import React, { useEffect, memo, useState } from "react";
import Columns from "../general/columns";
import {
  HeaderWrapper,
  PageTitle,
  PageViewOptions
} from "../general/page-header";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import styled from "styled-components";

const SortByContainer = styled.div`
  display: flex;
  align-items: center;
`;

// Sort button labels and corresponding arguments for updatePosts
const sorts = {
  newest: ["timestamp", "reverse"],
  tastiest: ["taste", "reverse"],
  easiest: ["ease", "reverse"],
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

  useEffect(() => fetchSortedPosts(sortBy), [])

  // Slugs are unique and can thus be used as keys
  return (
    <>
      <HeaderWrapper>
        <PageTitle>Home</PageTitle>
        <PageViewOptions>
          <SortByContainer>
            <span>Sort by: </span>
            <DropdownButton title={sortBy}>{sortButtons}</DropdownButton>
          </SortByContainer>
        </PageViewOptions>
      </HeaderWrapper>
      {postContent}
    </>
  );
});

export default Home;
