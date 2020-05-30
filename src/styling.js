import { createGlobalStyle } from "styled-components"

export const blueBase = "#1A153A";
export const yellowBase = "#EFD910";
export const redBase = "#DA1947";
export const logoFont = "Damion";
export const contentFont = "Josefin Sans";

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${contentFont}, sans-serif;
    font-size: 20px;
  }
`
