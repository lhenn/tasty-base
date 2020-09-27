import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AuthorDate from "./atoms/author-date";
import { CardCoverImage } from "./atoms/cover-image";
import { Icons } from "./atoms/icons";
import { DisplayRatings, SubscribeToRatings, UnsubscribeFromRatings } from "./atoms/ratings.js";
import { DisplayTitle } from "./atoms/title";

//this is a test
const CardContainer = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: column;
  border: solid 2px black;
  width: 95%;
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


const RecipePreview = ({ post: { content, slug } }) => {
  const [taste, setTaste] = useState(null);
  const [ease, setEase] = useState(null);

  useEffect(() => {
    SubscribeToRatings(slug, content.taste, content.ease, setTaste, setEase);
    return UnsubscribeFromRatings();
  }, []);

  return (
    <Link to={`/recipes/${slug}`}>
      <CardContainer>
        {content.coverImageURL && (
          <CardCoverImage
            src={content.coverImageURL}
            alt={content.coverImageAlt}
          />
        )}

        <CardContent>
          <DisplayTitle title={content.title} />
          <AuthorDate
            authorName={content.authorName}
            timestamp={content.timestamp}
          />
          <BottomRow>
            <DisplayRatings taste={taste} ease={ease} />
            <Icons slug={slug} />
          </BottomRow>
        </CardContent>
      </CardContainer>
    </Link>
  );
};

export default RecipePreview;
