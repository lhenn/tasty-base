import React from "react";
import styled from "styled-components";
import { defaultTransparent } from "../../styling";
import ClickToOpen from "../click-to-open";
import useExpandingArray from "../form-hooks";

const emptyIngredient = { name: "", amount: "" };

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

const ingredientsHeader = <h2 style={{ fontSize: "30px" }}>Ingredients</h2>;

const transparentIngredientsHeader = (
  <h2 style={{ opacity: defaultTransparent, fontSize: "30px" }}>Ingredients</h2>
);

export const DisplayIngredients = ({ ingredients }) => {
  if (!ingredients) return null;

  return (
    <IngredientsWrapper>
      {ingredientsHeader}
      {ingredients &&
        ingredients.map((ingredient, i) => (
          <p key={`ingredient-${i}`}>
            {ingredient.amount} {ingredient.name}
          </p>
        ))}
    </IngredientsWrapper>
  );
};

const DeleteIngredientButton = styled.button``;

export const IngredientsEditor = ({ ingredients, setIngredients }) => {
  const [
    newIngredients,
    setNewIngredientField,
    deleteNewIngredient,
  ] = useExpandingArray(
    ingredients.length > 0 ? [...ingredients] : [emptyIngredient]
  );

  const onClose = () => setIngredients(newIngredients.slice(0, -1));

  const closed = (
    <IngredientsWrapper>
      {ingredients.length === 0
        ? transparentIngredientsHeader
        : ingredientsHeader}
      {ingredients.map((ingredient, i) => (
        <p key={`ingredient-${i}`}>
          {ingredient.amount} {ingredient.name}
        </p>
      ))}
    </IngredientsWrapper>
  );

  const open = (
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
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setNewIngredientField(index, e.target.value, "amount")
            }
          />
          <input
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setNewIngredientField(index, e.target.value, "name")
            }
          />
        </div>
      ))}
    </IngredientsWrapper>
  );

  return <ClickToOpen open={open} closed={closed} onClose={onClose} />;
};
