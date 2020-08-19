import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import { BreakpointProvider } from "./breakpoint-hooks";
import { fetchSortedPosts, getFirebase } from "./firebase";
import Footer from "./general/footer";
import NavBar from "./general/navbar";
import About from "./pages/about";
import Create from "./pages/create";
import Edit from "./pages/edit";
import Favorites from "./pages/favorites";
import Graph from "./pages/graph";
import Home from "./pages/home";
import NoMatch from "./pages/no-match";
import Notes from "./pages/notes";
import Signin from "./pages/signin";
import SelfLoadingRecipePost from "./recipes/recipe-post";
import { GlobalStyle } from "./styling";
import MyRecipes from "./pages/myrecipes";

// background-color: whitesmoke;
const MainContent = styled.main`
  max-width: 1100px;
  margin: 20px auto;
  width: 100%;
  padding: 20px;
  min-height: 85vh;
  @media (max-width: 700px) {
    margin: 10px auto;
  }
`;

export const UserContext = createContext(null); // for user info and userData

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
        // Update info in firebase. Later we can let the user customize things.
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

// Layout sizes
export const SMALL = "small";
export const MEDIUM = "medium";
export const LARGE = "large";

// Helper to convert media query matches to layout sizes
// TODO: build into BreakpointProvider???
export const getLayoutSize = (matches) => {
  if (!matches.small && !matches.medium) return LARGE;
  else if (!matches.small && matches.medium) return MEDIUM;
  else return SMALL;
};

// Define the breakpoints
const queries = {
  small: "(max-width: 850px)",
  medium: "(max-width: 1350px)",
};

const App = () => {
  const [{ user, loadingUser }, setUser] = useState({
    user: null,
    loadingUser: true,
  });
  const [{ userData, loadingUserData }, setUserData] = useState({
    userData: null,
    loadingUserData: false,
  });
  const [{ posts, loadingPosts }, setPosts] = useState({
    posts: [],
    loadingPosts: false,
  });

  // TODO: enable cancellation of previous Promise if new one is started while
  // it's still resolving. Probably need state variable to keep track of any
  // pending post updates as a cancellable Promise.
  const updatePosts = (sortBy = "timestamp", order = "reverse") => {
    if (loadingPosts) {
      console.log("cannot call updatePosts: already loading posts!");
    } else {
      setPosts({ posts: [], loadingPosts: true });
      fetchSortedPosts(sortBy, order).then(
        (newPosts) => {
          setPosts({ posts: newPosts, loadingPosts: false });
        },
        (err) => console.log("app: problem with post loading:", err)
      );
    }
  };

  // Subscribe to listen for auth state changes when application mounts. Note
  // that onAuthStateChanged returns the auth unsubscribe function, so this
  // cleans up after itself.
  useEffect(() => {
    // Load all posts when App mounts
    updatePosts();
    const unsubscribeAuth = onAuthStateChanged((newUser) => {
      setUser({ user: newUser, loadingUser: false });
    });
    return unsubscribeAuth;
  }, []);

  // Load user data once user is authenticated
  useEffect(() => {
    if (user) {
      setUserData({ userData: null, loadingUserData: true });
      return getUserData(user.uid, (newUserData) => {
        setUserData({ userData: newUserData, loadingUserData: false });
      });
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, loadingUser, userData, loadingUserData }}
    >
      <BreakpointProvider queries={queries}>
        <Router>
          <GlobalStyle />
          <NavBar />
          <MainContent>
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <Home
                    posts={posts}
                    loadingPosts={loadingPosts}
                    updatePosts={updatePosts}
                  />
                )}
              />
              <Route exact path="/signin" component={Signin} />
              <Route exact path="/my-recipes" component={MyRecipes} />
              // <Route exact path="/fav-recipes" component={Favorites} />
              <Route exact path="/notes" component={Notes} />
              <Route exact path="/create" component={Create} />
              <Route exact path="/about" component={About} />
              <Route
                exact
                path="/graph"
                render={() => (
                  <Graph posts={posts} loadingPosts={loadingPosts} />
                )}
              />
              <Route
                exact
                path="/recipes/:slug"
                render={({
                  match: {
                    params: { slug },
                  },
                }) => <SelfLoadingRecipePost slug={slug} />}
              />
              <Route exact path="/recipes/:slug/edit" component={Edit} />
              <Route path="*" component={NoMatch} />
            </Switch>
          </MainContent>
          <Footer />
        </Router>
      </BreakpointProvider>
    </UserContext.Provider>
  );
};

export default App;
