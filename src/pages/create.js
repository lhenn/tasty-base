import React, { useState, useReducer } from "react";
import { getFirebase } from "../firebase";
import styled from "styled-components";
import ImageUploader from "./image-uploader";
import Label from "../forms/label";
import Input from "../forms/input";
import TextArea from "../forms/text-area";
import { DisplayRecipePost } from "../recipes/recipe-post";

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

const RecipeContentDiv = styled.div`
  display: flex;
`;

// TODO
// * Click and drag reordering
// * Automatically add new row when last one starts being filled -> done!
// * Button to remove ingredient
const ingredientsReducer = (ingredients, action) => {
  let i = action.index;

  if (action.type === "name_change") {
    let newIngredients = [...ingredients];
    if (i === ingredients.length - 1) {
      newIngredients.push({ amount: "", name: "" });
    }
    newIngredients[i] = {
      amount: newIngredients[i].amount,
      name: action.newName,
    };
    return newIngredients;
  } else if (action.type === "amount_change") {
    let newIngredients = [...ingredients];
    if (i === ingredients.length - 1) {
      newIngredients.push({ amount: "", name: "" });
    }
    newIngredients[i] = {
      amount: action.newAmount,
      name: newIngredients[i].name,
    };
    return newIngredients;
  } else {
    return ingredients;
  }
};

const IngredientList = () => {
  const [ingredients, dispatch] = useReducer(ingredientsReducer, [
    { amount: "", name: "" },
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Label content="Ingredients" />
      <div>
        {ingredients.map((ingredient, i) => (
          <div key={`ingredient${i}`}>
            <input
              type="text"
              id={`ingredient-amount${i}`}
              value={ingredient.amount}
              onChange={(e) => {
                dispatch({
                  type: "amount_change",
                  index: i,
                  newAmount: e.target.value,
                });
              }}
            />
            <input
              type="text"
              id={`ingredient-name${i}`}
              value={ingredient.name}
              onChange={(e) => {
                dispatch({
                  type: "name_change",
                  index: i,
                  newName: e.target.value,
                });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const RecipeContent = () => {
  return (
    <RecipeContentDiv>
      <IngredientList />
    </RecipeContentDiv>
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
    sourceType: "Web", // TODO: must align with an option in the select...
    source: "",
    activeTime: 0,
    downtime: 0,
    servings: 1,
    easiness: 10,
    tastiness: 10,
    coverImageURL: "",
    coverImageAlt: "",
    content: "", // TODO: refactor!
  });

  const createPost = () => {
    const date = generateDate();
    const newPost = {
      ...fields,
      dateFormatted: date.formatted,
      datePretty: date.pretty,
    };
    console.log(fields);
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
            placeholder="0"
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
            placeholder="0"
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
            placeholder="1"
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
            placeholder="1-10"
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
            placeholder="1-10"
            max="10"
            min="1"
            value={fields.tastiness}
            onChange={setFields}
          />
        </FormGroup>
      </FormRow>

      <Label content="Upload images"></Label>
      <ImageUploader />

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
        <Label content="Content"></Label>
        <TextArea
          type="text"
          id="content"
          value={fields.content}
          onChange={setFields}
        />
      </ContentDiv>

      {fields.sourceType === "other" && <RecipeContent />}

      <Label content="Post preview"></Label>
      <PreviewDiv>{DisplayRecipePost(fields)}</PreviewDiv>

      <div style={{ textAlign: "right" }}>
        <CreatePostButton onClick={createPost}> Create </CreatePostButton>
      </div>
    </>
  );
};

export default Create;
