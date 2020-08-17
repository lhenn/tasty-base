import React, { useState } from "react";
import styled from "styled-components";
import mdToHTML from "../../forms/md-parse";
import { defaultTransparent, lightGrey } from "../../styling";
import { textIsEmpty } from "../../utils";
import ClickToOpen from "../click-to-open";

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

const TransparentDescriptionText = styled(DescriptionText)`
  opacity: ${defaultTransparent};
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

export const DescriptionPlaceholder = () => (
  <DescriptionWrapper>
    <TransparentDescriptionText>Description</TransparentDescriptionText>
  </DescriptionWrapper>
);

export const DescriptionEditor = ({ description, set }) => {
  const [newDescription, setNewDescription] = useState(description);

  const onClose = () => set(newDescription);

  const closed = textIsEmpty(description) ? (
    <DescriptionPlaceholder />
  ) : (
    <DisplayDescription description={description} />
  );
  const open = (
    <DescriptionWrapper>
      <textarea
        placeholder={"Say something about this recipe"}
        style={{ width: "100%" }}
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        autoFocus
      />
    </DescriptionWrapper>
  );
  // console.log("DESC", description, open, closed);
  return <ClickToOpen open={open} closed={closed} onClose={onClose} />;
};
