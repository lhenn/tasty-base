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

  // User auth completed and failed
  if (!loadingUser && !loadingUserData && !user) {
    return <Redirect to="/" />;
  }

  const postsContent =
    loadingUser || loadingUserData || loadingPosts ? (
      <p>loading...</p>
    ) : (
      <MyListRecipes posts={posts} />
    );


  return (
    <>
      <h1>MyList</h1>
      {postsContent}
    </>
  );
};

export default MyList;
