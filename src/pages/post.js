import React, { useState }  from "react";
import { Redirect } from "react-router-dom";
import { getFirebase } from "../firebase";

const Post = ({ match }) => {
  
  const [loading, setLoading] = useState(true);
  const [blogPost, setBlogPost] = useState([]);
  
  //get the slug from the path
  const slug = match.params.slug;
  console.log('match', match, 'slug',slug);

  
  //find the right post
  if (loading && !blogPost.length) {
    getFirebase()
      .database()
      .ref("/posts")
      .once("value")
      .then(snapshot => {
        const snapshotVal = snapshot.val();
        console.log('snapshotVal', snapshot.val());
        
        let thisPost;
        for(var key in snapshotVal) {
          if(snapshotVal[key].slug == slug){
            thisPost = snapshotVal[key];
          }
        }
        if(thisPost == undefined) return <Redirect to="/404" />; 
        console.log("this post: ", thisPost);

        setBlogPost(thisPost);
        setLoading(false);
      });
  }
  
  if (loading) {
    return <h1>Loading...</h1>;
  }

  
  return (
    <>
      <h1>{blogPost.title}</h1>
      <h4>{blogPost.datePretty}</h4>
      <img src={blogPost.coverImage} alt={blogPost.coverImageAlt}/>
      <div dangerouslySetInnerHTML={{ __html: blogPost.content}}></div>
      
    </>
  );
};

export default Post;
