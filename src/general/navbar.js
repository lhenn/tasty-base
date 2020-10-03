import React, { useContext, useState } from "react";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../App";
import { blueBase, yellowBase, logoFont, containerRules } from "../styling";
import { MobileSignedInLinks, SignedInLinks } from "./signedin-links";
import { MobileSignedOutLinks, SignedOutLinks } from "./signedout-links";
import { getLayoutSize, SMALL, MEDIUM, LARGE } from "../App";
import { useBreakpoint } from "../breakpoint-hooks";

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
const MobileNavDisplay = styled.button`
  color: ${blueBase};
  background-color: ${yellowBase};
  margin: 10px;
  border: none;
  width: 2.7rem;
  height: 2.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  align-self: flex-end;
  justify-self: flex-start;
`;

const NavBar = () => {
  const [status, setStatus] = useState("close");
  const { user } = useContext(UserContext);
  const matches = useBreakpoint();
  // Media query
  const layoutSize = getLayoutSize(matches);
  console.log("layoutSize: ", layoutSize);

  const toggleDisplay = (display) => {
    console.log("should be toggling..");
    setStatus(display);
  };
  if (layoutSize == "small" && status == "close") {
    return (
      <MobileNavDisplay onClick={() => toggleDisplay("open")}>
        <FontAwesomeIcon icon={faBars} />
      </MobileNavDisplay>
    );
  }
  if (layoutSize == "small" && status != "close") {
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
