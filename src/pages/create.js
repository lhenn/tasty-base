import React, { useContext } from "react";
import { UserContext } from "../App";
import Editor from "../recipes/recipe-editor";

const Create = ({ history }) => {
  const { user, loadingUser } = useContext(UserContext);

  if (loadingUser) return <h1>Authenticating...</h1>;

  return (
    <>
      <div
        style={{
          width: "100%",
          borderBottom: "2px solid #000000",
          marginBottom: "10px",
        }}
      >
        <h1>Create a new post</h1>
      </div>
      <Editor
        author={user.uid}
        initialContent={{ authorName: user.displayName, timestamp: Date.now() }}
        history={history}
      />
    </>
  );
};

export default Create;
