import React from "react";
import styled from "styled-components";
import { parseIntOrEmpty } from "../../utils";
import { faClock, faUtensilSpoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { blueBase } from "../../styling";

export const BasicInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 700px) {
    align-items:flex-start;
  }
`;
const Icon = styled(FontAwesomeIcon)`
  color:${blueBase}
`;

export const DisplayBasicInfo = ({ time, servings }) => (
  <BasicInfoContainer>
    {time && <div><Icon icon={faClock}/>&nbsp;&nbsp;{time} min </div>}
    {servings && <div><Icon icon={faUtensilSpoon}/>&nbsp;&nbsp;{servings} servings</div>}
  </BasicInfoContainer>
);

const StyledPositiveIntInput = styled.input`
  border: none;
	width: 80px;
`;

export const BasicInfoEditor = ({ time, setTime, servings, setServings }) => {
  const timeInput = (
    <StyledPositiveIntInput
      placeholder="--"
      id="time-input"
      type="number"
      min="1"
      value={time}
      onChange={(e) => setTime(parseIntOrEmpty(e.target.value))}
    />
  );

  const servingsInput = (
    <StyledPositiveIntInput
      placeholder="--"
      id="servings-input"
      type="number"
      min="1"
      value={servings}
      onChange={(e) => setServings(parseIntOrEmpty(e.target.value))}
    />
  );

  return (
    <BasicInfoContainer>
      <p>total time: {timeInput} min</p>
      <p>servings: {servingsInput}</p>
    </BasicInfoContainer>
  );
};
