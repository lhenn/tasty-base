import React from "react";
import styled from "styled-components";
import { yellowBase } from "../styling";

const RatingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RatingsInner = styled.div`
  display: flex;
  width: min-content;
`;

const Labels = styled.div`
  border-right: solid 1px #5f5d58eb;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const Label = styled.div`
  padding: 3px 8px;
  font-family: "Playfair Display", serif;
  font-weight: 700;
  font-size: 16px;
  font-style: italic;
`;

const Bars = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100px;
  font-family: "Playfair Display", serif;
`;

const BarWrapper = styled.div`
  display: flex;
`;

const BarSection = styled.div`
  width: ${(props) => props.percentage}px;
  background-color: ${(props) => props.color};
  padding: 3px 0;
  margin: 3px 0;
  font-family: "Playfair Display", serif;
  font-size: 13px;
`;

const NumVotes = styled.div`
  font-family: sans-serif;
  font-size: 12px;
  color: #5f5d58eb;
  padding: 5px;
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

const RatingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DotsWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const RatingLabel = styled.span`
  width: 55px;
`

const Rating = ({ name, value, color }) => {
  const numFilledDots = numDots * (value / maxValue);

  const dots = [];
  for (var d = 0; d < numDots; d++) {
    if (d < Math.floor(numFilledDots))
      dots.push(<ShadedDot color={color} key={`${name}_${d}`} />);
    else if (d === Math.floor(numFilledDots))
      dots.push(
        <ShadedDot
          color={color}
          percentVisible={(numFilledDots % 1) * 100}
          key={`${name}_${d}`}
        />
      );
    else
      dots.push(
        <ShadedDot color={color} percentVisible={0} key={`${name}_${d}`} />
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

//Once multiple ratings available, figure out how to be more specific with props (rather than passing whole post)
const Ratings = (ratings) => {
  return (
    <RatingsContainer>
      {Object.entries(ratings).map(([name, value]) => (
        <Rating name={name} value={value} color={colors[name]} key={name} />
      ))}
    </RatingsContainer>
  );

  // return (
  //   <RatingsContainer>
  //     <RatingsInner>
  //       <Labels>
  //         <Label>taste</Label>
  //         <Label>ease</Label>
  //       </Labels>
  //       <Bars>
  //         <BarWrapper>
  //           <BarSection color="#775ffbb3" percentage={tastePercent}>
  //             {" "}
  //             &nbsp;{tastePercent}%
  //           </BarSection>
  //           <BarSection color="#775ffb4d" percentage={100 - tastePercent}>
  //             &nbsp;
  //           </BarSection>
  //         </BarWrapper>
  //         <BarWrapper>
  //           <BarSection color="#fb6e5fb3" percentage={easePercent}>
  //             {" "}
  //             &nbsp;{easePercent}%
  //           </BarSection>
  //           <BarSection color="#fb6e5f5e" percentage={100 - easePercent}>
  //             &nbsp;
  //           </BarSection>
  //         </BarWrapper>
  //       </Bars>
  //     </RatingsInner>
  //     <NumVotes>x votes</NumVotes>
  //   </RatingsContainer>
  // );
};

export default Ratings;
