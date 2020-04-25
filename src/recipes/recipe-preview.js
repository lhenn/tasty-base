import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import OverviewDiv from './overview.js';
import Ratings from './ratings.js';
import HighlightedTitle from '../general/highlight';

const StyledCard = styled.div`
    margin-top: 24px;
    box-shadow: 2px 2px 5px -1px rgba(0,0,0,0.38);
`;
const StyledImg = styled.img`
    height:300px;
    width:100%;
    object-fit:cover;
`;
const CardContent = styled.div`
  padding: 16px;
`;
const Row1 = styled.div`
    display:flex;
    justify-content:space-between;
    align-items:center;
`;
const Date = styled.span`
    font-size:16px;
`;
const H1 = styled.h1`
    font-size:48px;
    font-family: "Playfair Display", serif;
`;

const RecipePreview = (props) => {
  const {post} = props;
     
    return (
        
        <StyledCard key={post.slug} className="card">
                    <StyledImg src={post.coverImage} alt={post.coverImageAlt} />
                    <CardContent>
                        <Row1>
                        <h1>
                            <HighlightedTitle text={post.title} /> 
                            <Date> {post.datePretty}</Date>
                        </h1>
                        <Ratings post={post}/>
                        </Row1>
                        
                        <OverviewDiv post={post}/>
                        <br></br>
                        <Link to={`/recipes/${post.slug}`}>Continue reading...</Link>
                    </CardContent>
                </StyledCard> 
     
    );
}

export default RecipePreview;
