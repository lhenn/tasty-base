import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import "./App.css";

import Home from "./pages/home";
import Create from "./pages/create";
import Test from "./pages/test";
import Post from "./pages/post";
import NoMatch from "./pages/no-match";

function App() {
    return (
        <Router>
            <nav id="nav-bars">
                <Link to="/">
                    <h2>Tasty Base</h2>
                    <p>An Adam&Laura© website</p>
                </Link>
                <Link to="/create">
                    Create a post
                </Link>
            </nav>
            <main>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/create" component={Create} />
                    <Route path="/test" component={Test} />
                    <Route path="/404" component={NoMatch} />
                    <Route path="/:slug" component={Post} />
                </Switch>
            </main>
        </Router>
    );
}

export default App;
