import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrash } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import UpdatingTooltip from "../../general/tooltip";

const GalleryContainer = styled.div`
  width: 100%;
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
`;
const ThumbnailImg = styled.img`
  height: 200px;
  width: 200px;
  margin: 10px;
  object-fit: cover;
  display: inline-flex;
`;

export const DisplayGallery = ({ gallery }) => {
  return (
    <GalleryContainer>
      {gallery.map((img) => {
        return (
          <a key={img} data-fancybox="gallery" href={img}>
            <ThumbnailImg src={img} />
          </a>
        );
      })}
    </GalleryContainer>
  );
};

const FileInput = (props) => (
  <input
    type="file"
    accept="image/*"
    name="img-uploader-input"
    multiple
    {...props}
  />
);

const StyledEditThumbnail = styled.div`
  background-image: url("${(props) => props.src}");
  height: 200px;
  width: 200px;
  margin: 10px;
  object-fit: cover;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
const EditThumbnailOverlay = styled.div`
  height: 200px;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0);
  &:hover {
    background: rgba(0, 0, 0, 0.5);
    color: white;
  }
`;
const ThumbnailIcon = styled(FontAwesomeIcon)`
  color: rgba(0, 0, 0, 0);
  margin: 10px;
  font-size: ${(props) => props.fontSize};
  ${EditThumbnailOverlay}:hover & {
    color: white;
    cursor: pointer;
  }
`;
const EditThumbnail = ({ src, onSetCover }) => {
  console.log("src: ", src);
  //console.log('onSetCover: ', onSetCover)

  return (
    <StyledEditThumbnail src={src}>
      <EditThumbnailOverlay>
        <OverlayTrigger
          placement="bottom"
          trigger={["hover", "focus"]}
          overlay={<UpdatingTooltip>Set as cover</UpdatingTooltip>}
        >
          <ThumbnailIcon
            icon={faImage}
            fontSize="30px"
            onClick={(e) => onSetCover(src)}
          />
        </OverlayTrigger>
        <OverlayTrigger
          placement="bottom"
          trigger={["hover", "focus"]}
          overlay={<UpdatingTooltip>Delete</UpdatingTooltip>}
        >
          <ThumbnailIcon icon={faTrash} fontSize="24px" />
        </OverlayTrigger>
      </EditThumbnailOverlay>
    </StyledEditThumbnail>
  );
};
export const EditGallery = ({ gallery, onSetCover }) => {
  return (
    <GalleryContainer>
      {gallery.map((img) => {
        return <EditThumbnail key={img} src={img} onSetCover={onSetCover} />;
      })}
    </GalleryContainer>
  );
};
