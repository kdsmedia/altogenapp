import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi dari google-services.json (Data dasar)
// Pastikan appId di bawah ini adalah Web App ID dari Firebase Console Anda
const firebaseConfig = {
  apiKey: "AIzaSyBTFq2Hj0rWM57I8x-oYh_brlks4RhmT9U",
  authDomain: "altoshop.firebaseapp.com",
  projectId: "altoshop",
  storageBucket: "altoshop.firebasestorage.app",
  messagingSenderId: "35517370141",
  appId: "1:35517370141:web:ec8de985de09b86eecdbf4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Tambahkan custom parameter agar popup login selalu meminta pilih akun
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, db, googleProvider };