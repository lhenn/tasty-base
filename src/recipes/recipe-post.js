import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { getFirebase } from "../firebase";
import styled from "styled-components";
import OverviewDiv from './overview';

const MainImg = styled.img`
    height:300px;
    width:100%;
    object-fit: cover;
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
      <OverviewDiv post={currentPost}/>

      <p dangerouslySetInnerHTML={{ __html: currentPost.content }}></p>
    </>
  );
};

export default RecipePost;
