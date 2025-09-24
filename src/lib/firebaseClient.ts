// src/lib/firebaseClient.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
// Analytics is not currently used, so imports are removed to clean up.
// import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAmWk8-JUSthBMwdR1YsttKRQRNxy-CwlI",
  authDomain: "revive-underground.firebaseapp.com",
  projectId: "revive-underground",
  storageBucket: "revive-underground.appspot.com",
  messagingSenderId: "261720151125",
  appId: "1:261720151125:web:25e675ca6ebb92245670dc",
  measurementId: "G-9228Y6YV9M",
};

// Initialize Firebase
let app: FirebaseApp;

// Check if all required config keys are present before initializing
if (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp(); // If already initialized, use that app
    }
} else {
    console.error("CRITICAL: Firebase client configuration is incomplete. Check your NEXT_PUBLIC environment variables in the .env file.");
    // In a real app, you might want to handle this more gracefully,
    // but for now, we'll let it fail loudly in the console.
}


export { app };

