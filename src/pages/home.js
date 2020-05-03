import React, { useEffect, useState } from "react";
import { getFirebase } from "../firebase";
import RecipePreview from "../recipes/recipe-preview";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  // TODO: could use on() to listen for changes in real time
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
            posts.push(snapshot.val());
          });

          const newestFirst = posts.reverse();
          setPosts(newestFirst);
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
      {posts.map((post, i) => (
        <RecipePreview key={`post${i}`} post={post} />
      ))}
    </>
  );
};

export default Home;
