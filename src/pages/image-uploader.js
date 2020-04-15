import React, { useState, useEffect } from "react";
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
const Thumbnail = (props) => {
  const [ttText, setTTText] = useState("");

  // Copy image url to clipboard
  const onClick = () => {
    if (props.downloadUrl !== "") {
      let copyHelper = document.createElement("input");
      document.body.appendChild(copyHelper);
      copyHelper.setAttribute("id", "copy-helper");
      copyHelper.value = `<img src="${props.downloadUrl}" alt="${props.fileName}">`;
      copyHelper.select();
      document.execCommand("copy");
      document.body.removeChild(copyHelper);
      setTTText("Copied!");
    }
  };

  // Sets tooltip if image has a download url
  const onMouse = () => {
    if (props.downloadUrl !== "") {
      setTTText("Copy HTML link");
    } else {
      setTTText("");
    }
  };

  return (
    <ThumbnailDiv
      onClick={onClick}
      onMouseEnter={onMouse}
      onMouseLeave={onMouse}
    >
      <ThumbnailTooltip>{ttText}</ThumbnailTooltip>
      <ThumbnailImg
        src={props.src}
        alt={props.fileName}
        wasUploaded={props.wasUploaded}
      />
    </ThumbnailDiv>
  );
};

const ThumbnailContainer = styled.div`
  display:flex;
  flex-wrap:wrap;
`;

const SubmitBtn = styled.button` 
  padding:10px;
`;

const ImageUploader = () => {
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

            for (var i in uploaded) {
              if (uploaded[i].file === file) {
                wasUploaded = true;
                downloadUrl = uploaded[id].downloadUrl;
                break;
              }
            }

            return (
              <Thumbnail
                key={`thumb${index}`}
                index={index}
                src={src}
                downloadUrl={downloadUrl}
                fileName={file.name}
                wasUploaded={wasUploaded}
              />
            );
          })}
        </ThumbnailContainer>
        {status === "LOADED" && <SubmitBtn>Upload</SubmitBtn>}


      </form>
    </div>
  );
};

export default ImageUploader;
