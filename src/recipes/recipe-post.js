import React, { createContext, useContext, useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { UserContext } from "../App";
import { fetchPost } from "../firebase";
import DisplayRecipePost from "./display-recipe";

export const EditingContext = createContext({ editing: false });

const SelfLoadingRecipePost = ({ slug }) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const { user } = useContext(UserContext);

  // Load recipe post when component mounts
  useEffect(() => {
    let isMounted = true;

    fetchPost(slug).then(
      (post) => {
        if (isMounted) {
          setContent(post.content);
          setLoading(false);
        }
      },
      (err) => console.log("SelfLoadingRecipePost failed:", err)
    );

    return () => (isMounted = false);
  }, []);

  if (loading) return <h1>Loading...</h1>;

  if (!content) return <Redirect to="/404" />;

  return (
    <>
      <DisplayRecipePost content={content} slug={slug} />
    </>
  );
};

export default SelfLoadingRecipePost;
