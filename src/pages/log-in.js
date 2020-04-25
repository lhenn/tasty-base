import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { getFirebase } from "../firebase";



// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/signedIn',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID

    ]
  };

const Login = () => {
  
    return (
        <>
        <h1>Log in</h1>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getFirebase().auth()}/>
        </>
    )

}

export default Login;