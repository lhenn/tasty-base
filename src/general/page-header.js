import styled from "styled-components";

export const HeaderWrapper = styled.div`
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  @media(max-width:850px){
    flex-direction:column;
    align-items:flex-start;
    margin-bottom:10px;
  }
`;

export const PageTitle = styled.h1`
  font-size: 28px;
`;

export const PageViewOptions = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
`;
