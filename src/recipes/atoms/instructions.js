import React from "react";
import styled from "styled-components";
import { defaultTransparent } from "../../styling";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InstructionsHeader = ({ solid = true }) => (
  <h2 style={{ fontSize: "30px", opacity: solid ? 1 : defaultTransparent }}>
    Instructions
  </h2>
);

const InstructionsLI = styled.li`
  margin-bottom: 30px;
`;

const InstructionsWrapper = styled.div`
  width: 66.6666%;
`;

export const DisplayInstructions = ({ instructions }) => {
  if (!instructions) return null;

  return (
    <InstructionsWrapper id="instructions-wrapper">
      <InstructionsHeader />
      <ol>
        {instructions &&
          instructions.map((instruction, i) => (
            <InstructionsLI key={`instruction-${i}`}>
              {instruction}
            </InstructionsLI>
          ))}
      </ol>
    </InstructionsWrapper>
  );
};

// TODO: style this puppy
const DeleteInstructionButton = styled.button`
  margin-right: 10px;
`;

const InstructionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InstructionTextArea = styled.textarea`
  resize: none;
  min-height: 40px;
  width: 100%;
  margin-right: 10px;
`;

export const InstructionsEditor = ({
  instructions,
  setInstructionField,
  deleteInstruction,
}) => {
  const handleKeyDown = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <InstructionsWrapper id="instructions-editor-wrapper">
      <InstructionsHeader solid={instructions.length > 1} />
      <ol>
        {instructions.map((instruction, index) => (
          <InstructionsLI key={`instruction-${index}`}>
            <InstructionRow>
              <InstructionTextArea
                id={`input-ingredient-${index}`}
                placeholder="Instruction"
                value={instruction}
                onChange={(e) => setInstructionField(index, e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <FontAwesomeIcon
                icon={faTrash}
                id={`delete-ingredient-${index}`}
                onClick={() => deleteInstruction(index)}
                style={{ display: "inline-block" }}
              />
            </InstructionRow>
          </InstructionsLI>
        ))}
      </ol>
    </InstructionsWrapper>
  );
};
