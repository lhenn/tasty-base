import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../App";
import { getFirebase } from "../firebase";
import Button from "./button-primary";
import MutedText from "./muted-text";

const NavWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  background-color: #ebcb0c;
  padding: 20px 0;
`;

const NavInner = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 900px;
`;

const NavBar = () => {
  const user = useContext(UserContext);
  console.log("user: ", user);

  const logout = () => {
    console.log("logging out");
    getFirebase().auth().signOut();
  };

  return (
    <NavWrapper>
      <NavInner id="nav-bars">
        <Link to="/">
          <h2>Tasty Base</h2>
          <MutedText text="An Adam&Laura© website" />
        </Link>
        <Link to="/create">
          <Button>Create a post</Button>
        </Link>
        <Button onClick={logout}>Sign out</Button>
        <Link to="/signin">
          <Button>Sign in</Button>
        </Link>
        <div>
          <p>User information: {user.email}</p>;
        </div>
      </NavInner>
    </NavWrapper>
  );
};

export default NavBar;
