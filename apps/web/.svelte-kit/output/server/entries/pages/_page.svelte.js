import "../../chunks/server.js";
//#region src/routes/+page.svelte
function _page($$renderer) {
  $$renderer.push(
    `<h1>Home</h1> <p>Phase 0: shell title and tabs update from the current route via <code>$lib/shell.ts</code>.</p>`,
  );
}
//#endregion
export { _page as default };
