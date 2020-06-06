import React from "react";
import styled from "styled-components";
import { yellowBase } from "../styling";

export const RatingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Circle = styled.div`
  margin: 1.5px;
  height: 16px;
  width: 16px;
  background: ${(props) => props.color};
  border-radius: 50%;
`;

const DotMask = styled.div`
  position: relative;
  top: 0;
  left: ${({ percentVisible }) => `${percentVisible}%`};
  width: ${({ percentVisible }) => `${100 - percentVisible}%`};
  height: 100%;
  background: rgba(255, 255, 255, 0.65);
`;

const ShadedDot = ({ color, percentVisible = 100 }) => (
  <Circle color={color}>
    <DotMask percentVisible={percentVisible}></DotMask>
  </Circle>
);

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

const Rating = ({ name, value, color }) => {
  const numFilledDots = numDots * (value / maxValue);

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

const maxValue = 10.0;
const numDots = 5;
const colors = { taste: yellowBase, ease: "#4B3E99" };

export const TasteRating = ({value}) => (
  <Rating name="taste" value={value} color={colors["taste"]} />
);

export const EaseRating = ({value}) => (
  <Rating name="ease" value={value} color={colors["ease"]} />
);

//Once multiple ratings available, figure out how to be more specific with props (rather than passing whole post)
const Ratings = (ratings) => (
  <RatingsContainer>
    {Object.entries(ratings).map(([name, value]) => (
      <Rating name={name} value={value} color={colors[name]} key={name} />
    ))}
  </RatingsContainer>
);

export default Ratings;
