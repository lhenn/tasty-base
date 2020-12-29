import React, { useRef } from "react";
import styled from "styled-components";
import { defaultTransparent } from "../../styling";

export const DisplayCoverImage = styled.img`
  height: 400px;
  width: 100%;
  object-fit: cover;
`;

export const CardCoverImage = styled.img`
  height: 250px;
  width: 100%;
  object-fit: cover;
`;

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("${(props) => props.src}"),
    url("https://via.placeholder.com/1000x400?text=Click+to+add+cover+image");
  background-repeat: no-repeat;
  background-size: cover;
  height: 400px;
  z-index: 0;
  margin: 12px 0;
  &:focus-within {
    background: linear-gradient(
        rgba(255, 255, 255, ${defaultTransparent}),
        rgba(255, 255, 255, ${defaultTransparent})
      ),
      url(${(props) => props.src});
    background-repeat: no-repeat;
    background-size: cover;
  }
`;

const StyledCoverImageInput = styled.input`
  margin: 0 auto;
  opacity: 0;
  z-index: 1;
  width: 80%;
  &:invalid {
    opacity: 1;
  }
  ${StyledWrapper}:focus-within & {
    opacity: 1;
  }
`;

export const CoverImageEditor = ({ src, set }) => {
  const inputRef = useRef();
  return (
    <StyledWrapper
      role="img"
      src={src}
      alt="cover image"
      onClick={() => inputRef.current.focus()}
    >
      <StyledCoverImageInput
        id="cover-image-url-input"
        type="url"
        ref={inputRef}
        placeholder="Cover image URL"
        value={src}
        onChange={(e) => set(e.target.value)}
      />
    </StyledWrapper>
  );
};
