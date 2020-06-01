import React, { memo, useState } from "react";
import styled from "styled-components";


export const HeaderWrapper = styled.div`
  display: flex;
  padding:10px;
  align-items:center;
`;

export const PageTitle = styled.h1`
font-size:28px;
`;

export const PageViewOptions = styled.div`
display:flex;
justify-content:flex-end;
flex-grow:1;
align-items:center;

`;

export const SearchField = styled.input`
border:solid 1px black;
border-radius:20px;
height:35px;
width:200px;
padding: 0 10px;
margin: 0 20px;
`;
