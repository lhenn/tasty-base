import React, {useState} from "react";
import styled from "styled-components";
import {getFirebase} from "../firebase";
import Input from "../forms/input";
import Label from "../forms/label";
import TextArea from "../forms/text-area";
import {DisplayRecipePost} from "../recipes/recipe-post";
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

  return [fields, (field, value) => {
    console.log("field, value: ", field, value)
    setField({ ...fields, [field]: value });
  }];
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

// Combines all the post elements into one object and adds timestamp
const combinePostData = (basicInfo, ingredients, instructions) => {
  const date = generateDate();
  const author = getFirebase().auth().currentUser == null ? null : getFirebase().auth().currentUser.uid;

  // Remove last ingredient and instruction, which are always empty
  const newPost = {
    ...basicInfo,
    dateFormatted: date.formatted,
    datePretty: date.pretty,
    author: author,
    ingredients: ingredients.slice(0, -1),
    instructions: instructions.slice(0, -1),
  };
  return newPost;
};

// Called when create post button is clicked
const createPost = (basicInfo, history, ingredients, instructions) => {
  const newPost = combinePostData(basicInfo, ingredients, instructions);
  getFirebase()
    .database()
    .ref()
    .child(`posts`)
    .push()
    .set(newPost)
    .then(() => history.push(`/recipes/${newPost.slug}`));
};

const WebSourceInput = styled.input`
  border-color: ${(props) => (props.validationFailed ? "red" : "none")};
`;
// From https://cran.r-project.org/web/packages/rex/vignettes/url_parsing.html.
// Note that a slightly different regex is used in the firebase validation
// rule.
const urlRegex =
  "^(?:(?:http(?:s)?|ftp)://)(?:\\S+(?::(?:\\S)*)?@)?(?:(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)(?:\\.(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)*(?:\\.(?:[a-z0-9\u00a1-\uffff]){2,})(?::(?:\\d){2,5})?(?:/(?:\\S)*)?$";

const Create = ({ history }) => {
  // Information shared by all posts
  const [basicInfo, setBasicInfo] = useFormFields({
    title: "",
    slug: "",
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
  });

  // URLs and alt text for gallery images
  // const [gallery, setGallery] = useState([{ url: "", alt: "" }]);

  // Information for personal recipes only
  const [ingredients, updateIngredient, deleteIngredient] = useInputRows({
    name: "",
    amount: "",
  });
  const [instructions, updateInstruction, deleteInstruction] = useInputRows("");

  const parseIntOrEmpty = (str) => {
    let val = parseInt(str);
    return isNaN(val) ? "" : val;
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
            value={basicInfo.slug}
            onChange={(e) => setBasicInfo("slug", e.target.value)}
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
          <Label htmlFor="active-time" content="Active time" />
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
          <Label htmlFor="downtime" content="Downtime (nearest 15 min)" />
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
        {DisplayRecipePost(
          combinePostData(basicInfo, ingredients, instructions)
        )}
      </PreviewDiv>

      <div style={{ textAlign: "right" }}>
        <CreatePostButton
          onClick={() =>
            createPost(basicInfo, history, ingredients, instructions)
          }
        >
          {" "}
          Create{" "}
        </CreatePostButton>
      </div>
    </>
  );
};

export default Create;
