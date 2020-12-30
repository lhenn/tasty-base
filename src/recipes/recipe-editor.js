import React, { useRef, useEffect, useContext, useState } from "react";
import styled from "styled-components";
import { UserContext } from "../App";
import {
  addToMyList,
  getTimestamp,
  submitPost,
  addRatingToRecipe,
} from "../firebase";
import { ImageUploader, Thumbnail } from "../general/image-uploader";
import { EditGallery } from "./atoms/gallery";
import useFileHandlers from "../useFileHandlers";
import { CoverImageEditor } from "./atoms/cover-image";
import { DescriptionEditor } from "./atoms/description";
import { DetailsEditor } from "./atoms/details";
import { emptyIngredient } from "./atoms/ingredients";
import { OverviewEditor } from "./atoms/overview";
import { TitleEditor } from "./atoms/title";
import { RecipeContainer, RecipeHeader } from "./display-recipe";
import useExpandingArray from "./form-hooks";
import {EditPostStatusOptions} from "./atoms/post-update-buttons"

const ImageUploaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 15% 25px 15%;
`;

const Editor = ({ author, initialContent, slug = "", history }) => {
  const { user } = useContext(UserContext);

  // Make sure fields' states are defined
  const [title, setTitle] = useState(initialContent?.title || "");
  const [coverImageURL, setCoverImageURL] = useState(
    initialContent?.coverImageURL || ""
  );
  const [existingGallery, setExistingGallery] = useState(
    initialContent?.gallery || []
  );
  const [sourceType, setSourceType] = useState(
    initialContent?.sourceType || ""
  );
  const [source, setSource] = useState(initialContent?.source || "");
  const [time, setTime] = useState(initialContent?.time || "");
  const [servings, setServings] = useState(initialContent?.servings || "");
  const [taste, setTaste] = useState(
    initialContent?.taste ? initialContent.taste[user.uid].rating : ""
  );
  const [ease, setEase] = useState(
    initialContent?.ease ? initialContent.ease[user.uid].rating : ""
  );
  const [description, setDescription] = useState(
    initialContent?.description || ""
  );
  const [ingredients, setIngredientField, deleteIngredient] = useExpandingArray(
    initialContent?.ingredients?.length > 0
      ? [...initialContent.ingredients]
      : [emptyIngredient]
  );
  const [
    instructions,
    setInstructionField,
    deleteInstruction,
  ] = useExpandingArray(
    initialContent?.instructions ? [...initialContent.instructions] : [""]
  );

  //Set up file handlers for ImageUploader
  const {
    files: galleryFiles,
    uploaded: galleryUploaded, // uploaded files
    status: galleryUploadStatus,
    onSubmit: onSubmitGallery,
    onChange: onChangeGallery,
  } = useFileHandlers();

  const imageUploader = (
    <ImageUploaderWrapper>
      <label htmlFor="post-image-uploader">{"Upload images"}</label>
      <ImageUploader
        id="post-image-uploader"
        files={galleryFiles}
        uploaded={galleryUploaded}
        status={galleryUploadStatus}
        onSubmit={onSubmitGallery}
        onChange={onChangeGallery}
        curCover={coverImageURL}
        onSetCover={(url) => setCoverImageURL(url)}
      />
    </ImageUploaderWrapper>
  );

  // For disabling double submissions
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep track of whether component is mounted to avoid setting state after it
  // unmounts
  const isMounted = useRef(true);
  useEffect(() => {
    return () => (isMounted.current = false);
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const timestampedContent = {
      title,
      coverImageURL,
      sourceType,
      source,
      time,
      servings,
      description,
      ingredients: ingredients.slice(0, -1),
      instructions: instructions.slice(0, -1),
      author,
      timestamp: getTimestamp(),
      gallery: existingGallery.concat(
        Object.values(galleryUploaded).map((img) => img.downloadURL)
      ),
    };
    let actualSlug = slug;

    // Upload to firebase and update relevant lists and ratings
    setIsSubmitting(true);
    let newPostPromise = submitPost(actualSlug, timestampedContent)
      .then((snap) => {
        // Only update the slug if the post is being created
        if (actualSlug === "") actualSlug = snap.key;
      })
      .then(() => addToMyList(user.uid, actualSlug, "contribution"));

    // Add ratings if both are present
    if (taste !== "" && ease !== "") {
      newPostPromise = newPostPromise
        .then(() => addRatingToRecipe(actualSlug, "taste", taste, user.uid))
        .then(() => addRatingToRecipe(actualSlug, "ease", ease, user.uid))
        .then(() => addToMyList(user.uid, actualSlug, "rate", { ease, taste }))
        .then(() => addToMyList(user.uid, actualSlug, "check"));
    }
    newPostPromise.then(() => {
      if (isMounted.current) {
        setIsSubmitting(false);
        history.push(`/recipes/${actualSlug}`);
      }
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <RecipeContainer>
        <RecipeHeader>
          <TitleEditor title={title} set={setTitle} />
        </RecipeHeader>

        <CoverImageEditor src={coverImageURL} set={setCoverImageURL} />

        <OverviewEditor
          {...{
            sourceType,
            setSourceType,
            source,
            setSource,
            time,
            setTime,
            servings,
            setServings,
            taste,
            setTaste,
            ease,
            setEase,
          }}
        />

        <DescriptionEditor description={description} set={setDescription} />

        {sourceType === "personal" && (
          <DetailsEditor
            ingredients={ingredients}
            instructions={instructions}
            setIngredientField={setIngredientField}
            deleteIngredient={deleteIngredient}
            setInstructionField={setInstructionField}
            deleteInstruction={deleteInstruction}
          />
        )}
      </RecipeContainer>
      {imageUploader}
      {existingGallery && existingGallery.length > 0 && (
        <EditGallery
          onSetCover={(url) => {
            console.log("changing url to: ", url);
            setCoverImageURL(url);
          }}
          gallery={existingGallery}
        />
      )}
      {/** 
      {imageUploader}
      {existingGallery && existingGallery.length > 0 
      && existingGallery.map((src) => {
        let token = new URLSearchParams(src).get("token"); 

        return (
          <Thumbnail key={token}
          downloadURL={src}
          src={src}
          filename={'bleh'}
          wasUploaded={true}
          curCover={coverImageURL}
          onSetCover={(url) => setCoverImageURL(url)}/>
        )
      })}
      */}
      <EditPostStatusOptions slug={slug} isSubmitting={isSubmitting} />
    </form>
  );
};

export default Editor;
