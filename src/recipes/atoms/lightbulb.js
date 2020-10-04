import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useState } from "react";
import { UserContext } from "../../App";
import { Icon } from "./generic-icons";
import SignInRequiredTT from "./sign-in-required-tt";

const Lightbulb = ({ contribution }) => {
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );
  return (
    <>
      {user ? (
        <Icon
          icon={faLightbulb}
          isactive={contribution ? "true" : undefined}
        />
      ) : (
        <SignInRequiredTT
          wrappedEl={<Icon icon={faLightbulb} />}
        ></SignInRequiredTT>
      )}
    </>
  );
};

export default Lightbulb;
