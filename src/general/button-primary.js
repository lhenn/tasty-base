import styled from "styled-components";

const PrimaryButton = styled.button`
background-image: linear-gradient(45deg, #738fce, #8377c7);
  color: white;
  padding: 10px 15px;
  border-radius: 50px;
  font-weight:bold;
  border: 0;
  &:hover {
    cursor: pointer;
    -webkit-box-shadow: 10px 10px 26px -4px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 26px -4px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 26px -4px rgba(0,0,0,0.75);
  }
`;

export default PrimaryButton;
