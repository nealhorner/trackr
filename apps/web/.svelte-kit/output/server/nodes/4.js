export const index = 4;
let component_cache;
export const component = async () =>
  (component_cache ??= (
    await import("../entries/pages/favorites/_page.svelte.js")
  ).default);
export const imports = [
  "_app/immutable/nodes/4.mfo_h9kK.js",
  "_app/immutable/chunks/z3NksYcX.js",
  "_app/immutable/chunks/CT0T0Gak.js",
  "_app/immutable/chunks/xBZOLoWV.js",
];
export const stylesheets = [];
export const fonts = [];
