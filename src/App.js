import React, { createContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import { getFirebase } from "./firebase";
import NavBar from "./general/navbar";
import Create from "./pages/create";
import Edit from "./pages/edit";
import Home from "./pages/home";
import NoMatch from "./pages/no-match";
import Signin from "./pages/signin";
import SelfLoadingRecipePost from "./recipes/recipe-post";

const MainContent = styled.main`
  max-width: 900px;
  margin: 20px auto;
  width: 100%;
  background-color: white;
  padding: 20px;
`;

export const UserContext = createContext(null);

// Update the user's information in Firebase whenever they log in
const updateUser = (user) => {
  getFirebase().database().ref(`/users/${user.uid}`).update({
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
  });
};

const onAuthStateChanged = (callback) => {
  // Subscribe to auth state changes and call the callback.
  // onAuthStateChanged() returns firebase.unsubscribe().
  return getFirebase()
    .auth()
    .onAuthStateChanged((user) => {
      if (user) {
        updateUser(user);
        callback(user);
      } else {
        callback(null);
      }
    });
};

const getUserData = (uid, callback) => {
  // Listen for changes in user data
  const userDataRef = getFirebase().database().ref(`/users/${uid}/data`);
  userDataRef.on(
    "value",
    (snapshot) => {
      callback(snapshot.val());
    },
    (err) => console.log("getUserData error: ", err)
  );
  // Return unsubscribe function
  return () => userDataRef.off();
};

const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  // Subscribe to listen for auth state changes when application mounts. Note
  // that onAuthStateChanged returns the auth unsubscribe function, so this
  // cleans up after itself.
  useEffect(() => onAuthStateChanged(setUser), []);
  useEffect(() => {
    if (user) return getUserData(user.uid, setUserData);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, userData }}>
      <Router>
        <NavBar />
        <MainContent>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signin" component={Signin} />
            <Route path="/create" component={Create} />
            <Route path="/404" component={NoMatch} />
            <Route
              exact
              path="/recipes/:slug"
              component={SelfLoadingRecipePost}
            />
            <Route exact path="/recipes/:slug/edit" component={Edit} />
          </Switch>
        </MainContent>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
