import React from "react";
import styled from "styled-components";
import { DisplayIngredients } from "./ingredients";
import { DisplayInstructions } from "./instructions";

const DetailsWrapper = styled.div`
  display: flex;
  padding: 25px 0 25px 0;
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
    <DisplayIngredients
      ingredients={ingredients}
      setIngredientField={setIngredientField}
      deleteIngredient={deleteIngredient}
    />
    <DisplayInstructions
      instructions={instructions}
      setInstructionField={setInstructionField}
      deleteInstruction={deleteInstruction}
    />
  </DetailsWrapper>
);
