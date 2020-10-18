import styled from "styled-components";

export const HeaderWrapper = styled.div`
  display: flex;
  padding:25px 15px 15px 15px;
  justify-content: space-between;
  align-items: center;
  @media(max-width:850px){
    flex-direction:column;
    align-items:flex-start;
    margin-bottom:10px;
  }
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  margin:0;
`;

export const PageViewOptions = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
`;
