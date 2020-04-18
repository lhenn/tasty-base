import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    background-color: #037161;
    color: white;
    padding: 10px;
    border-radius: 5px;
    border: 0;
    &:hover{
        cursor:pointer;
        background-color: #005246;
    }
`;

const Button = (props) => {
    return (
        <>
        <StyledButton>{props.text}</StyledButton>
        </>
    )
}

export default Button;

