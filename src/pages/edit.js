import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../App";
import { fetchPost } from "../firebase";
import Editor from "../recipes/recipe-editor";

const Edit = ({ history, match }) => {
  const { user, loadingUser } = useContext(UserContext);
  const [loadingPost, setLoadingPost] = useState(true);
  const [content, setContent] = useState();
  const [authorized, setAuthorized] = useState();

  const slug = match.params.slug;

  // Load content to make sure it's up to date
  useEffect(() => {
    if (!loadingUser) {
      let isMounted = true;

      fetchPost(slug).then(
        ({ content: fetchedContent }) => {
          if (isMounted) {
            // Wait until has been set
            if (user && fetchedContent.author !== user.uid) {
              setAuthorized(false);
            } else {
              setAuthorized(true);
              setContent(fetchedContent);
            }
            setLoadingPost(false);
          }
        },
        (err) =>
          console.log("edit: content loading failed with code: ", err.code)
      );

      return () => (isMounted = false);
    }
  }, [loadingUser, user, slug]);

  if (loadingPost || loadingUser) {
    return <h1>Loading...</h1>;
  } else if (!loadingUser && !user) {
    return <Redirect to="/" />;
  } else if (!authorized) {
    return <p>You are not authorized to edit this post.</p>;
  } else if (!content) {
    // Loading is done and post wasn't found in the database
    return <Redirect to="/404" />;
  }

  return (
    <>
      <div
        style={{
          width: "100%",
          borderBottom: "2px solid #000000",
          marginBottom: "10px",
        }}
      >
        <h1>Edit Post</h1>
      </div>
      <Editor
        author={user.uid}
        initialContent={content}
        slug={slug}
        history={history}
      />
    </>
  );
};

export default Edit;
