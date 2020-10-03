import React, { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../App";
import Editor from "../recipes/recipe-editor";

const StyledHeaderDiv = styled.div`
  width: 100%;
  border-bottom: 2px solid #000000;
  margin-bottom: 12px;
`;

const Create = ({ history }) => {
  const { user, loadingUser } = useContext(UserContext);

  if (loadingUser) {
    return <h1>Loading...</h1>;
  } else if (!loadingUser && !user) {
    return <p>To create a new post, sign in or create an account.</p>;
  }

  return (
    <>
      <StyledHeaderDiv>
        <h1>Create a new post</h1>
      </StyledHeaderDiv>
      <Editor
        author={user.uid}
        initialContent={{ authorName: user.displayName, timestamp: Date.now() }}
        history={history}
      />
    </>
  );
};

export default Create;
