import firebase from "firebase/app";
import database from "firebase/database";

const config = {
    apiKey: "AIzaSyAZOwNwikvL7sAd_KhjYpsozA-UQBW_CGw",
    authDomain: "tasty-base.firebaseapp.com",
    databaseURL: "https://tasty-base.firebaseio.com",
    projectId: "tasty-base",
    storageBucket: "tasty-base.appspot.com",
    messagingSenderId: "1019826146813",
    appId: "1:1019826146813:web:c9fd1d77989f7f72d0dd94"
};

let firebaseCache;

export const getFirebase = () => {
  if (firebaseCache) {
    return firebaseCache;
  }

  firebase.initializeApp(config);
  firebaseCache = firebase;
  return firebase;
};