import React, { useState } from "react";
import { getFirebase } from "../firebase";
import styled from "styled-components";
import ImageUploader from "./image-uploader";
import Label from "../forms/label.js";
import Input from "../forms/input.js";
import TextArea from "../forms/text-area.js";

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  flex-grow: 1;
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
  const [source, setSource] = useState("");
  const [time, setTime] = useState("");
  const [servings, setServings] = useState("");
  const [easiness, setEasiness] = useState(-1);
  const [tastiness, setTastiness] = useState(-1);
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
      source,
      time,
      servings,
      easiness,
      tastiness,
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
          <Input
            id="title-field"
            type="text"
            onChange={({ target: { value } }) => {
              setTitle(value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="slug-field" content="Slug" />
          <Input
            id="slug-field"
            type="text"
            value={slug}
            onChange={({ target: { value } }) => {
              setSlug(value);
              setCoverImageAlt(`${value}-img`);
            }}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <Label htmlFor="source-field" content="Source" />
          <Input
            type="text"
            id="source-field"
            placeholder="html if link"
            value={source}
            onChange={({ target: { value } }) => {
              setSource(value);
            }}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <Label htmlFor="time-field" content="Time" />
          <Input
            type="text"
            id="time-field"
            value={time}
            onChange={({ target: { value } }) => {
              setTime(value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="servings-field" content="No. servings" />
          <Input
            type="text"
            id="servings-field"
            value={servings}
            onChange={({ target: { value } }) => {
              setServings(value);
            }}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <Label htmlFor="easiness-field" content="Easiness rating" />
          <Input
            id="easiness-field"
            type="number"
            placeholder="1-10"
            max="10"
            min="0"
            value={easiness}
            onChange={({ target: { value } }) => {
              setEasiness(value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="tastiness-field" content="Tastiness rating" />
          <Input
            id="tastiness-field"
            type="number"
            placeholder="1-10"
            max="10"
            min="0"
            value={tastiness}
            onChange={({ target: { value } }) => {
              setTastiness(value);
            }}
          />
        </FormGroup>
      </FormRow>
      <Label htmlFor="image-uploader" content="Upload images"></Label>
      <ImageUploader />
      <FormRow>
        <FormGroup>
          <Label htmlFor="cover-image-field" content="Cover image" />
          <Input
            id="cover-image-field"
            type="text"
            value={coverImage}
            placeholder="image url"
            onChange={({ target: { value } }) => {
              setCoverImage(value);
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
