import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../App";
import SignedInLinks from "./signedin-links";
import SignedOutLinks from "./signedout-links";
import Button from 'react-bootstrap/Button';

const NavWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  background-color: #252525;
  padding: 15px 0;
`;

const NavInner = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  max-width: 900px;
`;
const LogoWrapper = styled.div`
  display:flex;
  flex-grow:1;
  justify-content:flex-start;
`;

const NavBar = () => {
  const { user } = useContext(UserContext);

  return (
    <NavWrapper>
      <NavInner id="nav-bars">
        <LogoWrapper>
        <Link to="/">
          <h2>Tasty Base</h2>
        </Link>
        </LogoWrapper>
        {user ? <SignedInLinks user={user} /> : <SignedOutLinks />}
      </NavInner>
    </NavWrapper>
  );
};

export default NavBar;
