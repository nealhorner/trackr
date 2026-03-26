export const index = 0;
let component_cache;
export const component = async () =>
  (component_cache ??= (await import("../entries/pages/_layout.svelte.js"))
    .default);
export const imports = [
  "_app/immutable/nodes/0.pzupB7Tj.js",
  "_app/immutable/chunks/z3NksYcX.js",
  "_app/immutable/chunks/ByKYz4xh.js",
  "_app/immutable/chunks/CT0T0Gak.js",
  "_app/immutable/chunks/xBZOLoWV.js",
];
export const stylesheets = ["_app/immutable/assets/0.CqBB1Cw6.css"];
export const fonts = [];
