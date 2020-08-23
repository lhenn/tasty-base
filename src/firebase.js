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

export const addToMyList = (uid, slug, action, ratings = null) => {
  let entry =
    ratings == null
      ? {
          [action]: getFirebase().database.ServerValue.TIMESTAMP,
        }
      : {
          [action]: {
            timeAdded: getFirebase().database.ServerValue.TIMESTAMP,
            ease: ratings.ease,
            taste: ratings.taste,
          },
        };
  return getFirebase()
    .database()
    .ref(`/users/${uid}/data/myListRecipes/${slug}`)
    .update(entry);
};
export const removeFromMyList = (uid, slug, action) =>
  getFirebase()
    .database()
    .ref(`/users/${uid}/data/myListRecipes/${slug}/${action}`)
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

export const fetchPost = async (slug) => {
  const snapshot = await getFirebase()
    .database()
    .ref(`posts/${slug}`)
    .once("value");
  // Unclear why this doesn't work in a then...
  const content = snapshot.val();
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

export const submitPost = async (slug, content) =>
  await getFirebase().database().ref(`/posts/${slug}`).set(content);

export const getTimestamp = () => getFirebase().database.ServerValue.TIMESTAMP;

export const addRatingToRecipe = async (slug, ratingType, ratingValue, uid) => {
  return await getFirebase().database().ref(`/posts/${slug}/${ratingType}/${uid}`).set({
    rating:ratingValue,
    timestamp: getTimestamp()
  });

}
