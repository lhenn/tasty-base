import React, { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../App";
import mdToHTML from "../forms/md-parse";
import Check from "./check";
import { AuthorDate, Title, Source } from "./general-recipe";
import Ratings from "./ratings.js";
import Star from "./star";

// box-shadow: 10px 10px 5px -10px rgba(0, 0, 0, 0.75);
const Container = styled.div`
  background-color: white;
`;

const CoverImage = styled.img`
  height: 400px;
  width: 100%;
  object-fit: cover;
`;

const InnerContainer = styled.div``;

const OverviewRow = styled.div`
  display: flex;
`;

const OverviewCol1 = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const OverviewCol2 = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  border-radius: 0 0 0 520px;
  background-color: #e4e4e4;
  width: 250px;
`;

const SourceLabel = styled.span`
  color: grey;
`;

const DescriptionLink = styled.a`
  text-decoration: underline !important;
  color: ;
`;

const Description = styled.p`
  white-space: pre-line;
  text-align: center;
  background: #e8e8e8;
  padding: 25px 15% 25px 15%;
`;

const DetailsWrapper = styled.div`
  display: flex;
  padding: 25px 0 25px 0;
`;

const IngredientsWrapper = styled.div`
  width: 35%;
  border-right: 2px solid #000000;
  margin-right: 20px;
`;

const Ingredients = ({ ingredients }) => {
  if (!ingredients) return null;
  return (
    <IngredientsWrapper>
      <h2 style={{ fontSize: "30px" }}>Ingredients</h2>
      {ingredients.map((ingredient, i) => (
        <p key={`ingredient-${i}`}>
          {ingredient.amount} {ingredient.name}
        </p>
      ))}
    </IngredientsWrapper>
  );
};

const Instructions = ({ instructions }) => {
  if (!instructions) return null;
  return (
    <div>
      <h2 style={{ fontSize: "30px" }}>Instructions</h2>
      {instructions.map((instruction, i) => (
        <p style={{ marginBottom: "30px" }} key={`instruction-${i}`}>
          {instruction}
        </p>
      ))}
    </div>
  );
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
  display: inline-flex;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const OverviewWrapper = styled.div`
  margin: 25px 0px 25px 0px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const OverviewFirstColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const OverviewColumn = styled.div`
  border-left: 2px solid #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Overview = ({ content }) => {
  const {
    authorName,
    timestamp,
    sourceType,
    source,
    activeTime: time, // TODO: change after simplifying recipe post
    servings,
    tastiness: taste,
    easiness: ease,
  } = content;

  const middleCol = time || servings;

  return (
    <OverviewWrapper>
      <OverviewFirstColumn>
        <AuthorDate authorName={authorName} timestamp={timestamp} />
        <Source sourceType={sourceType} source={source} />
      </OverviewFirstColumn>
      {middleCol && (
        <OverviewColumn>
          {time && <p>total time: {time} min</p>}
          {servings && <p>servings: {servings}</p>}
        </OverviewColumn>
      )}
      <OverviewColumn>
        <Ratings taste={taste} ease={ease} />
      </OverviewColumn>
    </OverviewWrapper>
  );
};

const DisplayRecipePost = ({ content, slug }) => {
  const { user } = useContext(UserContext);

  // {content.gallery && content.gallery.length > 0 && (
  //     <Gallery gallery={content.gallery} />
  //   );}

  // const breakpoints = useBreakpoint();
  return (
    <Container>
      <Header>
        <Title title={content.title} />
        {user && (
          <div>
            <Check slug={slug} />
            <Star slug={slug} />
          </div>
        )}
      </Header>

      {content.coverImageURL !== "" ? (
        <CoverImage src={content.coverImageURL} alt="cover image" />
      ) : null}

      <Overview content={content} />

      <Description>
        {mdToHTML(content.description.replace(/\\n/g, "\n"), DescriptionLink)}
      </Description>

      <Details
        ingredients={content.ingredients}
        instructions={content.instructions}
      />
    </Container>
  );
};

export default DisplayRecipePost;
