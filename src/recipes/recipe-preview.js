import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Ratings from "./ratings.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons";

import { getFirebase } from "../firebase";

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
// NEW STYLES START
const Card = styled.div`
  margin: 15px;
  display: inline-flex;
  flex-direction:column;
  box-shadow: 10px 10px 5px -10px rgba(0, 0, 0, 0.75);
  &:hover {
    box-shadow: 10px 10px 5px -9px rgba(0, 0, 0, 0.75);
  }
  width: 400px;
`;
const StyledImg = styled.img`
  height: 250px;
  object-fit: cover;

`;

const CardContent = styled.div`
  flex-grow: 1;
  padding: 16px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items:flex-start;
`;

const Title = styled.h1`
  color: black;
  font-size: 44px;
  text-decoration: none;
  cursor: pointer;
`;

const TimestampWrapper = styled.span`
font-style: italic;
`;
const BottomRow = styled.div`
  display:flex;
  justify-content:space-between;
  width:100%;
  align-items:flex-end;
`;
const IconsWrapper = styled.div`
  display:flex;

`;
const Icon = styled(FontAwesomeIcon)`
  color:lightgrey;
  font-size:26px;
  padding:5px;
  margin: 20px 5px;
  &:hover{
    color: #9791e8;
  }
`;


// NEW STYLES END
const RecipePreview = ({ post, slug }) => {
  const [authorName, setAuthorName] = useState("");
  // Get author name
  useEffect( () => {
    let isMounted = true;
    getFirebase()
    .database()
    .ref(`/users/${post.author}/name`)
    .once("value")
    .then(
      (snapshot) => {
        if(!isMounted) return;
        setAuthorName(snapshot.val());
      },
      (err) =>
        console.log(
          "SelfLoadingRecipePost: author name loading failed with code: ",
          err.code
        )
    );
    return () => {
      isMounted = false;
    }
  }, []);

  return (
    <Link to={`/recipes/${slug}`}>
      <Card>
        {post.coverImageURL && <StyledImg src={post.coverImageURL} alt={post.coverImageAlt} />}
        <CardContent>
          <Title>
            {post.title} 
          </Title>
          <p>{authorName}, <Timestamp timestamp={post.timestamp} /></p>
          <BottomRow>
          <Ratings post={post} />
          <IconsWrapper>
          <Icon icon={faStar}/>
          <Icon icon={faCheck}/>
          </IconsWrapper>
          </BottomRow>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RecipePreview;
