import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../App";
import { fetchPosts } from "../firebase";
import RecipePreview from "../recipes/recipe-preview";
import useCancellablePromises from "../promise-hooks";

const FavoritesList = ({ posts }) => (
  <>
    <h1>Favorite recipes</h1>
    <div>
      {posts.map((post) => (
        <RecipePreview key={post.slug} post={post} />
      ))}
    </div>
  </>
);

// TODO: must be inaccessible if user is not logged in, but should show loading
// message if waiting for authentication
const Favorites = () => {
  const [{ posts, loadingPosts }, setPosts] = useState({
    posts: [],
    loadingPosts: false,
  });
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );

  const { addPromise } = useCancellablePromises();

  // Load all posts if userData is present
  useEffect(() => {
    if (!loadingUserData && userData?.favoriteRecipes) {
      setPosts({ posts: [], loadingPosts: true });
      // Values are timestamps
      addPromise(fetchPosts(Object.keys(userData.favoriteRecipes))).then(
        (favPosts) => {
          setPosts({ posts: favPosts, loadingPosts: false });
        },
        (err) => console.log("Favorites: fetchPosts failed: ", err)
      );
    }
  }, [userData, loadingUserData, addPromise]);

  // User auth and data loading underway
  if (loadingUser || loadingUserData) {
    return <h1>Loading...</h1>;
  }

  // User auth completed
  if (!user) {
    return <Redirect to="/" />;
  }

  // User exists and may have favorite posts that are being loaded
  if (loadingPosts) {
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
