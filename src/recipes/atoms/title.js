import React, { useState } from "react";
import styled from "styled-components";
import { textIsEmpty } from "../../utils";
import ClickToOpen from "../click-to-open";

export const StyledTitle = styled.h1`
  color: black;
  font-size: 48px;
  @media (max-width: 700px) {
    font-size: 36px;
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
  const [newTitle, setNewTitle] = useState(title);

  const onClose = () => set(newTitle);

  const closed = textIsEmpty(title) ? (
    <TitlePlaceholder />
  ) : (
    <DisplayTitle title={title} />
  );

  const open = (
    <input
      placeholder="Title"
      value={newTitle}
      onChange={(e) => setNewTitle(e.target.value)}
      autoFocus
    />
  );

  return <ClickToOpen open={open} closed={closed} onClose={onClose} />;
};
