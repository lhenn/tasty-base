import React, { useState } from "react";
import styled from "styled-components";



const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin:0;
`;
const LabelSpan = styled.span`
  font-weight: bold;
`;


const OverviewDiv = (props) => {
    const {post} = props;
    return(
        <StyledDiv>
        <div>
          <p>
            <LabelSpan>Source: </LabelSpan>
            <span
              dangerouslySetInnerHTML={{ __html: post.source }}
            ></span>
          </p>
          <p>
            {post.time} | {post.servings} servings
          </p>
        </div>
      </StyledDiv>
    )
}

export default OverviewDiv;