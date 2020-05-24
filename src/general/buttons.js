import React from "react";
import styled from "styled-components";

export const PrimaryButton = styled.button`
background-image: linear-gradient(45deg, #738fce, #8377c7);
  color: white;
  padding: 7px 15px;
  border-radius: 50px;
  font-size:15px;
  font-weight:bold;
  border: 0;
  &:hover {
    cursor: pointer;
    -webkit-box-shadow: 5px 8px 20px -10px rgba(0,0,0,0.75);
    -moz-box-shadow: 5px 8px 20px -10px rgba(0,0,0,0.75);
    box-shadow: 5px 8px 20px -10px rgba(0,0,0,0.75);
  }
`;

export const SecondaryButton = styled.button`
  background-color: inherit;
  color: #775ffb;
  padding: 10px;
  border-radius: 50px;
  border: solid 1 px #775ffb;
  &:hover {
    cursor: pointer;
   
  }
`;