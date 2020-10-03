import React from "react";
import styled, { css } from "styled-components";

const TitleStyles = css`
  color: black;
  font-size: 48px;
  @media (max-width: 700px) {
    font-size: 36px;
  }
`;

const StyledTitle = styled.h1`
  ${TitleStyles}
`;

export const DisplayTitle = ({ title }) => <StyledTitle>{title}</StyledTitle>;

const StyledTitleInput = styled.input`
  ${TitleStyles}
`;

export const TitleEditor = ({ title, set }) => {
  return (
    <StyledTitleInput
      type="text"
      minLength="1"
      pattern="\S.*\S"
      id="title"
      placeholder="Title"
      value={title}
      onChange={(e) => set(e.target.value)}
      required
    />
  );
};
