import React, { useState, useRef } from "react";
import { Link , Redirect} from "react-router-dom";
import styled from "styled-components";
import { getFirebase } from "../firebase";
import PrimaryButton from "./button-primary";
import NavItem from "./nav-item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
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
  color:#dedddd;
  border: none;
  &:hover {
    color: white;
    cursor: pointer;
  }
`;

const UserPhoto = ({ user }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const logout = () => {
    getFirebase().auth().signOut().then(function() {
      return(
        <Redirect to="/"/>
      )
    }, function(error) {
      console.error('Sign Out Error', error);
    });;
  };

  return (
    <>
      <UserPhotoC
        src={user.photoURL}
        ref={target}
        onClick={() => setShow(!show)}
      />
      <Overlay target={target.current} show={show} placement="bottom">
        {(props) => (
          <Tooltip id="overlay" {...props}>
            <TtInner>
              <strong>{user.displayName}</strong>
              <SignOutLink onClick={logout}>Sign out <FontAwesomeIcon icon={faSignOutAlt}/></SignOutLink>
            </TtInner>
          </Tooltip>
        )}
      </Overlay>
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
        <Link to="/create">
          <PrimaryButton>create a post +</PrimaryButton>
        </Link>
      </NavItem>
    </>
  );
};

export default SignedInLinks;
