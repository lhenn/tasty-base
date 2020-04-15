import React, { useState } from "react";
import { getFirebase } from "../firebase";
import styled from "styled-components";
import ImageUploader from "./image-uploader";
import Label from "../forms/label.js";
import TextInput from "../forms/input.js";
import TextArea from "../forms/text-area.js";

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-right:10px;
  flex-grow:1;
`;
const FormRow = styled.div`
  display: flex;
  margin: 20px 0;
`;
const generateDate = () => {
  const now = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };

  const year = now.getFullYear();

  let month = now.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`; // prepend with a 0
  }

  let day = now.getDate();
  if (day < 10) {
    day = `0${day}`; // prepend with a 0
  }

  return {
    formatted: `${year}-${month}-${day}`, // used for sorting
    pretty: now.toLocaleDateString("en-US", options), // used for displaying
  };
};

const Create = ({ history }) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverImageAlt, setCoverImageAlt] = useState("");
  const [content, setContent] = useState("");

  const createPost = () => {
    const date = generateDate();
    const newPost = {
      title,
      dateFormatted: date.formatted,
      datePretty: date.pretty,
      slug,
      coverImage,
      coverImageAlt,
      content,
    };
    console.log(newPost);
    const postsRef = getFirebase()
      .database()
      .ref()
      .child(`posts`)
      .push()
      .set(newPost)
      .then(() => history.push(`/`));
  };

  return (
    <>
      <h1>Create a new post</h1>
      <FormRow>
      <FormGroup>
        <Label htmlFor="title-field" content="Title" />
        <TextInput
          id="title-field"
          type="text"
          onChange={({ target: { value } }) => {
            setTitle(value);
          }}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="slug-field" content="Slug" />
        <TextInput
          id="slug-field"
          type="text"
          value={slug}
          onChange={({ target: { value } }) => {
            setSlug(value);
          }}
        />
      </FormGroup>
      </FormRow>
      <Label htmlFor="image-uploader" content="Upload images"></Label>
      <ImageUploader />
      <FormRow>
        <FormGroup>
      <Label htmlFor="cover-image-field" content="Cover image" />
      <TextInput
        id="cover-image-field"
        type="text"
        value={coverImage}
        onChange={({ target: { value } }) => {
          setCoverImage(value);
        }}
      />
      </FormGroup>
      <FormGroup>
      <Label htmlFor="cover-image-alt-field" content="Cover image alt"></Label>
      <TextInput
        id="cover-image-alt-field"
        type="text"
        value={coverImageAlt}
        onChange={({ target: { value } }) => {
          setCoverImageAlt(value);
        }}
      />
      </FormGroup>
      </FormRow>
      <Label htmlFor="content-field" content="Content"></Label>

      <TextArea
        id="content"
        type="text"
        value={content}
        onChange={({ target: { value } }) => {
          setContent(value);
        }}
      />
      <Label htmlFor="preview" content="Post preview"></Label>
      <div>
        <p dangerouslySetInnerHTML={{ __html: content }}></p>
      </div>

      <div style={{ textAlign: "right" }}>
        <button
          style={{
            border: "none",
            color: "#fff",
            backgroundColor: "#039be5",
            borderRadius: "4px",
            padding: "8px 12px",
            fontSize: "0.9rem",
          }}
          onClick={createPost}
        >
          Create
        </button>
      </div>
    </>
  );
};

export default Create;
