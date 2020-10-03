import React from "react";
import { Link } from "react-router-dom";
import {PrimaryButton} from "./buttons";


export const MobileSignedOutLinks = ({toggleDisplay}) => {
  return (
    <>
      <Link to="/signin" onClick={()=>toggleDisplay('close')}>
        <PrimaryButton>Sign in</PrimaryButton>
      </Link>
    </>
  );
}
export const SignedOutLinks = () => {
  return (
    <>
      <Link to="/signin">
        <PrimaryButton>Sign in</PrimaryButton>
      </Link>
    </>
  );
};

