import React, { useState } from "react";
import { useBreakpoint } from "../App.js";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import styled from "styled-components";
import RecipePreview from "../recipes/recipe-preview";

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
  justify-content:center;
`;
const Column = styled.div`
display:flex;
flex-direction:column;
flex-grow:1;
width:100%;
`;

const Home = ({ loadingPosts, posts, fetchPosts }) => {

  let numCols;
  const breakpoints = useBreakpoint();
  if (!breakpoints.small && !breakpoints.medium) numCols = 3;
  else if (!breakpoints.small && breakpoints.medium) numCols = 2;
  else numCols = 1;

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

  if (loadingPosts) {
    return <h1>Loading...</h1>;
  }

  //split up posts for each column
  let PostsByCol = [[],[],[]];

  posts.forEach((post, index) => {
    if (numCols === 3) {
      if ((index + 1) % 3 === 0) PostsByCol[2].push(post);
      else if ((index + 2) % 3 === 0) PostsByCol[1].push(post);
      else PostsByCol[0].push(post);
    } else if (numCols === 2) {
      (index + 1) % 2 === 0
        ? PostsByCol[1].push(post)
        : PostsByCol[0].push(post);
    } else PostsByCol[0].push(post);
  });

  //add divided posts to column(s)
  let Cols = [];

  for (let i = 0; i < numCols; i++) {
    Cols.push(
      <Column key={i}>
        {PostsByCol[i].map(({ slug, post }) => (
          <RecipePreview key={slug} post={post} slug={slug} />
        ))}
      </Column>
    );
  }

  // slugs are unique and can thus be used as keys
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
        {Cols}
      </PostsContainer>
    </>
  );
};

export default Home;

