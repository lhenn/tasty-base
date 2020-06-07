import React, { useContext } from "react";
import styled from "styled-components";
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

export const RecipeHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DisplayRecipePost = ({ content, slug }) => {
  const { user } = useContext(UserContext);

  if (!content) return <h1>Loading recipe post...</h1>;

  // {content.gallery && content.gallery.length > 0 && (
  //     <Gallery gallery={content.gallery} />
  //   );}

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
        activeTime={content.activeTime}
        servings={content.servings}
        tastiness={content.tastiness}
        easiness={content.easiness}
      />

      <DisplayDescription description={content.description} />

      <DisplayDetails
        ingredients={content.ingredients}
        instructions={content.instructions}
      />
    </RecipeContainer>
  );
};

export default DisplayRecipePost;
