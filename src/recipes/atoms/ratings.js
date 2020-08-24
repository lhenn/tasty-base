import React from "react";
import styled from "styled-components";
import ShadedDot from "../../shaded-dot";
import { yellowBase } from "../../styling";
import { parseFloatOrEmpty } from "../../utils";

// Styling
export const ratingStep = 0.1;
export const minRating = 0.0;
export const maxRating = 5.0;
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

// Generic dots component. name is required for giving dots unique keys.
const Dots = ({ name, value, color }) => {
  const numFilledDots = numDots * (value / maxRating);

  const dots = [];
  for (var d = 0; d < numDots; d++) {
    if (d < Math.floor(numFilledDots))
      dots.push(<ShadedDot color={color} key={`${name}-dot-${d}`} />);
    else if (d === Math.floor(numFilledDots))
      dots.push(
        <ShadedDot
          color={color}
          percentVisible={(numFilledDots % 1) * 100}
          key={`${name}-dot-${d}`}
        />
      );
    else
      dots.push(
        <ShadedDot color={color} percentVisible={0} key={`${name}-dot-${d}`} />
      );
  }

  return <DotsWrapper>{dots}</DotsWrapper>;
};

// Specialized components for Tasty Base ratings
export const TasteRating = ({ value }) => (
  <RatingWrapper>
    <RatingLabel>taste</RatingLabel>
    <Dots name="taste" value={value} color={colors["taste"]} />
  </RatingWrapper>
);

export const EaseRating = ({ value }) => (
  <RatingWrapper>
    <RatingLabel>ease</RatingLabel>
    <Dots name="ease" value={value} color={colors["ease"]} />
  </RatingWrapper>
);

export const DisplayRatings = (ratings) => {
  const averageRating = (ratingObject) => {
    let rateArray = [];
      for (let k in ratingObject) {
        rateArray.push(ratingObject[k].rating);
      }
      return rateArray.reduce((a,b) => a + b, 0) / rateArray.length;
  }
  const tasteValue = averageRating(ratings.taste);
  const easeValue = averageRating(ratings.ease);

  return (
    <RatingsContainer>
      <TasteRating value={tasteValue} />
      <EaseRating value={easeValue} />
    </RatingsContainer>
  );
};

export const RatingInput = ({ value, set }) => (
  <input
    style={{ width: "100%" }}
    type="number"
    min={`${minRating}`}
    max={`${maxRating}`}
    step={`${ratingStep}`}
    value={value}
    onChange={(e) => set(parseFloatOrEmpty(e.target.value))}
  />
);

// Nested divs where one is visible when they're focused and the other is
// visible when they're not
const StyledRatingEditor = styled(RatingWrapper)``;

const StyledRatingInput = styled.input`
  position: absolute;
  width: 70px;
  opacity: 0;
  &:invalid {
    opacity: 1;
  }
  ${StyledRatingEditor}:focus-within & {
    opacity: 1;
  }
`;

const StyledDots = styled.div`
  width: 100px;
  opacity: 1;
  ${StyledRatingInput}:invalid + & {
    opacity: 0;
  }
  ${RatingWrapper}:focus-within & {
    opacity: 0;
  }
`;

export const RatingsEditor = ({ taste, setTaste, ease, setEase }) => {
  return (
    <RatingsContainer>
      <RatingWrapper>
        <RatingLabel>taste </RatingLabel>
        <StyledRatingEditor>
          <StyledDots>
            <Dots
              id="taste-dots"
              name="taste"
              value={taste}
              color={colors["taste"]}
            />
          </StyledDots>
          <StyledRatingInput
            type="number"
            min={`${minRating}`}
            max={`${maxRating}`}
            step={`${ratingStep}`}
            value={taste}
            onChange={(e) => setTaste(parseFloatOrEmpty(e.target.value))}
          />
        </StyledRatingEditor>
      </RatingWrapper>
      <RatingWrapper>
        <RatingLabel>ease </RatingLabel>
        <StyledRatingEditor>
          <StyledDots>
            <Dots
              id="ease-dots"
              name="ease"
              value={ease}
              color={colors["ease"]}
            />
          </StyledDots>
          <StyledRatingInput
            type="number"
            min={`${minRating}`}
            max={`${maxRating}`}
            step={`${ratingStep}`}
            value={ease}
            onChange={(e) => setEase(parseFloatOrEmpty(e.target.value))}
          />
        </StyledRatingEditor>
      </RatingWrapper>
    </RatingsContainer>
  );
};
