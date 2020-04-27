import React from "react";
import { Link } from "react-router-dom";
import Button from "./button-primary";

const SignedOutLinks = () => {
  return (
    <>
      <Link to="/signin">
        <Button>Sign in</Button>
      </Link>
    </>
  );
};

export default SignedOutLinks;

