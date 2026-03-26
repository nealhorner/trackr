export const index = 3;
let component_cache;
export const component = async () =>
  (component_cache ??= (
    await import("../entries/pages/analytics/_page.svelte.js")
  ).default);
export const imports = [
  "_app/immutable/nodes/3.C6vHY6iD.js",
  "_app/immutable/chunks/z3NksYcX.js",
  "_app/immutable/chunks/CT0T0Gak.js",
  "_app/immutable/chunks/xBZOLoWV.js",
];
export const stylesheets = [];
export const fonts = [];
