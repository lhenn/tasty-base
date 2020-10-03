import React from "react";
import firebase from "firebase/app";
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
  padding: 5px;
`;

const DotsWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Count = styled.span`
  color: #717070;
  padding: 0 5px;
  font-size: 16px;
`;

export const StyledRatingSpan = styled.span`
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
export const TasteRating = ({ value, count }) => (
  <RatingWrapper>
    <StyledRatingSpan>taste</StyledRatingSpan>
    <Dots name="taste" value={value} color={colors["taste"]} />
    <Count>({count})</Count>
  </RatingWrapper>
);

export const EaseRating = ({ value, count }) => (
  <RatingWrapper>
    <StyledRatingSpan>ease</StyledRatingSpan>
    <Dots name="ease" value={value} color={colors["ease"]} />
    <Count>({count})</Count>
  </RatingWrapper>
);

export const DisplayRatings = (ratings) => {
  const averageRating = (ratingObject) => {
    let [rateArray, count] = [[], 0];
    for (let k in ratingObject) {
      rateArray.push(ratingObject[k].rating);
      count++;
    }
    return {
      count,
      value: rateArray.reduce((a, b) => a + b, 0) / rateArray.length,
    };
  };
  const tasteData = averageRating(ratings.taste);
  const easeData = averageRating(ratings.ease);

  return (
    <RatingsContainer>
      <TasteRating value={tasteData.value} count={tasteData.count} />
      <EaseRating value={easeData.value} count={easeData.count} />
    </RatingsContainer>
  );
};

// Subscribe and unsubscribe functions are for updating rating values in components when the database values are updated (in recipe-preview and display-recipe)
export const SubscribeToRatings = (
  slug,
  initialTaste,
  initialEase,
  setTaste,
  setEase
) => {
  firebase
    .database()
    .ref(`posts/${slug}/taste`)
    .on("value", (snapshot) => {
      if (JSON.stringify(snapshot.val()) !== JSON.stringify(initialTaste)) {
        setTaste(snapshot.val());
      }
    });
  firebase
    .database()
    .ref(`posts/${slug}/ease`)
    .on("value", (snapshot) => {
      if (JSON.stringify(snapshot.val()) !== JSON.stringify(initialEase)) {
        setEase(snapshot.val());
      }
    });
};
export const UnsubscribeFromRatings = (slug) => {
  firebase.database().ref(`posts/${slug}/taste`).off("value");
  firebase.database().ref(`posts/${slug}/ease`).off("value");
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
  width: 70px;
`;

const MarginedDiv = styled.div`
  margin: 5px;
`;

export const RatingsEditor = ({ taste, setTaste, ease, setEase }) => {
  return (
    <RatingsContainer>
      <MarginedDiv>
        {"taste: "}
        <StyledRatingInput
          type="number"
          placeholder="--"
          min={`${minRating}`}
          max={`${maxRating}`}
          step={`${ratingStep}`}
          value={taste}
          onChange={(e) => setTaste(parseFloatOrEmpty(e.target.value))}
          required
        />
      </MarginedDiv>
      <MarginedDiv>
        {"ease: "}
        <StyledRatingInput
          type="number"
          placeholder="--"
          min={`${minRating}`}
          max={`${maxRating}`}
          step={`${ratingStep}`}
          value={ease}
          onChange={(e) => setEase(parseFloatOrEmpty(e.target.value))}
          required
        />
      </MarginedDiv>
    </RatingsContainer>
  );
};
