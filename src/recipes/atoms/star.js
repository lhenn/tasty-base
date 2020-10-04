import { faStar } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { UserContext } from "../../App";
import { addToMyList, removeFromMyList } from "../../firebase";
import UpdatingTooltip from "../../general/tooltip";
import { Icon } from "./generic-icons";
import SignInRequiredTT from "./sign-in-required-tt";

const Star = ({ slug }) => {
  // Busy when sending star/unstar data to firebase
  const [busy, setBusy] = useState(false);
  const [ttText, setTTText] = useState("");
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );

  if (loadingUser || loadingUserData) return <Icon icon={faStar} />;

  const isStarred =
    userData?.myListRecipes &&
    userData.myListRecipes[slug] &&
    userData.myListRecipes[slug].hasOwnProperty("star");

    console.log('isStarred? ', isStarred)
  const star = () => {
    if (busy) return;
    setBusy(true);
    if (user) {
      addToMyList(user.uid, slug, "star").then(
        () => {
          setTTText("Starred!");
        },
        (err) => console.log("star failed with code:", err.code)
      );
    } else {
      setTTText("Log in or create an account to use this feature :)");
    }
    setBusy(false);
  };

  const unstar = () => {
    if (busy) return;
    setBusy(true);
    if (user) {
      removeFromMyList(user.uid, slug, "star").then(
        () => {
          setTTText("Unstarred!");
          setBusy(false);
        },
        (err) => console.log("unstar failed with code:", err.code)
      );
    } else {
      setTTText("Log in or create an account to use this feature :)");
    }
  };

  const onClick = () => (!isStarred ? star() : unstar());

  const onMouseEnter = () => {
    !isStarred ? setTTText("Star") : setTTText("Unstar");
  };
  return (
    <>
      {user ? (
        <OverlayTrigger
          placement="bottom"
          trigger={["hover", "focus"]}
          overlay={
            <UpdatingTooltip id="star-tooltip">{ttText}</UpdatingTooltip>
          }
        >
          <Icon
            icon={faStar}
            isactive={isStarred ? 'true' : undefined}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
          />
        </OverlayTrigger>
      ) : (
        <OverlayTrigger
          placement="bottom"
          trigger={["click"]}
          overlay={
            <UpdatingTooltip id="no-signin-tooltip">{'must be signed in!'}</UpdatingTooltip>
          }
        rootClose
        >
          <Icon
            icon={faStar}
          />
        </OverlayTrigger>
      )}
    </>
  );
};

export default Star;
