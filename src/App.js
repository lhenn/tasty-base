import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import NavBar from "./general/navbar";
import Create from "./pages/create";
import Editor from "./pages/editor";
import Home from "./pages/home";
import NoMatch from "./pages/no-match";
import Signin from "./pages/signin";
import RecipePost from "./recipes/recipe-post";

const MainContent = styled.main`
  max-width: 900px;
  margin: 20px auto;
  width: 100%;
  background-color: white;
  padding: 20px;
`;

export const CounterContext = createContext({ count: 0 });

const App = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return (
    <CounterContext.Provider value={{ count, increment }}>
      <Router>
        <NavBar />
        <MainContent>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signin" component={Signin} />
            <Route path="/create" component={Create} />
            <Route path="/404" component={NoMatch} />
            <Route path="/recipes/:slug" component={RecipePost} />
            <Route path="/editor" component={Editor} />
          </Switch>
        </MainContent>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;
