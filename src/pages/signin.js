import firebase from "firebase";
import React, {useContext} from "react";
import { UserContext } from "../App";
import {Redirect} from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { getFirebase } from "../firebase";

const Signin = () => {
  // Check if user is already signed in and send to home if so
  const user = useContext(UserContext);
  if(user != null) return <Redirect to="/"/>

  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",

    // We will display Google and email as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    signInSuccessUrl: '/'
  };

  return (
    <>
      <h1>Sign in</h1>
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={getFirebase().auth()}
      />
    </>
  );
};

export default Signin;
