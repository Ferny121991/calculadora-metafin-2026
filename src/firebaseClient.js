import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCPovEW4vkk_5-zQMiCaJ84AlqJ8Euqvzw',
  authDomain: 'calc-metafin-2026-pro.firebaseapp.com',
  projectId: 'calc-metafin-2026-pro',
  storageBucket: 'calc-metafin-2026-pro.firebasestorage.app',
  messagingSenderId: '665757327689',
  appId: '1:665757327689:web:97b3bb54afb2338144fa98',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export {
  createUserWithEmailAndPassword,
  doc,
  getDoc,
  onSnapshot,
  onAuthStateChanged,
  serverTimestamp,
  setDoc,
  signInWithEmailAndPassword,
  signOut,
};
