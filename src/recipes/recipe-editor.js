import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import {
  addToMyList,
  deleteImages,
  getTimestamp,
  submitPost,
} from "../firebase";
import ImageUploaderContainer from "../general/image-uploader";
import useFileHandlers from "../useFileHandlers";
import { CoverImageEditor } from "./atoms/cover-image";
import { DescriptionEditor } from "./atoms/description";
import { DetailsEditor } from "./atoms/details";
import { EditGallery } from "./atoms/gallery";
import { emptyIngredient } from "./atoms/ingredients";
import { OverviewEditor } from "./atoms/overview";
import { EditPostStatusOptions } from "./atoms/post-update-buttons";
import { TitleEditor } from "./atoms/title";
import { RecipeContainer, RecipeHeader } from "./display-recipe";
import useExpandingArray from "./form-hooks";

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
  const [imagesToDelete, setImagesToDelete] = useState([]);
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

  useEffect(() => {
    setExistingGallery(
      existingGallery.concat(
        Object.values(galleryUploaded).map((img) => img.downloadURL)
      )
    );
  }, [galleryUploaded]);

  // Removes image from gallery component when user selects 'delete'. Does not remove from database until edit submitted
  const onDeleteImage = (url) => {
    setImagesToDelete(imagesToDelete.concat([url]));
    console.log("imagesToDelete updated to: ", imagesToDelete);
    setExistingGallery(existingGallery.filter((el) => el !== url));
  };

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
      gallery: existingGallery,
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
        .then(() => addToMyList(user.uid, actualSlug, "rate", { ease, taste }))
        .then(() => addToMyList(user.uid, actualSlug, "check"));
    }
    newPostPromise.then(() => {
      if (isMounted.current) {
        setIsSubmitting(false);
        history.push(`/recipes/${actualSlug}`);
      }
    });
    // Remove images from storage if they were deleted during session
    deleteImages(imagesToDelete);
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
      <ImageUploaderContainer
        id="post-image-uploader"
        files={galleryFiles}
        uploaded={galleryUploaded}
        status={galleryUploadStatus}
        onSubmit={onSubmitGallery}
        onChange={onChangeGallery}
      />
      {existingGallery && existingGallery.length > 0 && (
        <EditGallery
          onSetCover={setCoverImageURL}
          onDeleteImage={onDeleteImage}
          gallery={existingGallery}
        />
      )}
      <EditPostStatusOptions slug={slug} isSubmitting={isSubmitting} />
    </form>
  );
};

export default Editor;
