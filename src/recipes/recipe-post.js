import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { getFirebase } from "../firebase";
import styled from "styled-components";

const MainImg = styled.img`
    height:300px;
    width:100%;
    object-fit: cover;
`;
const OverviewDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin:20px 0;
`;
const LabelSpan = styled.span`
  font-weight: bold;
`;
const RecipePost = ({ match }) => {
  const slug = match.params.slug;
  // const postSlugs = ["my-first-blog-post", "my-second-blog-post"];
  const [loading, setLoading] = useState(true);
  const [currentPost, setCurrentPost] = useState();
  if (loading && !currentPost) {
    const postsRef = getFirebase().database().ref().child("posts");
    postsRef
      .orderByChild("slug")
      .equalTo(slug)
      .on("child_added", function (snapshot) {
        console.log("the post: ", snapshot.val());
        setCurrentPost(snapshot.val());
        setLoading(false);
      });
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  // Loading is done and post wasn't found in the database
  if (!currentPost) {
    return <Redirect to="/404" />;
  }
  //<img src={currentPost.coverImage} alt={currentPost.coverImageAlt} />
  return (
    <>
    <MainImg src={currentPost.coverImage}/>
      <h1>{currentPost.title}</h1>
      <em>{currentPost.datePretty}</em>
      <OverviewDiv>
        <div>
          <p>
            <LabelSpan>Source: </LabelSpan>
            <span
              dangerouslySetInnerHTML={{ __html: currentPost.source }}
            ></span>
          </p>
          <p>
            {currentPost.time} | {currentPost.servings} servings
          </p>
        </div>
        <div>
            <p>{currentPost.easiness}/10 Easiness</p>
            <p>{currentPost.tastiness}/10 Tastiness</p>
        </div>
      </OverviewDiv>

      <p dangerouslySetInnerHTML={{ __html: currentPost.content }}></p>
    </>
  );
};

export default RecipePost;
