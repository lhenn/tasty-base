import React, { useState } from "react";
import styled from "styled-components";
import useFileHandlers from "../useFileHandlers";

const Input = (props) => (
  <input
    type="file"
    accept="image/*"
    name="img-uploader-input"
    multiple
    {...props}
  />
);

const SuccessContainer = (props) => (
  <div className="success-container">
    <div>
      <h2>Congratulations!</h2>
      <small>You uploaded your files. Get some rest.</small>
    </div>
  </div>
);

// Container for thumbnail
const ThumbnailDiv = styled.div`
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

  ${ThumbnailDiv}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

// Thumbnail component
// BUG: seems like tooltip sometimes displays for un-uploaded image if an image
// was already uploaded.
const Thumbnail = ({
  downloadUrl,
  filename,
  src,
  wasUploaded,
  id,
  // setAsCover,
  // unsetAsCover,
}) => {
  const [isCover, setIsCover] = useState(false);
  const [ttText, setTTText] = useState("");

  console.log("thumb for ", filename, "; isCover? ", isCover, "\n");

  // If image has a download url, it can be set/unset as the cover image
  const onClick = () => {
    if (downloadUrl !== "" && isCover) {
      setIsCover(false);
      setTTText("Unset!");
      // onSetAsCover(downloadUrl)
    } else if (downloadUrl !== "" && !isCover) {
      setIsCover(true);
      setTTText("Set!");
    } else {
      setTTText("");
    }
  };

  const onMouse = () => {
    if (downloadUrl !== "" && !isCover) {
      setTTText("Set as cover");
    } else if (downloadUrl !== "" && isCover) {
      setTTText("Unset as cover");
    } else {
      setTTText("");
    }
  };

  // onMouseLeave={onMouse} // seems unnecessary
  return (
    <ThumbnailDiv onClick={onClick} onMouseEnter={onMouse}>
      <ThumbnailImg src={src} alt={filename} wasUploaded={wasUploaded} />
      <ThumbnailTooltip>{ttText}</ThumbnailTooltip>
    </ThumbnailDiv>
  );
};

const ThumbnailContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const UploadButton = styled.button`
  padding: 10px;
`;

const ImageUploader = ({ onSetAsCover, onUnsetAsCover }) => {
  const {
    files,
    pending,
    next,
    uploading,
    uploaded,
    status,
    onSubmit,
    onChange,
  } = useFileHandlers();

  return (
    <div className="container">
      <form className="form" onSubmit={onSubmit}>
        {status === "FILES_UPLOADED" && <SuccessContainer />}

        <Input onChange={onChange} />

        <ThumbnailContainer>
          {files.map(({ file, src, id }, index) => {
            let wasUploaded = false;
            let downloadUrl = "";

            console.log("file: ", file);

            // Check whether file was uploaded or not
            for (var i in uploaded) {
              if (uploaded[i].file === file) {
                wasUploaded = true;
                downloadUrl = uploaded[id].downloadUrl;
                break;
              }
            }

            return (
              <Thumbnail
                key={`thumb${index}-${file.name}`}
                downloadUrl={downloadUrl}
                filename={file.name}
                src={src}
                wasUploaded={wasUploaded}
                id={id}
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
