import {
  faCheck,
  faLightbulb,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../App";
import { fetchPosts } from "../firebase";
import { FilterButton } from "../general/buttons";
import Columns from "../general/columns";
import {
  HeaderWrapper,
  PageTitle,
  PageViewOptions,
} from "../general/page-header";
import useCancellablePromises from "../promise-hooks";
import { greenBase, redOrangeBase, yellowBase } from "../styling";

const FilterIcon = styled(FontAwesomeIcon)`
  color: black;
  font-size: medium;
`;

const MyRecipes = () => {
  const [{ posts, loadingPosts }, setPosts] = useState({
    posts: [],
    loadingPosts: false,
  });
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );
  const { addPromise } = useCancellablePromises();
  const [activeFilters, setActiveFilters] = useState([
    "check",
    "star",
    "contribution",
  ]);

  useEffect(() => {
    if (!loadingUserData && userData?.myListRecipes) {
      console.log("FILTERING");
      setPosts({ posts: [], loadingPosts: true });
      const filteredSlugs = new Set();
      for (let [slug, info] of Object.entries(userData.myListRecipes)) {
        activeFilters.forEach((filter) => {
          if (info.hasOwnProperty(filter)) {
            filteredSlugs.add(slug);
          }
        });
      }
      addPromise(fetchPosts(Array.from(filteredSlugs))).then(
        (myRecipesPosts) => {
          setPosts({ posts: myRecipesPosts, loadingPosts: false });
        },
        (err) => console.log("fetchPosts failed: ", err)
      );
    }
  }, [activeFilters, userData, loadingUserData, addPromise]);

  if (loadingUser) {
    return <p>Loading...</p>;
  } else if (!loadingUser && !user) {
    return <p>Sign in or make an account to start saving recipes.</p>
  } else if (!loadingUser && user && loadingUserData) {
    return <p>Loading...</p>;
  } else if (!loadingUser && !loadingUserData && loadingPosts) {
    return <p>Loading...</p>;
  }

  const handleFilterClick = (e, filterBy) => {
    const newActiveFilters = [...activeFilters];
    activeFilters.includes(filterBy)
      ? newActiveFilters.splice(activeFilters.indexOf(filterBy), 1)
      : newActiveFilters.push(filterBy);
    setActiveFilters(newActiveFilters);
  };

  return (
    <>
      <HeaderWrapper>
        <PageTitle>My Recipes</PageTitle>
        <PageViewOptions>
          <FilterButton
            isActive={activeFilters.includes("check")}
            color={greenBase}
            onClick={(e) => handleFilterClick(e, "check")}
          >
            made <FilterIcon icon={faCheck} />
          </FilterButton>
          <FilterButton
            isActive={activeFilters.includes("star")}
            color={yellowBase}
            onClick={(e) => handleFilterClick(e, "star")}
          >
            starred <FilterIcon icon={faStar} />
          </FilterButton>
          <FilterButton
            isActive={activeFilters.includes("contribution")}
            color={redOrangeBase}
            onClick={(e) => handleFilterClick(e, "contribution")}
          >
            contributions <FilterIcon icon={faLightbulb} />
          </FilterButton>
        </PageViewOptions>
      </HeaderWrapper>

      <Columns posts={posts} />
    </>
  );
};

export default MyRecipes;
