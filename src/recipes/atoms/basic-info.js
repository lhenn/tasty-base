import React from "react";
import { parseIntOrEmpty } from "../../utils";
import ClickToOpen from "../click-to-open";
import { NumericPlaceholder } from "./generic-placeholders";

export const DisplayBasicInfo = ({ time, servings }) => (
  <>
    {time && <p>total time: {time} min</p>}
    {servings && <p>servings: {servings}</p>}
  </>
);

export const BasicInfoEditor = ({ time, setTime, servings, setServings }) => {
  const closed = (
    <>
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
    </>
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
    <>
      <p>total time: {timeInput} min</p>
      <p>servings: {servingsInput}</p>
    </>
  );

  return <ClickToOpen open={open} closed={closed} />;
};
