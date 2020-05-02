import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import { getFirebase } from "./firebase";
import NavBar from "./general/navbar";
import Create from "./pages/create";
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

//we can only retrieve user information for users who are not signed in if we store it ourselves
const updateUsers = (user) => {
  let newUser = true;
  const usersRef = getFirebase().database().ref("/users");
  //see if the user data already exists
  usersRef
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((existingUser) => {
        if (existingUser.key == user.uid) {
          newUser = false;
        }
      });
      if(newUser){
        usersRef.child(user.uid).set({
          name:user.displayName,
          email:user.email,
          photo: user.photoURL
          //TODO: figure out what other info we want. username??
        })
      } 
    })
  
};

const onAuthStateChanged = (callback) => {
  // Subscribe to auth state changes and call the callback.
  // onAuthStateChanged() returns firebase.unsubscribe().
  return getFirebase()
    .auth()
    .onAuthStateChanged((user) => {
      if (user) {
        callback(user);
        if(user != null) updateUsers(user);
      } else {
        callback(null);
      }
    });
};

const App = () => {
  const [user, setUser] = useState(null);

  // Subscribe to listen for auth state changes when application mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(setUser);
    //getFirebase()
    // Unsubscribe to the listener when unmounting
    return () => {
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
          </Switch>
        </MainContent>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
