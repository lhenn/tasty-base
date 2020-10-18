import styled from "styled-components";
import { createGlobalStyle } from "styled-components";

// Container rules
const containerWidth ="1200px";
const containerPadding = "0 20px";
const smallBreakPoint = "850px";
const mobileContainerPadding = "10px";
export const containerRules = `
  max-width: ${containerWidth}; 
  padding:${containerPadding}; 
  width: 100%;
  @media(max-width:${smallBreakPoint}){
    padding:${mobileContainerPadding};
  }
  `;

// Colors
export const blueBase = "#1A153A";
export const lightBlueBase = "#38b9f7bd";
export const mediumBlueBase = "#4B3E99";
export const yellowBase = "#EFD910";
export const redBase = "#DA1947";
export const greenBase = "#05CF56";
export const redOrangeBase = "#FF2E00";
export const lavendarBase = "#D3B0FF";
export const lightGrey = "#E8E8E8";
export const logoFont = "Damion";
export const contentFont = "Josefin Sans";
export const defaultTransparent = 0.4;

//Global
export const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${contentFont}, sans-serif;
    font-size: 18px;
  }

  button{
    padding: 5px 15px;
    border-radius: 50px;
    font-size: 16px;
    &:focus {
      outline: none;
    }
  }
`
export const buttonPadding = `0 10px`;

//Navbar
export const NavItem = styled.div`
  display: flex;
  margin: 0 20px;
  font-size: 20px;
  color: white;
`;
