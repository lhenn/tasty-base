import React from "react";
import styled from "styled-components";
import { Title, AuthorDate, Icons } from "./general-recipe";
import Ratings from "./ratings.js";
import mdToHTML from "../forms/md-parse";
import { useBreakpoint } from "../App.js";
import OverviewWrapper from "./overview";

const Container = styled.div`
  background-color: white;
  box-shadow: 10px 10px 5px -10px rgba(0, 0, 0, 0.75);

`;
const MainImg = styled.img`
  height: 300px;
  width: 100%;
  object-fit: cover;
`;
const InnerContainer = styled.div`
 
`;
const OverviewRow = styled.div`
  display: flex;

`;
const OverviewCol1 = styled.div`
padding:20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
 
`;
const OverviewCol2 = styled.div`
padding:20px;
  display: flex;
  flex-direction: column;
  align-items:flex-end;
  justify-content: space-between;
  border-radius: 0 0 0 520px;
  background-color: #dfdce6;
  width:250px;
`;
const SourceLabel = styled.span`
color:grey;
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

const Gallery = ({ gallery }) => {
  return (
    <div>
      {gallery.map((img) => {
        return (
          <a key={img} data-fancybox="gallery" href={img}>
            <ThumbnailImg src={img} />
          </a>
        );
      })}
    </div>
  );
};
const ThumbnailImg = styled.img`
  height: 200px;
  width: 200px;
  margin: 10px;
  object-fit: cover;
  display:inline-flex;
`;
// authorName is either loaded from firebase (for SelfLoadingRecipePost) or
// passed in using context (for previews during post edits/creates when user
// has permission)
const DisplayRecipePost = ({ post, authorName }) => {
    const breakpoints = useBreakpoint();
    return(
  <Container>
    {post.coverImageURL !== "" ? <MainImg src={post.coverImageURL} /> : null}
    <InnerContainer>
      <OverviewRow>
        <OverviewCol1>
          <Title title={post.title} />
          <AuthorDate authorName={authorName} timestamp={post.timestamp} />
          <p><SourceLabel>source: </SourceLabel>{post.source}</p>
        </OverviewCol1>
        <OverviewCol2>
          <Ratings post={post} />
          <Icons />
        </OverviewCol2>
      </OverviewRow>

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
    </InnerContainer>
  </Container>
)};

export default DisplayRecipePost;
