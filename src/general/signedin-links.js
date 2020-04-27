import React from "react";
import { Link } from "react-router-dom";
import Button from "./button-primary";
import styled from "styled-components";

const UserIcon = styled.div`
    display:flex;
    flex-direction:column;
`;
const UserPhoto = styled.img`
    width:50px;
    border-radius:50px;
`;

const SignedInLinks = ({user}) => {
    console.log("picture:",user.photoURL)
    return (
        <>
        <Link to="/create">
          <Button text="Create a post" />
        </Link>
        <UserIcon>
            <UserPhoto src={user.photoURL}/>
            {user.displayName}</UserIcon>
        </>
    )
}

export default SignedInLinks;