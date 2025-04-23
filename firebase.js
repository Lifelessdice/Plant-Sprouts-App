
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7SFazdj_ZbfYRCMtBjfmzzFvchbtfASA",
  authDomain: "smartsprout-ea006.firebaseapp.com",
  projectId: "smartsprout-ea006",
  storageBucket: "smartsprout-ea006.appspot.com", 
  messagingSenderId: "632489090774",
  appId: "1:632489090774:web:86d0bc7c57ecaec2ecb377",
  measurementId: "G-5146DPLTNJ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
