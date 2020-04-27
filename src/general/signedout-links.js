import React from "react";
import { Link } from "react-router-dom";
import Button from "./button-primary";

const SignedOutLinks = (user) => {
    return (
        <>
        <Link to="/signin">
          <Button text="Sign in" />
        </Link>
        </>
    )
}

export default SignedOutLinks;