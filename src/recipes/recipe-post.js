import React, { useEffect, useState, useContext } from "react";
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

const TimestampEM = styled.em`
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
    <TimestampEM title={date.toLocaleDateString("en-GB", hoverOptions)}>
      {date.toLocaleDateString("en-GB", options)}
    </TimestampEM>
  );
};

const AuthorSpan = styled.p``;

const Author = ({ name }) => {
  return <AuthorSpan>{`Posted by ${name}`}</AuthorSpan>;
};

const EditButton = ({ slug }) => {
  const editPath = `/recipes/${slug}/edit`;
  return <a href={editPath}>edit</a>;
};

// authorName is either loaded from firebase (for SelfLoadingRecipePost) or
// passed in using context (for previews during post edits/creates when user
// has permission)
export const DisplayRecipePost = ({ post, authorName }) => (
  <>
    <MainImg
      src={post.coverImageURL}
      onerror="this.onerror=null; this.src=''" // TODO: add default image?
    />
    <h1>{post.title}</h1>
    <Timestamp timestamp={post.timestamp} />
    <Author name={authorName} />
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

const SelfLoadingRecipePost = ({ match }) => {
  const slug = match.params.slug;
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState();
  const [authorName, setAuthorName] = useState();
  const user = useContext(UserContext);

  // Load recipe post
  useEffect(() => {
    // Need to store author uid in temporary variable since setPost is
    // asynchronous!
    let uid = "";

    getFirebase()
      .database()
      .ref(`posts/${slug}`)
      .once(
        "value",
        (snapshot) => {
          console.log("SelfLoadingRecipePost: once");
          // Snapshot consists of key and post data
          const postData = snapshot.val();
          setPost(postData);
          uid = postData.author;
        },
        (err) =>
          console.log("recipe-post: post loading failed with code: ", err.code)
      )
      .then(
        // Get author name
        () => getFirebase().database().ref(`/users/${uid}/name`).once("value")
      )
      .then(
        (snapshot) => {
          setAuthorName(snapshot.val());
          setLoading(false);
        },
        (err) => console.log("Author name loading failed with code: ", err.code)
      );
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  } else if (!post) {
    // Loading is done and post wasn't found in the database
    return <Redirect to="/404" />;
  } else {
    return (
      <>
        <DisplayRecipePost post={post} authorName={authorName} />;
        {user && post.author === user.uid && <EditButton slug={slug} />}
      </>
    );
  }
};

export default SelfLoadingRecipePost;
