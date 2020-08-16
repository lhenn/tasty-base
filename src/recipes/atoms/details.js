import React from "react";
import styled from "styled-components";
import { DisplayIngredients, IngredientsEditor } from "./ingredients";
import { DisplayInstructions, InstructionsEditor } from "./instructions";

const DetailsWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 25px 0 25px 0;
  @media(max-width:700px){
    flex-direction:column;
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
  setIngredientField,
  setInstructionField,
  deleteIngredient,
  deleteInstruction,
}) => (
  <DetailsWrapper>
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
