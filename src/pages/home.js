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
import Columns from "../general/columns";
import {
  HeaderWrapper,
  PageTitle,
  PageViewOptions,
} from "../general/page-header";
import { greenBase, redBase, yellowBase } from "../styling";
import { useBreakpoint } from "../breakpoint-hooks";
import { getLayoutSize, SMALL, MEDIUM, LARGE } from "../App";

const FilterIcon = styled(FontAwesomeIcon)`
  color: black;
  font-size: medium;
`;

const SortByContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left:20px;
  @media(max-width:850px){
    padding-left:0;
    padding-right:10px;
  }
`;

// Sort button labels and corresponding arguments for updatePosts
const sorts = [
  { label: "newest", attribute: "timestamp" },
  { label: "tastiest", attribute: "taste" },
  { label: "easiest", attribute: "ease" },
];

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

const filters = [
  { label: "all", attribute: null },
  { label: "made", attribute: "check", icon: faCheck, color: greenBase },
  { label: "starred", attribute: "star", icon: faStar, color: yellowBase },
  {
    label: "contributions",
    attribute: "contribution",
    icon: faLightbulb,
    color: redBase,
  },
];

const FilteredAllPlaceholder = ({ attribute }) => {
  if (attribute === "check") {
    return (
      <StyledLeftPaddedDiv>
        {"You haven't made any recipes yet."}
      </StyledLeftPaddedDiv>
    );
  } else if (attribute === "star") {
    return (
      <StyledLeftPaddedDiv>
        {"You haven't starred any recipes yet."}
      </StyledLeftPaddedDiv>
    );
  } else if (attribute === "contribution") {
    return (
      <StyledLeftPaddedDiv>
        {"You haven't contributed any recipes yet."}
      </StyledLeftPaddedDiv>
    );
  }
};

const StyledDropdownButtonDiv = styled.div`
display:flex;
justify-content:space-between;
`;

// Labeled dropdown option list. Requires an array options whose entries have
// key 'label'.
const DropdownOptions = ({ label, options, cur, setCur }) => {
  const buttons = options.map((option) => (
    <Dropdown.Item key={option.label} onClick={() => setCur(option)}>
      <StyledDropdownButtonDiv>
        {option.label}{" "}
        {option.icon && (
          <FontAwesomeIcon icon={option.icon} color={option.color} />
        )}
      </StyledDropdownButtonDiv>
    </Dropdown.Item>
  ));

  return (
    <SortByContainer>
      <span>{label} </span>
      <DropdownButton title={cur.label} id={`${label.split(':')[0].toLowerCase()}-btn`}>{buttons}</DropdownButton>
    </SortByContainer>
  );
};

const Home = memo(({ loadingPosts, posts }) => {
  const [curFilter, setCurFilter] = useState(filters[0]);
  const [curSort, setCurSort] = useState(sorts[0]);
  const { user, loadingUser, userData, loadingUserData } = useContext(
    UserContext
  );
  const matches = useBreakpoint();
  const layoutSize = getLayoutSize(matches);
  console.log('layoutSize: ', layoutSize);

  let content;
  if (loadingPosts || loadingUser || loadingUserData) {
    content = <h1>Loading...</h1>;
  } else {
    if (!user || curFilter.attribute === null) {
      content = <Columns posts={sortPosts(curSort.attribute, posts)} />;
    } else if (!userData || !userData.myListRecipes) {
      content = <FilteredAllPlaceholder attribute={curFilter.attribute} />;
    } else {
      // Find slugs for myListRecipes passing the filter
      const filteredSlugSet = new Set();
      for (let [slug, info] of Object.entries(userData.myListRecipes)) {
        if (info.hasOwnProperty(curFilter.attribute)) {
          filteredSlugSet.add(slug);
        }
      }

      // Grab the corresponding posts
      const filteredPosts = [];
      posts.forEach((post) => {
        if (filteredSlugSet.has(post.slug)) filteredPosts.push(post);
      });

      if (filteredPosts.length === 0) {
        content = <FilteredAllPlaceholder attribute={curFilter.attribute} />;
      } else {
        // Sort the posts
        content = (
          <Columns posts={sortPosts(curSort.attribute, filteredPosts)} />
        );
      }
    }
  }

  // Slugs are unique and can thus be used as keys
  return (
    <>
      <HeaderWrapper>
        {layoutSize !== 'small' && (
          <div>
          <PageTitle>Home</PageTitle>
        </div>
        )}
        <PageViewOptions>
          <DropdownOptions
            label={"Sort:"}
            options={sorts}
            cur={curSort}
            setCur={setCurSort}
          />
          {user && (
            <DropdownOptions
              label={"Filter:"}
              options={filters}
              cur={curFilter}
              setCur={setCurFilter}
            />
          )}
        </PageViewOptions>
      </HeaderWrapper>
      {content}
    </>
  );
});

export default Home;
