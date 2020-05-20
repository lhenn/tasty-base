import React, { useState } from "react";
import {useBreakpoint} from '../App.js';
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import styled from "styled-components";
import RecipePreview from "../recipes/recipe-preview";

//Breakpoints:
//3 columns, min-width: 1350px
//2 columns, min-width: 850px


const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SortByContainer = styled.div`
  display: flex;
  align-items: center;
`;
const PostsContainer = styled.div`
  display: flex;
`;
const Column = styled.div``;

const Home = ({ loadingPosts, posts, fetchPosts }) => {
  const breakpoints = useBreakpoint();

  const matchingList = Object.keys(breakpoints).map(media => (
    <li key={media}>{media} ---- {breakpoints[media] ? 'Yes' : 'No'}</li>
  ));

  console.log(breakpoints);
  let numCols;
  if(!breakpoints.small && !breakpoints.medium) numCols = 3;
  else if(!breakpoints.small && breakpoints.medium) numCols = 2;
  else numCols = 1
  
  const [sortOptions, setSortOptions] = useState([
    { label: "newest", selected: true },
    { label: "tastiest", selected: false },
    { label: "easiest", selected: false },
  ]);

  const labelToFetchOptions = {
    newest: ("timestamp", "reverse"),
    tastiest: ("tastiness", "forward"),
    easiest: ("easiness", "forward"),
  };

  const sort = (label) => {
    // Fetch sorted data. Currently we could do sorting on front end, but that
    // won't scale when we have more posts.
    fetchPosts(labelToFetchOptions[label]);

    // Update the dropdown
    let updatedSortOptions = [...sortOptions];
    updatedSortOptions.forEach((option) => (option.selected = false));
    updatedSortOptions.find((option) => option.label === label).selected = true;
    setSortOptions(updatedSortOptions);
  };


  return (
    <>
      <HeaderWrapper>
        <h1>Recipes</h1>
        <SortByContainer>
          <span>Sort by: </span>
          <DropdownButton
            title={sortOptions.find((option) => option.selected === true).label}
          >
            {sortOptions
              .filter((option) => !option.selected)
              .map((option) => {
                return (
                  <Dropdown.Item
                    key={option.label}
                    onClick={() => sort(option.label)}
                  >
                    {option.label}
                  </Dropdown.Item>
                );
              })}
          </DropdownButton>
        </SortByContainer>
      </HeaderWrapper>
      <PostsContainer>
     <ol>
      {numCols} columns
    </ol>
        <Column>
          {posts
            .filter((post, index) => {
              return index % 2 === 0;
            })
            .map(({ slug, post }) => (
              <RecipePreview key={slug} post={post} slug={slug} />
            ))}
        </Column>
        <Column>
          {posts
            .filter((post, index) => {
              return index % 2 !== 0;
            })
            .map(({ slug, post }) => (
              <RecipePreview key={slug} post={post} slug={slug} />
            ))}
        </Column>
       
      </PostsContainer>
    </>
  );
};

export default Home;
