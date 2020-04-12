import React from "react";

const RecipePost = ({ match }) => {
    const slug = match.params.slug;

    return (
        <div className="recipeContainer">
            <p>{slug}</p>
        </div>
    )
}

export default RecipePost;
