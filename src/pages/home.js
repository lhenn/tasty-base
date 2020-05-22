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
`;

const Column = styled.div``;

const Home = ({ loadingPosts, posts, fetchPosts }) => {
  const [sortBy, setSortBy] = useState("newest");

  const breakpoints = useBreakpoint();

  if (loadingPosts) {
    return <h1>Loading...</h1>;
  }

  // Sort button labels and corresponding arguments for fetchPosts
  const sorts = {
    newest: ["timestamp", "reverse"],
    tastiest: ["tastiness", "reverse"],
    easiest: ["easiness", "reverse"],
  };

  // Fetch sorted data. Currently we could do sorting on front end, but that
  // won't scale when we have more posts.
  const sort = (newSortBy) => {
    fetchPosts(...sorts[newSortBy]);
    setSortBy(newSortBy); // update the dropdown
  };

  const sortButtons = Object.keys(sorts)
    .filter((s) => s !== sortBy)
    .map((s) => (
      <Dropdown.Item key={s} onClick={() => sort(s)}>
        {s}
      </Dropdown.Item>
    ));

  // Media query
  let numCols;
  if (!breakpoints.small && !breakpoints.medium) numCols = 3;
  else if (!breakpoints.small && breakpoints.medium) numCols = 2;
  else numCols = 1;

  // Split up posts for each column. NOTE: using Array(...).fill([]) gives an
  // array where all elements reference the same initially empty array...
  const postsByCol = [...Array(numCols)].map(() => []);
  posts.forEach((post, index) => postsByCol[index % numCols].push(post));

  const columns = postsByCol.map((col, i) => (
    <Column key={`col ${i} of ${numCols}`}>
      {col.map(({ slug, post }) => (
        <RecipePreview key={slug} post={post} slug={slug} />
      ))}
    </Column>
  ));

  // Slugs are unique and can thus be used as keys
  return (
    <>
      <HeaderWrapper>
        <h1>Recipes</h1>
        <SortByContainer>
          <span>Sort by: </span>
          <DropdownButton title={sortBy}>{sortButtons}</DropdownButton>
        </SortByContainer>
      </HeaderWrapper>
      <PostsContainer>{columns}</PostsContainer>
    </>
  );
};

export default Home;
