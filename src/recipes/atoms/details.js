import React from "react";
import styled from "styled-components";
import { DisplayIngredients, IngredientsEditor } from "./ingredients";
import { DisplayInstructions, InstructionsEditor } from "./instructions";

const DetailsWrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 12px 0;
  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

export const DisplayDetails = ({ ingredients, instructions }) => (
  <DetailsWrapper>
    <DisplayIngredients ingredients={ingredients} />
    <DisplayInstructions instructions={instructions} />
  </DetailsWrapper>
);

export const DetailsEditor = ({
  ingredients,
  instructions,
  setInstructionField,
  deleteInstruction,
  setIngredientField,
  deleteIngredient,
}) => (
  <DetailsWrapper id="details-wrapper">
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
