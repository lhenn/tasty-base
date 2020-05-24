import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../App";
import { fetchPost } from "../firebase";
import {PrimaryButton} from "../general/buttons";
import DisplayRecipePost from "./display-recipe";
import Star from "./star";
import useCancellablePromises from "../promise-hooks";

const Edit = ({ slug }) => {
  const editPath = `/recipes/${slug}/edit`;
  return (
    <PrimaryButton
      onClick={(e) => {
        e.preventDefault();
        window.location.href = editPath;
      }}
    >
      Edit
    </PrimaryButton>
  );
};

const SelfLoadingRecipePost = ({ slug }) => {
  const [{ content, loading }, setContent] = useState({
    content: {},
    loading: true,
  });
  const { user } = useContext(UserContext);
  const { addPromise } = useCancellablePromises();

  // Load recipe post when component mounts
  useEffect(() => {
    addPromise(fetchPost(slug)).then(
      (post) => setContent({ loading: false, content: post.content }),
      (err) => console.log("SelfLoadingRecipePost failed:", err)
    );
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  } else if (!content) {
    // Loading is done and post wasn't found in the database
    return <Redirect to="/404" />;
  } else {
    return (
      <>
        <DisplayRecipePost content={content} slug={slug} />
        {user?.uid === content.author && <Edit slug={slug} />}
      </>
    );
  }
};

export default SelfLoadingRecipePost;
