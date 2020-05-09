import React, { useEffect, useState } from "react";
import { getFirebase } from "../firebase";
import RecipePreview from "../recipes/recipe-preview";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  // Load all posts
  useEffect(() => {
    getFirebase()
      .database()
      .ref("posts")
      .orderByChild("timestamp")
      .once(
        "value",
        (snapshots) => {
          let posts = [];
          snapshots.forEach((snapshot) => {
            posts.push({ slug: snapshot.key, post: snapshot.val() });
          });

          // Put newest posts first
          setPosts(posts.reverse());
          setLoading(false);
        },
        (err) => console.log("home: post loading failed with code: ", err.code)
      );
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  // slugs are unique and can thus be used as keys
  return (
    <>
      <h1>Recipes</h1>
      {posts.map(({ slug, post }) => (
        <RecipePreview key={slug} post={post} slug={slug} />
      ))}
    </>
  );
};

export default Home;
