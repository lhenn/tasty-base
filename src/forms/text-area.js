import React from "react";
import styled from "styled-components";

const StyledTextArea = styled.textarea`
    width: 100%;
    height: 200px;
    lineHeight: 2rem;
    verticalAlign: middle;
    fontSize: 1rem;
    marginBottom: 1.5rem;
    padding: 0 0.25rem;
`;

const TextArea = (props) => {
  return (
    <>
      <StyledTextArea
        type={props.type}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        {...props}
      ></StyledTextArea>
    </>
  );
};

export default TextArea;
