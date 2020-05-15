import React, { useState } from "react";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
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

const Tooltip = ({ post }) => {
  return (
    <StyledTooltip>
      <StyledTooltipText>
        <strong>{post.post.title}</strong>
        <br />
        {`Ease: ${post.post.easiness}`}
        <br />
        {`Taste: ${post.post.tastiness}`}
      </StyledTooltipText>
    </StyledTooltip>
  );
};

const jitter = (x, amount = 0.3, xMin = 0, xMax = 100, step = 10) => {
  if (xMax - x > 0.5 * step && x - xMin > 0.5 * step) {
    return x + amount * step * (Math.random() - 0.5);
  } else if (x - xMin < 0.5 * step) {
    return x + 0.5 * amount * step * Math.random();
  } else {
    return x - 0.5 * amount * step * Math.random();
  }
};

// Make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
const Graph = ({ posts, loadingPosts }) => {
  const [previewing, setPreviewing] = useState(null);

  if (loadingPosts) {
    return <h1>Loading posts...</h1>;
  }

  const data = [
    {
      id: "recipes",
      data: Object.values(posts).map((p) => {
        const x = jitter(p.post.easiness * 10);
        const y = jitter(p.post.tastiness * 10);
        return { x, y };
      }),
    },
  ];

  const onClick = (node) => {
    console.log(posts[node.index]);
    if (!previewing) {
      setPreviewing(posts[node.index]);
    } else {
      setPreviewing(null);
    }
  };

  return (
    <div style={{ display: "flex"}}>
      <div style={{ height: 500,  width:'70%' }}>
        <ResponsiveScatterPlot
          data={data}
          margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
          xScale={{ type: "linear", min: 0, max: 100 }}
          yScale={{ type: "linear", min: 0, max: 100 }}
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
          onClick={onClick}
          tooltip={({ node }) => <Tooltip post={posts[node.index]} />}
        />
      </div>
      {previewing && (
        <RecipePreview post={previewing.post} slug={previewing.slug} />
      )}
    </div>
  );
};

export default Graph;
