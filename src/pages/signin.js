import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { connect } from "react-redux";
import signedIn, { SIGNED_IN } from "../redux/actions";
import firebase from "firebase";
import { getFirebase } from "../firebase";

class Signin extends React.Component {
  state = {
    isSignedIn: false, // Local signed-in state.
    user: null,
  };

  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",

    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      this.setState({ isSignedIn: !!user, user: user });
      console.log("new state: ", this.state);
      console.log("user ?", user);
      this.props.dispatch({ type: "SIGNED_IN", user:user });
    });
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }
  render() {
    return (
      <>
        <h1>Sign in</h1>
        <StyledFirebaseAuth
          uiConfig={this.uiConfig}
          firebaseAuth={getFirebase().auth()}
        />
      </>
    );
  }
}
const mapStateToProps = (state) => {
  const user = state.userDataReducer;
  console.log("STATE", state);
  return user;
};

export default connect(mapStateToProps)(Signin);
