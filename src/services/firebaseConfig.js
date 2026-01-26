// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-o4a5BrWwlzu_PdXvJHHOzawrN9bNOf4",
  authDomain: "oauth-7b81d.firebaseapp.com",
  projectId: "oauth-7b81d",

  appId: "1:28860008832:web:2c7474a8cbf6fb4c3b1965",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
