import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons";

const StyledTitle = styled.h1`
  color: black;
  font-size: 44px;
  text-decoration: none;
`;

export const Title = ({ title }) => <StyledTitle>{title}</StyledTitle>;

const Timestamp = ({ timestamp }) => {
  const date = new Date(timestamp);
  const hoverOptions = {
    hour: "numeric",
    minute: "numeric",
    month: "numeric",
    day: "numeric",
    year: "numeric",
  };
  const TimeSpan = styled.span`
    font-style: italic;
  `;
  const options = { month: "long", day: "numeric", year: "numeric" };
  return (
    <TimeSpan title={date.toLocaleDateString("en-GB", hoverOptions)}>
      {date.toLocaleDateString("en-GB", options)}{" "}
    </TimeSpan>
  );
};

export const AuthorDate = ({ authorName, timestamp }) => {
  return (
    <p>
      {authorName}, <Timestamp timestamp={timestamp} />
    </p>
  );
};

const IconsWrapper = styled.div`
  display: flex;
`;

// TODO: change styling when starred
const getActiveIconColor = (props) => {
  if(props.icon == faStar) return '#EFD910';
  if(props.icon == faCheck) return '#05CF56';
}
export const Icon = styled(FontAwesomeIcon)`
  color: ${(props) => props.isActive ? getActiveIconColor(props) : 'lightgrey'};
  font-size: 26px;
  padding: 5px;
  margin: 20px 5px;
  &:hover {
    color: ${(props) => props.isActive ? 'lightgrey' : getActiveIconColor(props)};
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
