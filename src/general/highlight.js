import React from "react";
import styled from "styled-components";


const StyledSpan = styled.span`
  font-size:48px;
  font-family: "Playfair Display", serif;
  background-image: linear-gradient(120deg,#fffa4e 0%,#fffa4e 100%);
  background-repeat: no-repeat;
  background-size: 100% 0.5em;
  background-position: 0 88%;
  transition: background-size 0.1s ease-in;
  cursor:pointer;
  &:hover {
    background-size: 100% 60%;
  }
`;

const HighlightedTitle = (props) => {
return(
<StyledSpan>{props.text}</StyledSpan>
)
}

export default HighlightedTitle