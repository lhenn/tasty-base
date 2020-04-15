import React from "react";
import styled from "styled-components";

const StyledLabel = styled.label`

  margin-bottom: 5px;
`;

const Label = (props) => {
  return (
    <>
      <StyledLabel htmlFor={props.htmlFor}>{props.content}</StyledLabel>
    </>
  );
};

export default Label;
