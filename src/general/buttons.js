import styled from "styled-components";
import { yellowBase } from "../styling";

export const PrimaryButton = styled.button`
  background-color: ${yellowBase};
  font-size: 20px;
  padding: 7px 10px;
  border-radius: 50px;
  border: 0;
  box-shadow: none;
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

export const FilterButton = styled.button`
 border:solid 2px black;
 font-size: 20px;
  padding: 0 10px;
  border-radius: 50px;
  margin: 0 10px;
 color: black;
 background-color: ${props => props.isActive ? props.color : 'white'};
 &:focus {
   outline: none;
 }
`;
