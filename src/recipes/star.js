import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "./general-recipe";
import React, { useContext, useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { UserContext } from "../App";
import { addToMyList, removeFromMyList } from "../firebase";
import UpdatingTooltip from "../general/tooltip";


const Star = ({ slug }) => {
  // Busy when sending star/unstar data to firebase
  const [busy, setBusy] = useState(false);
  const [ttText, setTTText] = useState("");
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );

  if (loadingUser || loadingUserData) return <Icon icon={faStar} />;

  const isStarred = 
    userData.myListRecipes &&
    userData.myListRecipes[slug] &&
    userData.myListRecipes[slug].hasOwnProperty("star");

  const star = () => {
    if (busy) return;
    setBusy(true);
    addToMyList(user.uid, slug, 'star').then(
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
    removeFromMyList(user.uid, slug, 'star').then(
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
