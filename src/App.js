import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import "./App.css";

import Home from "./pages/home";
import Create from "./pages/create";
import ImageUploader from "./pages/image-uploader";
import Post from "./pages/post";
import NoMatch from "./pages/no-match";
import ImageTest from "./pages/image-test";
import RecipePost from "./pages/recipe-post";
import Editor from "./pages/editor";

// BUG: home not working!!!
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
                    <Route path="/image-uploader" component={ImageUploader} />
                    <Route path="/404" component={NoMatch} />
                    <Route path="/get-image" component={ImageTest} />
                    <Route path="/recipes/:slug" component={RecipePost} />
                    <Route path="/editor" component={Editor} />
                    <Route path="/:slug" component={Post} />
                </Switch>
            </main>
        </Router>
    );
}

export default App;
