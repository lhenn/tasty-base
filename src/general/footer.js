import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { blueBase } from "../styling"

const StyledFooter = styled.div`
  display: flex;
  height: 50px;
  text-align: center;
  align-items: center;
  background: ${blueBase};
`;

const Footer = () => (
  <StyledFooter>
    <p style={{ color: "white", margin: "auto" }}>
      <Link to="/about">about</Link> | <Link to="/privacy">privacy</Link>
    </p>
  </StyledFooter>
);

export default Footer;
