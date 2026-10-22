import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Öffentliche Browser-Konfiguration (kein Geheimnis).
const firebaseConfig = {
  apiKey: 'AIzaSyA7KvcCXudc6k7IOzdR9-CvKo-2i2orrPw',
  authDomain: 'eramaster-1eec0.firebaseapp.com',
  projectId: 'eramaster-1eec0',
  storageBucket: 'eramaster-1eec0.firebasestorage.app',
  messagingSenderId: '101435293312',
  appId: '1:101435293312:web:91d1c5436b4bfd1f4df065',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
