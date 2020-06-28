import React from "react";
import styled from "styled-components";
import { parseIntOrEmpty } from "../../utils";
import ClickToOpen from "../click-to-open";
import { NumericPlaceholder } from "./generic-placeholders";

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

export const BasicInfoEditor = ({ time, setTime, servings, setServings }) => {
  const closed = (
    <BasicInfoContainer>
      {time ? (
        <p>total time: {time} min</p>
      ) : (
        <NumericPlaceholder name="total time" />
      )}
      {servings ? (
        <p>servings: {servings}</p>
      ) : (
        <NumericPlaceholder name="servings" />
      )}
    </BasicInfoContainer>
  );

  const getIntSetter = (set) => (e) => set(parseIntOrEmpty(e.target.value));

  const timeInput = (
    <input
      type="number"
      min="1"
      value={time}
      onChange={getIntSetter(setTime)}
    />
  );

  const servingsInput = (
    <input
      type="number"
      min="1"
      value={servings}
      onChange={getIntSetter(setServings)}
    />
  );

  const open = (
    <BasicInfoContainer>
      <p>total time: {timeInput} min</p>
      <p>servings: {servingsInput}</p>
    </BasicInfoContainer>
  );

  return <ClickToOpen open={open} closed={closed} />;
};
