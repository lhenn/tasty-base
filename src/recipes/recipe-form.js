import React, { useCallback, useContext, useState } from "react";
import styled from "styled-components";
import { getFirebase } from "../firebase";
import Input from "../forms/input";
import Label from "../forms/label";
import TextArea from "../forms/text-area";
import { DisplayRecipePost } from "./recipe-post";
import ImageUploader from "../general/image-uploader";
import { UserContext } from "../App";
import Button from "../general/button-primary";

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  flex-grow: 1;
`;

const FormRow = styled.div`
  display: flex;
  margin: 20px 0;
`;

const ContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`;

const PreviewDiv = styled.div`
  border: 1px solid black;
  margin: 5px 0;
`;

// Auto-expanding input rows
// TODO: learn emptyRow from initialState
const useInputRows = (initialState) => {
  console.log("useInputRows: initialState = ", initialState)
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

const CustomRecipeContentDiv = styled.div`
  display: flex;
`;

const CustomRecipeContent = (props) => {
  return (
    <CustomRecipeContentDiv>
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
    </CustomRecipeContentDiv>
  );
};

const useFormFields = (initialState) => {
  const [fields, setField] = useState(initialState);

  return [
    fields,
    (field, value) => {
      setField({ ...fields, [field]: value });
    },
  ];
};

// Combines all the post data into one object except for author uid and
// timestamp. These both need to be handled separately.
const combinePostData = (basicInfo, ingredients, instructions, author) => {
  // Remove last ingredient and instruction, which are always empty
  const newPost = {
    ...basicInfo,
    ingredients: ingredients.slice(0, -1),
    instructions: instructions.slice(0, -1),
    author,
    timestamp: Date.now(),
  };

  return newPost;
};

// Called when create post button is clicked
const CreatePostButton = ({ post, slug, history }) => {
  console.log("CreatePostButton", post);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = useCallback(() => {
    console.log("SUBMITTING");
    // Don't submit multiple times
    if (isSubmitting) return;

    // Swap Date timestamp out for special firebase one
    const timestamp = getFirebase().database.ServerValue.TIMESTAMP;
    const timestampedPost = { ...post, timestamp };
    console.log("timestampedPost: ", timestampedPost);

    // Submit the post
    setIsSubmitting(true);
    getFirebase()
      .database()
      .ref()
      .child(`/posts/${slug}`)
      .set(timestampedPost)
      .then(() => {
        console.log("CreatePostButton: then");
        setIsSubmitting(false);
      })
      .then(() => history.push(`/recipes/${slug}`));
  }, [isSubmitting, post, slug, history]);

  return (
    <Button onClick={submit} disabled={isSubmitting}>
      Create
    </Button>
  );
};

const WebSourceInput = styled.input`
  border-color: ${(props) => (props.validationFailed ? "red" : "none")};
`;

// From https://cran.r-project.org/web/packages/rex/vignettes/url_parsing.html
const urlRegex =
  "^(?:(?:http(?:s)?|ftp)://)(?:\\S+(?::(?:\\S)*)?@)?(?:(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)(?:\\.(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)*(?:\\.(?:[a-z0-9\u00a1-\uffff]){2,})(?::(?:\\d){2,5})?(?:/(?:\\S)*)?$";

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

const RecipeForm = ({ history, post, slug }) => {
  // Information shared by all posts
  const [basicInfo, setBasicInfo] = useFormFields(
    post ? { ...post } : emptyBasicInfo
  );

  // Information for personal recipes only. If the post exists but is not a
  // personal recipe, ingredients and instructions won't exist.
  const [ingredients, updateIngredient, deleteIngredient] = useInputRows(
    post && post.ingredients ? post.ingredients : emptyIngredients
  );
  const [instructions, updateInstruction, deleteInstruction] = useInputRows(
    post && post.instructions ? post.instructions : emptyInstructions
  );

  const [slugState, setSlugState] = useState(slug ? slug : "");

  // URLs and alt text for gallery images
  // const [gallery, setGallery] = useState([{ url: "", alt: "" }]);

  // Block until user has authenticated
  const user = useContext(UserContext);
  if (!user) return <h1>LOADING USER INFO</h1>;

  return (
    <>
      <FormRow>
        <FormGroup>
          <Label htmlFor="title" content="Title" />
          <Input
            type="text"
            id="title"
            value={basicInfo.title}
            onChange={(e) => setBasicInfo("title", e.target.value)}
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
            onChange={(e) => setBasicInfo("sourceType", e.target.value)}
            required
          >
            <option value="personal">Personal</option>
            <option value="web">Web</option>
            <option value="cookbook">Cookbook</option>
          </select>
          {basicInfo.sourceType === "web" ? (
            <WebSourceInput
              type="url"
              id="source"
              placeholder="https://example.com"
              pattern={urlRegex}
              value={basicInfo.source}
              onChange={(e) => setBasicInfo("source", e.target.value)}
              required
            />
          ) : (
            <Input
              type="text"
              id="source"
              value={basicInfo.source}
              onChange={(e) => setBasicInfo("source", e.target.value)}
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
              setBasicInfo("activeTime", parseIntOrEmpty(e.target.value))
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
              setBasicInfo("downtime", parseIntOrEmpty(e.target.value))
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
              setBasicInfo("servings", parseIntOrEmpty(e.target.value))
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
              setBasicInfo("easiness", parseIntOrEmpty(e.target.value))
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
              setBasicInfo("tastiness", parseIntOrEmpty(e.target.value))
            }
            required
          />
        </FormGroup>
      </FormRow>

      <Label htmlFor="post-image-uploader" content="Upload images"></Label>
      <ImageUploader id="post-image-uploader" />

      <FormRow>
        <FormGroup>
          <Label htmlFor="cover-image-url" content="Cover image URL" />
          <Input
            type="text"
            id="cover-image-url"
            value={basicInfo.coverImageURL}
            placeholder="Image URL"
            onChange={(e) => setBasicInfo("coverImageURL", e.target.value)}
          />
        </FormGroup>
      </FormRow>

      <ContentDiv>
        <Label htmlFor="description" content="Description"></Label>
        <TextArea
          id="description"
          placeholder="How did you find this recipe? What should we know about it?"
          value={basicInfo.description}
          onChange={(e) => setBasicInfo("description", e.target.value)}
          required
        />
      </ContentDiv>

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
      <PreviewDiv id="preview">
        <DisplayRecipePost
          post={combinePostData(basicInfo, ingredients, instructions, user.uid)}
          authorName={user.displayName}
        />
      </PreviewDiv>

      <div style={{ textAlign: "right" }}>
        <CreatePostButton
          post={combinePostData(basicInfo, ingredients, instructions, user.uid)}
          slug={slugState}
          history={history}
        />
      </div>
    </>
  );
};

export default RecipeForm;
