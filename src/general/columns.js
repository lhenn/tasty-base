import React from "react";
import { useBreakpoint } from "../breakpoint-hooks";
import { getLayoutSize, SMALL, MEDIUM, LARGE } from "../App";
import styled from "styled-components";
import RecipePreview from "../recipes/recipe-preview";

const ColumnsContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
`;
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

  return (
    <ColumnsContainer>
      {postsByCol.map((col, i) => (
        <Column key={`col ${i} of ${numCols}`}>
          {col.map((post) => (
            <RecipePreview key={post.slug} post={post} />
          ))}
        </Column>
      ))}
    </ColumnsContainer>
  );
};

export default Columns;
