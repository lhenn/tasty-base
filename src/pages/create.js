import React from "react";
import RecipeForm from "../recipes/recipe-form";

const Create = ({ history }) => {
  return (
    <>
      <h1>Create a new post</h1>
      <RecipeForm history={history} />
    </>
  );
};

export default Create;
