import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";
import { mediumBlueBase } from "../../styling";

export const SourceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
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
        <div>personal recipe</div>
      </SourceContainer>
    );
  } else if (sourceType === "cookbook") {
    return (
      <SourceContainer>
        <div>source: {source}</div>
      </SourceContainer>
    );
  } else {
    return (
      <SourceContainer>
        <div>
          source: <DisplayWebSource source={source} />
        </div>
      </SourceContainer>
    );
  }
};

const StyledSourceTypeSelector = styled.select``;

const SourceTypeSelector = ({ sourceType, set }) => (
  <StyledSourceTypeSelector
    value={sourceType}
    onChange={(e) => set(e.target.value)}
    required
  >
    <option value="" disabled>
      Select recipe source
    </option>
    <option value="personal">Personal</option>
    <option value="web" placeholder="Recipe URL">
      Web
    </option>
    <option value="cookbook" placeholder="Title & author">
      Cookbook
    </option>
  </StyledSourceTypeSelector>
);

const MarginedHideableDiv = styled.div`
  margin: 5px;
  &:empty {
    display: none;
  }
`;

export const SourceEditor = ({
  sourceType,
  setSourceType,
  source,
  setSource,
}) => {
  return (
    <SourceContainer>
      <div style={{ margin: "8px, 5px, 5px, 5px" }}>
        <SourceTypeSelector
          sourceType={sourceType}
          set={(value) => {
            setSourceType(value) || setSource("");
          }}
        />
      </div>

      <MarginedHideableDiv>
        {sourceType === "web" && (
          <input
            type="url"
            minLength="1"
            id="web-source"
            placeholder="Recipe URL"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
          />
        )}
      </MarginedHideableDiv>

      <MarginedHideableDiv>
        {sourceType === "cookbook" && (
          <input
            type="text"
            minLength="1"
            id="web-source"
            placeholder="Cookbook title"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
          />
        )}
      </MarginedHideableDiv>
    </SourceContainer>
  );
};
