import React, { useState } from "react";
import styled from "styled-components";
import ShadedDot from "../../shaded-dot";
import { yellowBase } from "../../styling";
import { parseFloatOrEmpty } from "../../utils";
import ClickToOpen from "../click-to-open";
import { NumericPlaceholder } from "./generic-placeholders";

// Styling
const ratingStep = 0.1;
const minRating = 0.0;
const maxRating = 5.0;
const numDots = 5;
const colors = { taste: yellowBase, ease: "#4B3E99" };

export const RatingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const RatingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DotsWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export const RatingLabel = styled.span`
  width: 55px;
`;

// Generic rating component
const Rating = ({ name, value, color }) => {
  const numFilledDots = numDots * (value / maxRating);

  const dots = [];
  for (var d = 0; d < numDots; d++) {
    if (d < Math.floor(numFilledDots))
      dots.push(<ShadedDot color={color} key={`${name}-${d}`} />);
    else if (d === Math.floor(numFilledDots))
      dots.push(
        <ShadedDot
          color={color}
          percentVisible={(numFilledDots % 1) * 100}
          key={`${name}-${d}`}
        />
      );
    else
      dots.push(
        <ShadedDot color={color} percentVisible={0} key={`${name}-${d}`} />
      );
  }

  return (
    <RatingWrapper>
      <RatingLabel>{name}</RatingLabel>
      <DotsWrapper>{dots}</DotsWrapper>
    </RatingWrapper>
  );
};

// Specialized components for Tasty Base ratings
export const TasteRating = ({ value }) => (
  <Rating name="taste" value={value} color={colors["taste"]} />
);

export const EaseRating = ({ value }) => (
  <Rating name="ease" value={value} color={colors["ease"]} />
);

//Once multiple ratings available, figure out how to be more specific with props (rather than passing whole post)
export const DisplayRatings = (ratings) => (
  <RatingsContainer>
    <TasteRating value={ratings.taste} />
    <EaseRating value={ratings.ease} />
  </RatingsContainer>
);

const RatingInput = ({ value, set }) => (
  <input
    type="number"
    min={`${minRating}`}
    max={`${maxRating}`}
    step={`${ratingStep}`}
    value={value}
    onChange={(e) => set(parseFloatOrEmpty(e.target.value))}
  />
);

export const RatingsEditor = ({ taste, setTaste, ease, setEase }) => {
  const [newTaste, setNewTaste] = useState(taste);
  const [newEase, setNewEase] = useState(ease);

  const onClose = () => setTaste(newTaste) || setEase(newEase);

  const closed = (
    <RatingsContainer>
      {taste ? (
        <TasteRating value={taste} />
      ) : (
        <NumericPlaceholder name="taste" />
      )}
      {ease ? <EaseRating value={ease} /> : <NumericPlaceholder name="ease" />}
    </RatingsContainer>
  );

  const open = (
    <RatingsContainer>
      <RatingWrapper>
        <RatingLabel>taste</RatingLabel>
        <RatingInput value={newTaste} set={setNewTaste} />
      </RatingWrapper>
      <RatingWrapper>
        <RatingLabel>ease</RatingLabel>
        <RatingInput value={newEase} set={setNewEase} />
      </RatingWrapper>
    </RatingsContainer>
  );

  return <ClickToOpen open={open} closed={closed} onClose={onClose} />;
};
