import firebase from "firebase/app";
// Required, even though they appear to be unused. Can probably move imports to
// wherever they're actually needed.
import database from "firebase/database";
import storage from "firebase/storage";

const config = {
  apiKey: "AIzaSyAZOwNwikvL7sAd_KhjYpsozA-UQBW_CGw",
  authDomain: "tasty-base.firebaseapp.com",
  databaseURL: "https://tasty-base.firebaseio.com",
  projectId: "tasty-base",
  storageBucket: "tasty-base.appspot.com",
  messagingSenderId: "1019826146813",
  appId: "1:1019826146813:web:c9fd1d77989f7f72d0dd94",
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
