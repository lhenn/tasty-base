import React from "react";

const SlugEditor = ({ slug, setSlug }) => (
  <p>
    {"slug: "}
    <input
      type="text"
      value={slug}
      onChange={setSlug ? (e) => setSlug(e.target.value) : () => {}}
      disabled={!setSlug}
    />
  </p>
);

export default SlugEditor;
