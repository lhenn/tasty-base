import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFirebase } from "../firebase";
import PrimaryButton from "./button-primary";
import NavItem from "./nav-item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";

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

const TtInner = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserPhoto = ({ src }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const logout = () => {
    getFirebase().auth().signOut();
  };

  return (
    <>
      <UserPhotoC src={src} ref={target} onClick={() => setShow(!show)} />
      <Overlay target={target.current} show={show} placement="bottom">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            <TtInner>
              My Tooltip
              <SignOutLink onClick={logout}>Sign out</SignOutLink>
            </TtInner>
          </Tooltip>
        )}
      </Overlay>
    </>
  );
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
  return (
    <>
      <NavItem>
        <UserWrapper>
          <UserPhoto src={user.photoURL} alt="user photo" />
        </UserWrapper>
      </NavItem>

      <NavItem>
        <Link to="/fav-recipes">
          <FontAwesomeIcon icon={faBookmark} />
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
