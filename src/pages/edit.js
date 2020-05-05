import React, { useEffect, useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../App";
import { getFirebase } from "../firebase";
import RecipeForm from "../recipes/recipe-form";

const Edit = ({ history, match }) => {
  const {user} = useContext(UserContext);
  const slug = match.params.slug;
  const [loading, setLoading] = useState(true);
  const [post, setCurrentPost] = useState();
  const [authorized, setAuthorized] = useState();

  // Load the post
  useEffect(() => {
    getFirebase()
      .database()
      .ref(`posts/${slug}`)
      .once(
        "value",
        (snapshot) => {
          // Wait until updateuser has been set
          if (user && snapshot.val().author !== user.uid) {
            setAuthorized(false);
          } else {
            setAuthorized(true);
            setCurrentPost(snapshot.val());
          }
          setLoading(false);
        },
        (err) => console.log("edit: post loading failed with code: ", err.code)
      );
  }, [slug, user]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!authorized) {
    return <p>You are not authorized to edit this post.</p>;
  }

  // Loading is done and post wasn't found in the database
  if (!post) {
    return <Redirect to="/404" />;
  }

  // Prepopulate recipe form
  return (
    <>
      <h1>Edit Post</h1>
      <RecipeForm history={history} post={post} slug={slug} />
    </>
  );
};

export default Edit;
