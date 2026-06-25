"use client";

import { useState } from "react";

// Parse a CSS declaration string ("a:b;c:d") into a React style object.
export function css(str) {
  const out = {};
  if (!str) return out;
  str.split(";").forEach((decl) => {
    const i = decl.indexOf(":");
    if (i === -1) return;
    const prop = decl.slice(0, i).trim();
    if (!prop) return;
    const val = decl.slice(i + 1).trim();
    const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[camel] = val;
  });
  return out;
}

// Element that merges a hover style string on pointer enter — mirrors the
// design's `style-hover` attribute.
export function Hoverable({ as: Tag = "div", base, hover, style, children, ...rest }) {
  const [h, setH] = useState(false);
  return (
    <Tag
      style={{ ...css(base), ...style, ...(h ? css(hover) : {}) }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
