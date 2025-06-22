import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyC1c4rwxhx8rp6nwUhyHYvpsV9HddVJvTU",
  authDomain: "ai-resume-285cd.firebaseapp.com",
  projectId: "ai-resume-285cd",
  storageBucket: "ai-resume-285cd.firebasestorage.app",
  messagingSenderId: "395584275167",
  appId: "1:395584275167:web:eaa0a12c97112e8cfa1f6a",
  measurementId: "G-84Z3LW1DP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

export { analytics };
export default app; 