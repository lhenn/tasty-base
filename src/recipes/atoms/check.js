import { faCheck } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useState, useRef } from "react";
import { UserContext } from "../../App";
import { addToMyList, removeFromMyList } from "../../firebase";
import { FormGroup, FormRow, Input, Label } from "../../forms/general-forms";
import { PrimaryButton } from "../../general/buttons";
import { Icon } from "./generic-icons";
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
      .then(() => {
        props.closeRate();
      })
      .catch((err) => console.log(err));
  };
  // Currently wrapping Icon in a Button because otherwise there is a "functional components not compatible with useRef error"
  // TODO: improve the check clicking active/not-active and checked/not-checked behavior
  // TODO: should only open rating container if check is currently unchecked (?) or..
  // if clicked and check is already checked, should at least show current ratings rather than defaulting to 5
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
              <p onClick={() => handleSubmit()}>No Thanks</p>
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
      removeFromMyList(user.uid, slug, "rate").then(
        () => {
          setBusy(false);
          setRate(false);
        },
        (err) => console.log("remove ratings failed with code:", err.code)
      ),
      (err) => console.log("remove check failed with code:", err.code)
    );

  };
  // const uncheck = () => {
  //   if (busy) return;
  //   setBusy(true);

  //   removeFromMyList(user.uid, slug, "rate").then(
  //     () => {
  //       setBusy(false);
  //       setRate(false);
  //     },
  //     (err) => console.log("remove ratings failed with code:", err.code)
  //   );
  // };

  const onClick = () => (!isChecked ? check() : uncheck());

  return (
    <div>
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
