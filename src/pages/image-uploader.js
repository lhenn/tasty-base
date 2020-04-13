import React from "react";
import useFileHandlers from "../useFileHandlers";

const Input = (props) => (
    <input type="file" accept="image/*" name="img-uploader-input" multiple {...props} />
)

const ImageUploader = () => {
    const {
        files,
        pending,
        next,
        uploading,
        uploaded,
        status,
        onSubmit,
        onChange
    } = useFileHandlers()

    return (
        <div className="container">
            <form className="form" onSubmit={onSubmit}>
                {status === 'FILES_UPLOADED' && (
                    <div className="success-container">
                        <div>
                            <h2>Congratulations!</h2>
                            <small>You uploaded your files. Get some rest.</small>
                        </div>
                    </div>
                )}
                <div>
                    <Input onChange={onChange} />
                    <button type="submit">Submit</button>
                </div>
                <div>
                    {files.map(({ file, src, id }, index) => (
                        <div key={`thumb${index}`} className="thumbnail-wrapper">
                            <img className="thumbnail" src={src} alt="" />
                            <div className="thumbnail-caption">{file.name}</div>
                        </div>
                    ))}
                </div>
            </form>
        </div>
    )
}

export default ImageUploader;