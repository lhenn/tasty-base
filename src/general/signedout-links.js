import React from "react";
import { Link } from "react-router-dom";
import {PrimaryButton} from "./buttons";

const SignedOutLinks = () => {
  return (
    <>
      <Link to="/signin">
        <PrimaryButton>Sign in</PrimaryButton>
      </Link>
    </>
  );
};

export default SignedOutLinks;

