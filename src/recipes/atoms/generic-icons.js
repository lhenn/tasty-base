import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { redBase } from "../../styling";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";

const getActiveIconColor = (props) => {
  if (props.icon === faStar) return "#EFD910";
  if (props.icon === faCheck) return "#05CF56";
  if (props.icon === faLightbulb) return redBase;
};

export const Icon = styled(FontAwesomeIcon)`
  color: ${(props) =>
    props.isactive == 'true' ? getActiveIconColor(props) : "lightgrey"};
  font-size: 26px;
  padding: 5px;
  margin: ${(props) => props.margins ?? "20px 5px"};
  @media (max-width: 700px) {
    margin: 5px;
  }
`;
