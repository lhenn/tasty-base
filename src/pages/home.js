import React, { useState } from "react";
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

const Home = ({ loadingPosts, posts, fetchPosts }) => {
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
      {posts.map(({ slug, post }) => (
        <RecipePreview key={slug} post={post} slug={slug} />
      ))}
    </>
  );
};

export default Home;
