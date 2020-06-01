import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../App";
import { fetchPosts } from "../firebase";
import {
  HeaderWrapper,
  PageTitle,
  PageViewOptions,
  SearchField,
} from "../general/page-header";
import Columns from "../general/columns";
import useCancellablePromises from "../promise-hooks";
import { FilterButton } from "../general/buttons";
import { yellowBase, greenBase, redOrangeBase, lavendarBase } from "../styling";

const Filter = () => {};

const MyList = () => {
  const [{ posts, loadingPosts }, setPosts] = useState({
    posts: [],
    loadingPosts: false,
  });
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );
  const { addPromise } = useCancellablePromises();
  const [activeFilters, setActiveFilters] = useState(["check", "star"]);

  // Load all posts if userData is present
  useEffect(() => {
    if (!loadingUserData && userData?.myListRecipes) {
      setPosts({ posts: [], loadingPosts: true });
      // Values are timestamps
      addPromise(fetchPosts(Object.keys(userData.myListRecipes))).then(
        (myListPosts) => {
          setPosts({ posts: myListPosts, loadingPosts: false });
        },
        (err) => console.log("Stars: fetchPosts failed: ", err)
      );
    }
  }, [userData, loadingUserData, addPromise]);

  // User auth completed and failed
  if (!loadingUser && !loadingUserData && !user) {
    return <Redirect to="/" />;
  }

  const postsContent =
    loadingUser || loadingUserData || loadingPosts ? (
      <p>loading...</p>
    ) : (
      <Columns posts={posts} />
    );
  //why isnt' this working??? maybe ahve to do some 'busy' thing like with stars/checks
  console.log("initial activeFilters", activeFilters);
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
        <PageTitle>My List</PageTitle>
        <PageViewOptions>
          <FilterButton
            isActive={activeFilters.includes("check")}
            color={greenBase}
            onClick={(e) => handleFilterClick(e, "check")}
          >
            made
          </FilterButton>
          <FilterButton
            isActive={activeFilters.includes("star")}
            color={yellowBase}
            onClick={(e) => handleFilterClick(e, "star")}
          >
            starred
          </FilterButton>
          <FilterButton color={lavendarBase}>ideas</FilterButton>
          <FilterButton color={redOrangeBase}>contributions</FilterButton>

          <SearchField placeholder="search" />
        </PageViewOptions>
      </HeaderWrapper>

      {postsContent}
    </>
  );
};

export default MyList;
