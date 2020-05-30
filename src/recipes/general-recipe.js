import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";
import { redBase } from "../styling";

const StyledTitle = styled.h1`
  color: black;
  font-size: 48px;
`;

export const Title = ({ title }) => <StyledTitle>{title}</StyledTitle>;

const TimeSpan = styled.span`
  font-style: italic;
`;

const hoverOptions = {
  hour: "numeric",
  minute: "numeric",
  month: "numeric",
  day: "numeric",
  year: "numeric",
};

const options = { month: "long", day: "numeric", year: "numeric" };

const Timestamp = ({ timestamp }) => {
  const date = new Date(timestamp);
  return (
    <TimeSpan title={date.toLocaleDateString("en-GB", hoverOptions)}>
      {date.toLocaleDateString("en-GB", options)}{" "}
    </TimeSpan>
  );
};

const AuthorDateWrapper = styled.p`
  color: ${redBase};
`;

export const AuthorDate = ({ authorName, timestamp }) => {
  return (
    <AuthorDateWrapper>
      {authorName}, <Timestamp timestamp={timestamp} />
    </AuthorDateWrapper>
  );
};

export const Source = ({ sourceType, source }) => {
  if (sourceType === "personal") return <p>personal recipe</p>;
  else if (sourceType === "cookbook") return <p>source: {source}</p>;
  else
    return (
      <p>
        source: <a href={source}>Web</a>
      </p>
    );
};

const IconsWrapper = styled.div`
  display: flex;
`;

// TODO: change styling when starred
export const Icon = styled(FontAwesomeIcon)`
  color: lightgrey;
  font-size: 26px;
  padding: 5px;
  margin: 20px 5px;
  &:hover {
    color: #9791e8;
  }
`;

//Might end up removing this(?)
// TODO: pass props
export const Icons = () => (
  <IconsWrapper>
    <Icon icon={faStar} />
    <Icon icon={faCheck} />
  </IconsWrapper>
);
