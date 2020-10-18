import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import { BreakpointProvider } from "./breakpoint-hooks";
import { fetchSortedPosts, getFirebase, updateUser, getUserData } from "./firebase";
import Footer from "./general/footer";
import NavBar from "./general/navbar";
import About from "./pages/about";
import Create from "./pages/create";
import Edit from "./pages/edit";
import Home from "./pages/home";
import NoMatch from "./pages/no-match";
import Signin from "./pages/signin";
import SelfLoadingRecipePost from "./recipes/recipe-post";
import { GlobalStyle, containerRules } from "./styling";

// background-color: whitesmoke;
const MainContent = styled.main`
  ${containerRules}
  margin: 0 auto;
  flex-grow:1;
`;

export const UserContext = createContext(null); // for user info and userData

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
  const updatePosts = () => {
    if (loadingPosts) {
      console.log("cannot call updatePosts: already loading posts!");
    } else {
      setPosts({ posts: [], loadingPosts: true });
      fetchSortedPosts().then(
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
                  <Home posts={posts} loadingPosts={loadingPosts} />
                )}
              />
              <Route exact path="/signin" component={Signin} />
              <Route exact path="/create" component={Create} />
              <Route exact path="/about" component={About} />
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
