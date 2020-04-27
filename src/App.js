import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import { getFirebase } from "./firebase";
import NavBar from "./general/navbar";
import Create from "./pages/create";
import Editor from "./pages/editor";
import Home from "./pages/home";
import NoMatch from "./pages/no-match";
import Signin from "./pages/signin";
import RecipePost from "./recipes/recipe-post";

const MainContent = styled.main`
  max-width: 900px;
  margin: 20px auto;
  width: 100%;
  background-color: white;
  padding: 20px;
`;

export const UserContext = createContext(null);

const onAuthStateChanged = (callback) => {
  // Subscribe to auth state changes and call the callback.
  // onAuthStateChanged() returns firebase.unsubscribe().
  return getFirebase()
    .auth()
    .onAuthStateChanged((user) => {
      console.log("calling onChange with user = ", user);
      if (user) {
        console.log("\tUser is logged in");
        callback(user);
      } else {
        console.log("\tUser is logged out");
        callback(null);
      }
    });
};

const App = () => {
  const [user, setUser] = useState(null);

  // Subscribe to listen for auth state changes when application mounts
  useEffect(() => {
    console.log("calling useEffect");
    const unsubscribe = onAuthStateChanged(setUser);
    // Unsubscribe to the listener when unmounting
    return () => {
      console.log("called unsubscribe");
      unsubscribe();
    };
  }, []);

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
            <Route path="/recipes/:slug" component={RecipePost} />
            <Route path="/editor" component={Editor} />
          </Switch>
        </MainContent>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
