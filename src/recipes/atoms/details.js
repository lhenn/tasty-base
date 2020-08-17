import React from "react";
import styled from "styled-components";
import { DisplayIngredients, IngredientsEditor } from "./ingredients";
import { DisplayInstructions, InstructionsEditor } from "./instructions";

const DetailsWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 25px 0 25px 0;
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
  setIngredients,
  setInstructions,
}) => (
  <DetailsWrapper>
    <IngredientsEditor
      ingredients={ingredients}
      setIngredients={setIngredients}
    />
    <InstructionsEditor
      instructions={instructions}
      setInstructions={setInstructions}
    />
  </DetailsWrapper>
);
