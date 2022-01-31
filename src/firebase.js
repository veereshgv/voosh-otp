import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBCZQJruElaP_Uf7Ko3jsl-4qgIXywYKkk",
  authDomain: "otp-voosh.firebaseapp.com",
  projectId: "otp-voosh",
  storageBucket: "otp-voosh.appspot.com",
  messagingSenderId: "922413774057",
  appId: "1:922413774057:web:9b3f0311ef57da99cfec78",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const authentication = getAuth(app);
