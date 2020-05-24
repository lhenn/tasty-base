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

// TODO: restructure database to make name queries batchable?
const fetchName = async (uid) => {
  const name = await getFirebase()
    .database()
    .ref(`/users/${uid}/name`)
    .once("value");
  return name.val();
};

// Determines author display names and inserts them into an array of posts
// TODO: might be poor form to mutate posts
const insertAuthorNames = async (posts) => {
  const authors = new Set();
  posts.forEach(({ content: { author } }) => authors.add(author));

  // Get mapping from uids to names
  const authorNames = {};
  await Promise.all(
    [...authors].map((uid) =>
      fetchName(uid).then((name) => (authorNames[uid] = name))
    )
  );

  posts.forEach(
    ({ content }) => (content["authorName"] = authorNames[content.author])
  );

  return posts;
};

export const fetchSortedPosts = async (
  sortBy = "timestamp",
  order = "reverse"
) => {
  const snapshots = await getFirebase()
    .database()
    .ref("/posts")
    .orderByChild(sortBy)
    .once("value");

  // For some strange reason, can't just do snapshots.val()
  const posts = [];
  snapshots.forEach((snap) => {
    posts.push({ slug: snap.key, content: snap.val() });
  });

  await insertAuthorNames(posts);

  return order === "reverse" ? posts.reverse() : posts;
};

// Fetches a post (or posts) given a slug (or slugs)
export const fetchPost = async (slug) => {
  const content = await getFirebase()
    .database()
    .ref(`posts/${slug}`)
    .once("value")
    .then((snapshot) => snapshot.val());
  content["authorName"] = await fetchName(content.author);
  return { slug, content };
};

export const fetchPosts = async (slugs) => {
  const posts = await Promise.all(
    slugs.map((slug) =>
      getFirebase()
        .database()
        .ref(`/posts/${slug}`)
        .once("value")
        .then((snapshot) => ({ slug, content: snapshot.val() }))
    )
  );
  return await insertAuthorNames(posts);
};
