import React, { useState } from "react";
import styled from "styled-components";
import { getFirebase } from "../firebase";
import RecipeForm from "../recipes/recipe-form";
const Create = () => {
  return(
      <>
      <h1>Create a new post</h1>
      <RecipeForm/>
      </>
  )
}

export default Create;