import React from "react";
import {connect} from "react-redux";
import {BrowserRouter as Link} from "react-router-dom";
import styled from "styled-components";
import {CounterContext} from "../App";
import Button from "./button-primary";
import MutedText from "./muted-text";

const NavWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  background-color: #ebcb0c;
  padding: 20px 0;
`;
const NavInner = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 900px;
`;

const NavBar = (props) => {
  console.log("according to the store, we are: ", props.user);

  return (
    <NavWrapper>
      <NavInner id="nav-bars">
        <Link to="/">
          <h2>Tasty Base</h2>
          <MutedText text="An Adam&Laura© website" />
        </Link>
        <Link to="/create">
          <Button text="Create a post" />
        </Link>
        <Link to="/signin">
          <Button text="Sign in" />
        </Link>
        <div>
          <CounterContext.Consumer>
            {(value) => {
              return <p>Count in App: {value.count}</p>;
            }}
          </CounterContext.Consumer>
        </div>
      </NavInner>
    </NavWrapper>
  );
};
const mapStateToProps = (state) => {
  const user = state.userDataReducer;
  console.log("STATE", state);
  return user;
};

export default connect(mapStateToProps)(NavBar);

