import React from "react";
import styled from "styled-components";



const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin:20px 0;
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
            {post.activeTime} min active | {post.downtime} min downtime | {post.servings} servings
          </p>
        </div>
      </StyledDiv>
    )
}

export default OverviewDiv;
