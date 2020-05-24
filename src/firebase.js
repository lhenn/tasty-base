import firebase from "firebase/app";
import database from "firebase/database";
import storage from "firebase/storage";

const config = {
  apiKey: "AIzaSyAZOwNwikvL7sAd_KhjYpsozA-UQBW_CGw",
  authDomain: "tasty-base.firebaseapp.com",
  databaseURL: "https://tasty-base.firebaseio.com",
  projectId: "tasty-base",
  storageBucket: "tasty-base.appspot.com",
  messagingSenderId: "1019826146813",
  appId: "1:1019826146813:web:c9fd1d77989f7f72d0dd94",
};

// TODO: is this caching step really necessary?
let firebaseCache;

export const getFirebase = () => {
  if (firebaseCache) {
    return firebaseCache;
  }

  firebase.initializeApp(config);
  firebaseCache = firebase;

  return firebase;
};

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

export const checkPost = (uid, slug) =>
  getFirebase()
    .database()
    .ref(`/users/${uid}/data/checkedRecipes/${slug}`)
    .set({ timestamp: getFirebase().database.ServerValue.TIMESTAMP });

export const uncheckPost = (uid, slug) =>
  getFirebase()
    .database()
    .ref(`/users/${uid}/data/checkedRecipes/${slug}`)
    .remove();
export const ratePost = (uid, slug, ease, taste) =>
  getFirebase()
    .database()
    .ref(`/users/${uid}/data/checkedRecipes/${slug}`)
    .update({ ease, taste});

// TODO: restructure database to make name queries batchable?
const fetchName = async (uid) => {
  const name = await getFirebase()
    .database()
    .ref(`/users/${uid}/name`)
    .once("value");
  return name.val();
};

export const fetchPosts = async (sortBy = "timestamp", order = "reverse") => {
  const snapshots = await getFirebase()
    .database()
    .ref("/posts")
    .orderByChild(sortBy)
    .once("value");

  const authors = new Set();
  const posts = [];
  snapshots.forEach((snap) => {
    const content = snap.val();
    authors.add(content.author);
    posts.push({ slug: snap.key, content });
  });

  // Get corresponding display names
  const authorNames = {};
  await Promise.all(
    [...authors].map((uid) =>
      fetchName(uid).then((name) => (authorNames[uid] = name))
    )
  );

  posts.forEach(
    ({ content }) => (content["authorName"] = authorNames[content.author])
  );

  return order === "reverse" ? posts.reverse() : posts;
};

export const fetchPost = async (slug) => {
  const postSnapshot = await getFirebase()
    .database()
    .ref(`posts/${slug}`)
    .once("value"); // this returns a Promise

  const content = postSnapshot.val();

  const authorName = await fetchName(content.author);
  content["authorName"] = authorName;

  return { slug, content };
};
