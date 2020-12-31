import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { UserContext } from "../App";
import { DisplayCoverImage } from "./atoms/cover-image";
import { DisplayDescription } from "./atoms/description";
import { DisplayDetails } from "./atoms/details";
import { Icons } from "./atoms/icons";
import { DisplayOverview } from "./atoms/overview";
import { DisplayTitle } from "./atoms/title";
import { subscribeToRatings, unsubscribeFromRatings } from "../firebase";
import { DisplayGallery } from "./atoms/gallery";
import { DisplayPostStatusOptions } from "./atoms/post-update-buttons";

// box-shadow: 10px 10px 5px -10px rgba(0, 0, 0, 0.75);
export const RecipeContainer = styled.div`
  background-color: white;
`;

export const RecipeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 700px) {
    flex-flow: column-reverse;
    align-items: flex-start;
  }
`;

const DisplayRecipePost = ({ content, slug }) => {
  const { user, loadingUser } = useContext(UserContext);
  const [taste, setTaste] = useState(content.taste);
  const [ease, setEase] = useState(content.ease);

  useEffect(() => {
    let isMounted = true;

    subscribeToRatings(
      slug,
      (newTaste) => {
        if (isMounted) setTaste(newTaste);
      },
      (newEase) => {
        if (isMounted) setEase(newEase);
      }
    );

    return () => {
      isMounted = false;
      unsubscribeFromRatings(slug);
    };
  }, []);

  if (!content) return <h1>Loading recipe post...</h1>;

  return (
    <RecipeContainer>
      <RecipeHeader>
        <DisplayTitle title={content.title} />
        <Icons
          slug={slug}
          contribution={!loadingUser && user && content.author === user.uid}
        />
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
        tastiness={taste}
        easiness={ease}
      />

      <DisplayDescription description={content.description} />

      {content.sourceType === "personal" && (
        <DisplayDetails
          ingredients={content.ingredients}
          instructions={content.instructions}
        />
      )}

      {content.gallery && content.gallery.length >= 1 && (
        <DisplayGallery gallery={content.gallery} />
      )}
      {user?.uid === content.author && <DisplayPostStatusOptions slug={slug} />}
    </RecipeContainer>
  );
};

export default DisplayRecipePost;
