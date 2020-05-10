import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../App";
import { getFirebase } from "../firebase";
import RecipePreview from "../recipes/recipe-preview";

const downloadPosts = async (slugs) => {
  let posts = [];

  for (const slug of slugs) {
    const snapshot = await getFirebase()
      .database()
      .ref(`posts/${slug}`)
      .once("value");
    posts.push({ slug, post: snapshot.val() });
  }

  return posts;
};

const FavoritesList = ({ posts }) => (
  <>
    <h1>Favorite recipes</h1>
    <div>
      {posts.map(({ slug, post }) => (
        <RecipePreview key={slug} post={post} slug={slug} />
      ))}
    </div>
  </>
);

// TODO: must be inaccessible if user is not logged in, but should show loading
// message if waiting for authentication
const Favorites = () => {
  // True when downloading favorite posts from firebase
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );

  // Load all posts if userData is present
  useEffect(() => {
    if (
      !loadingUser &&
      !loadingUserData &&
      user &&
      userData &&
      userData.favoriteRecipes
    ) {
      setLoading(true);

      const favSlugs = Object.keys(userData.favoriteRecipes);
      downloadPosts(favSlugs)
        .then((favPosts) => {
          setPosts(favPosts);
          setLoading(false);
        })
        .catch((err) => console.log("Favorites: downloadPosts failed: ", err));
    }
  }, [user, loadingUser, userData, loadingUserData]);

  // User auth and data loading underway
  if (loadingUser || loadingUserData) {
    return <h1>Loading...</h1>;
  }

  // User auth completed
  if (!user) {
    return <Redirect to="/" />;
  }

  // User exists and may have favorite posts that are being loaded
  if (loading) {
    return <h1>Loading favorites recipes...</h1>;
  }

  return (
    <>
      {posts.length > 0 ? (
        <FavoritesList posts={posts} />
      ) : (
        <p>No favorites added yet!</p>
      )}
    </>
  );
};

export default Favorites;
