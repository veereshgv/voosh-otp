import { useState } from "react";
import { authentication } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import "./App.css";
import food from "./food.jpg";

function App() {
  const countryCode = "+91";
  const [phoneNumber, setPhoneNumber] = useState(countryCode);
  const [expandForm, setExpandForm] = useState(false);
  const [OTP, setOTP] = useState("");
  const [userAuth, setUserAuth] = useState(false);
  const [errOTP, setErrOTP] = useState(false);

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      },
      authentication
    );
  };

  const requestOTP = (e) => {
    e.preventDefault();
    if (phoneNumber.length >= 12) {
      setExpandForm(true);
      generateRecaptcha();
      let appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(authentication, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
        })
        .catch((error) => {
          // Error; SMS not sent
          console.log(error);
        });
    }
  };

  const verifyOTP = (e) => {
    let otp = e.target.value;
    setOTP(otp);

    if (otp.length === 6) {
      // console.log(otp);
      // verify OTP
      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otp)
        .then((result) => {
          // User signed in successfully.
          const user = result.user;
          console.log(user);
          setUserAuth(true);
        })
        .catch((error) => {
          // User couldn't sign in (bad verification code?)
          console.log(error);
          setErrOTP(true);
        });
    }
  };

  return (
    <div className="formContainer">
      <div className="image">
        <img width="600px" height="250px" src={food} alt="" />
      </div>

      {userAuth === false ? (
        <form onSubmit={requestOTP}>
          <h1>Sign in with Phone Number</h1>
          <div className="mb-3">
            <label htmlFor="phoneNumberInput" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              name=""
              id="phoneNumberInput"
              aria-describedby="emailHelp"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <div className="form-text" id="phoneNumberHelp">
              Please Enter your Phone Number
            </div>
          </div>
          {expandForm === true ? (
            <>
              <div className="mb-3">
                <label htmlFor="otpInput" className="form-label">
                  OTP
                </label>
                <input
                  type="number"
                  name=""
                  id="otpInput"
                  className="form-control"
                  value={OTP}
                  onChange={verifyOTP}
                />
                <div className="form-text" id="otpHelp">
                  {errOTP === false ? (
                    "Please enter OTP sent to your phone number"
                  ) : (
                    <p style={{ color: "red" }}>Enter Valid OTP</p>
                  )}
                </div>
              </div>
            </>
          ) : null}

          {expandForm === false ? (
            <button type="submit" className="btn btn-primary">
              Request OTP
            </button>
          ) : null}
          <div id="recaptcha-container"></div>
        </form>
      ) : (
        <div className="signedIn">
          <h3>User Successfully Sined In !!</h3>
        </div>
      )}
    </div>
  );
}

export default App;
