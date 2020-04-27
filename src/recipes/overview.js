import React from "react";
import styled from "styled-components";

const OverviewWrapper = styled.div`
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

const OverviewDiv = ({ post }) => {
  return (
    <OverviewWrapper>
      <div>
        <Source sourceType={post.sourceType} source={post.source} />
        <p>
          {post.activeTime} min active | {post.downtime} min downtime |{" "}
          {post.servings} servings
        </p>
      </div>
    </OverviewWrapper>
  );
};

export default OverviewDiv;
