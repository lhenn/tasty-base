import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../App";
import MutedText from "./muted-text";
import SignedInLinks from "./signedin-links";
import SignedOutLinks from "./signedout-links";

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

  return (
    <NavWrapper>
      <NavInner id="nav-bars">
        <Link to="/">
          <h2>Tasty Base</h2>
          <MutedText text="An Adam&Laura© website" />
        </Link>
        {user !== null ? <SignedInLinks user={user} /> : <SignedOutLinks />}
      </NavInner>
    </NavWrapper>
  );
};

export default NavBar;
