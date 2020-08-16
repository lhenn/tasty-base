import React from "react";
import styled from "styled-components";
import { textIsEmpty } from "../../utils";
import ClickToOpen from "../click-to-open";

export const StyledTitle = styled.h1`
  color: black;
  font-size: 48px;
  @media(max-width:700px){
    font-size:36px;
  }
`;

const TransparentStyledTitle = styled(StyledTitle)`
  opacity: 0.4;
`;

export const TitlePlaceholder = () => (
  <TransparentStyledTitle>Title</TransparentStyledTitle>
);

export const DisplayTitle = ({ title }) => <StyledTitle>{title}</StyledTitle>;

export const TitleEditor = ({ title, set }) => {
  const closed = textIsEmpty(title) ? (
    <TitlePlaceholder />
  ) : (
    <DisplayTitle title={title} />
  );
  const open = (
    <input
      placeholder="Title"
      value={title}
      onChange={(e) => set(e.target.value)}
      autoFocus
    />
  );
  // console.log("TITLE", title, open, closed);
  return <ClickToOpen open={open} closed={closed} />;
};
