// import firebase, { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCD-8RBQKpOXYzV_5E4fOJFLP_owspysGM",
  authDomain: "react-whatsapp-b136b.firebaseapp.com",
  projectId: "react-whatsapp-b136b",
  storageBucket: "react-whatsapp-b136b.appspot.com",
  messagingSenderId: "203900379532",
  appId: "1:203900379532:web:fb7d6745c0397f4a2576a9",
};

// const firebaseApp = firebase.initializeApp(firebaseConfig);
// const db = getFirestore(firebaseApp);
// const auth = getAuth();
// const provider = new GoogleAuthProvider();
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
