import React, { memo, useState } from "react";
import { useBreakpoint } from "../breakpoint-hooks";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import styled from "styled-components";
import RecipePreview from "../recipes/recipe-preview";
import { getLayoutSize, SMALL, MEDIUM, LARGE } from "../App";

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
  justify-content: center;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
`;

// Sort button labels and corresponding arguments for updatePosts
const sorts = {
  newest: ["timestamp", "reverse"],
  tastiest: ["tastiness", "reverse"],
  easiest: ["easiness", "reverse"],
};

// Column layout for (sorted) posts
const Columns = ({ posts }) => {
  const matches = useBreakpoint();

  // Media query
  const layoutSize = getLayoutSize(matches);
  const numCols =
    layoutSize === SMALL
      ? 1
      : layoutSize === MEDIUM
      ? 2
      : layoutSize === LARGE
      ? 3
      : console.log("invalid layout size");

  // Split up posts for each column. NOTE: using Array(...).fill([]) gives an
  // array where all elements reference the same initially empty array...
  const postsByCol = [...Array(numCols)].map(() => []);
  posts.forEach((post, index) => postsByCol[index % numCols].push(post));

  return postsByCol.map((col, i) => (
    <Column key={`col ${i} of ${numCols}`}>
      {col.map((post) => (
        <RecipePreview key={post.slug} post={post} />
      ))}
    </Column>
  ));
};

const Home = memo(({ loadingPosts, posts, updatePosts }) => {
  const [sortBy, setSortBy] = useState("newest");

  // Fetch sorted data if not busy loading posts. Currently we could do sorting
  // on front end, but that won't scale when we have more posts.
  const fetchSortedPosts = (newSortBy) => {
    if (!loadingPosts) {
      updatePosts(...sorts[newSortBy]);
      setSortBy(newSortBy); // update the dropdown
    }
  };

  const sortButtons = Object.keys(sorts)
    .filter((sb) => sb !== sortBy)
    .map((sb) => (
      <Dropdown.Item key={sb} onClick={() => fetchSortedPosts(sb)}>
        {sb}
      </Dropdown.Item>
    ));

  const postContent = loadingPosts ? (
    <h1>Loading posts...</h1>
  ) : (
    <Columns posts={posts} />
  );

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
      <PostsContainer>{postContent}</PostsContainer>
    </>
  );
});

export default Home;
