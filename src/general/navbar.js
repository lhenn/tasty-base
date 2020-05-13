import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../App";
import LogoSource from "../assets/tasty-base-3.png";
import SignedInLinks from "./signedin-links";
import SignedOutLinks from "./signedout-links";

const NavWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  background-color: white;
  padding: 5px 0;
  box-shadow: 0px 10px 5px -10px rgba(0, 0, 0, 0.75);
`;

const NavInner = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  max-width: 1000px;
`;
const LogoWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
`;
const Logo = styled.img`
  width: 160px;
`;

const NavBar = () => {
  const { user } = useContext(UserContext);

  return (
    <NavWrapper>
      <NavInner id="nav-bars">
        <LogoWrapper>
          <Link to="/">
            <Logo src={LogoSource} />
          </Link>
        </LogoWrapper>
        {user ? <SignedInLinks user={user} /> : <SignedOutLinks />}
      </NavInner>
    </NavWrapper>
  );
};

export default NavBar;
