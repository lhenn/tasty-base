import { faBookmark, faSignOutAlt, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import { getFirebase } from "../firebase";
import PrimaryButton from "./button-primary";
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

const SignedInLinks = ({ user }) => {
  return (
    <>
      <NavItem>
        <UserWrapper>
          <UserPhoto user={user} />
        </UserWrapper>
      </NavItem>

      <NavItem>
        <Link to="/fav-recipes">
          <FontAwesomeIcon icon={faBookmark} />
        </Link>
      </NavItem>

      <NavItem>
        <Link to="/wish-recipes">
          <FontAwesomeIcon icon={faList} />
        </Link>
      </NavItem>

      <NavItem>
        <Link to="/create">
          <PrimaryButton>create a post +</PrimaryButton>
        </Link>
      </NavItem>
    </>
  );
};

export default SignedInLinks;
