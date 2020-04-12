import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import {getFirebase} from "../firebase";

const Post = ({match}) => {
    const slug = match.params.slug;
    // const postSlugs = ["my-first-blog-post", "my-second-blog-post"];
    const [loading, setLoading] = useState(true);
    const [currentPost, setCurrentPost] = useState();

    if (loading && !currentPost) {
        getFirebase()
            .database()
            .ref()
            .child(`posts/${slug}`)  // ` used for interpolating
            .once("value")
            .then(snapshot => {
                if (snapshot.val()) {
                    setCurrentPost(snapshot.val());
                }
                setLoading(false);
            });
    }

    if (loading) {
        return <h1>Loading...</h1>;
    }

    // Loading is done and post wasn't found in the database
    if (!currentPost) {
        return <Redirect to="/404" />;
    }

    return (
        <>
            <img src={currentPost.coverImage} alt={currentPost.coverImageAlt} />
            <h1>{currentPost.title}</h1>
            <em>{currentPost.datePretty}</em>
            <p dangerouslySetInnerHTML={{__html: currentPost.content}}></p>
        </>
    );
};

export default Post;
