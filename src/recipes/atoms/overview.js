import React from "react";
import styled from "styled-components";
import AuthorDate from "./author-date";
import { BasicInfoEditor, DisplayBasicInfo } from "./basic-info";
import { DisplayRatings, RatingsEditor } from "./ratings";
import { DisplaySource, SourceEditor } from "./source";

const OverviewWrapper = styled.div`
  margin: 25px 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  @media (max-width: 700px) {
    flex-direction: column;
    margin: 10px 0 20px 0;
  }
`;

const OverviewFirstColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content:center;
  width: 100%;
`;

const OverviewColumn = styled.div`
  border-left: 2px solid #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center;
  width: 100%;
  @media (max-width: 700px) {
    border: 0;
  }
`;

export const DisplayOverview = ({
  authorName,
  timestamp,
  sourceType,
  source,
  activeTime: time,
  servings,
  tastiness: taste,
  easiness: ease,
}) => (
  <OverviewWrapper>
    <OverviewFirstColumn>
      <AuthorDate authorName={authorName} timestamp={timestamp} />
      <DisplaySource sourceType={sourceType} source={source} />
    </OverviewFirstColumn>
    {(time || servings) && (
      <OverviewColumn>
        <DisplayBasicInfo time={time} servings={servings} />
      </OverviewColumn>
    )}
    <OverviewColumn>
      <DisplayRatings taste={taste} ease={ease} />
    </OverviewColumn>
  </OverviewWrapper>
);

export const OverviewEditor = ({
  authorName,
  timestamp,
  sourceType,
  setSourceType,
  source,
  setSource,
  time,
  setTime,
  servings,
  setServings,
  taste,
  setTaste,
  ease,
  setEase,
}) => {
  return (
    <OverviewWrapper>
      <OverviewFirstColumn>
        <AuthorDate authorName={authorName} timestamp={timestamp} />
        <SourceEditor
          sourceType={sourceType}
          setSourceType={setSourceType}
          source={source}
          setSource={setSource}
        />
      </OverviewFirstColumn>
      <OverviewColumn>
        <BasicInfoEditor
          time={time}
          setTime={setTime}
          servings={servings}
          setServings={setServings}
        />
      </OverviewColumn>
      <OverviewColumn>
        <RatingsEditor
          taste={taste}
          setTaste={setTaste}
          ease={ease}
          setEase={setEase}
        />
      </OverviewColumn>
    </OverviewWrapper>
  );
};
