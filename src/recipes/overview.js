import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0;
`;

const SourceLabel = styled.span`
  font-weight: bold;
`;

const WebSourceLink = styled.a`
  font-weight: bold;
`;

const Source = ({ sourceType, source }) => {
  return (
    <p>
      {sourceType === "web" ? (
        <WebSourceLink href={source}>Source</WebSourceLink>
      ) : (
        <>
          <SourceLabel>Source: </SourceLabel>
          <span>{source}</span>
        </>
      )}
    </p>
  );
};

const OverviewWrapper = ({ content }) => {
  return (
    <Wrapper>
      <Source sourceType={content.sourceType} source={content.source} />
      <p>
        {content.activeTime} min active | {content.downtime} min downtime |{" "}
        {content.servings} servings
      </p>
    </Wrapper>
  );
};

export default OverviewWrapper;
