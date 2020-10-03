import React from "react";
import styled from "styled-components";
import mdToHTML from "../../forms/md-parse";
import { lightGrey } from "../../styling";

// TODO: factor out
const DescriptionLink = styled.a`
  text-decoration: underline !important;
`;

// TODO: factor out
const DescriptionText = styled.p`
  white-space: pre-line;
  margin: 0;
  padding: 0;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${lightGrey};
  padding: 25px 15% 25px 15%;
`;

export const DisplayDescription = ({ description }) => (
  <DescriptionWrapper>
    <DescriptionText>
      {mdToHTML(description.replace(/\\n/g, "\n"), DescriptionLink)}
    </DescriptionText>
  </DescriptionWrapper>
);

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
