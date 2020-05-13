import React from "react";

/*
 * Parses markdown. Currently only handles links.
 *
 * Example:
 *   parseLink("A link to [google](google.com)")
 *   ["A link to ",  {text: "google", url: "google.com"}]
 */
export const parseMD = (str) => {
  const textOpen = "[";
  const textClose = "]";
  const urlOpen = "(";
  const urlClose = ")";
  // Ordered list of tokens
  const tokens = [textOpen, textClose, urlOpen, urlClose];

  let parsed = [];
  let curContent = "";
  let curText = "";
  let curURL = "";
  let matchingText = false;
  let matchingURL = false;
  let prevChar = "";

  for (const c of str) {
    if (matchingText) {
      if (!tokens.includes(c)) {
        curText += c;
      } else if (c === textClose) {
        if (curText === "") {
          throw new Error("Empty link text");
        } else {
          matchingText = false;
          matchingURL = true;
        }
      } else {
        throw new Error("Found '" + c + "', but expected ']'");
      }
    } else if (matchingURL) {
      if (prevChar === textClose) {
        if (c !== urlOpen) {
          throw new Error("'(URL)' must follow '[text]'");
        }
      } else if (!tokens.includes(c)) {
        curURL += c;
      } else if (c === urlClose) {
        if (curURL === "") {
          throw new Error("Empty URL");
        } else {
          // Done parsing!
          parsed.push({ text: curText, url: curURL });
          matchingURL = false;
        }
      } else {
        throw new Error("Found '" + c + "', but expected ')'");
      }
    } else {
      if (c === textOpen) {
        // Start parsing
        matchingText = true;
        if (curContent !== "") parsed.push(curContent);
        curContent = "";
      } else if (c === textClose) {
        // Invalid token
        throw new Error("Unbalanced ']'");
      } else {
        // Just a normal character
        curContent += c;
      }
    }
    prevChar = c;
  }

  if (matchingText) {
    throw new Error("Link text incomplete");
  } else if (matchingURL) {
    throw new Error("Link URL incomplete");
  } else {
    if (curContent !== "") parsed.push(curContent);
    return parsed;
  }
};

/*
 * Converts markdown text to a list of strings and link components. If a custom
 * link component is not provided as the second argument, <a href>...</a> will
 * be used.
 */
const mdToHTML = (str, LinkComponent, rethrow = false) => {
  try {
    const parsed = parseMD(str);
    return parsed.map((chunk) => {
      if (typeof chunk === "string") {
        return chunk;
      } else {
        if (LinkComponent) {
          return (
            <LinkComponent href={chunk.url} key={chunk.url}>
              {chunk.text}
            </LinkComponent>
          );
        } else {
          return (
            <a href={chunk.url} key={chunk.url}>
              {chunk.text}
            </a>
          );
        }
      }
    });
  } catch (err) {
    if (rethrow) throw err;
    else return str;
  }
};

export default mdToHTML;
