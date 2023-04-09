import firebase from "firebase/compat/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFQTj2wDQj1r_pLFRVPpIGzGpZmvQd9bI",
  authDomain: "letmeask-2d5de.firebaseapp.com",
  databaseURL: "https://letmeask-2d5de-default-rtdb.firebaseio.com",
  projectId: "letmeask-2d5de",
  storageBucket: "letmeask-2d5de.appspot.com",
  messagingSenderId: "602017334513",
  appId: "1:602017334513:web:a9f95fe03619ad19c39550",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };

export const auth = firebase.auth;
// export const db = firebase.firestore();
