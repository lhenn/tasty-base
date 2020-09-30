import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../App";
import { blueBase, logoFont } from "../styling";
import {MobileSignedInLinks, SignedInLinks} from "./signedin-links";
import SignedOutLinks from "./signedout-links";
import { getLayoutSize, SMALL, MEDIUM, LARGE } from "../App";
import { useBreakpoint } from "../breakpoint-hooks";

const MobileNavWrapper = styled.div`
  height:105vh;
  width:100%;
  position:fixed;
  background-color: ${blueBase};
  display: flex;
  justify-content: center;
  align-items:center;
  margin-top:-10px;
  overflow-y:fixed;
  z-index:10;
`;
const MobileNavInner = styled.div`
  display: flex;
  flex-direction:column;
  justify-content: space-around;
  height: 300px;
  align-items: center;
`;
const MobileLogoWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;


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
  const matches = useBreakpoint();
  // Media query
  const layoutSize = getLayoutSize(matches);
  console.log('layoutSize: ', layoutSize);

  if(layoutSize == "small"){
    return (
      <MobileNavWrapper>
      <MobileNavInner id="nav-bars">
        <MobileLogoWrapper>
          <Link to="/">
            {/*<Logo src={LogoSource} />*/}
            <Logo>Tasty Base</Logo>
          </Link>
        </MobileLogoWrapper>
        {user ? <MobileSignedInLinks user={user} /> : <SignedOutLinks />}
      </MobileNavInner>
    </MobileNavWrapper>
    )
  }

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
