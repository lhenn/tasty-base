import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "./general-recipe";
import React, { useContext, useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { UserContext } from "../App";
import { starPost, unstarPost } from "../firebase";
import UpdatingTooltip from "../general/tooltip";


const Star = ({ slug }) => {
  // Busy when sending star/unstar data to firebase
  const [busy, setBusy] = useState(false);
  const [ttText, setTTText] = useState("");
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );

  if (loadingUser || loadingUserData) return <Icon icon={faStar} />;

  const isStarred = userData?.starredRecipes?.hasOwnProperty(slug);

  const star = () => {
    if (busy) return;
    setBusy(true);
    starPost(user.uid, slug).then(
      () => {
        setTTText("Starred!");
        setBusy(false);
      },
      (err) => console.log("star failed with code:", err.code)
    );
  };

  const unstar = () => {
    if (busy) return;
    setBusy(true);
    unstarPost(user.uid, slug).then(
      () => {
        setTTText("Unstarred!");
        setBusy(false);
      },
      (err) => console.log("unstar failed with code:", err.code)
    );
  };

  const onClick = () => (!isStarred ? star() : unstar());

  const onMouseEnter = () => {
    !isStarred ? setTTText("Star") : setTTText("Unstar");
  };
  console.log('isStarred:', isStarred)

  return (
    <OverlayTrigger
      placement="bottom"
      trigger={["hover", "focus"]}
      overlay={<UpdatingTooltip id="star-tooltip">{ttText}</UpdatingTooltip>}
    >
      <Icon icon={faStar} isactive={isStarred ? 1 : 0} onClick={onClick} onMouseEnter={onMouseEnter} />
    </OverlayTrigger>
  );
};

export default Star;
