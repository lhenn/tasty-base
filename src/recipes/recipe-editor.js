import React, { useState, useContext } from "react";
import { UserContext } from "../App";
import { getTimestamp, submitPost, addToMyList } from "../firebase";
import useCancellablePromises from "../promise-hooks";
import { PrimaryButton } from "../general/buttons";
import { RecipeContainer, RecipeHeader } from "./display-recipe";
import { TitleEditor } from "./atoms/title";
import { CoverImageEditor } from "./atoms/cover-image";
import { OverviewEditor } from "./atoms/overview";
import { DescriptionEditor } from "./atoms/description";
import { DetailsEditor } from "./atoms/details";
import SlugEditor from "./atoms/slug";
import useExpandingArray from "./form-hooks";

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
      .then(() => setIsSubmitting(false))
      .then(() => history.push(`/recipes/${slug}`));
  };

  return (
    <PrimaryButton onClick={submit} disabled={isSubmitting}>
      Submit
    </PrimaryButton>
  );
};

const Editor = ({ author, initialContent, initialSlug = "", history }) => {
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );
  // Make sure fields' states are defined
  const [title, setTitle] = useState(initialContent?.title || "");
  const [coverImageURL, setCoverImageURL] = useState(
    initialContent?.coverImageURL || ""
  );
  const [sourceType, setSourceType] = useState(
    initialContent?.sourceType || ""
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
    initialContent?.ingredients
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
  };
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

        <DetailsEditor
          ingredients={ingredients}
          instructions={instructions}
          setIngredientField={setIngredientField}
          setInstructionField={setInstructionField}
          deleteIngredient={deleteIngredient}
          deleteInstruction={deleteInstruction}
        />
      </RecipeContainer>

      <div style={{ textAlign: "right" }}>
        <SubmitButton
          content={content}
          slug={slug}
          history={history}
          uid={user.uid}
        />
      </div>
    </>
  );
};

export default Editor;
