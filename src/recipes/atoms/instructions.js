import React from "react";
import styled from "styled-components";
import { defaultTransparent } from "../../styling";
import ClickToOpen from "../click-to-open";
import useExpandingArray from "../form-hooks";

const StyledList = styled.ol`
  @media (max-width: 700px) {
    padding-left: 18px !important;
  }
`;

const instructionsHeader = <h2 style={{ fontSize: "30px" }}>Instructions</h2>;

const transparentInstructionsHeader = (
  <h2 style={{ opacity: defaultTransparent, fontSize: "30px" }}>
    Instructions
  </h2>
);

export const DisplayInstructions = ({ instructions }) => {
  if (!instructions) return null;

  return (
    <div>
      {instructionsHeader}
      <StyledList>
        {instructions &&
          instructions.map((instruction, i) => (
            <li style={{ marginBottom: "30px" }} key={`instruction-${i}`}>
              {instruction}
            </li>
          ))}
      </StyledList>
    </div>
  );
};

const DeleteInstructionButton = styled.button``;

export const InstructionsEditor = ({ instructions, setInstructions }) => {
  const [
    newInstructions,
    setNewInstructionField,
    deleteNewInstruction,
  ] = useExpandingArray(instructions.length > 0 ? [...instructions] : [""]);

  const onClose = () => setInstructions(newInstructions.slice(0, -1));

  const closed = (
    <div>
      {instructions.length === 0
        ? transparentInstructionsHeader
        : instructionsHeader}
      <ol>
        {instructions &&
          instructions.map((instruction, i) => (
            <li key={`instruction-${i}`}>{instruction}</li>
          ))}
      </ol>
    </div>
  );

  const open = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {instructionsHeader}
      {newInstructions.map((instruction, index) => (
        <div
          style={{ display: "flex", flexDirection: "row", width: "100%" }}
          key={`instruction-${index}`}
        >
          <DeleteInstructionButton
            id={`delete-ingredient-${index}`}
            onClick={() => deleteNewInstruction(index)}
          >
            X
          </DeleteInstructionButton>
          <textarea
            placeholder="Instruction"
            value={instruction}
            onChange={(e) => setNewInstructionField(index, e.target.value)}
          />
        </div>
      ))}
    </div>
  );

  return <ClickToOpen open={open} closed={closed} onClose={onClose} />;
};
