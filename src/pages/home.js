import React, { useState } from "react";
import { getFirebase } from "../firebase";
import RecipePreview from "../recipes/recipe-preview";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);

  if (loading && !blogPosts.length) {
    getFirebase()
      .database()
      .ref("/posts")
      .orderByChild("dateFormatted")
      .once("value")
      .then((snapshot) => {
        let posts = [];
        snapshot.forEach((postSnapshot) => {
          posts.push(postSnapshot.val());
        });

        const newestFirst = posts.reverse();
        setBlogPosts(newestFirst);
        console.log(newestFirst);
        setLoading(false);
      });
  }

  if (loading) {
    return <h1>Loading...</h1>;
  } 

  return (
    <>
      <h1>Blog posts</h1>
      {blogPosts.map((blogPost) => (
          <>
          <RecipePreview key={blogPost.slug} post={blogPost} />
          </>
      ))}
    </>
  );
};

export default Home;
