import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { getFirebase } from "../firebase";
import OverviewDiv from "./overview";
import { UserContext } from "../App";

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
  if (ingredients === undefined || ingredients === null) {
    return <></>;
  } else {
    return (
      <IngredientsUL>
        {ingredients.map((ingredient, i) => (
          <IngredientLI key={`ingredient-${i}`}>
            {ingredient.amount} {ingredient.name}
          </IngredientLI>
        ))}
      </IngredientsUL>
    );
  }
};

const InstructionsOL = styled.ol``;

const InstructionsLI = styled.li``;

const Instructions = ({ instructions }) => {
  if (instructions === undefined || instructions === null) {
    return <></>;
  } else {
    return (
      <InstructionsOL>
        {instructions.map((instruction, i) => (
          <InstructionsLI key={`instruction-${i}`}>
            {instruction}
          </InstructionsLI>
        ))}
      </InstructionsOL>
    );
  }
};

const Description = styled.p`
  white-space: pre-line;
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

const TimestampWrapper = styled.em`
  font-size: 18px;
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
const EditButton = ({ slug }) => {
  const editPath = `/recipes/${slug}/edit`;
  return <a href={editPath}>edit</a>;
};

export const DisplayRecipePost = ({ post }) => {
  return (
    <>
      <MainImg
        src={post.coverImageURL}
        onerror="this.onerror=null; this.src=''" // TODO: add default image?
      />
      <h1>{post.title}</h1>
      <Timestamp timestamp={post.timestamp} />
      <OverviewDiv post={post} />
      <Description>{post.description.replace(/\\n/g, "\n")}</Description>
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
  const user = useContext(UserContext);

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

  return (
    <>
      <DisplayRecipePost post={post} />
      {post.author === user.uid && <EditButton slug={post.slug} />}
    </>
  );
};

export default RecipePost;
