import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import "./App.css";
import styled from "styled-components";
import NavBar from "./general/navbar";
import Home from "./pages/home";
import Signin from './pages/signin'
import Create from "./pages/create";
import NoMatch from "./pages/no-match";
import RecipePost from "./recipes/recipe-post";
import Editor from "./pages/editor";

const MainContent = styled.main`
    max-width:900px;
    margin: 20px auto;
    width:100%;
    background-color:white;
    padding:20px;
`;

const App = () => {
    return (
        <Router>
          <NavBar/>
            <MainContent>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path = "/signin" component={Signin} />
                    <Route path="/create" component={Create} />
                    <Route path="/404" component={NoMatch} />
                    <Route path="/recipes/:slug" component={RecipePost} />
                    <Route path="/editor" component={Editor} />
                </Switch>
            </MainContent>
        </Router>
    );
}

export default App;
