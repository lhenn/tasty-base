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
    align-items: flex-start;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: ${blueBase};
`;

const MarginedDiv = styled.div`
  margin: 5px;
`;

export const DisplayBasicInfo = ({ time, servings }) => (
  <BasicInfoContainer>
    {time && (
      <MarginedDiv>
        <Icon icon={faClock} />
        &nbsp;&nbsp;{time} min{" "}
      </MarginedDiv>
    )}
    {servings && (
      <MarginedDiv>
        <Icon icon={faUtensilSpoon} />
        &nbsp;&nbsp;{servings} servings
      </MarginedDiv>
    )}
  </BasicInfoContainer>
);

const StyledPositiveIntInput = styled.input`
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
      <MarginedDiv>
        {"total time: "}
        {timeInput}
        {" min"}
      </MarginedDiv>
      <MarginedDiv>
        {"servings: "}
        {servingsInput}
      </MarginedDiv>
    </BasicInfoContainer>
  );
};
