import React, { useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import styled from "styled-components";
import UpdatingTooltip from "../general/tooltip";
import { SecondaryButton } from "../general/buttons";
import {
  LOADED,
  INIT,
  PENDING,
  FILES_UPLOADED,
  IDLE,
} from "../useFileHandlers";

const FileInput = (props) => (
  <input
    type="file"
    accept="image/*"
    name="img-uploader-input"
    multiple
    {...props}
  />
);

// Container for thumbnail
const ThumbnailWrapper = styled.div`
height: 200px;
width: 200px;
margin: 10px;
  ${({ isCover }) => isCover && `background: #17cb05`}
`;

// Thumbnail image
const ThumbnailImg = styled.img`
  max-width: 100%;
  max-height: 100%;
object-fit: cover;

  opacity: ${(props) => {
    if (props.wasUploaded) {
      return 1;
    } else {
      return 0.3;
    }
  }};
`;

// Thumbnail component
// onSetCover is called when an image is toggled/untoggled as the album cover.
// It takes the image's URL and the file name as the alt text.
export const Thumbnail = ({
  downloadURL,
  src,
  filename,
  wasUploaded,
  curCover,
  onSetCover,
}) => {
  const [ttText, setTTText] = useState("");

  const onClick = () => {
    if (wasUploaded && curCover !== downloadURL) {
      setTTText("Set!");
      onSetCover(downloadURL, filename);
    } else if (wasUploaded) {
      setTTText("Unset!");
      onSetCover("", "");
    } else {
      setTTText("Not yet uploaded");
    }
  };

  const onMouseEnter = () => {
    if (wasUploaded && curCover !== downloadURL) {
      setTTText("Set as cover");
    } else if (wasUploaded) {
      setTTText("Unset as cover");
    } else {
      setTTText("Not yet uploaded");
    }
  };

  return (
    <OverlayTrigger
      placement="bottom"
      trigger={["hover", "focus"]}
      overlay={
        <UpdatingTooltip id="favorite-tooltip">{ttText}</UpdatingTooltip>
      }
    >
      <ThumbnailWrapper
        isCover={wasUploaded && curCover === downloadURL}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        <ThumbnailImg src={src} alt={filename} wasUploaded={wasUploaded} />
      </ThumbnailWrapper>
    </OverlayTrigger>
  );
};

const FilesContainer = styled.div`
  display: flex;
  justify-content:center;
  align-items:center;
  flex-direction: column;
`;

const UploadButton = ({ status, ...props }) => {
  if (status === IDLE) return null;
  else if (status === LOADED)
    return (
      <SecondaryButton type="button" {...props}>
        Upload
      </SecondaryButton>
    );

  const text =
    status === INIT || status === PENDING
      ? "Uploading..."
      : status === FILES_UPLOADED
      ? "Uploaded!"
      : "Error!";

  return (
    <SecondaryButton disabled type="button" {...props}>{text}</SecondaryButton>
  );
};

const FileName = styled.p`
margin-bottom:5px;
`;
// Callbacks:
//  onSetCover: called after an image is set as the cover with the src and alt
//    props of the image.
//  onUnsetCover: called after an image is unset as the cover with the src
export const ImageUploader = ({
  files,
  uploaded,
  status,
  onSubmit,
  onChange,
  curCover,
  onSetCover,
}) => {
  return (
    <div
      className="container"
      style={{ alignItems: "center", width: "100%", display: "block" }}
    >
      <FileInput onChange={onChange} />

      <FilesContainer>
        {files.map(({ file, src, id }, index) => {
          let wasUploaded = false;
          let downloadURL = "";

          // Check whether file was uploaded or not
          for (var i in uploaded) {
            if (uploaded[i].file === file) {
              wasUploaded = true;
              downloadURL = uploaded[id].downloadURL;
              break;
            }
          }

          return (
            <FileName key={`thumb${index}-${file.name}`} >{file.name}</FileName>
            // <Thumbnail
            //   key={`thumb${index}-${file.name}`}
            //   downloadURL={downloadURL}
            //   src={src}
            //   filename={file.name}
            //   wasUploaded={wasUploaded}
            //   curCover={curCover}
            //   onSetCover={onSetCover}
            // />
          );
        })}
      </FilesContainer>
      <UploadButton status={status} onClick={onSubmit} />
    </div>
  );
};
