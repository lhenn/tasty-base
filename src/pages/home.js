import React, { memo, useState } from "react";
import Columns from "../general/columns";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SortByContainer = styled.div`
  display: flex;
  align-items: center;
`;


// Sort button labels and corresponding arguments for updatePosts
const sorts = {
  newest: ["timestamp", "reverse"],
  tastiest: ["tastiness", "reverse"],
  easiest: ["easiness", "reverse"],
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
        <h1>Home</h1>
        <SortByContainer>
          <span>Sort by: </span>
          <DropdownButton title={sortBy}>{sortButtons}</DropdownButton>
        </SortByContainer>
      </HeaderWrapper>
      {postContent}
    </>
  );
});

export default Home;
