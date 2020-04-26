import React, { useState } from "react";
import styled from "styled-components";
import { getFirebase } from "../firebase";
import Input from "../forms/input";
import Label from "../forms/label";
import TextArea from "../forms/text-area";
import { DisplayRecipePost } from "../recipes/recipe-post";
import ImageUploader from "./image-uploader";
import { CounterContext } from "../App";

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

const DeleteIngredientButton = styled.button``;

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

// Custom hook
const useInputRows = (emptyRow) => {
  const [rows, setRows] = useState([emptyRow]);

  const updateRow = (index, value, field = "") => {
    let newState = [...rows];

    // If no field was specified, replace whole row
    if (field === "") {
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

  const deleteRow = (index) => {
    console.log("Number of rows: ", rows.length);
    if (rows.length > 1) {
      let newState = [...rows];
      newState.splice(index, 1);
      setRows(newState);
    }
  };

  return [rows, updateRow, deleteRow];
};

const Ingredients = () => {
  const [ingredients, updateIngredient, deleteIngredient] = useInputRows({
    name: "",
    amount: "",
  });

  console.log("ingredients: ", ingredients);

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

const InstructionsList = () => {
  const [instructions, updateInstructions, deleteInstruction] = useInputRows(
    ""
  );

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
              onChange={(e) => updateInstructions(i, e.target.value)}
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

const CustomRecipeContent = () => {
  return (
    <CustomRecipeContentDiv>
      <Ingredients />
      <InstructionsList />
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

const Create = ({ history }) => {
  const [fields, setFields] = useFormFields({
    title: "",
    slug: "",
    sourceType: "other", // TODO: must manually align with an option...
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

  const createPost = () => {
    const date = generateDate();
    const newPost = {
      ...fields,
      dateFormatted: date.formatted,
      datePretty: date.pretty,
    };
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

  return (
    <>
      <h1>Global counter test</h1>
      <CounterContext.Consumer>
        {(value) => {
          return (
            <>
              <p>Count in Create: {value.count}</p>
              <button onClick={() => value.increment()}>Increment count</button>
            </>
          );
        }}
      </CounterContext.Consumer>
      <h1>Create a new post</h1>
      <FormRow>
        <FormGroup>
          <Label htmlFor="title" content="Title" />
          <Input
            type="text"
            id="title"
            value={fields.title}
            onChange={setFields}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="slug" content="Slug" />
          <Input
            type="text"
            id="slug"
            value={fields.slug}
            onChange={setFields}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <Label htmlFor="sourceType" content="Source" />
          <select
            value={fields.sourceType}
            id="sourceType"
            onChange={(e) => {
              setFields(e);
            }}
          >
            <option value="web">Web</option>
            <option value="cookbook">Cookbook</option>
            <option value="other">Other</option>
          </select>
          <Input
            type="text"
            id="source"
            value={fields.source}
            onChange={setFields}
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
            value={fields.activeTime}
            onChange={setFields}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="downtime" content="Downtime (nearest 15 min)" />
          <Input
            type="number"
            id="downtime"
            min="0"
            step="15"
            value={fields.downtime}
            onChange={setFields}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="servings" content="Servings" />
          <Input
            type="number"
            id="servings"
            min="1"
            value={fields.servings}
            onChange={setFields}
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
            value={fields.easiness}
            onChange={setFields}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="tastiness" content="Tastiness rating" />
          <Input
            type="number"
            id="tastiness"
            max="10"
            min="1"
            value={fields.tastiness}
            onChange={setFields}
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
            value={fields.coverImageURL}
            placeholder="Image URL"
            onChange={setFields}
          />
        </FormGroup>
      </FormRow>

      <ContentDiv>
        <Label htmlFor="description" content="Description"></Label>
        <TextArea
          id="description"
          placeholder="How did you find this recipe? What should we know about it?"
          value={fields.description}
          onChange={setFields}
        />
      </ContentDiv>

      {fields.sourceType === "other" && <CustomRecipeContent />}

      <Label htmlFor="preview" content="Post preview"></Label>
      <PreviewDiv id="preview">{DisplayRecipePost(fields)}</PreviewDiv>

      <div style={{ textAlign: "right" }}>
        <CreatePostButton onClick={createPost}> Create </CreatePostButton>
      </div>
    </>
  );
};

export default Create;
