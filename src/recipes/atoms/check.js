import { faCheck } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import styled from "styled-components";
import { UserContext } from "../../App";
import {
  addToMyList,
  removeFromMyList,
  addRatingToRecipe,
  removeRatingFromRecipe
} from "../../firebase";
import { FormGroup, FormRow, Label } from "../../forms/general-forms";
import { PrimaryButton } from "../../general/buttons";
import { Icon } from "./generic-icons";
import { RatingInput } from "./ratings";

const TtInner = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0;
`;
const DeclineButton = styled.p`
  cursor: pointer;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  &:hover {
    text-decoration: underline;
  }
`;

function RateToolTip(props) {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const [ease, setEase] = useState(5);
  const [taste, setTaste] = useState(5);
  const { user } = useContext(UserContext);

  const handleSubmit = (ease, taste) => {
    if (ease && taste) sendRatings(ease, taste);
    setShow(false);
  };
  const sendRatings = (ease, taste) => {
    addToMyList(user.uid, props.slug, "rate", { ease, taste })
      .then(() => addRatingToRecipe(props.slug, "ease", ease, user.uid))
      .then(() => addRatingToRecipe(props.slug, "taste", taste, user.uid))
      .then(() => {
        props.closeRate();
      })
      .catch((err) => console.log(err));
  };
  // Currently wrapping Icon in a Button because otherwise there is a "functional components not compatible with useRef error"
  // Could not get tooltip closing to work with OverlayTrigger
  return (
    <>
      <Button
        id="invisible-trigger-wrapper"
        ref={target}
        onClick={() => {
          if (!props.isactive) {
            setShow(!show);
          }
        }}
      >
        <Icon
          icon={faCheck}
          isactive={props.isactive}
          onClick={props.onClick}
        />
      </Button>
      <Overlay target={target.current} show={show} placement="bottom">
        {(props) => (
          <Tooltip id="overlay" {...props}>
            <TtInner>
              <div>Care to anonymously rate this recipe?</div>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="taste" content="Taste rating" />
                  <RatingInput value={taste} set={setTaste} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="ease" content="Ease rating" />
                  <RatingInput value={ease} set={setEase} />
                </FormGroup>
              </FormRow>
              <PrimaryButton onClick={() => handleSubmit(ease, taste)}>
                Submit
              </PrimaryButton>
              <DeclineButton onClick={() => handleSubmit()}>
                No Thanks
              </DeclineButton>
            </TtInner>
          </Tooltip>
        )}
      </Overlay>
    </>
  );
}

const Check = ({ slug }) => {
  const [busy, setBusy] = useState(false);
  const [rate, setRate] = useState(false);
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );

  if (loadingUser || loadingUserData) return <Icon icon={faCheck} />;

  const isChecked =
    userData?.myListRecipes &&
    userData.myListRecipes[slug] &&
    userData.myListRecipes[slug].hasOwnProperty("check")
      ? true
      : false;

  const check = () => {
    if (busy) return;
    setBusy(true);
    addToMyList(user.uid, slug, "check").then(
      () => {
        setBusy(false);
        setRate(true);
      },
      (err) => console.log("check failed with code:", err.code)
    );
  };

  const uncheck = () => {
    if (busy) return;
    setBusy(true);
    removeFromMyList(user.uid, slug, "check")
      .then(() => removeFromMyList(user.uid, slug, "rate"))
      .then(() => removeRatingFromRecipe(slug, 'ease', user.uid))
      .then(() => removeRatingFromRecipe(slug, 'taste', user.uid))
      .then(() => {
        setBusy(false);
        setRate(false);
      });
   
  };

  const onClick = () => (!isChecked ? check() : uncheck());

  return (
    <div>
      <RateToolTip
        slug={slug}
        closeRate={() => setRate(false)}
        isactive={isChecked}
        onClick={onClick}
      />
    </div>
  );
};

export default Check;
