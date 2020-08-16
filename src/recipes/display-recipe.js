import React, { useContext } from "react";
import styled from "styled-components";
import { lightGrey } from "../styling";
import { UserContext } from "../App";
import { DisplayCoverImage } from "./atoms/cover-image";
import { DisplayDescription } from "./atoms/description";
import { DisplayDetails } from "./atoms/details";
import { Icons } from "./atoms/icons";
import { DisplayOverview } from "./atoms/overview";
import { DisplayTitle } from "./atoms/title";

// box-shadow: 10px 10px 5px -10px rgba(0, 0, 0, 0.75);
export const RecipeContainer = styled.div`
  background-color: white;
`;

const GalleryContainer = styled.div`
  width: 100%;
  text-align: center;
  background: ${lightGrey};
  padding: 20px;
  margin-bottom: 20px;
`;

const Gallery = ({ gallery }) => {
  return (
    <GalleryContainer>
      {gallery.map((img) => {
        return (
          <a key={img} data-fancybox="gallery" href={img}>
            <ThumbnailImg src={img} />
          </a>
        );
      })}
    </GalleryContainer>
  );
};

const ThumbnailImg = styled.img`
  height: 200px;
  width: 200px;
  margin: 10px;
  object-fit: cover;
  display: inline-flex;
`;

export const RecipeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  @media(max-width:700px){
    flex-direction:column;
    text-align:center;
  }
`;

const DisplayRecipePost = ({ content, slug }) => {
  const { user } = useContext(UserContext);

  if (!content) return <h1>Loading recipe post...</h1>;
  console.log('content',content)
  console.log('activeTime',content.time)

  return (
    <RecipeContainer>
      <RecipeHeader>
        <DisplayTitle title={content.title} />
        {user && <Icons slug={slug} />}
      </RecipeHeader>

      {content.coverImageURL && (
        <DisplayCoverImage src={content.coverImageURL} alt="cover image" />
      )}

      <DisplayOverview
        authorName={content.authorName}
        timestamp={content.timestamp}
        sourceType={content.sourceType}
        source={content.source}
        activeTime={content.time}
        servings={content.servings}
        tastiness={content.taste}
        easiness={content.ease}
      />

      <DisplayDescription description={content.description} />

      <DisplayDetails
        ingredients={content.ingredients}
        instructions={content.instructions}
      />

      {content.gallery && content.gallery.length > 0 && (
        <Gallery gallery={content.gallery} />
      )}
    </RecipeContainer>
  );
};

export default DisplayRecipePost;
