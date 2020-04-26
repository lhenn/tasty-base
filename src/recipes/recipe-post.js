import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { getFirebase } from "../firebase";
import styled from "styled-components";
import OverviewDiv from "./overview";

const MainImg = styled.img`
  height: ${(props) => {
    console.log("main image url: ", props);
    if (props.src === "") {
      return "0px";
    } else {
      return "300px";
    }
  }};
  width: 100%;
  object-fit: cover;
`;

export const DisplayRecipePost = (post) => {
  return (
    <>
      <MainImg
        src={post.coverImageURL}
        onerror="this.onerror=null; this.src=''"
      />
      <h1>{post.title}</h1>
      <em>{post.datePretty}</em>
      <OverviewDiv post={post} />
      <p dangerouslySetInnerHTML={{ __html: post.content }}></p>
    </>
  );
};

const RecipePost = ({ match }) => {
  const slug = match.params.slug;
  const [loading, setLoading] = useState(true);
  const [post, setCurrentPost] = useState();

  if (loading && !post) {
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
  if (!post) {
    return <Redirect to="/404" />;
  }

  return DisplayRecipePost(post);
};

export default RecipePost;
