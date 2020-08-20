import React from "react";

const SlugEditor = ({ slug, setSlug }) => (
  <p>
    {"slug: "}
    <input
      type="text"
      minLength="1"
      pattern="[a-z0-9\-]+"
      id="slug"
      value={slug}
      onChange={setSlug ? (e) => setSlug(e.target.value.toLowerCase()) : () => {}}
      disabled={!setSlug}
    />
  </p>
);

export default SlugEditor;
