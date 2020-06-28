import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../App";
import { fetchPost } from "../firebase";
import useCancellablePromises from "../promise-hooks";
import Editor from "../recipes/recipe-editor";

const Edit = ({ history, match }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState();
  const [authorized, setAuthorized] = useState();
  const { addPromise } = useCancellablePromises();

  const slug = match.params.slug;

  // Load content to make sure it's up to date
  useEffect(() => {
    addPromise(fetchPost(slug)).then(
      ({ content: fetchedContent }) => {
        // Wait until updateuser has been set
        if (user && fetchedContent.author !== user.uid) {
          setAuthorized(false);
        } else {
          setAuthorized(true);
          setContent(fetchedContent);
        }
        setLoading(false);
      },
      (err) => console.log("edit: content loading failed with code: ", err.code)
    );
  }, [slug, user, addPromise]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!authorized) {
    return <p>You are not authorized to edit this post.</p>;
  }

  // Loading is done and post wasn't found in the database
  if (!content) {
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
        initialSlug={slug}
        history={history}
      />
    </>
  );
};

export default Edit;
