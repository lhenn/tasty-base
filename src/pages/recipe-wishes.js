import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../App";
import { getFirebase } from "../firebase";
import Input from "../forms/input";
import mdToHTML from "../forms/md-parse";

const WishLink = styled.a`
  text-decoration: underline !important;
  color: ;
`;

const WishCardWrapper = styled.div`
  border: solid 2px black;
  padding: 10px;
  margin-top: 10px;
`;

const WishCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const WishlistHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Notes = styled.textarea`
  width: 100%;
  lineheight: 2rem;
  verticalalign: middle;
  fontsize: 1rem;
  margin-top: 10px;
  padding: 0 0.38rem;
`;

const Button = styled.button``;

const WishCardsWrapper = styled.div`
  margin-top: 20px;
`;

const WishCard = ({ wishKey, wish, viewing, startEdit, deleteWish }) => {
  const EditButton = () => (
    <button onClick={() => startEdit(wishKey)} disabled={!viewing}>
      <FontAwesomeIcon icon={faEdit} />
    </button>
  );

  const DeleteButton = () => (
    <button onClick={() => deleteWish(wishKey)} disabled={!viewing}>
      <FontAwesomeIcon icon={faTimes} />
    </button>
  );

  return (
    <WishCardWrapper>
      <WishCardHeader>
        <strong>{wish.idea}</strong>
        <div>
          <EditButton />
          <DeleteButton />
        </div>
      </WishCardHeader>
      {wish.notes !== "" && <p>{mdToHTML(wish.notes, WishLink)}</p>}
    </WishCardWrapper>
  );
};

const WishCards = ({
  wishes,
  viewing,
  beingEdited,
  startEdit,
  submitEdit,
  deleteWish,
  cancel,
  working,
}) => {
  if (Object.keys(wishes).length > 0) {
    return (
      <WishCardsWrapper>
        {Object.entries(wishes)
          .reverse()
          .map(([wishKey, wish]) =>
            beingEdited(wishKey) ? (
              <WishForm
                submitWish={(wish) => submitEdit(wishKey, wish)}
                cancel={cancel}
                working={working}
                initialWish={wish}
                key={wishKey}
              />
            ) : (
              <WishCard
                wishKey={wishKey}
                wish={wish}
                viewing={viewing}
                startEdit={startEdit}
                deleteWish={deleteWish}
                key={wishKey}
              />
            )
          )}
      </WishCardsWrapper>
    );
  } else {
    return <p>No wishes added yet!</p>;
  }
};

const WishForm = ({ submitWish, cancel, working, initialWish }) => {
  const [idea, setIdea] = useState(initialWish ? initialWish.idea : "");
  const [notes, setNotes] = useState(initialWish ? initialWish.notes : "");

  return (
    <WishCardWrapper>
      <Input
        type="text"
        id="idea"
        placeholder="What's your idea?"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        autoFocus
        required
        disabled={working === true}
      />
      <Notes
        id="notes"
        placeholder="Notes, with [links](https://example.com)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={working === true}
      />
      <div style={{ textAlign: "right" }}>
        <Button
          onClick={() => submitWish({ idea, notes })}
          disabled={working === true}
        >
          Submit
        </Button>
        <Button onClick={cancel} disabled={working === true}>
          Cancel
        </Button>
      </div>
    </WishCardWrapper>
  );
};

// Specifies which state transitions are allowed
const reducer = (state, action) => {
  if (state.mode === "viewing") console.assert(!state.working);

  switch (action.type) {
    case "start_new":
      if (state.mode === "viewing") return { mode: "creating", working: false };
      break;
    case "submit_new":
      if (state.mode === "creating" && !state.working)
        return { mode: "creating", working: true, newWish: action.newWish };
      break;
    case "start_edit":
      if (state.mode === "viewing" && !state.working)
        return { mode: "editing", working: false, wishKey: action.wishKey };
      break;
    case "submit_edit":
      if (
        state.mode === "editing" &&
        action.wishKey === state.wishKey &&
        !state.working
      )
        return {
          mode: "editing",
          working: true,
          wishKey: action.wishKey,
          updatedWish: action.updatedWish,
        };
      break;
    case "delete":
      if (state.mode === "viewing" && !state.working)
        return { mode: "deleting", working: true, wishKey: action.wishKey };
      break;
    case "reset":
      return { mode: "viewing", working: false };
    default:
      return { ...state };
  }
  return { ...state };
};

const WishRecipes = () => {
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );
  // TODO: have App provide just wishes?
  const [wishes, setWishes] = useState({});
  const [state, dispatch] = useReducer(reducer, {
    mode: "viewing",
    working: false,
  });

  // Load all posts if userData is present
  useEffect(() => {
    if (!loadingUser && !loadingUserData && userData && userData.wishRecipes) {
      setWishes(userData.wishRecipes);
    }
  }, [loadingUser, userData, loadingUserData]);

  useEffect(() => {
    if (state.working) {
      const dbRef = getFirebase()
        .database()
        .ref(`/users/${user.uid}/data/wishRecipes/`);

      if (state.mode === "creating") {
        // push a new wish
        dbRef
          .push(state.newWish)
          .then(() => dispatch({ type: "reset" }))
          .catch((err) => console.log("create wish error: ", err));
      } else if (state.mode === "editing") {
        // update a wish
        dbRef
          .child(state.wishKey)
          .set(state.updatedWish) // or update()
          .then(() => dispatch({ type: "reset" }))
          .catch((err) => console.log("update wish error: ", err));
      } else if (state.mode === "deleting") {
        dbRef
          .child(state.wishKey)
          .remove()
          .then(() => dispatch({ type: "reset" }))
          .catch((err) => console.log("delete wish error: ", err));
      }
    }
  }, [state, user]);

  // User auth and data loading underway
  if (loadingUser || loadingUserData) {
    return <h1>Loading...</h1>;
  }

  // User auth completed, but use not logged in
  if (!user) {
    return <Redirect to="/" />;
  }

  // Allow children to dispatch certain actions
  const startNew = () => dispatch({ type: "start_new" });
  const submitWish = (newWish) => dispatch({ type: "submit_new", newWish });
  const startEdit = (wishKey) => dispatch({ type: "start_edit", wishKey });
  const submitEdit = (wishKey, updatedWish) =>
    dispatch({ type: "submit_edit", wishKey, updatedWish });
  const deleteWish = (wishKey) => dispatch({ type: "delete", wishKey });
  const cancel = () => dispatch({ type: "reset" });

  // Tells cards which wish is being edited
  const beingEdited = (wishKey) =>
    state.mode === "editing" && state.wishKey === wishKey;

  const WishCreator = () =>
    state.mode === "creating" && (
      <WishForm
        submitWish={submitWish}
        cancel={cancel}
        working={state.working}
      />
    );

  return (
    <>
      <WishlistHeader>
        <h1>Your recipe wish list</h1>
        <Button onClick={startNew} disabled={state.mode !== "viewing"}>
          Add wish
        </Button>
      </WishlistHeader>
      <WishCreator />
      <WishCards
        wishes={wishes}
        viewing={state.mode === "viewing"}
        beingEdited={beingEdited}
        startEdit={startEdit}
        submitEdit={submitEdit}
        deleteWish={deleteWish}
        cancel={cancel}
        working={state.working}
      />
    </>
  );
};

export default WishRecipes;
