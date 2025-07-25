// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAv-grPhQLLoxpIIOG9t5LEK0m8diSszOo",
  authDomain: "vihar-app-3904d.firebaseapp.com",
  projectId: "vihar-app-3904d",
  storageBucket: "vihar-app-3904d.firebasestorage.app",
  messagingSenderId: "478628203908",
  appId: "1:478628203908:web:84b7aedd9524d31cac21d1",
  measurementId: "G-PT3NTEJMG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);