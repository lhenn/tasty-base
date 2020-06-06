import { useState } from "react";
import { shallowIsEqual } from "../utils";

// Auto-expanding input rows
const useExpandingArray = (initialArray) => {
  let emptyEl = "";
  if (
    typeof initialArray[0] !== "string" &&
    !(initialArray[0] instanceof String)
  ) {
    // Infer empty element structure
    emptyEl = {};
    for (const key of Object.keys(initialArray[0])) emptyEl[key] = "";
  }

  // Add empty element to initial state
  const expandedInitialArray = [...initialArray];
  const lastEl = expandedInitialArray.slice(-1)[0];
  if (lastEl !== emptyEl && !shallowIsEqual(lastEl, emptyEl))
    expandedInitialArray.push(emptyEl);

  const [array, setArray] = useState(expandedInitialArray);

  const setElField = (index, value, field) => {
    const newArray = [...array];
    if (index === array.length - 1) newArray.push(emptyEl);

    if (!field) newArray[index] = value;
    else newArray[index] = { ...newArray[index], [field]: value };

    setArray(newArray);
  };

  const deleteEl = (index) => {
    if (
      array.length > 1 &&
      array[index] !== emptyEl &&
      !shallowIsEqual(array[index], emptyEl)
    ) {
      const newArray = [...array];
      newArray.splice(index, 1);
      setArray(newArray);
    }
  };

  return [array, setElField, deleteEl];
};

export default useExpandingArray;
