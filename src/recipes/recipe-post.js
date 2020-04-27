import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { getFirebase } from "../firebase";
import styled from "styled-components";
import OverviewDiv from "./overview";

const MainImg = styled.img`
  height: ${(props) => {
    if (props.src === "") {
      return "0px";
    } else {
      return "300px";
    }
  }};
  width: 100%;
  object-fit: cover;
`;

const IngredientsUL = styled.ul``;

const IngredientLI = styled.li``;

const Ingredients = ({ ingredients }) => {
  return (
    <IngredientsUL>
      {ingredients.map((ingredient, i) => (
        <IngredientLI key={`ingredient-${i}`}>
          {ingredient.amount} {ingredient.name}
        </IngredientLI>
      ))}
    </IngredientsUL>
  );
};

const InstructionsOL = styled.ol``;

const InstructionsLI = styled.li``;

const Instructions = ({ instructions }) => {
  return (
    <InstructionsOL>
      {instructions.map((instruction, i) => (
        <InstructionsLI key={`instruction-${i}`}>{instruction}</InstructionsLI>
      ))}
    </InstructionsOL>
  );
};

const Description = styled.p`
  white-space: pre-wrap;
`;

const DetailsDiv = styled.div`
  display: flex;
`;

const Details = ({ ingredients, instructions }) => {
  return (
    <DetailsDiv>
      <Ingredients ingredients={ingredients} />
      <Instructions instructions={instructions} />
    </DetailsDiv>
  );
};

export const DisplayRecipePost = (post) => {
  return (
    <>
      <MainImg
        src={post.coverImageURL}
        onerror="this.onerror=null; this.src=''" // TODO: add default image?
      />
      <h1>{post.title}</h1>
      <em>{post.datePretty}</em>
      <OverviewDiv post={post} />
      <Description>{post.description}</Description>
      {post.sourceType === "personal" && (
        <Details
          ingredients={post.ingredients}
          instructions={post.instructions}
        />
      )}
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
      .on("child_added", (snapshot) => {
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
