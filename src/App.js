import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
const updateUser = (user) =>
  // set() is safe since uids are unique
  getFirebase().database().ref(`/users/${user.uid}`).set({
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
    uid: user.uid,
  });

const onAuthStateChanged = (callback) => {
  // Subscribe to auth state changes and call the callback.
  // onAuthStateChanged() returns firebase.unsubscribe().
  console.log("setting user");
  return getFirebase()
    .auth()
    .onAuthStateChanged((user) => {
      if (user) {
        callback(user);
        console.log("user set!", user);
        updateUser(user);
      } else {
        callback(null);
      }
    });
};

const App = () => {
  console.log("App");
  const [user, setUser] = useState(null);

  // Subscribe to listen for auth state changes when application mounts
  useEffect(() => onAuthStateChanged(setUser), []);

  return (
    <UserContext.Provider value={user}>
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
