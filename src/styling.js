import { createGlobalStyle } from "styled-components";

export const blueBase = "#1A153A";
export const yellowBase = "#EFD910";
export const redBase = "#DA1947";
export const greenBase = "#05CF56";
export const redOrangeBase = "#FF2E00";
export const lavendarBase = "#D3B0FF";
export const lightGrey = "#E8E8E8";
export const logoFont = "Damion";
export const contentFont = "Josefin Sans";
export const defaultTransparent = 0.4;

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${contentFont}, sans-serif;
    font-size: 20px;
  }

  button{
    padding: 0 10px;
    border-radius: 50px;
    font-size: 20px;
    &:focus {
      outline: none;
    }
  }
`
export const buttonPadding = `0 10px`;
