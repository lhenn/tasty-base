import React from "react";
import styled from "styled-components";
import { redBase } from "../../styling";

const TimeSpan = styled.span`
  font-style: italic;
`;

const dateHoverOptions = {
  hour: "numeric",
  minute: "numeric",
  month: "numeric",
  day: "numeric",
  year: "numeric",
};

const dateOptions = { month: "long", day: "numeric", year: "numeric" };

const Timestamp = ({ timestamp }) => {
  const date = new Date(timestamp);
  return (
    <TimeSpan title={date.toLocaleDateString("en-GB", dateHoverOptions)}>
      {date.toLocaleDateString("en-GB", dateOptions)}{" "}
    </TimeSpan>
  );
};

const AuthorDateWrapper = styled.div`
  color: ${redBase};
  padding: 5px;
`;

const AuthorDate = ({ authorName, timestamp }) => {
  return (
    <AuthorDateWrapper>
      {authorName}, <Timestamp timestamp={timestamp} />
    </AuthorDateWrapper>
  );
};

export default AuthorDate;
