import React, {useState} from "react";


const Create = () => {
    const [content, setContent] = useState("");

    return (
        <>
            <h1>Create a new post</h1>
            <label htmlFor="content-field">
                Content
            </label>
            <textarea
                id="content"
                type="text"
                value={content}
                onChange={({target: {value}}) => {
                    setContent(value);
                }}
            />
            <div>
                <p dangerouslySetInnerHTML={{__html: content}}></p>
            </div>
        </>
    );
};

export default Create;
