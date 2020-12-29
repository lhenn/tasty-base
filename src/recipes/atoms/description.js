import React from "react";
import styled from "styled-components";
import mdToHTML from "../../forms/md-parse";
import { lightGrey } from "../../styling";
import { getLayoutSize, SMALL, UserContext } from "../../App";
import { useBreakpoint } from "../../breakpoint-hooks";

// TODO: factor out
const DescriptionLink = styled.a`
  text-decoration: underline !important;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: ${(props) => {
    return props.layoutSize == SMALL ? "column" : "row";
  }};
  align-items: center;
  justify-content: center;
  background: ${lightGrey};
  padding: 20px;
`;
const DescriptionHeader = styled.h4`
  font-weight: bold;
  width: 20%;
  display: flex;
  padding:10px;
  align-items: center;
  justify-content: center;
`;
// TODO: factor out
const DescriptionText = styled.p`
${(props) => {
  return props.layoutSize == SMALL ? "width: 100%; ": "width: 80%; margin-right: 20px;";
}}
  white-space: pre-line;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const DisplayDescription = ({ description }) => {
  const matches = useBreakpoint();
  const layoutSize = getLayoutSize(matches);

  return (
    <DescriptionWrapper layoutSize={layoutSize}>
      <DescriptionHeader>About</DescriptionHeader>
      <DescriptionText layoutSize={layoutSize}>
        {mdToHTML(description.replace(/\\n/g, "\n"), DescriptionLink)}
      </DescriptionText>
    </DescriptionWrapper>
  );
};

const StyledDescriptionInput = styled.textarea`
  resize: none;
  width: 100%;
  min-height: 40px;
`;

export const DescriptionEditor = ({ description, set }) => {
  const handleKeyDown = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <DescriptionWrapper>
      <StyledDescriptionInput
        id="description-input"
        onKeyDown={handleKeyDown}
        placeholder="Recipe description"
        value={description}
        onChange={(e) => set(e.target.value)}
      />
    </DescriptionWrapper>
  );
};
