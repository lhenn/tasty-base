import React, { useState } from "react";
import { getFirebase } from "../firebase";

const ImageTest = () => {
    const [loading, setLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState(null);

    if (loading && imageSrc == null) {
        getFirebase()
            .storage()
            .ref("kimchi-udon.jpeg")
            .getDownloadURL()
            .then((url) => {
                console.log("url: ", url);
                setImageSrc(url);
                setLoading(false);
            });
    }
    if (loading) {
        return <h1>Loading...</h1>;
    }
    return (
        <>
            <p>Image test</p>
            <img src={imageSrc} alt="alt-text!" />
        </>
    );
};

export default ImageTest;
