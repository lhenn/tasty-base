import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthorDate, Icons, Title } from "./general-recipe";
import Ratings from "./ratings.js";

const Card = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 10px 10px 5px -10px rgba(0, 0, 0, 0.75);
  &:hover {
    box-shadow: 10px 10px 5px -9px rgba(0, 0, 0, 0.75);
  }
  width: 95%;
`;
const StyledImg = styled.img`
  height: 250px;
  width: 100%;
  object-fit: cover;
`;

const CardContent = styled.div`
  flex-grow: 1;
  padding: 16px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: flex-end;
`;

const RecipePreview = ({ post: { content, slug } }) => (
  <Link to={`/recipes/${slug}`}>
    <Card>
      {content.coverImageURL && (
        <StyledImg src={content.coverImageURL} alt={content.coverImageAlt} />
      )}
      <CardContent>
        <Title title={content.title} />
        <AuthorDate
          authorName={content.authorName}
          timestamp={content.timestamp}
        />
        <BottomRow>
          <Ratings taste={content.tastiness} ease={content.easiness} />
          <Icons />
        </BottomRow>
      </CardContent>
    </Card>
  </Link>
);

export default RecipePreview;
