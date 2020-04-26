import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import Signin from "./pages/signin";
import Create from "./pages/create";
import ImageUploader from "./pages/image-uploader";
import NoMatch from "./pages/no-match";
import ImageTest from "./pages/image-test";
import RecipePost from "./recipes/recipe-post";
import Editor from "./pages/editor";
import styled from "styled-components";
import Button from "./general/button-primary";
import MutedText from "./general/muted-text";

export const CounterContext = createContext({ count: 0 });

const NavWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  background-color: #ebcb0c;
  padding: 20px 0;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 900px;
`;

const MainContent = styled.main`
  max-width: 900px;
  margin: 20px auto;
  width: 100%;
  background-color: white;
  padding: 20px;
`;

const App = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return (
    <CounterContext.Provider value={{ count, increment }}>
      <Router>
        <NavWrapper>
          <NavBar id="nav-bars">
            <Link to="/">
              <h2>Tasty Base</h2>
              <MutedText text="An Adam&Laura© website" />
            </Link>
            <Link to="/create">
              <Button text="Create a post" />
            </Link>
            <Link to="/log-in">
              <Button text="Login" />
            </Link>
            <div>
              <CounterContext.Consumer>
                {(value) => {
                  return <p>Count in App: {value.count}</p>;
                }}
              </CounterContext.Consumer>
            </div>
          </NavBar>
        </NavWrapper>
        <MainContent>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/log-in" component={Signin} />
            <Route path="/create" component={Create} />
            <Route path="/image-uploader" component={ImageUploader} />
            <Route path="/404" component={NoMatch} />
            <Route path="/get-image" component={ImageTest} />
            <Route path="/recipes/:slug" component={RecipePost} />
            <Route path="/editor" component={Editor} />
          </Switch>
        </MainContent>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;
