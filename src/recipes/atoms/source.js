import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import styled from "styled-components";
import { mediumBlueBase } from "../../styling";
import ClickToOpen from "../click-to-open";

export const SourceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const StyledWebSourceLink = styled.a`
  display: inline-flex;
  align-items: flex-start;
  color: ${mediumBlueBase} !important;
  &:hover {
    text-decoration: underline !important;
    color: ${mediumBlueBase} !important;
    cursor: pointer;
  }
`;
const ExternalLinkIcon = styled(FontAwesomeIcon)`
  font-size: 15px;
  margin: 5px;
`;
const DisplayWebSource = (source) => {
  //remove href if in edit mode to prevent confusion
  return window.location.pathname.includes("edit") ? (
    <StyledWebSourceLink>
      Web <ExternalLinkIcon icon={faExternalLinkAlt} />
    </StyledWebSourceLink>
  ) : (
    <StyledWebSourceLink href={source.source} target="_blank">
      Web <ExternalLinkIcon icon={faExternalLinkAlt} />
    </StyledWebSourceLink>
  );
};
export const DisplaySource = ({ sourceType, source }) => {
  if (sourceType === "personal") {
    return (
      <SourceContainer>
        <p>personal recipe</p>
      </SourceContainer>
    );
  } else if (sourceType === "cookbook") {
    return (
      <SourceContainer>
        <p>source: {source}</p>
      </SourceContainer>
    );
  } else {
    return (
      <SourceContainer>
        <p>
          source: <DisplayWebSource source={source} />
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

export const SourceEditor = ({
  sourceType,
  setSourceType,
  source,
  setSource,
}) => {
  const [newSourceType, setNewSourceType] = useState(sourceType);
  const [newSource, setNewSource] = useState(source);

  const onClose = () => {
    setSourceType(newSourceType) || setSource(newSource);
  };

  const closed = <DisplaySource sourceType={sourceType} source={source} />;

  const open = (
    <SourceContainer>
      <SourceTypeSelector
        sourceType={newSourceType}
        set={(value) => {
          setNewSourceType(value) || setNewSource("");
        }}
      />

      {newSourceType === "web" && (
        <input
          type="url"
          minLength="1"
          id="web-source"
          placeholder="Recipe URL"
          value={newSource}
          onChange={(e) => setNewSource(e.target.value)}
          required
        />
      )}

      {newSourceType === "cookbook" && (
        <input
          type="text"
          minLength="1"
          id="web-source"
          placeholder="Cookbook title"
          value={newSource}
          onChange={(e) => setNewSource(e.target.value)}
          required
        />
      )}
    </SourceContainer>
  );

  return <ClickToOpen open={open} closed={closed} onClose={onClose} />;
};
