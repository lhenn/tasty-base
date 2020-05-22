import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../App";
import { getFirebase } from "../firebase";
import Button from "../general/button-primary";
import UpdatingTooltip from "../general/tooltip";
import DisplayRecipePost from "./display-recipe";

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

// TODO: change when favorited
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

const Favorite = ({ slug, uid, isFavorite }) => {
  // Busy when sending favorite/unfavorite data to firebase
  const [busy, setBusy] = useState(false);
  const [ttText, setTTText] = useState("");

  const addFavorite = () => {
    if (busy) return;
    // Push to favorite recipes list with timestamp
    const timestamp = getFirebase().database.ServerValue.TIMESTAMP;
    setBusy(true);
    getFirebase()
      .database()
      .ref(`/users/${uid}/data/favoriteRecipes/${slug}`)
      .set(timestamp)
      .then(() => {
        setTTText("Favorited!");
        setBusy(false);
      })
      .catch((err) => console.log("addFavorite failed: ", err));
  };

  const removeFavorite = () => {
    if (busy) return;
    setBusy(true);
    getFirebase()
      .database()
      .ref(`/users/${uid}/data/favoriteRecipes/${slug}`)
      .remove()
      .then(() => {
        setTTText("Unfavorited!");
        setBusy(false);
      })
      .catch((err) => console.log("removeFavorite failed: ", err));
  };

  const onClick = () => {
    if (!isFavorite) {
      addFavorite();
    } else {
      removeFavorite();
    }
  };

  const onMouseEnter = () => {
    !isFavorite ? setTTText("Favorite") : setTTText("Unfavorite");
  };

  return (
    <OverlayTrigger
      placement="bottom"
      trigger={["hover", "focus"]}
      overlay={
        <UpdatingTooltip id="favorite-tooltip">{ttText}</UpdatingTooltip>
      }
    >
      <FavoriteButton onClick={onClick} onMouseEnter={onMouseEnter}>
        <FontAwesomeIcon icon={faBookmark} />
      </FavoriteButton>
    </OverlayTrigger>
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
