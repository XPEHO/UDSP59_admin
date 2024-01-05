import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASURMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig)
const provider = new GoogleAuthProvider()
const auth = getAuth()
const db = getFirestore(firebaseApp)

const usersCollection = collection(db, 'users')
const modulesCollection = collection(db, 'modules')
const tipsCollection = collection(db, 'tips')

export { firebaseApp, provider, auth, db, usersCollection, modulesCollection, tipsCollection }