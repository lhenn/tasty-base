import {
  faCheck,
  faLightbulb,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { UserContext } from "../App";
import { FilterButton } from "../general/buttons";
import Columns from "../general/columns";
import {
  HeaderWrapper,
  PageTitle,
  PageViewOptions,
} from "../general/page-header";
import { greenBase, redOrangeBase, yellowBase } from "../styling";

const FilterIcon = styled(FontAwesomeIcon)`
  color: black;
  font-size: medium;
`;

const MyRecipes = ({ posts, loadingPosts }) => {
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );

  const [activeFilters, setActiveFilters] = useState([
    "check",
    "star",
    "contribution",
  ]);

  if (loadingUser) {
    return <p>Loading...</p>;
  } else if (!loadingUser && !user) {
    return <p>Sign in or make an account to start saving recipes.</p>;
  }

  // Update set of active filters
  const handleFilterClick = (filterBy) => {
    const newActiveFilters = [...activeFilters];
    activeFilters.includes(filterBy)
      ? newActiveFilters.splice(activeFilters.indexOf(filterBy), 1)
      : newActiveFilters.push(filterBy);
    setActiveFilters(newActiveFilters);
  };

  let content;
  if (loadingUserData || loadingPosts) {
    content = <p>Loading...</p>;
  } else if (!userData?.myListRecipes) {
    content = (
      <p style={{ textAlign: "center" }}>
        {"You have no recipes in your list yet."}
      </p>
    );
  } else {
    // Apply active filters to posts
    const filteredSlugSet = new Set();
    for (let [slug, info] of Object.entries(userData.myListRecipes)) {
      activeFilters.forEach((filter) => {
        if (info.hasOwnProperty(filter)) {
          filteredSlugSet.add(slug);
        }
      });
    }

    const filteredPosts = [];
    posts.forEach((post) => {
      if (filteredSlugSet.has(post.slug)) filteredPosts.push(post);
    });

    content = <Columns posts={filteredPosts} />;
  }

  return (
    <>
      <HeaderWrapper>
        <PageTitle>My Recipes</PageTitle>
        <PageViewOptions>
          <FilterButton
            isActive={activeFilters.includes("check")}
            color={greenBase}
            onClick={() => handleFilterClick("check")}
          >
            made <FilterIcon icon={faCheck} />
          </FilterButton>
          <FilterButton
            isActive={activeFilters.includes("star")}
            color={yellowBase}
            onClick={() => handleFilterClick("star")}
          >
            starred <FilterIcon icon={faStar} />
          </FilterButton>
          <FilterButton
            isActive={activeFilters.includes("contribution")}
            color={redOrangeBase}
            onClick={() => handleFilterClick("contribution")}
          >
            contributions <FilterIcon icon={faLightbulb} />
          </FilterButton>
        </PageViewOptions>
      </HeaderWrapper>

      {content}
    </>
  );
};

export default MyRecipes;
