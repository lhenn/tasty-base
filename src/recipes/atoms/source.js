import React from "react";
import ClickToOpen from "../click-to-open";

// TODO: link display text for web sources

export const DisplaySource = ({ sourceType, source }) => {
  if (sourceType === "personal") {
    return <p>personal recipe</p>;
  } else if (sourceType === "cookbook") {
    return <p>source: {source}</p>;
  } else {
    return (
      <p>
        source: <a href={source}>Web</a>
      </p>
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
    <>
      <SourceTypeSelector sourceType={sourceType} set={setSourceType} />
      {(sourceType === "web" || sourceType === "cookbook") && (
        <SourceInput source={source} set={setSource} />
      )}
    </>
  );

  return <ClickToOpen open={open} closed={closed} />;
};
