import React from "react";
import styled from "styled-components";
import { parseIntOrEmpty } from "../../utils";

export const BasicInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const DisplayBasicInfo = ({ time, servings }) => (
  <BasicInfoContainer>
    {time && <p>total time: {time} min</p>}
    {servings && <p>servings: {servings}</p>}
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
