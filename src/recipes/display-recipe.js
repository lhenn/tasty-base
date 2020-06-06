import React, { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../App";
import mdToHTML from "../forms/md-parse";
import Check from "./check";
import { AuthorDate, Source } from "./general-recipe";
import Ratings from "./ratings.js";
// import { EditingContext } from "./recipe-post";
import Star from "./star";

// box-shadow: 10px 10px 5px -10px rgba(0, 0, 0, 0.75);
export const Container = styled.div`
  background-color: white;
`;

export const CoverImage = styled.img`
  height: 400px;
  width: 100%;
  object-fit: cover;
`;

export const DetailsWrapper = styled.div`
  display: flex;
  padding: 25px 0 25px 0;
`;

export const IngredientsWrapper = styled.div`
  width: 35%;
  border-right: 2px solid #000000;
  margin-right: 20px;
`;

export const ingredientsHeader = (
  <h2 style={{ fontSize: "30px" }}>Ingredients</h2>
);

const Ingredients = ({ ingredients }) => {
  if (!ingredients) return null;
  return (
    <IngredientsWrapper>
      {ingredientsHeader}
      {ingredients &&
        ingredients.map((ingredient, i) => (
          <p key={`ingredient-${i}`}>
            {ingredient.amount} {ingredient.name}
          </p>
        ))}
    </IngredientsWrapper>
  );
};

export const instructionsHeader = (
  <h2 style={{ fontSize: "30px" }}>Instructions</h2>
);

const Instructions = ({ instructions }) => {
  if (!instructions) return null;
  return (
    <div>
      {instructionsHeader}
      {instructions &&
        instructions.map((instruction, i) => (
          <p style={{ marginBottom: "30px" }} key={`instruction-${i}`}>
            {instruction}
          </p>
        ))}
    </div>
  );
};

export const Details = ({ ingredients, instructions }) => (
  <DetailsWrapper>
    <Ingredients ingredients={ingredients} />
    <Instructions instructions={instructions} />
  </DetailsWrapper>
);

// const Gallery = ({ gallery }) => {
//   return (
//     <div>
//       {gallery.map((img) => {
//         return (
//           <a key={img} data-fancybox="gallery" href={img}>
//             <ThumbnailImg src={img} />
//           </a>
//         );
//       })}
//     </div>
//   );
// };

// const ThumbnailImg = styled.img`
//   height: 200px;
//   width: 200px;
//   margin: 10px;
//   object-fit: cover;
//   display: inline-flex;
// `;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const OverviewWrapper = styled.div`
  margin: 25px 0px 25px 0px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

export const OverviewFirstColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const OverviewColumn = styled.div`
  border-left: 2px solid #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const Overview = ({
  authorName,
  timestamp,
  sourceType,
  source,
  activeTime: time,
  servings,
  tastiness: taste,
  easiness: ease,
}) => {
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

export const StyledTitle = styled.h1`
  color: black;
  font-size: 48px;
`;

export const Title = ({ title }) => <StyledTitle>{title}</StyledTitle>;

// TODO: factor out
const DescriptionLink = styled.a`
  text-decoration: underline !important;
`;

// TODO: factor out
export const DescriptionText = styled.p`
  white-space: pre-line;
  margin: 0;
  padding: 0;
`;

export const DescriptionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8e8e8;
  padding: 25px 15% 25px 15%;
`;

export const Description = ({ description }) => (
  <DescriptionWrapper>
    <DescriptionText>
      {mdToHTML(description.replace(/\\n/g, "\n"), DescriptionLink)}
    </DescriptionText>
  </DescriptionWrapper>
);

const DisplayRecipePost = ({ content, slug }) => {
  const { user } = useContext(UserContext);

  if (!content) return <h1>Loading recipe post...</h1>;

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

      {content.coverImageURL && (
        <CoverImage src={content.coverImageURL} alt="cover image" />
      )}

      <Overview
        authorName={content.authorName}
        timestamp={content.timestamp}
        sourceType={content.sourceType}
        source={content.source}
        activeTime={content.activeTime}
        servings={content.servings}
        tastiness={content.tastiness}
        easiness={content.easiness}
      />

      <Description description={content.description} />

      <Details
        ingredients={content.ingredients}
        instructions={content.instructions}
      />
    </Container>
  );
};

export default DisplayRecipePost;
