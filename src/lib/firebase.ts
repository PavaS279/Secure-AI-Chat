import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  "projectId": "studio-1554426953-a1f54",
  "appId": "1:320558966271:web:f00bff50acff7ff7c133ca",
  "apiKey": "AIzaSyDJE8Jekve31yMEkKpJ1YvQvTFWUNXYFY4",
  "authDomain": "studio-1554426953-a1f54.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "320558966271"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
