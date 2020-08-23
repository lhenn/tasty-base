import React, { useContext, useState } from "react";
import styled from "styled-components";
import { UserContext } from "../App";
import { addToMyList, getTimestamp, submitPost } from "../firebase";
import { PrimaryButton } from "../general/buttons";
import ImageUploader from "../general/image-uploader";
import useCancellablePromises from "../promise-hooks";
import useFileHandlers from "../useFileHandlers";
import { CoverImageEditor } from "./atoms/cover-image";
import { DescriptionEditor } from "./atoms/description";
import { DetailsEditor } from "./atoms/details";
import { emptyIngredient } from "./atoms/ingredients";
import { OverviewEditor } from "./atoms/overview";
import SlugEditor from "./atoms/slug";
import { TitleEditor } from "./atoms/title";
import { RecipeContainer, RecipeHeader } from "./display-recipe";
import useExpandingArray from "./form-hooks";

const ImageUploaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 15% 25px 15%;
`;

const Editor = ({ author, initialContent, initialSlug = "", history }) => {
  const { user } = useContext(UserContext);

  // Make sure fields' states are defined
  const [title, setTitle] = useState(initialContent?.title || "");
  const [coverImageURL, setCoverImageURL] = useState(
    initialContent?.coverImageURL || ""
  );
  const [sourceType, setSourceType] = useState(
    initialContent?.sourceType || "personal"
  );
  const [source, setSource] = useState(initialContent?.source || "");
  const [time, setTime] = useState(initialContent?.time || "");
  const [servings, setServings] = useState(initialContent?.servings || "");
  const [taste, setTaste] = useState(initialContent?.taste || "");
  const [ease, setEase] = useState(initialContent?.ease || "");
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
  const [slug, setSlug] = useState(initialSlug);

  // Set up file handlers for ImageUploader
  const {
    files: galleryFiles,
    uploaded: galleryUploaded, // uploaded files
    status: galleryUploadStatus,
    onSubmit: onSubmitGallery,
    onChange: onChangeGallery,
  } = useFileHandlers();

  const content = {
    title,
    coverImageURL,
    sourceType,
    source,
    time,
    servings,
    taste,
    ease,
    description,
    ingredients: ingredients.slice(0, -1),
    instructions: instructions.slice(0, -1),
    author,
    gallery: Object.values(galleryUploaded).map((img) => img.downloadURL),
  };

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPromise } = useCancellablePromises();

  const onSubmit = () => {
    // Don't submit multiple times
    if (isSubmitting) return;

    // Swap Date timestamp out for special firebase one
    const timestampedContent = {
      ...content,
      timestamp: getTimestamp(),
    };

    // Upload to firebase
    setIsSubmitting(true);
    addPromise(submitPost(slug, timestampedContent))
      .then(() => addToMyList(user.uid, slug, "contribution"))
      .then(() => addToMyList(user.uid, slug, "check"))
      .then(() =>
        addToMyList(user.uid, slug, "rate", {
          ease: content.ease,
          taste: content.taste,
        })
      )
      .then(() => setIsSubmitting(false))
      .then(() => history.push(`/recipes/${slug}`));
  };

  const buttons = (
    <div style={{ textAlign: "right" }}>
      <PrimaryButton type="submit" disabled={isSubmitting}>
        Submit
      </PrimaryButton>
      <PrimaryButton type="button" onClick={() => history.go(-1)}>
        Cancel
      </PrimaryButton>
    </div>
  );

  return (
    <form onSubmit={onSubmit}>
      <RecipeContainer>
        <RecipeHeader>
          <TitleEditor title={title} set={setTitle} />
          <SlugEditor
            slug={slug}
            setSlug={initialSlug !== "" ? undefined : setSlug}
          />
        </RecipeHeader>

        <CoverImageEditor src={coverImageURL} set={setCoverImageURL} />

        <OverviewEditor
          authorName={initialContent?.authorName}
          timestamp={initialContent?.timestamp}
          sourceType={sourceType}
          setSourceType={setSourceType}
          source={source}
          setSource={setSource}
          time={time}
          setTime={setTime}
          servings={servings}
          setServings={setServings}
          taste={taste}
          setTaste={setTaste}
          ease={ease}
          setEase={setEase}
        />

        <DescriptionEditor description={description} set={setDescription} />

        {content.sourceType === "personal" && (
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

      {buttons}
    </form>
  );
};

export default Editor;
