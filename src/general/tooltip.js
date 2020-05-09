import React, { forwardRef, useEffect } from "react";
import Tooltip from "react-bootstrap/Tooltip";

const UpdatingTooltip = forwardRef(
  ({ popper, children, show: _, ...props }, ref) => {
    useEffect(() => {
      popper.scheduleUpdate();
    }, [children, popper]);

    return (
      <Tooltip ref={ref} content {...props}>
        {children}
      </Tooltip>
    );
  }
);

export default UpdatingTooltip;
