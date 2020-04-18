import React from "react";
import styled from "styled-components";

const StyledText = styled.span`
    color: #776d4c;
    font-size:12px;
`;

const MutedText = (props) => {
    return (
        <>
        <StyledText>{props.text}</StyledText>
        </>
    )
}

export default MutedText;
