import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import OverviewDiv from "./overview.js";
import Ratings from "./ratings.js";

const StyledCard = styled.div`
  margin-top: 24px;
  box-shadow: 2px 2px 5px -1px rgba(0, 0, 0, 0.38);
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
const Title = styled(Link)`
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
const Date = styled.span`
  font-size: 18px;
  margin: 0 10px;
  font-weight: bold;
`;

const RecipePreview = (props) => {
  const { post } = props;

  return (
    <StyledCard key={post.slug} className="card">
      <StyledImg src={post.coverImage} alt={post.coverImageAlt} />
      <CardContent>
        <Row1>
          <TitleDate>
            <Title to={`/recipes/${post.slug}`}>
              {post.title}
            </Title>
            <Date> {post.datePretty}</Date>
          </TitleDate>
          <Ratings post={post} />
        </Row1>
        <OverviewDiv post={post} />
        <br></br>
        <Link to={`/recipes/${post.slug}`}>Continue reading...</Link>
      </CardContent>
    </StyledCard>
  );
};

export default RecipePreview;
