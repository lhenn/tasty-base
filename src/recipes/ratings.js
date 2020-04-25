import React, { useState } from "react";
import styled from "styled-components";

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
  background-color: #eae8df73;
  font-family: "Playfair Display", serif;
`;
const Bar = styled.div`
  width: ${(props) => props.percentage}px;
  background-color: ${(props) => props.color};
  padding: 3px 0;
  margin: 3px 0;
  font-family: "Playfair Display", serif;
  font-size:13px;
`;

const NumVotes = styled.div`
  font-family: sans-serif;
  font-size: 12px;
  color: #5f5d58eb;
  padding: 5px;
`;

const Ratings = (props) => {
  const { post } = props;
  //obviously will need to fix this later if multiple ratings involved
  const tastePercent = post.tastiness * 10;
  const easePercent = post.easiness * 10;
  return (
    <RatingsContainer>
      <RatingsInner>
        <Labels>
          <Label>taste</Label>
          <Label>ease</Label>
        </Labels>
        <Bars>
          <Bar color="#775ffbb3" percentage={tastePercent}>
            {" "}
            &nbsp;{tastePercent}%
          </Bar>
          <Bar color="#fb6e5fb3" percentage={easePercent}>
            {" "}
            &nbsp;{easePercent}%
          </Bar>
        </Bars>
      </RatingsInner>
      <NumVotes>x votes</NumVotes>
    </RatingsContainer>
  );
};

export default Ratings;
