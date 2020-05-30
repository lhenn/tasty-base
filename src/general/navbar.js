import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../App";
import { blueBase, logoFont } from "../styling";
import SignedInLinks from "./signedin-links";
import SignedOutLinks from "./signedout-links";

const NavWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  background-color: ${blueBase};
  height: 100px;
`;

const NavInner = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  max-width: 1100px;
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
`;

// const Logo = styled.img`
//   width: 160px;
// `;

const Logo = styled.p`
  font-size: 48px;
  font-family: ${logoFont};
  color: white;
`;

const NavBar = () => {
  const { user } = useContext(UserContext);

  return (
    <NavWrapper>
      <NavInner id="nav-bars">
        <LogoWrapper>
          <Link to="/">
            {/*<Logo src={LogoSource} />*/}
            <Logo>Tasty Base</Logo>
          </Link>
        </LogoWrapper>
        {user ? <SignedInLinks user={user} /> : <SignedOutLinks />}
      </NavInner>
    </NavWrapper>
  );
};

export default NavBar;
