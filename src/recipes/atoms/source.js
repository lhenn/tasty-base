import React from "react";
import styled from "styled-components";
import ClickToOpen from "../click-to-open";

export const SourceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// TODO: link display text for web sources

export const DisplaySource = ({ sourceType, source }) => {
  if (sourceType === "personal") {
    return <SourceContainer><p>personal recipe</p></SourceContainer>;
  } else if (sourceType === "cookbook") {
    return <SourceContainer><p>source: {source}</p></SourceContainer>;
  } else {
    return (
      <SourceContainer>
      <p>
        source: <a href={source}>Web</a>
      </p>
      </SourceContainer>
    );
  }
};

const SourceTypeSelector = ({ sourceType, set }) => (
  <select value={sourceType} onChange={(e) => set(e.target.value)}>
    <option value="personal">Personal</option>
    <option value="web" placeholder="Recipe URL">
      Web
    </option>
    <option value="cookbook" placeholder="Title & author">
      Cookbook
    </option>
  </select>
);

// const inputPlaceholder = { web: "Recipe URL", cookbook: "Title & author" };

const SourceInput = ({ source, set }) => (
  <input value={source} onChange={(e) => set(e.target.value)} />
);

export const SourceEditor = ({
  sourceType,
  setSourceType,
  source,
  setSource,
}) => {
  const closed = <DisplaySource sourceType={sourceType} source={source} />;

  const open = (
    <SourceContainer>
      <SourceTypeSelector sourceType={sourceType} set={setSourceType} />
      {(sourceType === "web" || sourceType === "cookbook") && (
        <SourceInput source={source} set={setSource} />
      )}
    </SourceContainer>
  );

  return <ClickToOpen open={open} closed={closed} />;
};
