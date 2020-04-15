import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
    width: 100%;
    height: 2rem;
    lineHeight: 2rem;
    verticalAlign: middle;
    fontSize: 1rem;
    marginBottom: 1.5rem;
    padding: 0 0.25rem;
`;

const TextInput = (props) => {
  return (
    <>
      <StyledInput
        type={props.type}
        id={props.id}
        onChange={props.onChange}
      ></StyledInput>
    </>
  );
};

export default TextInput;
