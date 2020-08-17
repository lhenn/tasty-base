import { faCheck } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useState, useRef } from "react";
import { UserContext } from "../../App";
import { addToMyList, removeFromMyList } from "../../firebase";
import { FormGroup, FormRow, Input, Label } from "../../forms/general-forms";
import { PrimaryButton } from "../../general/buttons";
import { Icon } from "./generic-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Overlay from "react-bootstrap/Overlay";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import styled from "styled-components";

const TtInner = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0;
`;

function RateToolTip(props) {
  console.log("props:", props);
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const [ease, setEase] = useState(5);
  const [taste, setTaste] = useState(5);
  const { user } = useContext(UserContext);

  const handleSubmit = () => {
    sendRatings(ease, taste);
    setShow(false);
  };
  const sendRatings = (ease, taste) => {
    addToMyList(user.uid, props.slug, "rate", { ease, taste })
      .then(() => {
        props.closeRate();
      })
      .catch((err) => console.log(err));
  };
  // Currently wrapping Icon in a Button because otherwise there is a "functional components not compatible with useRef error"
  // TODO: improve the check clicking active/not active and checked/not checked behavior
  return (
    <>
      <Button ref={target} onClick={() => setShow(!show)}>
        <Icon
          icon={faCheck}
          isactive={props.isactive}
          onClick={props.onClick}
        />
      </Button>
      <Overlay target={target.current} show={show} placement="right">
        {(props) => (
          <Tooltip id="overlay" {...props}>
            <TtInner>
              <div>Care to anonymously rate this recipe?</div>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="ease" content="Ease rating" />
                  <Input
                    type="number"
                    id="ease"
                    max="5"
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
                    max="5"
                    min="1"
                    onChange={(e) => setTaste(e.target.value)}
                  />
                </FormGroup>
              </FormRow>
              <PrimaryButton onClick={() => handleSubmit(ease, taste)}>
                Submit
              </PrimaryButton>
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
    removeFromMyList(user.uid, slug, "check").then(
      () => {
        setBusy(false);
        setRate(false);
      },
      (err) => console.log("uncheck failed with code:", err.code)
    );
  };

  const onClick = () => (!isChecked ? check() : uncheck());

  return (
    <div>
      <RateTT
        slug={slug}
        closeRate={() => setRate(false)}
        isactive={isChecked ? 1 : 0}
        onClick={onClick}
      />
      <RateToolTip
        slug={slug}
        closeRate={() => setRate(false)}
        isactive={isChecked ? 1 : 0}
        onClick={onClick}
      />
    </div>
  );
};

export default Check;
