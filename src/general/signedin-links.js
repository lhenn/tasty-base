import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import { getFirebase } from "../firebase";
import { PrimaryButton } from "./buttons";
import { NavItem } from "../styling";

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
  color: white;
  border: none;
  &:hover {
    cursor: pointer;
  }
`;

const logout = () => {
  getFirebase()
    .auth()
    .signOut()
    .then(
      () => {
        return <Redirect to="/" />;
      },
      function (error) {
        console.error("Sign Out Error", error);
      }
    );
};

const UserPhoto = ({ user: {displayName, email, photoURL} }) => {
  return (
    <>
      <OverlayTrigger
        placement="bottom"
        trigger="click"
        overlay={
          <Tooltip id="overlay">
            <TtInner>
              <strong>{displayName}</strong>
              {email}
              <SignOutLink onClick={logout}>
                Sign out <FontAwesomeIcon icon={faSignOutAlt} />
              </SignOutLink>
            </TtInner>
          </Tooltip>
        }
        rootClose
      >
        <UserPhotoC src={photoURL} alt="user photo" />
      </OverlayTrigger>
    </>
  );
};

export const MobileSignedInLinks = ({ toggleDisplay }) => {
  return (
    <>
      <NavItem>
        <Link to="/create" onClick={() => toggleDisplay("close")}>
          <PrimaryButton>recipe +</PrimaryButton>
        </Link>
      </NavItem>
      <NavItem>
        <Link to="/about" onClick={() => toggleDisplay("close")}>
          About
        </Link>
      </NavItem>
      <NavItem>
        <SignOutLink
          onClick={() => {
            toggleDisplay("close");
            logout();
          }}
        >
          Sign out
        </SignOutLink>
      </NavItem>
    </>
  );
};
export const SignedInLinks = ({ user }) => {
  return (
    <>
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
