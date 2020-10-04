import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Icon } from "./generic-icons";

const Lightbulb = ({ contribution }) => (
  <Icon
    style={{ fontSize: "32px", marginTop: "18px" }}
    icon={faLightbulb}
    isactive={contribution}
  />
);

export default Lightbulb;
