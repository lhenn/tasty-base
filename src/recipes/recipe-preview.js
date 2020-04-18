import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import OverviewDiv from './overview.js';



const StyledCard = styled.div`
    margin-top: 24px;
    border:solid 1px black;
`;
const StyledImg = styled.img`
    height:300px;
    width:100%;
    object-fit:cover;
`;
const CardContent = styled.div`
  padding: 16px;
 

`;

const RecipePreview = (props) => {
  const {post} = props;
     
    return (
        
        <StyledCard key={post.slug} className="card">
                    <StyledImg src={post.coverImage} alt={post.coverImageAlt} />
                    <CardContent>
                        <h2>
                            {post.title} &mdash;{" "}
                            <span style={{ color: "#5e5e5e" }}>{post.datePretty}</span>
                        </h2>
                        <OverviewDiv post={post}/>
                        <br></br>
                        <Link to={`/recipes/${post.slug}`}>Continue reading...</Link>
                    </CardContent>
                </StyledCard> 
     
    );
}

export default RecipePreview;
