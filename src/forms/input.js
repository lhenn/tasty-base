import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  width: 100%;
  height: 2rem;
  lineheight: 2rem;
  verticalalign: middle;
  fontsize: 1rem;
  marginbottom: 1.5rem;
  padding: 0 0.25rem;
`;

const Input = (props) => {
  return (
    <>
      <StyledInput {...props}></StyledInput>
    </>
  );
};

export default Input;
