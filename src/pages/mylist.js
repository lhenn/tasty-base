import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../App";
import { fetchPosts } from "../firebase";
import RecipePreview from "../recipes/recipe-preview";
import useCancellablePromises from "../promise-hooks";

const MyListRecipes = ({ posts }) => (
  <>
    {posts.map((post) => (
      <RecipePreview key={post.slug} post={post} />
    ))}
  </>
);
const MyList = () => {
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
    if (!loadingUserData && userData?.myListRecipes) {
      setPosts({ posts: [], loadingPosts: true });
      // Values are timestamps
      addPromise(fetchPosts(Object.keys(userData.myListRecipes))).then(
        (myListPosts) => {
          setPosts({ posts: myListPosts, loadingPosts: false });
        },
        (err) => console.log("Stars: fetchPosts failed: ", err)
      );
    }
  }, [userData, loadingUserData, addPromise]);
 
  // User auth and data loading underway
  if (loadingUser || loadingUserData) return <p>loading...</p>;

  // User auth completed
  if (!user) {
    return <Redirect to="/" />;
  }

  // User exists and may have favorite posts that are being loaded
  if (loadingPosts) return <p>loading...</p>;
  
  return (
    <>
      <h1>MyList</h1>
      <MyListRecipes posts={posts} />
    </>
  );
};

export default MyList;
