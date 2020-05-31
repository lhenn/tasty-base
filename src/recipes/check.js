import React, { useContext, useState } from "react";
import { PrimaryButton } from "../general/buttons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "./general-recipe";
import { FormRow, FormGroup, Label, Input } from "../forms/general-forms";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import styled from "styled-components";
import { UserContext } from "../App";
import { checkPost, uncheckPost, ratePost } from "../firebase";
import UpdatingTooltip from "../general/tooltip";

//
/**
 * TODO:
 * -    generalize this and star.js (maybe into Higher Order Component?)
 * -    generalize check and star functions in '../firebase'
 */

const Rate = ({slug}) => {
  const [ease, setEase] = useState(10);
  const [taste, setTaste] = useState(10);
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );

  const sendRatings = (ease, taste) => {
    ratePost(user.uid, slug, ease, taste);

};

  return (
    <>
      <div>Care to anonymously rate this recipe?</div>
      <FormRow>
        <FormGroup>
          <Label htmlFor="ease" content="Ease rating" />
          <Input
            type="number"
            id="ease"
            max="10"
            min="1"
            value={ease}
            onChange={(e) => setEase(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="taste" content="Taste rating" />
          <Input
            type="number"
            id="taste"
            value={taste}
            max="10"
            min="1"
            onChange={(e) => setTaste(e.target.value)}
          />
        </FormGroup>
      </FormRow>
      <PrimaryButton onClick={() => sendRatings(ease, taste)}>Submit</PrimaryButton>
    </>
  );
};

const Check = ({ slug }) => {
  const [busy, setBusy] = useState(false);
  const [ttText, setTTText] = useState("");
  const [rate, setRate] = useState(false);
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
        setRate(true);
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
        setRate(false);
      },
      (err) => console.log("uncheck failed with code:", err.code)
    );
  };

  const onClick = () => (!isChecked ? check() : uncheck());

  const onMouseEnter = () => {
    !isChecked ? setTTText("Check") : setTTText("Uncheck");
  };

  return (
    <>
      <OverlayTrigger
        placement="bottom"
        trigger={["hover", "focus"]}
        overlay={<UpdatingTooltip id="check-tooltip">{ttText}</UpdatingTooltip>}
      >
        <Icon icon={faCheck} isActive={isChecked} onClick={onClick} onMouseEnter={onMouseEnter} />
      </OverlayTrigger>
      {rate && <Rate slug={slug} />}
    </>
  );
};
export default Check;
