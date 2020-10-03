import {
  faCheck,
  faLightbulb,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { memo, useContext, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
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

const SortByContainer = styled.div`
  display: flex;
  align-items: center;
`;

// Sort button labels and corresponding arguments for updatePosts
const sorts = { newest: "timestamp", tastiest: "taste", easiest: "ease" };

const sortPosts = (sortBy, posts) => {
  // Extract values to sort on
  let sortVals = Array.from(Array(posts.length).keys());
  if (sortBy === "taste" || sortBy === "ease") {
    const ratings = posts.map((p) => {
      const entries = p.content[sortBy];
      if (entries) return Object.values(entries).map((entry) => entry.rating);
      else return [0.0];
    });
    sortVals = ratings.map(
      (rs) => rs.reduce((prev, cur) => prev + cur, 0) / rs.length
    );
  } else if (sortBy === "timestamp") {
    sortVals = posts.map((p) => p.content.timestamp);
  }

  // Find order of indices that sorts sortVals
  const idxs = Array.from(Array(posts.length).keys());
  const sortIdxs = idxs.sort((a, b) =>
    sortVals[a] < sortVals[b] ? -1 : (sortVals[b] < sortVals[a]) | 0
  );

  if (sortBy === "timestamp") return sortIdxs.map((i) => posts[i]);
  else return sortIdxs.map((i) => posts[i]).reverse();
};

const StyledLeftPaddedDiv = styled.div`
  padding-left: 10px;
`;

const Filters = ({ filter, setFilter }) => {
  return (
    <div>
      <FilterButton
        isActive={filter === "all"}
        color={greenBase}
        onClick={() => setFilter("all")}
      >
        {"all"}
      </FilterButton>
      <FilterButton
        isActive={filter === "check"}
        color={greenBase}
        onClick={() => setFilter("check")}
      >
        {"made"} <FilterIcon icon={faCheck} />
      </FilterButton>
      <FilterButton
        isActive={filter === "star"}
        color={yellowBase}
        onClick={() => setFilter("star")}
      >
        {"starred"} <FilterIcon icon={faStar} />
      </FilterButton>
      <FilterButton
        isActive={filter === "contributions"}
        color={redOrangeBase}
        onClick={() => setFilter("contributions")}
      >
        {"contributions"} <FilterIcon icon={faLightbulb} />
      </FilterButton>
    </div>
  );
};

const FilteredAllPlaceholder = ({ filter }) => {
  if (filter === "check") {
    return (
      <StyledLeftPaddedDiv>
        {"You haven't made any recipes yet."}
      </StyledLeftPaddedDiv>
    );
  } else if (filter === "star") {
    return (
      <StyledLeftPaddedDiv>
        {"You haven't starred any recipes yet."}
      </StyledLeftPaddedDiv>
    );
  } else if (filter === "contributions") {
    return (
      <StyledLeftPaddedDiv>
        {"You haven't contributed any recipes yet."}
      </StyledLeftPaddedDiv>
    );
  }
};

const Home = memo(({ loadingPosts, posts }) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );

  const sortButtons = Object.entries(sorts)
    .filter((sort) => sort[0] !== sortBy)
    .map(([label, sb]) => (
      <Dropdown.Item key={sb} onClick={() => setSortBy(sb)}>
        {label}
      </Dropdown.Item>
    ));

  let content;
  if (loadingPosts || loadingUser || loadingUserData) {
    content = <h1>Loading...</h1>;
  } else {
    if (!user || filter === "all") {
      content = <Columns posts={sortPosts(sortBy, posts)} />;
    } else if (!userData || !userData.myListRecipes) {
      content = <FilteredAllPlaceholder filter={filter} />;
    } else {
      // Find slugs for myListRecipes passing the filter
      const filteredSlugSet = new Set();
      for (let [slug, info] of Object.entries(userData.myListRecipes)) {
        if (info.hasOwnProperty(filter)) {
          filteredSlugSet.add(slug);
        }
      }

      // Grab the corresponding posts
      const filteredPosts = [];
      posts.forEach((post) => {
        if (filteredSlugSet.has(post.slug)) filteredPosts.push(post);
      });

      if (filteredPosts.length === 0) {
        content = <FilteredAllPlaceholder filter={filter} />;
      } else {
        // Sort the posts
        content = <Columns posts={sortPosts(sortBy, filteredPosts)} />;
      }
    }
  }

  // Slugs are unique and can thus be used as keys
  return (
    <>
      <HeaderWrapper>
        <PageTitle>Home</PageTitle>
        {user && <Filters filter={filter} setFilter={setFilter} />}
        <PageViewOptions>
          <SortByContainer>
            <span>Sort by: </span>
            <DropdownButton title={sortBy}>{sortButtons}</DropdownButton>
          </SortByContainer>
        </PageViewOptions>
      </HeaderWrapper>
      {content}
    </>
  );
});

export default Home;
