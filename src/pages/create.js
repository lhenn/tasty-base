import React, { useState } from "react";
import styled from "styled-components";
import { getFirebase } from "../firebase";
import Input from "../forms/input";
import Label from "../forms/label";
import TextArea from "../forms/text-area";
import { DisplayRecipePost } from "../recipes/recipe-post";
import ImageUploader from "./image-uploader";

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
const useInputRows = (emptyRow) => {
  const [rows, setRows] = useState([emptyRow]);

  // Updates a row or a field in a row
  const updateRow = (index, value, field = null) => {
    let newState = [...rows];

    // If no field was specified, replace whole row
    if (field === null) {
      newState[index] = value;
    } else {
      newState[index] = {
        ...newState[index],
        [field]: value,
      };
    }

    if (index === rows.length - 1) {
      newState.push(emptyRow);
    }

    setRows(newState);
  };

  // Deletes a row using its index
  const deleteRow = (index) => {
    if (rows.length > 1) {
      let newState = [...rows];
      newState.splice(index, 1);
      setRows(newState);
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
  const [fields, setFields] = useState(initialState);

  return [
    fields,
    (e) => {
      setFields({
        ...fields,
        [e.target.id]: e.target.value,
      });
    },
  ];
};

const CreatePostButton = styled.button`
  border: none;
  color: #fff;
  backgroundcolor: #039be5;
  borderradius: 4px;
  padding: 8px 12px;
  fontsize: 0.9rem;
`;

// TODO: generate timestamp and move date formatting to post viewer
const generateDate = () => {
  const now = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };

  const year = now.getFullYear();

  let month = now.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`; // prepend with a 0
  }

  let day = now.getDate();
  if (day < 10) {
    day = `0${day}`; // prepend with a 0
  }

  return {
    formatted: `${year}-${month}-${day}`, // used for sorting
    pretty: now.toLocaleDateString("en-US", options), // used for displaying
  };
};

// Called when create post button is clicked
const createPost = (basicInfo, history, details = null) => {
  const date = generateDate();
  let newPost = {
    ...basicInfo,
    dateFormatted: date.formatted,
    datePretty: date.pretty,
  };
  if (details !== null) {
    newPost["details"] = details;
  }
  console.log("new post: ", newPost);
  // TODO: clean up any empty rows in ingredients and instructions?

  // TODO: maybe use this ref to push new post to history?
  // const postsRef =
  getFirebase()
    .database()
    .ref()
    .child(`posts`)
    .push()
    .set(newPost)
    .then(() => history.push(`/`));
};

const Create = ({ history }) => {
  // Information shared by all posts
  const [basicInfo, setBasicInfo] = useFormFields({
    title: "",
    slug: "",
    sourceType: "personal", // TODO: must manually align with an option...
    source: "",
    activeTime: 0,
    downtime: 0,
    servings: 1,
    easiness: 10,
    tastiness: 10,
    coverImageURL: "",
    coverImageAlt: "",
    description: "",
  });

  // URLs and alt text for gallery images
  // const [gallery, setGallery] = useState([{ url: "", alt: "" }]);

  // Information for personal recipes only
  const [ingredients, updateIngredient, deleteIngredient] = useInputRows({
    name: "",
    amount: "",
  });
  const [instructions, updateInstruction, deleteInstruction] = useInputRows("");

  return (
    <>
      <h1>Create a new post</h1>
      <FormRow>
        <FormGroup>
          <Label htmlFor="title" content="Title" />
          <Input
            type="text"
            id="title"
            value={basicInfo.title}
            onChange={setBasicInfo}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="slug" content="Slug" />
          <Input
            type="text"
            id="slug"
            value={basicInfo.slug}
            onChange={setBasicInfo}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <Label htmlFor="sourceType" content="Source" />
          <select
            value={basicInfo.sourceType}
            id="sourceType"
            onChange={(e) => {
              setBasicInfo(e);
            }}
          >
            <option value="personal">Personal</option>
            <option value="web">Web</option>
            <option value="cookbook">Cookbook</option>
          </select>
          <Input
            type="text"
            id="source"
            value={basicInfo.source}
            onChange={setBasicInfo}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <Label htmlFor="activeTime" content="Active time (nearest 15 min)" />
          <Input
            type="number"
            id="activeTime"
            min="0"
            step="15"
            value={basicInfo.activeTime}
            onChange={setBasicInfo}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="downtime" content="Downtime (nearest 15 min)" />
          <Input
            type="number"
            id="downtime"
            min="0"
            step="15"
            value={basicInfo.downtime}
            onChange={setBasicInfo}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="servings" content="Servings" />
          <Input
            type="number"
            id="servings"
            min="1"
            value={basicInfo.servings}
            onChange={setBasicInfo}
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
            onChange={setBasicInfo}
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
            onChange={setBasicInfo}
          />
        </FormGroup>
      </FormRow>

      <Label htmlFor="post-image-uploader" content="Upload images"></Label>
      <ImageUploader id="post-image-uploader" />

      <FormRow>
        <FormGroup>
          <Label htmlFor="coverImageURL" content="Cover image URL" />
          <Input
            type="text"
            id="coverImageURL"
            value={basicInfo.coverImageURL}
            placeholder="Image URL"
            onChange={setBasicInfo}
          />
        </FormGroup>
      </FormRow>

      <ContentDiv>
        <Label htmlFor="description" content="Description"></Label>
        <TextArea
          id="description"
          placeholder="How did you find this recipe? What should we know about it?"
          value={basicInfo.description}
          onChange={setBasicInfo}
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
      <PreviewDiv id="preview">{DisplayRecipePost(basicInfo)}</PreviewDiv>

      <div style={{ textAlign: "right" }}>
        <CreatePostButton
          onClick={() => {
            if (basicInfo.sourceType === "personal") {
              createPost(basicInfo, history, { ingredients, instructions });
            } else {
              createPost(basicInfo, history);
            }
          }}
        >
          {" "}
          Create{" "}
        </CreatePostButton>
      </div>
    </>
  );
};

export default Create;
