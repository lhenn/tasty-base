import React from "react";
import styled from "styled-components";
import { Title, AuthorDate, Icons } from "./general-recipe";
import Ratings from "./ratings.js";
import mdToHTML from "../forms/md-parse";
import OverviewWrapper from "./overview";

const Container = styled.div`
  background-color:white;
`;
const MainImg = styled.img`
  height: ${(props) => (
    props.src === "" ? "0px" : 
    "300px"
  )
  };
  width: 100%;
  object-fit: cover;
`;
const InnerContainer = styled.div`
  padding:20px;
`;

const DescriptionLink = styled.a`
  text-decoration: underline !important;
  color: ;
`;
const Description = styled.p`
  white-space: pre-line;
`;

const DetailsWrapper = styled.div`
  display: flex;
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
const Details = ({ ingredients, instructions }) => (
  <DetailsWrapper>
    <Ingredients ingredients={ingredients} />
    <Instructions instructions={instructions} />
  </DetailsWrapper>
);
const GalleryWrapper = styled.div`
  display: flex;
`;
const Gallery = ({ gallery }) => {
    return (
      <GalleryWrapper>
        {gallery.map((img) => {
          return (
            <a key={img} data-fancybox="gallery" href={img}>
              <ThumbnailImg src={img} />
            </a>
          );
        })}
      </GalleryWrapper>
    );
  };
const ThumbnailImg = styled.img`
  height: 200px;
  width: 200px;
  margin: 10px;
  object-fit: cover;
`;
// authorName is either loaded from firebase (for SelfLoadingRecipePost) or
// passed in using context (for previews during post edits/creates when user
// has permission)
const DisplayRecipePost = ({ post, authorName }) => (
    <Container>
      <MainImg
        src={post.coverImageURL}
        onerror="this.onerror=null; this.src=''" // TODO: add default image?
      />
      <Title title={post.title}/>
      <AuthorDate authorName={authorName} timestamp={post.timestamp}/>
      <OverviewWrapper post={post} />
      <Description>
        {mdToHTML(post.description.replace(/\\n/g, "\n"), DescriptionLink)}
      </Description>
      {post.sourceType === "personal" && (
        <Details
          ingredients={post.ingredients}
          instructions={post.instructions}
        />
      )}
      {post.gallery && post.gallery.length > 0 && (
        <Gallery gallery={post.gallery} />
      )}
    </Container>
  );

  export default DisplayRecipePost;