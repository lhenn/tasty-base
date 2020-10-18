import firebase from "firebase/app";
import database from "firebase/database";
import storage from "firebase/storage";

// Choose whether to use acceptance database or not
const acc = true;
const version = acc ? 'acceptance' : 'production';

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

// Update the user's information in Firebase whenever they log in
export const updateUser = (user) => {
  getFirebase().database().ref(`${version}/users/${user.uid}`).update({
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
  });
};
export const getUserData = (uid, callback) => {
  // Listen for changes in user data
  const userDataRef = getFirebase().database().ref(`${version}/users/${uid}/data`);
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
export const starPost = (uid, slug) =>
  getFirebase()
    .database()
    .ref(`${version}/users/${uid}/data/starredRecipes/${slug}`)
    .set(getFirebase().database.ServerValue.TIMESTAMP);

export const unstarPost = (uid, slug) =>
  getFirebase()
    .database()
    .ref(`${version}/users/${uid}/data/starredRecipes/${slug}`)
    .remove();

export const checkPost = (uid, slug) =>
  getFirebase()
    .database()
    .ref(`${version}/users/${uid}/data/checkedRecipes/${slug}`)
    .set({ timestamp: getFirebase().database.ServerValue.TIMESTAMP });

export const uncheckPost = (uid, slug) =>
  getFirebase()
    .database()
    .ref(`${version}/users/${uid}/data/checkedRecipes/${slug}`)
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
  console.log("should be updating:", uid, slug, action);
  return getFirebase()
    .database()
    .ref(`${version}/users/${uid}/data/myListRecipes/${slug}`)
    .update(entry);
};
export const removeFromMyList = (uid, slug, action) =>
  getFirebase()
    .database()
    .ref(`${version}/users/${uid}/data/myListRecipes/${slug}/${action}`)
    .remove();

// TODO: restructure database to make name queries batchable?
const fetchName = async (uid) => {
  const name = await getFirebase()
    .database()
    .ref(`${version}/users/${uid}/name`)
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

export const fetchSortedPosts = async () => {
  const snapshots = await getFirebase().database().ref(`${version}/posts`).once("value");

  // For some strange reason, can't just do snapshots.val()
  const posts = [];
  snapshots.forEach((snap) => {
    posts.push({ slug: snap.key, content: snap.val() });
  });

  await insertAuthorNames(posts);

  return posts;
};

export const fetchPost = async (slug) => {
  const snapshot = await getFirebase()
    .database()
    .ref(`${version}/posts/${slug}`)
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
        .ref(`${version}/posts/${slug}`)
        .once("value")
        .then((snapshot) => ({ slug, content: snapshot.val() }))
    )
  );
  return await insertAuthorNames(posts);
};

export const submitPost = async (slug, content) => {
  const postRef = getFirebase().database().ref(`${version}/posts/${slug}`);
  return slug === "" ? await postRef.push(content) : await postRef.set(content);
};

export const getTimestamp = () => getFirebase().database.ServerValue.TIMESTAMP;

export const addRatingToRecipe = async (slug, ratingType, ratingValue, uid) => {
  return await getFirebase()
    .database()
    .ref(`${version}/posts/${slug}/${ratingType}/${uid}`)
    .set({
      rating: ratingValue,
      timestamp: getTimestamp(),
    });
};

export const removeRatingFromRecipe = async (slug, ratingType, uid) => {
  return await getFirebase()
    .database()
    .ref(`${version}/posts/${slug}/${ratingType}/${uid}`)
    .remove();
};

// Subscribe and unsubscribe functions are for updating rating values in components when the database values are updated (in recipe-preview and display-recipe)
export const subscribeToRatings = (
  slug,
  setTaste,
  setEase
) => {
  firebase
    .database()
    .ref(`${version}/posts/${slug}/taste`)
    .on("value", (snapshot) => {
      setTaste(snapshot.val());
    });
  firebase
    .database()
    .ref(`${version}/posts/${slug}/ease`)
    .on("value", (snapshot) => {
      setEase(snapshot.val());
    });
};
export const unsubscribeFromRatings = (slug) => {
  firebase.database().ref(`${version}/posts/${slug}/taste`).off("value");
  firebase.database().ref(`${version}/posts/${slug}/ease`).off("value");
};
