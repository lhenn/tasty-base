import React, { useRef } from "react";
import styled from "styled-components";
import { defaultTransparent } from "../../styling";
import { ImageWithPlaceholder } from "../../utils";

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

const CoverImagePlaceholderWrapper = styled.div`
  height: 100px;
  width: 100%;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CoverImagePlaceholder = () => (
  <CoverImagePlaceholderWrapper>
    <p style={{ margin: "0", padding: "0", opacity: defaultTransparent }}>
      No cover image selected
    </p>
  </CoverImagePlaceholderWrapper>
);

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  height: 400px;
  z-index: 0;
  &:focus-within {
    opacity: ${defaultTransparent};
  }
`;

const StyledCoverImageInput = styled.input`
  margin: 0 auto;
  opacity: 0;
  z-index: 1;
  &:invalid {
    opacity: 1;
  }
  ${StyledWrapper}:focus-within & {
    opacity: 1;
  }
`;

// const StyledImageWithPlaceholder = styled(ImageWithPlaceholder)`
//   opacity: 1;
//   ${StyledWrapper}:focus-within & {
//     opacity: ${defaultTransparent};
//   }
// `;

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
      {/*<StyledImageWithPlaceholder
        src={src}
        alt="cover image"
        Image={DisplayCoverImage}
        Placeholder={CoverImagePlaceholder}
        onClick={() => inputRef.current.focus()}
      />*/}
    </StyledWrapper>
  );
};
