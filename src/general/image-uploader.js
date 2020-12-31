import React from "react";
import styled from "styled-components";
import { SecondaryButton } from "../general/buttons";
import {
  LOADED,
  INIT,
  PENDING,
  FILES_UPLOADED,
  IDLE,
} from "../useFileHandlers";

const ImageUploaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 15% 25px 15%;
`;

const FileInput = (props) => (
  <input
    type="file"
    accept="image/*"
    name="img-uploader-input"
    multiple
    {...props}
  />
);

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

const ImageUploader = ({
  files,
  uploaded,
  status,
  onSubmit,
  onChange,
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
          );
        })}
      </FilesContainer>
      <UploadButton status={status} onClick={onSubmit} />
    </div>
  );
};

const ImageUploaderContainer = (props) => {
  return (
    <ImageUploaderWrapper>
    <label htmlFor="image-uploader">Upload images</label>
    <ImageUploader
      id="image-uploader"
      {...props}
    />
  </ImageUploaderWrapper>
  )
}
export default ImageUploaderContainer;
