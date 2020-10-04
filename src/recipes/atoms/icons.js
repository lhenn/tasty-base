import React from "react";
import styled from "styled-components";
import Check from "./check";
import Star from "./star";
import Lightbulb from "./lightbulb";

const IconsWrapper = styled.div`
  display: flex;
  @media (max-width: 700px) {
    align-self: flex-end;
  }
`;

export const Icons = ({ slug, contribution }) => (
  <IconsWrapper onClick={(e) => e.preventDefault()}>
    <Check slug={slug} />
    <Star slug={slug} />
    <Lightbulb contribution={contribution} />
  </IconsWrapper>
);
