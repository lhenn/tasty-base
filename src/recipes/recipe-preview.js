import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFirebase } from "../firebase";
import useCancellablePromises from "../promise-hooks";
import { AuthorDate, Icons, Title } from "./general-recipe";
import Ratings from "./ratings.js";

// NEW STYLES START
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

// NEW STYLES END
const RecipePreview = ({ post, slug }) => {
  const [authorName, setAuthorName] = useState("");
  const { addPromise } = useCancellablePromises();

  useEffect(() => {
    console.log("preview mounting!");
    return () => console.log("preview unmounting!");
  }, []);

  // Get author name
  useEffect(() => {
    const authorNamePromise = getFirebase()
      .database()
      .ref(`/users/${post.author}/name`)
      .once("value")
      .then(
        (snapshot) => {
          setAuthorName(snapshot.val());
        },
        (err) =>
          console.log(
            "SelfLoadingRecipePost: author name loading failed with code: ",
            err.code
          )
      );

    addPromise(authorNamePromise);
  }, [slug, post]);

  return (
    <Link to={`/recipes/${slug}`}>
      <Card>
        {post.coverImageURL && (
          <StyledImg src={post.coverImageURL} alt={post.coverImageAlt} />
        )}
        <CardContent>
          <Title title={post.title} />
          <AuthorDate authorName={authorName} timestamp={post.timestamp} />
          <BottomRow>
            <Ratings post={post} />
            <Icons />
          </BottomRow>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RecipePreview;
