import React, { useEffect, useState } from "react";
import { getFirebase } from "../firebase";
import RecipePreview from "../recipes/recipe-preview";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  // Load all posts
  // TODO: could optimize by not loading every post in full
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
        (err) => console.log("edit: post loading failed with code: ", err.code)
      );
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h1>Blog posts</h1>
      {posts.map(({ slug, post }, i) => (
        <RecipePreview key={`post${i}`} post={post} slug={slug} />
      ))}
    </>
  );
};

export default Home;
