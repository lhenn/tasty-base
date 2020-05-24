import React, { useContext, useState } from "react";
import styled from "styled-components";
import { UserContext } from "../App";
import { getFirebase } from "../firebase";
import {PrimaryButton} from "../general/buttons";
import ImageUploader from "../general/image-uploader";
import useFileHandlers, { FILES_UPLOADED } from "../useFileHandlers";
import DisplayRecipePost from "./display-recipe";
import { FormRow, FormGroup, Label, Input, TextArea } from "../forms/general-forms";
import useCancellablePromises from "../promise-hooks";


const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`;

const PreviewWrapper = styled.div`
  border: 1px solid black;
  margin: 5px 0;
`;

// Auto-expanding input rows
// TODO: learn emptyRow from initialState
const useInputRows = (initialState) => {
  // Figure out what an empty row looks like
  let emptyRow = "";
  if (
    typeof initialState[0] !== "string" &&
    !(initialState[0] instanceof String)
  ) {
    emptyRow = {};
    for (const k of Object.keys(initialState[0])) {
      emptyRow[k] = "";
    }
  }

  // Add empty row if last row is not already empty
  let fullInitialState = [...initialState];
  if (fullInitialState[fullInitialState.length - 1] !== emptyRow) {
    fullInitialState.push(emptyRow);
  }

  const [rows, setRows] = useState(initialState);

  // Updates a row or a field in a row
  const updateRow = (index, value, field = null) => {
    let newRows = [...rows];

    // If no field was specified, replace whole row
    if (field === null) {
      newRows[index] = value;
    } else {
      newRows[index] = {
        ...newRows[index],
        [field]: value,
      };
    }

    if (index === rows.length - 1) {
      newRows.push(emptyRow);
    }

    setRows(newRows);
  };

  // Deletes a row using its index
  const deleteRow = (index) => {
    if (rows.length > 1) {
      let newRows = [...rows];
      newRows.splice(index, 1);
      setRows(newRows);
    }
  };

  return [rows, updateRow, deleteRow];
};

const DeleteIngredientButton = styled.button``;

const Ingredients = ({ ingredients, updateIngredient, deleteIngredient }) => {
  // TODO: is there any issue with the key here?
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Label htmlFor="ingredients-list" content="Ingredients: name, quantity" />
      <div id="ingredients-list">
        {ingredients.map((ingredient, i) => (
          <div key={`ingredient${i}`}>
            <DeleteIngredientButton
              id={`delete-ingredient${i}`}
              onClick={() => deleteIngredient(i)}
            >
              X
            </DeleteIngredientButton>
            <input
              type="text"
              id={`ingredient-name${i}`}
              value={ingredient.name}
              onChange={(e) => updateIngredient(i, e.target.value, "name")}
            />
            <input
              type="text"
              id={`ingredient-amount${i}`}
              value={ingredient.amount}
              onChange={(e) => updateIngredient(i, e.target.value, "amount")}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const DeleteInstructionButton = styled.button``;

const InstructionsList = ({
  instructions,
  updateInstruction,
  deleteInstruction,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Label htmlFor="instructions-list" content="Instructions" />
      <div id="instructions-list">
        {instructions.map((instruction, i) => (
          <div
            key={`instruction${i}`}
            style={{ display: "flex", flexDirection: "row" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Label
                htmlFor={`instruction-content${i}`}
                content={`Step ${i + 1}`}
              />
              <DeleteInstructionButton
                id={`delete-instruction${i}`}
                onClick={() => deleteInstruction(i)}
              >
                X
              </DeleteInstructionButton>
            </div>
            <textarea
              id={`instruction-content${i}`}
              value={instruction}
              onChange={(e) => updateInstruction(i, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomRecipeContentWrapper = styled.div`
  display: flex;
`;

const CustomRecipeContent = (props) => {
  return (
    <CustomRecipeContentWrapper>
      <Ingredients
        ingredients={props.ingredients}
        updateIngredient={props.updateIngredient}
        deleteIngredient={props.deleteIngredient}
      />
      <InstructionsList
        instructions={props.instructions}
        updateInstruction={props.updateInstruction}
        deleteInstruction={props.deleteInstruction}
      />
    </CustomRecipeContentWrapper>
  );
};

// Combines all the post data into one object except for author uid and
// timestamp. These both need to be handled separately.
const makeContent = (
  basicInfo,
  ingredients,
  instructions,
  galleryUploaded,
  author,
  authorName
) => {
  // Get gallery dowload URLs
  let gallery = [];
  for (var i = 0; i < Object.keys(galleryUploaded).length; i++) {
    const curDownloadURL = galleryUploaded[i].downloadURL;
    if (curDownloadURL !== basicInfo.coverImageURL)
      gallery.push(curDownloadURL);
  }

  // Remove last ingredient and instruction, which are always empty
  return {
    ...basicInfo,
    ingredients: ingredients.slice(0, -1),
    instructions: instructions.slice(0, -1),
    author,
    authorName,
    timestamp: Date.now(),
    gallery,
  };
};

// Called when create post button is clicked
const CreatePostButton = ({ content, slug, history }) => {
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
      Create
    </PrimaryButton>
  );
};

const WebSourceInput = styled.input`
  border-color: ${(props) => (props.validationFailed ? "red" : "none")};
`;

const emptyBasicInfo = {
  title: "",
  sourceType: "personal", // TODO: must manually align with an option...
  source: "",
  activeTime: 1,
  downtime: 0,
  servings: 1,
  easiness: 10,
  tastiness: 10,
  coverImageURL: "",
  coverImageAlt: "",
  description: "",
};

const emptyIngredients = [{ name: "", amount: "" }];
const emptyInstructions = [""];

const parseIntOrEmpty = (str) => {
  let val = parseInt(str);
  return isNaN(val) ? "" : val;
};

const RecipeForm = ({ history, content, slug }) => {
  // Information shared by all posts
  const [basicInfo, setBasicInfo] = useState(
    content
      ? Object.keys(emptyBasicInfo).reduce((acc, key) => {
          acc[key] = content[key];
          return acc;
        }, {})
      : emptyBasicInfo
  );

  // Information for personal recipes only. If the post exists but is not a
  // personal recipe, ingredients and instructions won't exist.
  const [ingredients, updateIngredient, deleteIngredient] = useInputRows(
    content?.ingredient ?? emptyIngredients
  );
  const [instructions, updateInstruction, deleteInstruction] = useInputRows(
    content?.instructions ?? emptyInstructions
  );

  const [slugState, setSlugState] = useState(slug ? slug : "");

  // Callback for handling cover image changes in ImageUploader
  // NOTE: for some reason, when I wrapped basicInfo in a custom hook, the
  // state was not properly updated when thumbnails were set as the cover image
  // even though I verified the state was supposedly being reset in the hook.
  // When I either factored coverImageURL out into its own state hook or
  // changed to what's below, the state was updated properly. I think it has
  // something to do with a closure capturing a stale value for the
  // setBasicInfo hook, but I could not figure out where this was happening.
  const onSetCover = (url, alt) =>
    setBasicInfo({ ...basicInfo, coverImageURL: url, coverImageAlt: alt });

  // Set up file handlers for ImageUploader
  const {
    files: galleryFiles,
    uploaded: galleryUploaded, // uploaded files
    status: galleryUploadStatus,
    onSubmit: onSubmitGallery,
    onChange: onChangeGallery,
  } = useFileHandlers();

  // Block until user has authenticated
  // TODO: improve
  const { user } = useContext(UserContext);
  if (!user) return <h1>LOADING USER INFO</h1>;

  // This object is needed by the create post button and preview
  // TODO: declare dependencies with useMemo so it always gets synchronized
  // with the form's state?
  const newContent = makeContent(
    basicInfo,
    ingredients,
    instructions,
    galleryUploaded,
    user.uid,
    user.displayName
  );

  // TODO: <form>?
  return (
    <>
      <FormRow>
        <FormGroup>
          <Label htmlFor="recipe-title" content="Recipe title" />
          <Input
            type="text"
            id="recipe-title"
            value={basicInfo.title}
            onChange={(e) =>
              setBasicInfo({ ...basicInfo, title: e.target.value })
            }
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="slug" content="Slug" />
          <Input
            type="text"
            id="slug"
            value={slugState}
            onChange={(e) => setSlugState(e.target.value)}
            required
          />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label htmlFor="source-type" content="Source" />
          <select
            value={basicInfo.sourceType}
            id="source-type"
            onChange={(e) =>
              setBasicInfo({
                ...basicInfo,
                source: "",
                sourceType: e.target.value,
              })
            }
            required
          >
            <option value="personal">Personal</option>
            <option value="web">Web</option>
            <option value="cookbook">Cookbook</option>
          </select>
          {
            // Not so pretty
            basicInfo.sourceType === "web" && (
              <WebSourceInput
                type="url"
                id="source"
                placeholder="https://example.com"
                value={basicInfo.source}
                onChange={(e) =>
                  setBasicInfo({ ...basicInfo, source: e.target.value })
                }
                required
              />
            )
          }
          {basicInfo.sourceType === "cookbook" && (
            <Input
              type="text"
              id="source"
              placeholder="Title"
              value={basicInfo.source}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, source: e.target.value })
              }
              required
            />
          )}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label htmlFor="active-time" content="Active time (minutes)" />
          <Input
            type="number"
            id="active-time"
            min="1"
            value={basicInfo.activeTime}
            onChange={(e) =>
              setBasicInfo({
                ...basicInfo,
                activeTime: parseIntOrEmpty(e.target.value),
              })
            }
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="downtime" content="Downtime (minutes)" />
          <Input
            type="number"
            id="downtime"
            min="0"
            value={basicInfo.downtime}
            onChange={(e) =>
              setBasicInfo({
                ...basicInfo,
                downtime: parseIntOrEmpty(e.target.value),
              })
            }
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="servings" content="Servings" />
          <Input
            type="number"
            id="servings"
            min="1"
            value={basicInfo.servings}
            onChange={(e) =>
              setBasicInfo({
                ...basicInfo,
                servings: parseIntOrEmpty(e.target.value),
              })
            }
            required
          />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label htmlFor="easiness" content="Easiness rating" />
          <Input
            type="number"
            id="easiness"
            max="10"
            min="1"
            value={basicInfo.easiness}
            onChange={(e) =>
              setBasicInfo({
                ...basicInfo,
                easiness: parseIntOrEmpty(e.target.value),
              })
            }
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="tastiness" content="Tastiness rating" />
          <Input
            type="number"
            id="tastiness"
            max="10"
            min="1"
            value={basicInfo.tastiness}
            onChange={(e) =>
              setBasicInfo({
                ...basicInfo,
                tastiness: parseIntOrEmpty(e.target.value),
              })
            }
            required
          />
        </FormGroup>
      </FormRow>

      <Label htmlFor="post-image-uploader" content="Upload images"></Label>
      <ImageUploader
        id="post-image-uploader"
        files={galleryFiles}
        uploaded={galleryUploaded}
        status={galleryUploadStatus}
        uploadFinishedStatus={FILES_UPLOADED}
        onSubmit={onSubmitGallery}
        onChange={onChangeGallery}
        curCover={basicInfo.coverImageURL}
        onSetCover={onSetCover}
      />

      <FormRow>
        <FormGroup>
          <Label htmlFor="cover-image-url" content="Cover image URL" />
          <Input
            type="text"
            id="cover-image-url"
            value={basicInfo.coverImageURL}
            placeholder="Cover image URL"
            onChange={(e) =>
              setBasicInfo({
                ...basicInfo,
                coverImageURL: e.target.value,
                coverImageAlt: "",
              })
            }
            required
          />
        </FormGroup>
      </FormRow>

      <ContentWrapper>
        <Label htmlFor="description" content="Description"></Label>
        <TextArea
          id="description"
          placeholder="Description, with [links](https://example.com)"
          value={basicInfo.description}
          onChange={(e) =>
            setBasicInfo({ ...basicInfo, description: e.target.value })
          }
          required
        />
      </ContentWrapper>

      {basicInfo.sourceType === "personal" && (
        <CustomRecipeContent
          ingredients={ingredients}
          updateIngredient={updateIngredient}
          deleteIngredient={deleteIngredient}
          instructions={instructions}
          updateInstruction={updateInstruction}
          deleteInstruction={deleteInstruction}
        />
      )}

      <Label htmlFor="preview" content="Post preview"></Label>
      <PreviewWrapper id="preview">
        <DisplayRecipePost content={newContent} />
      </PreviewWrapper>

      <div style={{ textAlign: "right" }}>
        <CreatePostButton
          content={newContent}
          slug={slugState}
          history={history}
        />
      </div>
    </>
  );
};

export default RecipeForm;
