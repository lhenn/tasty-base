import React from "react";
import styled from "styled-components";
import { deletePost } from "../../firebase";
import { PrimaryButton, SecondaryButton } from "../../general/buttons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import UpdatingTooltip from "../../general/tooltip";
import { Redirect, Link } from "react-router-dom";

const PostStatusOptionsContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const DeleteButton = (slug) => (
  <OverlayTrigger
    placement="bottom"
    trigger={["hover", "focus"]}
    overlay={<UpdatingTooltip>This is permanent!</UpdatingTooltip>}
  >
    <SecondaryButton
      type="button"
      onClick={(event) => {
        deletePost(slug);
        window.location.href = "/"; //redirect to home
      }}
    >
      Delete
    </SecondaryButton>
  </OverlayTrigger>
);

export const EditPostStatusOptions = ({ isSubmitting, slug }) => {
  return (
    <PostStatusOptionsContainer>
      {slug !== "" && <DeleteButton slug={slug} />}
      <SecondaryButton
        type="button"
        onClick={(event) => {
          return <Redirect to={`/recipes/${slug}`} />;
        }}
      >
        Cancel
      </SecondaryButton>
      <PrimaryButton type="submit" disabled={isSubmitting}>
        Submit
      </PrimaryButton>
    </PostStatusOptionsContainer>
  );
};
const EditButton = ({ slug }) => (
  <Link to={`/recipes/${slug}/edit`}>
    <PrimaryButton>Edit</PrimaryButton>
  </Link>
);
export const DisplayPostStatusOptions = ({ slug }) => (
  <PostStatusOptionsContainer>
    <EditButton slug={slug} />
    <DeleteButton slug={slug} />
  </PostStatusOptionsContainer>
);
