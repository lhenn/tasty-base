import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import Check from './check';
import Star from './star';
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

const getActiveIconColor = (props) => {
  if(props.icon === faStar) return '#EFD910';
  if(props.icon === faCheck) return '#05CF56';
}
export const Icon = styled(FontAwesomeIcon)`
  color: ${(props) => props.isactive ? getActiveIconColor(props) : 'lightgrey'};
  font-size: 26px;
  padding: 5px;
  margin: 20px 5px;
  &:hover {
    color: ${(props) => getActiveIconColor(props)};
  }
`;


export const Icons = ({slug}) => (
<IconsWrapper onClick={(e) => e.preventDefault()}>
    <Check slug={slug}/>
    <Star slug={slug}/>
  </IconsWrapper>
);

  

