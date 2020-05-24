import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import React, { useState } from "react";
import styled from "styled-components";
import RecipePreview from "../recipes/recipe-preview";

const StyledTooltipText = styled.p`
  color: #ffffff;
  margin: 0;
  padding: 0;
`;

const StyledTooltip = styled.div`
  background: #181818;
  padding: 10px 15px;
  display: inline-block;
`;

const Tooltip = ({ post: { content } }) => {
  return (
    <StyledTooltip>
      <StyledTooltipText>
        <strong>{content.title}</strong>
        <br />
        {`Ease: ${content.easiness}`}
        <br />
        {`Taste: ${content.tastiness}`}
      </StyledTooltipText>
    </StyledTooltip>
  );
};

const jitter = (x, amount = 0.3, xMin = 1, xMax = 10, step = 1) => {
  if (xMax - x > 0.5 * step && x - xMin > 0.5 * step) {
    return x + amount * step * (Math.random() - 0.5);
  } else if (x - xMin < 0.5 * step) {
    return x + 0.5 * amount * step * Math.random();
  } else {
    return x - 0.5 * amount * step * Math.random();
  }
};

const Scatterplot = React.memo(({ posts, setPreviewIndex }) => {
  const data = Object.values(posts).map(({ slug, content }) => {
    const x = jitter(content.easiness);
    const y = jitter(content.tastiness);
    return { id: slug, data: [{ x, y }] };
  });

  return (
    <div style={{ height: 500, width: "70%" }}>
      <ResponsiveScatterPlot
        data={data}
        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
        xScale={{ type: "linear", min: 1, max: 10 }}
        yScale={{ type: "linear", min: 1, max: 10 }}
        axisBottom={{
          orient: "bottom",
          legend: "Ease",
          legendPosition: "middle",
          legendOffset: 60,
        }}
        axisLeft={{
          orient: "bottom",
          legend: "Taste",
          legendPosition: "middle",
          legendOffset: -60,
        }}
        animate={false}
        blendMode={"multiply"}
        onClick={(node) => setPreviewIndex(node.index)}
        tooltip={({ node }) => <Tooltip post={posts[node.index]} />}
      />
    </div>
  );
});

// Make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
const Graph = ({ posts, loadingPosts }) => {
  const [previewIndex, setPreviewIndex] = useState(null);

  if (loadingPosts || !posts) {
    return <h1>Loading posts...</h1>;
  }

  return (
    <div style={{ display: "flex" }}>
      <Scatterplot posts={posts} setPreviewIndex={setPreviewIndex} />
      {previewIndex !== null && (
        <div style={{ width: "30%" }}>
          <RecipePreview post={posts[previewIndex]} />
        </div>
      )}
    </div>
  );
};

export default Graph;
