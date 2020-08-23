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
import { OverviewEditor } from "./atoms/overview";
import SlugEditor from "./atoms/slug";
import { TitleEditor } from "./atoms/title";
import { RecipeContainer, RecipeHeader } from "./display-recipe";

const emptyIngredient = { name: "", amount: "" };

// On click, submit the post and then redirect to post's page
const SubmitButton = ({ content, slug, history, uid }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPromise } = useCancellablePromises();

  const submit = () => {
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
      .then(() => addToMyList(uid, slug, "contribution"))
      .then(() => addToMyList(uid, slug, "check"))
      .then(() =>
        addToMyList(uid, slug, "rate", {
          ease: content.ease,
          taste: content.taste,
        })
      )
      .then(() => setIsSubmitting(false))
      .then(() => history.push(`/recipes/${slug}`));
  };

  return (
    <PrimaryButton onClick={submit} disabled={isSubmitting}>
      Submit
    </PrimaryButton>
  );
};

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
  const [ingredients, setIngredients] = useState(
    initialContent?.ingredients
      ? [...initialContent.ingredients]
      : [emptyIngredient]
  );
  const [instructions, setInstructions] = useState(
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
    ingredients,
    instructions,
    author,
    gallery: Object.values(galleryUploaded).map((img) => img.downloadURL),
  };

  // The information that all recipes should have, regardless of source
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

  const submitButton = (
    <div style={{ textAlign: "right" }}>
      <SubmitButton
        content={content}
        slug={slug}
        history={history}
        uid={user.uid}
      />
    </div>
  );

  const cancelButton = (
    <div style={{ textAlign: "right" }}>
      <PrimaryButton onClick={() => history.push(`/recipes/${slug}`)}>
        Cancel
      </PrimaryButton>
    </div>
  );

  return (
    <>
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
            setIngredients={setIngredients}
            setInstructions={setInstructions}
          />
        )}
      </RecipeContainer>

      {imageUploader}

      {submitButton}

      {cancelButton}
    </>
  );
};

export default Editor;
