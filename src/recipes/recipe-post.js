import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../App";
import { getFirebase } from "../firebase";
import Button from "../general/button-primary";
import OverviewWrapper from "./overview";

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

const DetailsWrapper = styled.div`
  display: flex;
`;

const Details = ({ ingredients, instructions }) => (
  <DetailsWrapper>
    <Ingredients ingredients={ingredients} />
    <Instructions instructions={instructions} />
  </DetailsWrapper>
);

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

const GalleryWrapper = styled.div`
  display: flex;
`;
const ThumbnailImg = styled.img`
  height: 200px;
  width: 200px;
  margin: 10px;
  object-fit: cover;
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
// authorName is either loaded from firebase (for SelfLoadingRecipePost) or
// passed in using context (for previews during post edits/creates when user
// has permission)
export const DisplayRecipePost = ({ post, authorName }) => {
  return (
    <>
      <MainImg
        src={post.coverImageURL}
        onerror="this.onerror=null; this.src=''" // TODO: add default image?
      />
      <h1>{post.title}</h1>
      <Timestamp timestamp={post.timestamp} />
      <Author name={authorName} />
      <OverviewWrapper post={post} />
      <Description>{post.description.replace(/\\n/g, "\n")}</Description>
      {post.sourceType === "personal" && (
        <Details
          ingredients={post.ingredients}
          instructions={post.instructions}
        />
      )}
      {post.gallery && post.gallery.length > 0 && (
        <Gallery gallery={post.gallery} />
      )}
    </>
  );
};

const Edit = ({ slug }) => {
  const editPath = `/recipes/${slug}/edit`;
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        window.location.href = editPath;
      }}
    >
      Edit
    </Button>
  );
};

const FavoriteWrapper = styled.div``;

// TODO: should stay shaded when clicked; should be transparent on mouseover
const FavoriteButton = styled.button`
  background-color: #037161;
  color: white;
  padding: 10px;
  border-radius: 5px;
  border: 0;
  &:hover {
    cursor: pointer;
    background-color: #005246;
  }
`;

// Tooltip for mousing over to copy image url
// TODO: maybe unnecessary once we style FavoriteButton better.
const FavoriteTooltip = styled.span`
  visibility: hidden;

  ${FavoriteWrapper}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

const Favorite = ({ slug, uid, isFavorite, onSetFavorite }) => {
  console.log("Favorite", slug, uid, isFavorite);
  const [ttText, setTTText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => console.log("tt: ", ttText), [ttText]);

  const addFavorite = () => {
    if (busy) return;
    // Push to favorite recipes list with timestamp
    const timestamp = getFirebase().database.ServerValue.TIMESTAMP;

    setBusy(true);
    getFirebase()
      .database()
      .ref(`/users/${uid}/data/favoriteRecipes/${slug}`)
      .set(timestamp)
      .then(() => setBusy(false))
      .catch((err) => console.log("addFavorite failed: ", err));
  };

  const removeFavorite = () => {
    if (busy) return;

    setBusy(true);
    getFirebase()
      .database()
      .ref(`/users/${uid}/data/favoriteRecipes/${slug}`)
      .remove()
      .then(() => setBusy(false))
      .catch((err) => console.log("removeFavorite failed: ", err));
  };

  const onClick = () => {
    if (!isFavorite) {
      addFavorite();
      setTTText("Favorited!");
    } else {
      removeFavorite();
      setTTText("Unfavorited!");
    }
  };
  const onMouseEnter = () =>
    !isFavorite ? setTTText("Favorite") : setTTText("Unfavorite");

  return (
    <FavoriteWrapper onClick={onClick} onMouseEnter={onMouseEnter}>
      <FavoriteButton>
        <FontAwesomeIcon icon={faBookmark} />
      </FavoriteButton>
      <FavoriteTooltip>{ttText}</FavoriteTooltip>
    </FavoriteWrapper>
  );
};

const SelfLoadingRecipePost = ({ match }) => {
  const slug = match.params.slug;
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState();
  const [authorName, setAuthorName] = useState();
  const { user, userData } = useContext(UserContext);

  // Load recipe post when component mounts
  useEffect(() => {
    // Need to store author uid in temporary variable since setPost is async!
    let uid = "";

    getFirebase()
      .database()
      .ref(`posts/${slug}`)
      .once(
        "value",
        (snapshot) => {
          // Snapshot consists of key and post data
          const postData = snapshot.val();
          setPost(postData);
          uid = postData.author;
        },
        (err) =>
          console.log(
            "SelfLoadingRecipePost: post loading failed with code: ",
            err.code
          )
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
        (err) =>
          console.log(
            "SelfLoadingRecipePost: author name loading failed with code: ",
            err.code
          )
      );
  }, [slug, setPost, setAuthorName, setLoading]);

  // DEBUG
  useEffect(() => console.log("userData: ", userData), [userData]);

  if (loading) {
    return <h1>Loading...</h1>;
  } else if (!post) {
    // Loading is done and post wasn't found in the database
    return <Redirect to="/404" />;
  } else {
    return (
      <>
        {user && (
          <Favorite
            slug={slug}
            uid={user.uid}
            isFavorite={
              userData &&
              userData.favoriteRecipes !== null &&
              userData.favoriteRecipes.hasOwnProperty(slug)
            }
          />
        )}
        <DisplayRecipePost post={post} authorName={authorName} />
        {user && post.author === user.uid && <Edit slug={slug} />}
      </>
    );
  }
};

export default SelfLoadingRecipePost;
