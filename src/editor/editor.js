import React, { useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";

class SimpleImage {
  static get toolbox() {
    return {
      title: "Image",
      icon:
        '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }

  constructor({ data }) {
    this.data = data;
  }
  render() {
    const wrapper = document.createElement("div");
    const input = document.createElement("input");

    wrapper.classList.add("simple-image");
    wrapper.appendChild(input);

    input.placeholder = "Paste an image URL...";
    input.value = this.data && this.data.url ? this.data.url : "";

    return wrapper;
  }

  save(blockContent) {
    return {
      url: blockContent.value,
    };
  }
}

const editor = new EditorJS({
  /**
   * Id of Element that should contain the Editor
   */

  holderId: "editorjs",

  /**
   * Available Tools list.
   * Pass Tool's class or Settings object for each Tool you want to use
   */

  tools: {
    header: {
      class: Header,
      inlineToolbar: ["link"],
    },
    list: {
      class: List,
      inlineToolbar: true,
    },
    image: SimpleImage,
  },
});

const TextEditor = () => {
  const [output, setOutput] = useState(null);
  const save = () => {
    editor.save().then((savedData) => {
      console.log(savedData);
      setOutput(JSON.stringify(savedData, null, 4));
    });
  };
  return (
    <>
      <div id="editorjs"></div>
      <button id="save-button" onClick={save}>
        Save
      </button>
      {output}
    </>
  );
};

export default TextEditor;
