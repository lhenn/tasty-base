import styled from "styled-components";
import { yellowBase, lavendarBase, blueBase } from "../styling";

export const PrimaryButton = styled.button`
  background-color: ${yellowBase};
  border: 0;
`;

export const SecondaryButton = styled.button`
  background-color: inherit;
  color: #775ffb;
  border: solid 1 px #775ffb;
  &:hover {
    cursor: pointer;
  }
`;

export const FilterButton = styled.button`
 border:solid 2px black;
 margin: 0 10px;
 color: black;
 background-color: ${props => props.isActive ? props.color : 'white'};
`;

export const NoteButton = styled.button`
  background-color: ${lavendarBase};
  color: ${blueBase};
  border: 0;
  margin: 0 10px;
`;
export const SecondaryNoteButton = styled.button`
background-color: inherit;
color:${blueBase};
border: 0;


`;
