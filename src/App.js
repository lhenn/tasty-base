import React, { createContext, useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import { BreakpointProvider } from "./breakpoint-hooks";
import { fetchPosts, getFirebase } from "./firebase";
import Footer from "./general/footer";
import NavBar from "./general/navbar";
import About from "./pages/about";
import Create from "./pages/create";
import Edit from "./pages/edit";
import Favorites from "./pages/favorites";
import Graph from "./pages/graph";
import Home from "./pages/home";
import NoMatch from "./pages/no-match";
import WishRecipes from "./pages/recipe-wishes";
import Signin from "./pages/signin";
import SelfLoadingRecipePost from "./recipes/recipe-post";

const MainContent = styled.main`
  max-width: 1100px;
  margin: 20px auto;
  width: 100%;
  background-color: whitesmoke;
  padding: 20px;
  min-height: 80vh;
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
  const [user, setUser] = useState({ value: null, loading: true });
  const [userData, setUserData] = useState({ value: null, loading: false });
  const [posts, setPosts] = useState({ value: [], loading: true });

  const userContextValue = {
    user: user.value,
    loadingUser: user.loading,
    userData: userData.value,
    loadingUserData: userData.loading,
  };

  // TODO: make cancellable
  // TODO: enable cancellation of previous Promise if new one is started while
  // it's still resolving
  const updatePosts = useCallback(
    (sortBy = "timestamp", order = "reverse") => {
      if (!posts.loading) setPosts({ value: [], loading: true });
      fetchPosts(sortBy, order).then(
        (posts) => {
          setPosts({ value: posts, loading: false });
        },
        (err) => console.log("app: problem with post loading:", err)
      );
    },
    [posts.loading, setPosts]
  );

  // Subscribe to listen for auth state changes when application mounts. Note
  // that onAuthStateChanged returns the auth unsubscribe function, so this
  // cleans up after itself.
  useEffect(() => {
    // console.log("App mount");
    // Load all posts when App mounts
    updatePosts();
    const unsubscribeAuth = onAuthStateChanged((newUser) => {
      setUser({ value: newUser, loading: false });
    });
    return unsubscribeAuth;
  }, []);

  // Load user data once user is authenticated
  useEffect(() => {
    if (user.value) {
      setUserData({ value: null, loading: true });
      return getUserData(user.value.uid, (ud) => {
        setUserData({ value: ud, loading: false });
      });
    }
  }, [user]);

  return (
    <UserContext.Provider value={userContextValue}>
      <BreakpointProvider queries={queries}>
        <Router>
          <NavBar />
          <MainContent>
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <Home
                    posts={posts.value}
                    loadingPosts={posts.loading}
                    fetchPosts={updatePosts}
                  />
                )}
              />
              <Route exact path="/signin" component={Signin} />
              <Route exact path="/fav-recipes" component={Favorites} />
              <Route exact path="/wish-recipes" component={WishRecipes} />
              <Route exact path="/create" component={Create} />
              <Route exact path="/about" component={About} />
              <Route
                exact
                path="/graph"
                render={() => <Graph posts={posts} />}
              />
              <Route
                exact
                path="/recipes/:slug"
                component={SelfLoadingRecipePost}
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
