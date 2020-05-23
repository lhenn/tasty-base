import { useEffect, useRef } from "react";

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

// Checks if objects have same keys and values
// TODO: put in utils file or something
export const shallowIsEqual = (dict1, dict2) =>
  typeof dict1 === "object" &&
  dict1 !== null &&
  typeof dict2 === "object" &&
  dict2 !== null &&
  Object.keys(dict1).length === Object.keys(dict2).length &&
  Object.keys(dict1).every(
    (key) => dict2.hasOwnProperty(key) && dict1[key] === dict2[key]
  );
