import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFirebase } from "../firebase";
import Button from "./button-primary";

const UserIcon = styled.div`
  display: flex;
  flex-direction: column;
`;
const UserPhoto = styled.img`
  width: 50px;
  border-radius: 50px;
`;

const SignedInLinks = ({ user }) => {
  // TODO: useCallback?
  const logout = () => {
    getFirebase().auth().signOut();
  };

  return (
    <>
      <Link to="/create">
        <Button>Create a post</Button>
      </Link>
      <UserIcon>
        <UserPhoto src={user.photoURL} />
        {user.displayName}
      </UserIcon>
      <Button onClick={logout}>Sign out</Button>
    </>
  );
};

export default SignedInLinks;
