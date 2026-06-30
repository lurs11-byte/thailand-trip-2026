import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAZ3wYYg90Ma_soFNI2jf4WLtDZUK6meho",
  authDomain: "thailnd.firebaseapp.com",
  projectId: "thailnd",
  storageBucket: "thailnd.firebasestorage.app",
  messagingSenderId: "800880063998",
  appId: "1:800880063998:web:640b1e30da9e950606fcaf"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
