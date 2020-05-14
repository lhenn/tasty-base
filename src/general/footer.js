import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledFooter = styled.div`
  display: flex;
  height: 50px;
  text-align: center;
  align-items: center;
  background: #000000d6;
`;

const Footer = () => (
  <StyledFooter>
    <p style={{ color: "white", margin: "auto" }}>
      <Link to="/about">About</Link>
    </p>
  </StyledFooter>
);

export default Footer;
