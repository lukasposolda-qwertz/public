// Firebase project configuration for the Finans 360 samarbetstest.
// This is the public client config (safe to expose) - access is
// controlled via Firestore security rules, not by hiding this object.

const firebaseConfig = {
  apiKey: "AIzaSyBokc48rtT3ZLOF6y_xeScUtvlV3FlFTuA",
  authDomain: "finans-360-samarbete.firebaseapp.com",
  projectId: "finans-360-samarbete",
  storageBucket: "finans-360-samarbete.firebasestorage.app",
  messagingSenderId: "484073671575",
  appId: "1:484073671575:web:38565cf969a15f308612d2",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
