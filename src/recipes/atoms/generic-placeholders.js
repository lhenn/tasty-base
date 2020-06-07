import React from "react";
import { defaultTransparent } from "../../styling";

export const NumericPlaceholder = ({ name }) => (
  <p style={{ opacity: defaultTransparent }}>{`${name}: --`}</p>
);
