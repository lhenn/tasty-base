import React, { useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import styled from "styled-components";
import UpdatingTooltip from "../general/tooltip";
import SecondaryButton from "../general/button-secondary";
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
  width: 120px;
  align-items: center;
  padding: 5px;
  ${({ isCover }) => isCover && `background: #17cb05`}
`;

// Thumbnail image
const ThumbnailImg = styled.img`
  max-width: 100%;
  max-height: 100%;
  opacity: ${(props) => {
    if (props.wasUploaded) {
      return 1;
    } else {
      return 0.3;
    }
  }};
`;

// Thumbnail component
const Thumbnail = ({
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

const ThumbnailContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const UploadButton = ({ status }) => {
  if (status === LOADED) {
    return <SecondaryButton>Upload</SecondaryButton>;
  } else if (status === INIT || status === PENDING) {
    return <SecondaryButton disabled>Uploading...</SecondaryButton>;
  } else if (status === FILES_UPLOADED) {
    return <SecondaryButton disabled>Uploaded!</SecondaryButton>;
  } else if (status === IDLE) {
    return null;
  } else {
    return <SecondaryButton disabled>Error!</SecondaryButton>;
  }
};

// Callbacks:
//  onSetCover: called after an image is set as the cover with the src and alt
//    props of the image.
//  onUnsetCover: called after an image is unset as the cover with the src
const ImageUploader = ({
  files,
  uploaded,
  status,
  onSubmit,
  onChange,
  curCover,
  onSetCover,
}) => {
  return (
    <div className="container">
      <form className="form" onSubmit={onSubmit}>
        <FileInput onChange={onChange} />

        <ThumbnailContainer>
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
              <Thumbnail
                key={`thumb${index}-${file.name}`}
                downloadURL={downloadURL}
                src={src}
                filename={file.name}
                wasUploaded={wasUploaded}
                curCover={curCover}
                onSetCover={onSetCover}
              />
            );
          })}
        </ThumbnailContainer>
        <UploadButton status={status} />
      </form>
    </div>
  );
};

export default ImageUploader;
