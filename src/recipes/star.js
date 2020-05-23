import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import styled from "styled-components";
import { UserContext } from "../App";
import { starPost, unstarPost } from "../firebase";
import UpdatingTooltip from "../general/tooltip";

// TODO: change when starred
const StarIcon = styled(FontAwesomeIcon)`
  color: lightgrey;
  font-size: 26px;
  padding: 5px;
  margin: 20px 5px;
  &:hover {
    color: #9791e8;
  }
`;

const Star = ({ slug }) => {
  // Busy when sending star/unstar data to firebase
  const [busy, setBusy] = useState(false);
  const [ttText, setTTText] = useState("");
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );

  if (loadingUser || loadingUserData) return <StarIcon icon={faStar} />;

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

  return (
    <OverlayTrigger
      placement="bottom"
      trigger={["hover", "focus"]}
      overlay={<UpdatingTooltip id="star-tooltip">{ttText}</UpdatingTooltip>}
    >
      <StarIcon icon={faStar} onClick={onClick} onMouseEnter={onMouseEnter} />
    </OverlayTrigger>
  );
};

export default Star;
