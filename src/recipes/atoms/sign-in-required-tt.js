import React, { useContext, useState } from "react";
import UpdatingTooltip from "../../general/tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";


const SignInRequiredTT = () => {
    const ttText = 'test';
    return(
        <OverlayTrigger
      placement="bottom"
      trigger={["hover", "focus"]}
      overlay={<UpdatingTooltip id="no-user-tooltip">{ttText}</UpdatingTooltip>}
    />
    )
}
export default SignInRequiredTT;