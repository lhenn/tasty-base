import React from "react";
import styled from "styled-components";

const Circle = styled.div`
  margin: 1.5px;
  height: 16px;
  width: 16px;
  background: ${(props) => props.color};
  border-radius: 50%;
`;

const DotMask = styled.div`
  position: relative;
  top: 0;
  left: ${({ percentVisible }) => `${percentVisible}%`};
  width: ${({ percentVisible }) => `${100 - percentVisible}%`};
  height: 100%;
  background: rgba(255, 255, 255, 0.65);
`;

const ShadedDot = ({ color, percentVisible = 100 }) => (
  <Circle color={color}>
    <DotMask percentVisible={percentVisible}></DotMask>
  </Circle>
);

export default ShadedDot
