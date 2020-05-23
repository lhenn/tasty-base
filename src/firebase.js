import firebase from "firebase/app";

const config = {
  apiKey: "AIzaSyAZOwNwikvL7sAd_KhjYpsozA-UQBW_CGw",
  authDomain: "tasty-base.firebaseapp.com",
  databaseURL: "https://tasty-base.firebaseio.com",
  projectId: "tasty-base",
  storageBucket: "tasty-base.appspot.com",
  messagingSenderId: "1019826146813",
  appId: "1:1019826146813:web:c9fd1d77989f7f72d0dd94",
};

let firebaseCache;

export const getFirebase = () => {
  if (firebaseCache) {
    return firebaseCache;
  }

  firebase.initializeApp(config);
  firebaseCache = firebase;

  return firebase;
};

// Returns a Promise
export const starPost = (uid, slug) =>
  getFirebase()
    .database()
    .ref(`/users/${uid}/data/starredRecipes/${slug}`)
    .set(getFirebase().database.ServerValue.TIMESTAMP);

export const unstarPost = (uid, slug) =>
  getFirebase()
    .database()
    .ref(`/users/${uid}/data/starredRecipes/${slug}`)
    .remove();

// NOTE: callers should not refetch posts if there is a pending fetch!
export const fetchPosts = (sortBy = "timestamp", order = "reverse") =>
  getFirebase()
    .database()
    .ref("posts")
    .orderByChild(sortBy)
    .once("value")
    .then(
      (snapshots) => {
        let posts = [];
        snapshots.forEach((snapshot) => {
          posts.push({ slug: snapshot.key, post: snapshot.val() });
        });
        // Put newest posts first
        if (order === "reverse") return posts.reverse();
        else return posts;
      },
      (err) => console.log("home: post loading failed with code: ", err.code)
    )
    .then(
      (posts) => {
        // TODO: get Set of unique author UIDs
        // TODO: get displayNames for these UIDs and inject into posts
        return posts;
      },
      (err) => console.log("post author loading failed with code:", err.code)
    );
