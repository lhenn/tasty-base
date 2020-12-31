import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getLayoutSize, SMALL, UserContext } from "../App";
import { useBreakpoint } from "../breakpoint-hooks";
import { blueBase, containerRules, logoFont, yellowBase } from "../styling";
import { MobileSignedInLinks, SignedInLinks } from "./signedin-links";
import { MobileSignedOutLinks, SignedOutLinks } from "./signedout-links";

// MOBILE
const MobileClosedHeader = styled.div`
  background-color: ${blueBase};
  display:flex;
  justify-content:space-between;
  align-items:center;
  min-height:fit-content;
`;
const MobileLogo = styled.p`
  font-size: 32px;
  font-family: ${logoFont};
  color: white;
  padding:0 !important;
  margin:10px !important;
`;
const MobileNavDisplay = styled.button`
  color: ${blueBase};
  background-color: ${yellowBase};
  border: none;
  margin:10px;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  align-self: ${props => props.status === "closed" ? "flex-start" : "flex-end"};
  justify-self: flex-start;
`;
const MobileNavWrapper = styled.div`
  height: 100vh;
  width: 100%;
  position: fixed;
  background-color: ${blueBase};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  z-index: 10;
`;
const MobileNavInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex-grow: 1;
  padding: 200px 0;
  align-items: center;
`;
const MobileLogoWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

// TABLET/DESKTOP
const NavWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  background-color: ${blueBase};
  min-height:fit-content;
`;

const NavInner = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  ${containerRules}
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
  const [status, setStatus] = useState("close");
  const { user } = useContext(UserContext);
  const matches = useBreakpoint();
  // Media query
  const layoutSize = getLayoutSize(matches);

  const toggleDisplay = (display) => {
    setStatus(display);
  };
  if (layoutSize === SMALL && status === "close") {
    return (
      <MobileClosedHeader>
        <Link to="/">
        <MobileLogo>Tasty Base</MobileLogo>
        </Link>
        <MobileNavDisplay onClick={() => toggleDisplay("open")} status="closed">
          <FontAwesomeIcon icon={faBars} />
        </MobileNavDisplay>
      </MobileClosedHeader>
    );
  }
  if (layoutSize === SMALL && status !== "close") {
    return (
      <MobileNavWrapper>
        <MobileNavDisplay onClick={() => toggleDisplay("close")}>
          <FontAwesomeIcon icon={faTimes} />
        </MobileNavDisplay>
        <MobileNavInner id="nav-bars">
          <MobileLogoWrapper>
            <Link to="/" onClick={() => toggleDisplay("close")}>
              {/*<Logo src={LogoSource} />*/}
              <Logo>Tasty Base</Logo>
            </Link>
          </MobileLogoWrapper>
          {user ? (
            <MobileSignedInLinks toggleDisplay={toggleDisplay} />
          ) : (
            <MobileSignedOutLinks toggleDisplay={toggleDisplay} />
          )}
        </MobileNavInner>
      </MobileNavWrapper>
    );
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
