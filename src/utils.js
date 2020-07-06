import React, { useEffect, useRef, useState } from "react";

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

export const parseIntOrEmpty = (str) => {
  let val = parseInt(str);
  return isNaN(val) ? "" : val;
};

export const parseFloatOrEmpty = (str) => {
  let val = parseFloat(str);
  return isNaN(val) ? "" : val;
};

// Checks if a variable that should contain text doesn't exist or only contains
// whitespace
export const textIsEmpty = (text) =>
  text === null || text === undefined || text.replace(/\s/g, "").length === 0;

// Falls back to showing a placeholder when an image cannot be successfully
// loaded
export const ImageWithPlaceholder = ({
  src,
  alt,
  Placeholder,
  Image,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const imageProps = {
    src,
    style: !loaded ? { visibility: "hidden", height: "0px" } : {},
    onLoad: () => setLoaded(true),
    onError: () => setLoaded(false),
    ...props,
  };

  const image = Image ? (
    <Image {...imageProps} />
  ) : (
    <img alt={alt} {...imageProps} />
  );

  return (
    <>
      {!loaded && <Placeholder />}
      {image}
    </>
  );
};

//Use this to dangerously set innerHTML of components to display markdown.
//e.g. 
//const Test = () => {
//   return <div dangerouslySetInnerHTML= {createMarkDown('# markdown-it rulezz!')}/>;
// }
//Markdown formatting, etc here: https://github.com/markdown-it/markdown-it
export const createMarkDown = (mdText) => {
  var md = require('markdown-it')();
  return {__html:md.render(mdText)};
}