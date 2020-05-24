import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../App";
import { fetchPost } from "../firebase";
import Button from "../general/button-primary";
import DisplayRecipePost from "./display-recipe";
import Star from "./star";
import useCancellablePromises from "../promise-hooks";

const Edit = ({ slug }) => {
  const editPath = `/recipes/${slug}/edit`;
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        window.location.href = editPath;
      }}
    >
      Edit
    </Button>
  );
};

const SelfLoadingRecipePost = ({ slug }) => {
  console.log("SelfLoadingRecipePost render");
  const [{ content, loading }, setContent] = useState({
    content: {},
    loading: true,
  });
  const { user } = useContext(UserContext);
  const { addPromise } = useCancellablePromises();

  // Load recipe post when component mounts
  useEffect(() => {
    console.log("SelfLoadingRecipePost MOUNT");
    addPromise(fetchPost(slug)).then(
      (post) => {
        console.log("got it!:", post);
        setContent({ loading: false, content: post.content });
      },
      (err) => console.log("SelfLoadingRecipePost failed with code:", err)
    );
    return () => console.log("SelfLoadingRecipePost UNMOUNT");
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  } else if (!content) {
    // Loading is done and post wasn't found in the database
    return <Redirect to="/404" />;
  } else {
    return (
      <>
        {user && <Star slug={slug} />}
        <DisplayRecipePost content={content} />
        {user?.uid === content.author && <Edit slug={slug} />}
      </>
    );
  }
};

export default SelfLoadingRecipePost;
