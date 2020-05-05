import React, { useState } from "react";
import styled from "styled-components";

const Input = (props) => (
  <input
    type="file"
    accept="image/*"
    name="img-uploader-input"
    multiple
    {...props}
  />
);

const SuccessContainer = () => (
  <div className="success-container">
    <div>
      <h2>Congratulations!</h2>
      <small>You uploaded your files. Get some rest.</small>
    </div>
  </div>
);

// Container for thumbnail
const ThumbnailWrapper = styled.div`
  width: 120px;
  align-items: center;
  padding: 5px;
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

// Tooltip for mousing over to copy image url
const ThumbnailTooltip = styled.span`
  visibility: hidden;

  ${ThumbnailWrapper}:hover & {
    visibility: visible;
    opacity: 1;
  }
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
      setTTText("");
    }
  };

  const onMouseEnter = () => {
    if (wasUploaded && curCover !== downloadURL) {
      setTTText("Set as cover");
    } else if (wasUploaded) {
      setTTText("Unset as cover");
    } else {
      setTTText("");
    }
  };

  return (
    <ThumbnailWrapper onClick={onClick} onMouseEnter={onMouseEnter}>
      <ThumbnailImg src={src} alt={filename} wasUploaded={wasUploaded} />
      <ThumbnailTooltip>{ttText}</ThumbnailTooltip>
    </ThumbnailWrapper>
  );
};

const ThumbnailContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const UploadButton = styled.button`
  padding: 10px;
`;

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
        {status === "FILES_UPLOADED" && <SuccessContainer />}

        <Input onChange={onChange} />

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
        {status === "LOADED" && <UploadButton>Upload</UploadButton>}
      </form>
    </div>
  );
};

export default ImageUploader;
