import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFirebase } from "../firebase";
import PrimaryButton from "./button-primary";
import NavItem from "./nav-item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";


const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserPhotoC = styled.img`
  width: 35px;
  height: 35px;
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
      <NavItem><UserWrapper>
        <UserPhoto src={user.photoURL} alt="user photo" />
        <SignOutLink onClick={logout}>Sign out</SignOutLink>
      </UserWrapper></NavItem>
      <NavItem to="/fav-recipes"><FontAwesomeIcon icon={faBookmark} /></NavItem> 
      <NavItem to="/create"><PrimaryButton>create a post +</PrimaryButton></NavItem>
    </>
  );
};

export default SignedInLinks;
