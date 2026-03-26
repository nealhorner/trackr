export const index = 1;
let component_cache;
export const component = async () =>
  (component_cache ??= (await import("../entries/fallbacks/error.svelte.js"))
    .default);
export const imports = [
  "_app/immutable/nodes/1.BmnZl0kL.js",
  "_app/immutable/chunks/z3NksYcX.js",
  "_app/immutable/chunks/ByKYz4xh.js",
  "_app/immutable/chunks/CT0T0Gak.js",
  "_app/immutable/chunks/xBZOLoWV.js",
];
export const stylesheets = [];
export const fonts = [];
