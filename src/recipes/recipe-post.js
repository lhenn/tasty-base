import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../App";
import { getFirebase } from "../firebase";
import Button from "../general/button-primary";
import DisplayRecipePost from "./display-recipe";
import Star from "./star";

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

const SelfLoadingRecipePost = ({ match }) => {
  const slug = match.params.slug;
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState();
  const [authorName, setAuthorName] = useState();
  const { user } = useContext(UserContext);

  // Load recipe post when component mounts
  useEffect(() => {
    // Need to store author uid in temporary variable since setPost is async!
    let uid = "";

    getFirebase()
      .database()
      .ref(`posts/${slug}`)
      .once(
        "value",
        (snapshot) => {
          // Snapshot consists of key and post data
          const postData = snapshot.val();
          setPost(postData);
          uid = postData.author;
        },
        (err) =>
          console.log(
            "SelfLoadingRecipePost: post loading failed with code: ",
            err.code
          )
      )
      .then(
        // Get author name
        () => getFirebase().database().ref(`/users/${uid}/name`).once("value")
      )
      .then(
        (snapshot) => {
          setAuthorName(snapshot.val());
          setLoading(false);
        },
        (err) =>
          console.log(
            "SelfLoadingRecipePost: author name loading failed with code: ",
            err.code
          )
      );
  }, [slug, setPost, setAuthorName, setLoading]);

  if (loading) {
    return <h1>Loading...</h1>;
  } else if (!post) {
    // Loading is done and post wasn't found in the database
    return <Redirect to="/404" />;
  } else {
    return (
      <>
        {user && <Star slug={slug} />}
        <DisplayRecipePost post={post} authorName={authorName} />
        {user?.uid === post.author && <Edit slug={slug} />}
      </>
    );
  }
};

export default SelfLoadingRecipePost;
