import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const getActiveIconColor = (props) => {
  if (props.icon === faStar) return "#EFD910";
  if (props.icon === faCheck) return "#05CF56";
};

export const Icon = styled(FontAwesomeIcon)`
  color: ${(props) =>
    props.isactive ? getActiveIconColor(props) : "lightgrey"};
  font-size: 26px;
  padding: 5px;
  margin: ${(props) => props.margins ??'20px 5px'};
  &:hover {
    color: ${(props) => getActiveIconColor(props)};
  }
  @media(max-width:700px){
    margin: 5px;
  }
`;
