import styled from "styled-components";

export const HeaderWrapper = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  margin-bottom: 20px;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
`;

export const PageViewOptions = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  align-items: center;
`;

export const SearchField = styled.input`
  border: solid 2px black;
  border-radius: 20px;
  height: 35px;
  width: 200px;
  padding: 0 10px;
  margin-left: 10px;
  &:focus {
    outline: none;
  }
`;
