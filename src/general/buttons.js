import styled from "styled-components";
import { yellowBase } from "../styling";

export const PrimaryButton = styled.button`
  background-color: ${yellowBase};
  font-size: 20px;
  padding: 7px 15px;
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
