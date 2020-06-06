import React, { createContext, useContext, useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { UserContext } from "../App";
import { fetchPost } from "../firebase";
import { PrimaryButton } from "../general/buttons";
import useCancellablePromises from "../promise-hooks";
import DisplayRecipePost from "./display-recipe";

const EditButton = ({ slug }) => (
  <Link to={`/recipes/${slug}/edit`}>
    <PrimaryButton>Edit</PrimaryButton>
  </Link>
);

export const EditingContext = createContext({ editing: false });

const SelfLoadingRecipePost = ({ slug }) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const { user } = useContext(UserContext);
  const { addPromise } = useCancellablePromises();

  // Load recipe post when component mounts
  useEffect(() => {
    addPromise(fetchPost(slug)).then(
      (post) => {
        setContent(post.content);
        setLoading(false);
      },
      (err) => console.log("SelfLoadingRecipePost failed:", err)
    );
  }, []);

  // useEffect(() => console.log("content:", content), [content])

  if (loading) return <h1>Loading...</h1>;

  if (!content) return <Redirect to="/404" />;

  return (
    <>
      <DisplayRecipePost content={content} slug={slug} />
      {user?.uid === content.author && (
        <div style={{ textAlign: "right" }}>
          <EditButton slug={slug} />
        </div>
      )}
    </>
  );
};

export default SelfLoadingRecipePost;
