import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import { getFirebase } from "./firebase";
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
  max-width: 1000px;
  margin: 20px auto;
  width: 100%;
  background-color: whitesmoke;
  padding: 20px;
  min-height: 80vh;
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

const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingUserData, setLoadingUserData] = useState(false);

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posts, setPosts] = useState([]);

  // Subscribe to listen for auth state changes when application mounts. Note
  // that onAuthStateChanged returns the auth unsubscribe function, so this
  // cleans up after itself.
  useEffect(
    () =>
      onAuthStateChanged((u) => {
        setUser(u);
        setLoadingUser(false);
      }),
    []
  );

  // Load user data once user is authenticated
  useEffect(() => {
    if (user) {
      setLoadingUserData(true);
      return getUserData(user.uid, (ud) => {
        setUserData(ud);
        setLoadingUserData(false);
      });
    }
  }, [user]);

  const fetchPosts = (sortBy = "timestamp", order = "reverse") => {
    setLoadingPosts(true);
    getFirebase()
      .database()
      .ref("posts")
      .orderByChild(sortBy)
      .once(
        "value",
        (snapshots) => {
          let posts = [];
          snapshots.forEach((snapshot) => {
            posts.push({ slug: snapshot.key, post: snapshot.val() });
          });

          // Put newest posts first
          order === "reverse" ? setPosts(posts.reverse()) : setPosts(posts);
          setLoadingPosts(false);
        },
        (err) => console.log("home: post loading failed with code: ", err.code)
      );
  };

  // Load all posts when App mounts
  useEffect(fetchPosts, []);

  return (
    <UserContext.Provider
      value={{ user, loadingUser, userData, loadingUserData }}
    >
      <Router>
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
                  fetchPosts={fetchPosts}
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
              render={() => <Graph posts={posts} loadingPosts={loadingPosts} />}
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
    </UserContext.Provider>
  );
};

export default App;
