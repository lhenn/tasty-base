import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFirebase } from "../firebase";
import Button from "./button-primary";

const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserPhotoC = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50px;
`;

const UserPhoto = ({ src }) => {
  return <UserPhotoC src={src} />;
};

const SignOutLink = styled.button`
  background-color: inherit;
  padding-top: 10px;
  color: white;
  border: none;
  &:hover {
    color: blue;
    cursor: pointer;
  }
`;

const SignedInLinks = ({ user }) => {
  const logout = () => {
    getFirebase().auth().signOut();
  };
  return (
    <>
      <Link to="/create">
        <Button>Create a post</Button>
      </Link>
      <Link to="/fav-recipes">
        <Button>Favorites</Button>
      </Link>
      <UserWrapper>
        <UserPhoto src={user.photoURL} alt="user photo" />
        <SignOutLink onClick={logout}>Sign out</SignOutLink>
      </UserWrapper>
    </>
  );
};

export default SignedInLinks;
