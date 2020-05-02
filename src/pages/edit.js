import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../App";
import { getFirebase } from "../firebase";
import RecipeForm from "../recipes/recipe-form";

const Edit = ({ history, match }) => {
  const user = useContext(UserContext);
  const slug = match.params.slug;
  const [loading, setLoading] = useState(true);
  const [post, setCurrentPost] = useState();
  const [authorized, setAuthorized] = useState();

  if (user != null && loading && !post) {
    // TODO: switch to useEffect
    const postsRef = getFirebase().database().ref().child("posts");
    postsRef
      .orderByChild("slug")
      .equalTo(slug)
      .on("child_added", (snapshot) => {
        if (snapshot.val().author !== user.uid) {
          setAuthorized(false);
          setLoading(false);
        } else {
          setAuthorized(true);
          setCurrentPost(snapshot.val());
          setLoading(false);
        }
      });
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!authorized) {
    return (
      <>
        <p>You are not authorized to edit this post.</p>
      </>
    );
  }
  // Loading is done and post wasn't found in the database
  if (!post) {
    return <Redirect to="/404" />;
  }

  return (
    <>
      <h1>Edit Post</h1>
      <RecipeForm history={history} post={post} />
    </>
  );
};

export default Edit;
