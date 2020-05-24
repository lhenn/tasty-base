import React from "react";
import styled from "styled-components";

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  flex-grow: 1;
`;

export const FormRow = styled.div`
  display: flex;
  margin: 20px 0;
`;
const StyledLabel = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
`;

export const Label = (props) => (
  <>
    <StyledLabel htmlFor={props.htmlFor} {...props}>
      {props.content}
    </StyledLabel>
  </>
);
const StyledInput = styled.input`
  width: 100%;
  height: 2rem;
  lineheight: 2rem;
  verticalalign: middle;
  fontsize: 1rem;
  marginbottom: 1.5rem;
  padding: 0 0.25rem;
`;

export const Input = (props) => (
  <>
    <StyledInput {...props}></StyledInput>
  </>
);

const StyledTextArea = styled.textarea`
  width: 100%;
  height: 200px;
  lineheight: 2rem;
  verticalalign: middle;
  fontsize: 1rem;
  marginbottom: 1.5rem;
  padding: 0 0.25rem;
`;

export const TextArea = (props) => (
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
