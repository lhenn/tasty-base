import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import OverviewDiv from "./overview.js";
import Ratings from "./ratings.js";

const InvisibleLink = styled.a`
text-decoration: none;
color:inherit;
&:hover {
  text-decoration: none;
  color:inherit;
}
`;
const StyledCard = styled.div`
  margin-top: 24px;
  box-shadow: 10px 10px 5px -10px rgba(0,0,0,0.75);
  &:hover {
    box-shadow: 10px 10px 5px -9px rgba(0,0,0,0.75);
  }
`;

const StyledImg = styled.img`
  height: 300px;
  width: 100%;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const Row1 = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.span`
  color: black;
  font-size: 48px;
  text-decoration: none;
  font-family: "Playfair Display", serif;
  background-image: linear-gradient(120deg, #fffa4e 0%, #fffa4e 100%);
  background-repeat: no-repeat;
  background-size: 100% 0.5em;
  background-position: 0 88%;
  transition: background-size 0.1s ease-in;
  cursor: pointer;
  &:hover {
    background-size: 100% 60%;
  }
`;

const TitleDate = styled.div`
  margin: 0;
`;

const TimestampWrapper = styled.span`
  font-size: 18px;
  margin: 0 10px;
  font-weight: bold;
`;

const Timestamp = ({ timestamp }) => {
  const date = new Date(timestamp);
  const hoverOptions = {
    hour: "numeric",
    minute: "numeric",
    month: "numeric",
    day: "numeric",
    year: "numeric",
  };
  const options = { month: "long", day: "numeric", year: "numeric" };
  return (
    <TimestampWrapper title={date.toLocaleDateString("en-GB", hoverOptions)}>
      {date.toLocaleDateString("en-GB", options)}{" "}
    </TimestampWrapper>
  );
};

// TODO: ADD SLUG!
const RecipePreview = ({ post, slug }) => {
  return (
    <InvisibleLink href={`/recipes/${slug}`}>
    <StyledCard >
      <StyledImg src={post.coverImageURL} alt={post.coverImageAlt} />
      <CardContent>
        <Row1>
          <TitleDate>
            <Title >{post.title}</Title>
            <Timestamp timestamp={post.timestamp} />
          </TitleDate>
          <Ratings post={post} />
        </Row1>
        <OverviewDiv post={post} />
        <br></br>
      </CardContent>
    </StyledCard>
    </InvisibleLink>
  );
};

export default RecipePreview;
