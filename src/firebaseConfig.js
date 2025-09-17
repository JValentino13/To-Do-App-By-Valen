import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD46Az99IuPV5KE5jGNHQ_xnMuJjOgNVy8",
  authDomain: "to-do-app-valen.firebaseapp.com",
  projectId: "to-do-app-valen",
  storageBucket: "to-do-app-valen.firebasestorage.app",
  messagingSenderId: "843121208079",
  appId: "1:843121208079:web:322050c7567253c0802c7a",
  measurementId: "G-TKB8L09FNH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);