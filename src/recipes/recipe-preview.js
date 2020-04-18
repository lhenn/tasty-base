import React from "react";
import { Link } from "react-router-dom";



/* */
const RecipePreview = (props) => {
     console.log('the props: ', props);
    // console.log('props.props.post',props.post)
     
    return (
        
        <div key={props.post.slug} className="card">
                    <img src={props.post.coverImage} alt={props.post.coverImageAlt} />
                    <div className="card-content">
                        <h2>
                            {props.post.title} &mdash;{" "}
                            <span style={{ color: "#5e5e5e" }}>{props.post.datePretty}</span>
                        </h2>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: `${props.post.content.substring(0, 200)}...`
                            }}
                        ></p>
                        <Link to={`/recipes/${props.post.slug}`}>Continue reading...</Link>
                    </div>
                </div> 
     
    );
}

export default RecipePreview;
