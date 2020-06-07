import React from "react";
import styled from "styled-components";
import Check from "./check";
import Star from "./star";

const IconsWrapper = styled.div`
  display: flex;
`;

export const Icons = ({ slug }) => (
  <IconsWrapper onClick={(e) => e.preventDefault()}>
    <Check slug={slug} />
    <Star slug={slug} />
  </IconsWrapper>
);
