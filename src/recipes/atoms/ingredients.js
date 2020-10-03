import React from "react";
import styled from "styled-components";
import { defaultTransparent } from "../../styling";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const emptyIngredient = { name: "", amount: "" };

const IngredientsWrapper = styled.div`
  width: 33.3333%;
  border-right: 2px solid #000000;
  margin-right: 20px;
  padding-right: 10px;
  @media (max-width: 700px) {
    width: 100%;
    border: 0;
    margin: 0 0 15px 0;
  }
`;

const IngredientsHeader = ({ solid = true }) => (
  <h2 style={{ fontSize: "30px", opacity: solid ? 1 : defaultTransparent }}>
    Ingredients
  </h2>
);

export const DisplayIngredients = ({ ingredients }) => {
  if (!ingredients) return null;

  return (
    <IngredientsWrapper id="ingredients-wrapper">
      <IngredientsHeader />
      {ingredients &&
        ingredients.map((ingredient, i) => (
          <p key={`ingredient-${i}`}>
            {ingredient.amount} {ingredient.name}
          </p>
        ))}
    </IngredientsWrapper>
  );
};

const IngredientsInput = styled.input`
  resize: none;
  min-width: 0px;
  margin-right: 10px;
`;

const IngredientsEditorRow = styled.div`
  display: flex;
  align-items: center;
`;

export const IngredientsEditor = ({
  ingredients,
  setIngredientField,
  deleteIngredient,
}) => {
  return (
    <IngredientsWrapper id="ingredients-editor-wrapper">
      <IngredientsHeader solid={ingredients.length > 1} />
      {ingredients.map((ingredient, index) => (
        <IngredientsEditorRow key={`ingredient-${index}`}>
          <IngredientsInput
            id={`ingredient-${index}-amount-input`}
            placeholder="Amount"
            value={ingredient.amount}
            onChange={(e) =>
              setIngredientField(index, e.target.value, "amount")
            }
            style={{ display: "inline-block" }}
          />
          <IngredientsInput
            id={`ingredient-${index}-name-input`}
            placeholder="Name"
            value={ingredient.name}
            onChange={(e) => setIngredientField(index, e.target.value, "name")}
            style={{ display: "inline-block" }}
          />
          <FontAwesomeIcon
            icon={faTrash}
            id={`delete-ingredient-${index}`}
            onClick={() => deleteIngredient(index)}
            style={{ display: "inline-block" }}
          />
        </IngredientsEditorRow>
      ))}
    </IngredientsWrapper>
  );
};
