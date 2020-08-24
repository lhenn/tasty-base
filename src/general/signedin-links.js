import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import { getFirebase } from "../firebase";
import { PrimaryButton } from "./buttons";
import NavItem from "./nav-item";

const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserPhotoC = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50px;
  &:hover {
    cursor: pointer;
  }
`;

const TtInner = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0;
`;

const SignOutLink = styled.button`
  background-color: inherit;
  padding-top: 10px;
  color: #dedddd;
  border: none;
  &:hover {
    color: white;
    cursor: pointer;
  }
`;

const logout = () => {
  getFirebase()
    .auth()
    .signOut()
    .then(
      () => <Redirect to="/" />,
      function (error) {
        console.error("Sign Out Error", error);
      }
    );
};

const UserPhoto = ({ user }) => {
  return (
    <>
      <OverlayTrigger
        placement="bottom"
        trigger="click"
        overlay={
          <Tooltip id="overlay">
            <TtInner>
              <strong>{user.displayName}</strong>
              <SignOutLink onClick={logout}>
                Sign out <FontAwesomeIcon icon={faSignOutAlt} />
              </SignOutLink>
            </TtInner>
          </Tooltip>
        }
        rootClose
      >
        <UserPhotoC src={user.photoURL} alt="user photo" />
      </OverlayTrigger>
    </>
  );
};

// Taken from https://github.com/plotly/plotly-icons/tree/master/src/svg
// TODO: make THICKer
const StyledSVG = styled.svg`
  fill: currentColor;
`;

const ScatterIcon = () => (
  <StyledSVG
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 32 32"
  >
    <title>scatter-axes</title>
    <path d="M29.375 28.375h-24.313c-0.75 0-1.438-0.625-1.438-1.375v-24.375c0-0.563-0.438-1-1-1s-1 0.438-1 1v24.375c0 1.875 1.5 3.375 3.438 3.375h24.375c0.563 0 1-0.438 1-1s-0.5-1-1.063-1zM10.938 22.063c0 1-0.813 1.75-1.75 1.75s-1.75-0.75-1.75-1.75c0-0.938 0.813-1.688 1.75-1.688s1.75 0.75 1.75 1.688zM17.25 12.813c0 1-0.75 1.75-1.75 1.75-0.938 0-1.688-0.75-1.688-1.75 0-0.938 0.75-1.688 1.688-1.688 1 0 1.75 0.75 1.75 1.688zM19.438 19.625c0 1-0.75 1.75-1.688 1.75-1 0-1.75-0.75-1.75-1.75 0-0.938 0.75-1.688 1.75-1.688 0.938 0 1.688 0.75 1.688 1.688zM24.313 14.063c0 0.938-0.75 1.688-1.75 1.688-0.938 0-1.688-0.75-1.688-1.688s0.75-1.75 1.688-1.75c1 0 1.75 0.813 1.75 1.75zM27 7.5c0 0.938-0.813 1.688-1.75 1.688s-1.75-0.75-1.75-1.688c0-0.938 0.813-1.75 1.75-1.75s1.75 0.813 1.75 1.75z" />
  </StyledSVG>
);

const SignedInLinks = ({ user }) => {
  return (
    <>
      <NavItem>
        <Link to="/my-recipes">My Recipes</Link>
      </NavItem>
      <NavItem>
        <Link to="/notes">Notes</Link>
      </NavItem>
      <NavItem>
        <Link to="/create">
          <PrimaryButton>recipe +</PrimaryButton>
        </Link>
      </NavItem>
      <NavItem>
        <UserWrapper>
          <UserPhoto user={user} />
        </UserWrapper>
      </NavItem>
    </>
  );
};

export default SignedInLinks;
