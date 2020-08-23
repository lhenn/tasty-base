import React from "react";
import styled from "styled-components";
import { defaultTransparent } from "../../styling";

export const emptyIngredient = { name: "", amount: "" };

const IngredientsWrapper = styled.div`
  width: 33.3333%;
  border-right: 2px solid #000000;
  margin-right: 20px;
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

// TODO: style this puppy
const DeleteIngredientButton = styled.button``;

const IngredientsInput = styled.input`
  border: none;
  resize: none;
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
        <div key={`ingredient-${index}`}>
          <IngredientsInput
            id="amount"
            placeholder="Amount"
            value={ingredient.amount}
            onChange={(e) =>
              setIngredientField(index, e.target.value, "amount")
            }
            style={{ display: "inline-block" }}
          />{" "}
          <IngredientsInput
            id="amount"
            placeholder="Name"
            value={ingredient.name}
            onChange={(e) => setIngredientField(index, e.target.value, "name")}
            style={{ display: "inline-block" }}
          />
          <DeleteIngredientButton
            id={`delete-ingredient-${index}`}
            onClick={() => deleteIngredient(index)}
            style={{ display: "inline-block" }}
          >
            X
          </DeleteIngredientButton>
        </div>
      ))}
    </IngredientsWrapper>
  );

  /*const open = (
    <IngredientsWrapper>
      {ingredientsHeader}
      {newIngredients.map(({ name, amount }, index) => (
        <div
          style={{ display: "flex", flexDirection: "row", width: "100%" }}
          key={`ingredient-${index}`}
        >
          <DeleteIngredientButton
            id={`delete-ingredient-${index}`}
            onClick={() => deleteNewIngredient(index)}
          >
            X
          </DeleteIngredientButton>
          <input
            type="text"
            id={`ingredient-amount-${index}`}
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setNewIngredientField(index, e.target.value, "amount")
            }
          />
          <input
            type="text"
            id={`ingredient-${index}`}
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setNewIngredientField(index, e.target.value, "name")
            }
          />
        </div>
      ))}
    </IngredientsWrapper>
  );*/
};
