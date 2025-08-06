import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyAv-grPhQLLoxpIIOG9t5LEK0m8diSszOo",
//   authDomain: "vihar-app-3904d.firebaseapp.com",
//   projectId: "vihar-app-3904d",
//   storageBucket: "vihar-app-3904d.firebasestorage.app",
//   messagingSenderId: "478628203908",
//   appId: "1:478628203908:web:84b7aedd9524d31cac21d1",
//   measurementId: "G-PT3NTEJMG5"
// };
const firebaseConfig = {
  apiKey: "AIzaSyBkaEpBFuUizKnjl6LAt6FEx499pDHVPZs",
  authDomain: "vihar-app-f6b07.firebaseapp.com",
  projectId: "vihar-app-f6b07",
  storageBucket: "vihar-app-f6b07.firebasestorage.app",
  messagingSenderId: "768229718089",
  appId: "1:768229718089:web:e0fde908462429e731e798",
  measurementId: "G-441FJPXRL5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const FIREBASE_APP = initializeApp(firebaseConfig);

const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const FIREBASE_DB = getFirestore(FIREBASE_APP);


export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB };

