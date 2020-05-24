import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "./general-recipe";
import React, { useContext, useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import styled from "styled-components";
import { UserContext } from "../App";
import { checkPost, uncheckPost } from "../firebase";
import UpdatingTooltip from "../general/tooltip";

//
/**
 * TODO:
 * -    generalize this and star.js (maybe into Higher Order Component?)
 * -    consider using recipe id instead of slug in user data
 * -    generalize check and star functions in '../firebase'
 */


const Check = ({ slug }) => {
  const [busy, setBusy] = useState(false);
  const [ttText, setTTText] = useState("");
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );

  if (loadingUser || loadingUserData) return <Icon icon={faCheck} />;

  const isChecked = userData?.checkedRecipes?.hasOwnProperty(slug);

  const check = () => {

    if (busy) return;
    setBusy(true);
    checkPost(user.uid, slug).then(
      () => {
        setTTText("Checked!");
        setBusy(false);
      },
      (err) => console.log("check failed with code:", err.code)
    );
  };

  const uncheck = () => {
    if (busy) return;
    setBusy(true);
    uncheckPost(user.uid, slug).then(
        () => {
            setTTText("Unchecked!");
            setBusy(false);
        },
        (err) => console.log("uncheck failed with code:", err.code)
    );
  };

  const onClick = () => (!isChecked ? check() : uncheck());

  const onMouseEnter = () => {
      !isChecked ? setTTText("Check") : setTTText ("Uncheck");
  };

  return (
    <OverlayTrigger
    placement="bottom"
    trigger={["hover", "focus"]}
    overlay={<UpdatingTooltip id="check-tooltip">{ttText}</UpdatingTooltip>}
  >
    <Icon icon={faCheck} onClick={onClick} onMouseEnter={onMouseEnter} />
  </OverlayTrigger>
  )
};
export default Check;