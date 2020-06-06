import React, { useState } from "react";
import styled from "styled-components";
import { getTimestamp, submitPost } from "../firebase";
import useCancellablePromises from "../promise-hooks";
import {
  ImageWithPlaceholder,
  parseFloatOrEmpty,
  parseIntOrEmpty,
  textIsEmpty,
} from "../utils";
import { PrimaryButton } from "../general/buttons";
import ClickToOpen from "./click-to-open";
import {
  Container,
  CoverImage as DisplayCoverImage,
  Description as DisplayDescription,
  DescriptionText,
  DescriptionWrapper,
  DetailsWrapper,
  Header,
  ingredientsHeader,
  IngredientsWrapper,
  instructionsHeader,
  OverviewColumn,
  OverviewFirstColumn,
  OverviewWrapper,
  StyledTitle,
  Title as DisplayTitle,
} from "./display-recipe";
import useExpandingArray from "./form-hooks";
import { AuthorDate, Source } from "./general-recipe";
import {
  EaseRating,
  RatingLabel,
  RatingsContainer,
  RatingWrapper,
  TasteRating,
} from "./ratings.js";

const defaultOpacity = 0.4;

const TransparentTitle = styled(StyledTitle)`
  opacity: ${defaultOpacity};
`;

const TitlePlaceholder = () => <TransparentTitle>Title</TransparentTitle>;

const Title = ({ title, set }) => {
  const closed = textIsEmpty(title) ? (
    <TitlePlaceholder />
  ) : (
    <DisplayTitle title={title} />
  );
  const open = (
    <input
      placeholder="Title"
      value={title}
      onChange={(e) => set(e.target.value)}
      autoFocus
    />
  );
  // console.log("TITLE", title, open, closed);
  return <ClickToOpen open={open} closed={closed} />;
};

const TransparentDescriptionText = styled(DescriptionText)`
  opacity: ${defaultOpacity};
`;

const DescriptionPlaceholder = () => (
  <DescriptionWrapper>
    <TransparentDescriptionText>Description</TransparentDescriptionText>
  </DescriptionWrapper>
);

const Description = ({ description, set }) => {
  const closed = textIsEmpty(description) ? (
    <DescriptionPlaceholder />
  ) : (
    <DisplayDescription description={description} />
  );
  const open = (
    <DescriptionWrapper>
      <textarea
        placeholder={"Say something about this recipe"}
        style={{ width: "100%" }}
        value={description}
        onChange={(e) => set(e.target.value)}
        autoFocus
      />
    </DescriptionWrapper>
  );
  // console.log("DESC", description, open, closed);
  return <ClickToOpen open={open} closed={closed} />;
};

const TransparentCoverImage = styled(DisplayCoverImage)`
  opacity: ${defaultOpacity};
`;

const CoverImagePlaceholderWrapper = styled.div`
  height: 100px;
  width: 100%;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CoverImagePlaceholder = () => (
  <CoverImagePlaceholderWrapper>
    <p style={{ margin: "0", padding: "0", opacity: defaultOpacity }}>
      No cover image selected
    </p>
  </CoverImagePlaceholderWrapper>
);

// TODO: if no url, show placeholder
const CoverImage = ({ src, set }) => {
  const [newSrc, setNewSrc] = useState("");

  const onOpen = () => setNewSrc(src);
  const onClose = () => set(newSrc);

  const closed = (
    <ImageWithPlaceholder
      src={src}
      alt="cover image"
      Image={DisplayCoverImage}
      Placeholder={CoverImagePlaceholder}
    />
  );

  const open = (
    <>
      <ImageWithPlaceholder
        src={src}
        alt="cover image"
        Image={TransparentCoverImage}
        Placeholder={CoverImagePlaceholder}
      />
      <input
        placeholder="Cover image URL"
        value={newSrc}
        onChange={(e) => setNewSrc(e.target.value)}
        autoFocus
      />
    </>
  );
  return (
    <ClickToOpen
      open={open}
      closed={closed}
      onOpen={onOpen}
      onClose={onClose}
    />
  );
};

const TimePlaceholder = () => (
  <p style={{ opacity: defaultOpacity }}>total time: --</p>
);

const ServingsPlaceholder = () => (
  <p style={{ opacity: defaultOpacity }}>servings: --</p>
);

const TasteRatingPlaceholder = () => (
  <p style={{ opacity: defaultOpacity }}>taste: --</p>
);

const EaseRatingPlaceholder = () => (
  <p style={{ opacity: defaultOpacity }}>ease: --</p>
);

export const Overview = ({
  authorName,
  timestamp,
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
}) => {
  console.log("TASTE & EASE:", taste, ease);
  const closed = (
    <OverviewWrapper>
      <OverviewFirstColumn>
        <AuthorDate authorName={authorName} timestamp={timestamp} />
        <Source sourceType={sourceType} source={source} />
      </OverviewFirstColumn>
      <OverviewColumn>
        {time ? <p>total time: {time} min</p> : <TimePlaceholder />}
        {servings ? <p>servings: {servings}</p> : <ServingsPlaceholder />}
      </OverviewColumn>
      <OverviewColumn>
        <RatingsContainer>
          {taste ? <TasteRating value={taste} /> : <TasteRatingPlaceholder />}
          {ease ? <EaseRating value={ease} /> : <EaseRatingPlaceholder />}
        </RatingsContainer>
      </OverviewColumn>
    </OverviewWrapper>
  );

  const timeInput = (
    <input
      type="number"
      min="1"
      value={time}
      onChange={(e) => setTime(parseIntOrEmpty(e.target.value))}
    />
  );

  const servingsInput = (
    <input
      type="number"
      min="1"
      value={servings}
      onChange={(e) => setServings(parseIntOrEmpty(e.target.value))}
    />
  );

  const tasteInput = (
    <input
      type="number"
      min="0"
      max="10"
      step="0.5"
      value={taste}
      onChange={(e) => setTaste(parseFloatOrEmpty(e.target.value))}
    />
  );

  const easeInput = (
    <input
      type="number"
      min="0"
      max="10"
      step="0.5"
      value={ease}
      onChange={(e) => setEase(parseFloatOrEmpty(e.target.value))}
    />
  );

  const sourcePlaceholder =
    sourceType === "web"
      ? "Recipe URL"
      : sourceType === "cookbook"
      ? "Title & author"
      : "";

  const sourceEditor = (
    <>
      <select
        value={sourceType}
        onChange={(e) => setSourceType(e.target.value)}
      >
        <option value="personal">Personal</option>
        <option value="web" placeholder="Recipe URL">
          Web
        </option>
        <option value="cookbook" placeholder="Title & author">
          Cookbook
        </option>
      </select>
      {(sourceType === "web" || sourceType === "cookbook") && (
        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder={sourcePlaceholder}
        />
      )}
    </>
  );

  const open = (
    <OverviewWrapper>
      <OverviewFirstColumn>
        <AuthorDate authorName={authorName} timestamp={timestamp} />
        {sourceEditor}
      </OverviewFirstColumn>

      <OverviewColumn>
        <p>total time: {timeInput} min</p>
        <p>servings: {servingsInput}</p>
      </OverviewColumn>

      <OverviewColumn>
        <RatingsContainer>
          <RatingWrapper>
            <RatingLabel>taste</RatingLabel>
            {tasteInput}
          </RatingWrapper>

          <RatingWrapper>
            <RatingLabel>ease</RatingLabel>
            {easeInput}
          </RatingWrapper>
        </RatingsContainer>
      </OverviewColumn>
    </OverviewWrapper>
  );

  return <ClickToOpen open={open} closed={closed} />;
};

const DeleteIngredientButton = styled.button``;

const IngredientsEditor = ({
  ingredients,
  setIngredientField,
  deleteIngredient,
}) => {
  return (
    <IngredientsWrapper>
      {ingredientsHeader}
      {ingredients.map(({ name, amount }, index) => (
        <div
          style={{ display: "flex", flexDirection: "row", width: "100%" }}
          key={`ingredient-${index}`}
        >
          <DeleteIngredientButton
            id={`delete-ingredient-${index}`}
            onClick={() => deleteIngredient(index)}
          >
            X
          </DeleteIngredientButton>
          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setIngredientField(index, e.target.value, "amount")
            }
          />
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setIngredientField(index, e.target.value, "name")}
          />
        </div>
      ))}
    </IngredientsWrapper>
  );
};

const DeleteInstructionButton = styled.button``;

const InstructionsEditor = ({
  instructions,
  setInstructionField,
  deleteInstruction,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {instructionsHeader}
      {instructions.map((instruction, index) => (
        <div
          style={{ display: "flex", flexDirection: "row", width: "100%" }}
          key={`instruction-${index}`}
        >
          <DeleteInstructionButton
            id={`delete-ingredient-${index}`}
            onClick={() => deleteInstruction(index)}
          >
            X
          </DeleteInstructionButton>
          <textarea
            placeholder="Instruction"
            value={instruction}
            onChange={(e) => setInstructionField(index, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export const transparentIngredientsHeader = (
  <h2 style={{ opacity: defaultOpacity, fontSize: "30px" }}>Ingredients</h2>
);

export const transparentInstructionsHeader = (
  <h2 style={{ opacity: defaultOpacity, fontSize: "30px" }}>Instructions</h2>
);

const Details = ({
  ingredients,
  instructions,
  setIngredientField,
  setInstructionField,
  deleteIngredient,
  deleteInstruction,
}) => {
  const closed = (
    <DetailsWrapper>
      <IngredientsWrapper>
        {ingredients.slice(0, -1).length === 0
          ? transparentIngredientsHeader
          : ingredientsHeader}
        {ingredients.map((ingredient, i) => (
          <p key={`ingredient-${i}`}>
            {ingredient.amount} {ingredient.name}
          </p>
        ))}
      </IngredientsWrapper>
      <div>
        {ingredients.slice(0, -1).length === 0
          ? transparentInstructionsHeader
          : ingredientsHeader}
        {instructions &&
          instructions.map((instruction, i) => (
            <p style={{ marginBottom: "30px" }} key={`instruction-${i}`}>
              {instruction}
            </p>
          ))}
      </div>
    </DetailsWrapper>
  );

  const open = (
    <DetailsWrapper>
      <IngredientsEditor
        ingredients={ingredients}
        setIngredientField={setIngredientField}
        deleteIngredient={deleteIngredient}
      />
      <InstructionsEditor
        instructions={instructions}
        setInstructionField={setInstructionField}
        deleteInstruction={deleteInstruction}
      />
    </DetailsWrapper>
  );

  return <ClickToOpen open={open} closed={closed} />;
};

const emptyIngredient = { name: "", amount: "" };

const SubmitButton = ({ content, slug, history }) => {
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
      .then(() => setIsSubmitting(false))
      .then(() => history.push(`/recipes/${slug}`));
  };

  return (
    <PrimaryButton onClick={submit} disabled={isSubmitting}>
      Submit
    </PrimaryButton>
  );
};

const Slug = ({ slug, setSlug }) => (
  <p>
    {"slug: "}
    <input
      type="text"
      value={slug}
      onChange={setSlug ? (e) => setSlug(e.target.value) : () => {}}
      disabled={!setSlug}
    />
  </p>
);

const Editor = ({ initialContent, initialSlug = "", history }) => {
  // Make sure fields' states are defined
  const [title, setTitle] = useState(initialContent?.title || "");
  const [coverImageURL, setCoverImageURL] = useState(
    initialContent?.coverImageURL || ""
  );
  const [sourceType, setSourceType] = useState(
    initialContent?.sourceType || ""
  );
  const [source, setSource] = useState(initialContent?.source || "");
  const [time, setTime] = useState(initialContent?.activeTime || "");
  const [servings, setServings] = useState(initialContent?.servings || "");
  const [taste, setTaste] = useState(initialContent?.tastiness || "");
  const [ease, setEase] = useState(initialContent?.easiness || "");
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

  return (
    <>
      <Container>
        <Header>
          <Title title={title} set={setTitle} />
          <Slug
            slug={slug}
            setSlug={initialSlug !== "" ? undefined : setSlug}
          />
        </Header>

        <CoverImage src={coverImageURL} set={setCoverImageURL} />

        <Overview
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

        <Description description={description} set={setDescription} />

        <Details
          ingredients={ingredients}
          instructions={instructions}
          setIngredientField={setIngredientField}
          setInstructionField={setInstructionField}
          deleteIngredient={deleteIngredient}
          deleteInstruction={deleteInstruction}
        />
      </Container>

      <div style={{ textAlign: "right" }}>
        <SubmitButton
          content={{
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
          }}
          slug={slug}
          history={history}
        />
      </div>
    </>
  );
};

export default Editor;
