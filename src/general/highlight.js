import React from "react";
import styled from "styled-components";


const StyledSpan = styled.span`
    
background-image: linear-gradient(120deg,#d8ade6 0%,#d8ade6 100%);
  background-repeat: no-repeat;
  background-size: 100% 0.5em;
  background-position: 0 88%;
  transition: background-size 0.25s ease-in;
  cursor:pointer;
  &:hover {
    background-size: 100% 88%;
  }
`;

const Highlighted = (props) => {
return(
<StyledSpan>{props.text}</StyledSpan>
)
}

export default Highlighted