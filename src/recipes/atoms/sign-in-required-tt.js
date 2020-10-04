import React from "react";
import UpdatingTooltip from "../../general/tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import styled from "styled-components";
import { Link, Redirect } from "react-router-dom";

const SignInRequiredTT = ({ wrappedEl }) => {
  const TtLink = styled(Link)`
    text-decoration:underline !important;
    &:hover{
        text-decoration:underline !important;
    }
  `;
  const signin = () => {
    return <Redirect to="/signin" />;
  }
  return (
    <OverlayTrigger
      placement="bottom"
      trigger={["click"]}
      overlay={
        <UpdatingTooltip id="no-user-tooltip">
          <div>
            <TtLink to="/signin">Sign in</TtLink> or{" "}
            <TtLink to="/signin">create an account</TtLink> to use this feature. &#128521;
          </div>
        </UpdatingTooltip>
      }
      rootClose
    >
      {wrappedEl}
    </OverlayTrigger>
  );
};
export default SignInRequiredTT;
