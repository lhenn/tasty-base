import React, { useState } from "react";
import styled from "styled-components";
import { defaultTransparent } from "../../styling";
import { ImageWithPlaceholder } from "../../utils";
import ClickToOpen from "../click-to-open";

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

const TransparentCoverImage = styled(DisplayCoverImage)`
  opacity: ${defaultTransparent};
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

export const CoverImageEditor = ({ src, set }) => {
  const [newSrc, setNewSrc] = useState(src);

  const onClose = () => set(newSrc);

  const closed = (
    <ImageWithPlaceholder
      src={src}
      alt="cover image"
      Image={DisplayCoverImage}
      Placeholder={CoverImagePlaceholder}
    />
  );

  const open = (
    <>
      <ImageWithPlaceholder
        src={src}
        alt="cover image"
        Image={TransparentCoverImage}
        Placeholder={CoverImagePlaceholder}
      />
      <input
        placeholder="Cover image URL"
        value={newSrc}
        onChange={(e) => setNewSrc(e.target.value)}
        autoFocus
      />
    </>
  );
  return <ClickToOpen open={open} closed={closed} onClose={onClose} />;
};
