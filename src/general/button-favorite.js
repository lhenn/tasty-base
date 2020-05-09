import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, farfaBookmark } from "@fortawesome/free-solid-svg-icons";

const StyledButton = styled.button`
  color: purple;
  padding: 7px 15px;
  font-size:15px;
  &:hover {
    cursor: pointer;
    -webkit-box-shadow: 10px 10px 26px -4px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 26px -4px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 26px -4px rgba(0,0,0,0.75);
  }
`;

const FavoriteButton = ({isFavorited}) => {
    const icon = isFavorited ? {faBookmark} : {farfaBookmark};
    return(
        <StyledButton>
            <FontAwesomeIcon>
                {icon}
            </FontAwesomeIcon>
        </StyledButton>
    )
}

export default FavoriteButton;
