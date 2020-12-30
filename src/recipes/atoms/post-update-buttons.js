import React from "react"
import styled from "styled-components";
import {deletePost} from "../../firebase";
import { PrimaryButton, SecondaryButton } from "../../general/buttons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import UpdatingTooltip from "../../general/tooltip";
import { Redirect } from "react-router-dom";


const PostStatusOptionsContainer = styled.div`
display: flex;
justify-content: center;
`;

export const EditPostStatusOptions = ({isSubmitting, slug}) => {
    return (
       <PostStatusOptionsContainer>
         {slug !== '' &&
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
        </SecondaryButton></OverlayTrigger>}
        <SecondaryButton
          type="button"
          onClick={(event) => {
            return (<Redirect to={`/recipes/${slug}`} />)
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

  export const DisplayPostStatusOptions = ({slug}) => {

  }
