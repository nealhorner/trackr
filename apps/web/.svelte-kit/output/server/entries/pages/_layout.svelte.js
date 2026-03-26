import "../../chunks/internal.js";
import "../../chunks/exports.js";
import {
  S as derived,
  a as store_get,
  b as escape_html,
  d as getContext,
  i as slot,
  n as ensure_array_like,
  o as unsubscribe_stores,
  p as setContext,
  y as attr,
} from "../../chunks/server.js";
import "../../chunks/client.js";
//#region node_modules/@sveltejs/kit/src/runtime/app/stores.js
/**
 * A function that returns all of the contextual stores. On the server, this must be called during component initialization.
 * Only use this if you need to defer store subscription until after the component has mounted, for some reason.
 *
 * @deprecated Use `$app/state` instead (requires Svelte 5, [see docs for more info](https://svelte.dev/docs/kit/migrating-to-sveltekit-2#SvelteKit-2.12:-$app-stores-deprecated))
 */
var getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    page: { subscribe: stores$1.page.subscribe },
    navigating: { subscribe: stores$1.navigating.subscribe },
    updated: stores$1.updated,
  };
};
/**
 * A readable store whose value contains page data.
 *
 * On the server, this store can only be subscribed to during component initialization. In the browser, it can be subscribed to at any time.
 *
 * @deprecated Use `page` from `$app/state` instead (requires Svelte 5, [see docs for more info](https://svelte.dev/docs/kit/migrating-to-sveltekit-2#SvelteKit-2.12:-$app-stores-deprecated))
 * @type {import('svelte/store').Readable<import('@sveltejs/kit').Page>}
 */
var page = {
  subscribe(fn) {
    return getStores().page.subscribe(fn);
  },
};
//#endregion
//#region src/lib/shell.ts
/** Derives top-bar title and tab strip from the active pathname (Phase 0 shell contract). */
function createShellState() {
  return derived(page, ($page) => {
    const path = $page.url.pathname;
    const defaultTabs = [
      {
        label: "Overview",
        href: "/",
      },
      {
        label: "Recent",
        href: "/your-work",
      },
    ];
    if (path === "/" || path === "")
      return {
        contextTitle: "Home",
        tabs: defaultTabs,
      };
    if (path.startsWith("/your-work"))
      return {
        contextTitle: "Your Work",
        tabs: [
          {
            label: "Assigned",
            href: "/your-work",
          },
          {
            label: "Mentions",
            href: "/your-work",
          },
        ],
      };
    if (path.startsWith("/organizations"))
      return {
        contextTitle: "Organizations",
        tabs: [
          {
            label: "List",
            href: "/organizations",
          },
          {
            label: "Members",
            href: "/organizations",
          },
        ],
      };
    if (path.startsWith("/projects"))
      return {
        contextTitle: "Projects",
        tabs: [
          {
            label: "Board",
            href: "/projects",
          },
          {
            label: "Backlog",
            href: "/projects",
          },
        ],
      };
    if (path.startsWith("/analytics"))
      return {
        contextTitle: "Analytics",
        tabs: [
          {
            label: "Overview",
            href: "/analytics",
          },
        ],
      };
    if (path.startsWith("/settings"))
      return {
        contextTitle: "Settings",
        tabs: [
          {
            label: "Profile",
            href: "/settings",
          },
          {
            label: "Notifications",
            href: "/settings",
          },
        ],
      };
    if (path.startsWith("/favorites"))
      return {
        contextTitle: "Favorites",
        tabs: [
          {
            label: "Saved",
            href: "/favorites",
          },
        ],
      };
    return {
      contextTitle: "Trackr",
      tabs: defaultTabs,
    };
  });
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer) => {
    var $$store_subs;
    const shell = createShellState();
    setContext("shell", shell);
    $$renderer.push(
      `<div class="app-shell svelte-12qhfyh"><header class="top-nav svelte-12qhfyh"><div class="title-and-tabs svelte-12qhfyh"><div class="context-title svelte-12qhfyh">${escape_html(store_get(($$store_subs ??= {}), "$shell", shell).contextTitle)}</div> <nav class="context-tabs svelte-12qhfyh"><!--[-->`,
    );
    const each_array = ensure_array_like(
      store_get(($$store_subs ??= {}), "$shell", shell).tabs,
    );
    for (
      let $$index = 0, $$length = each_array.length;
      $$index < $$length;
      $$index++
    ) {
      let tab = each_array[$$index];
      $$renderer.push(
        `<a class="tab svelte-12qhfyh"${attr("href", tab.href)}>${escape_html(tab.label)}</a>`,
      );
    }
    $$renderer.push(
      `<!--]--></nav></div> <div class="global-search svelte-12qhfyh"><input type="search" placeholder="Search organizations, projects, tickets..." aria-label="Global search" class="svelte-12qhfyh"/></div></header> <div class="body svelte-12qhfyh"><aside class="left-nav svelte-12qhfyh"><div class="tenant-name svelte-12qhfyh">Tenant Name</div> <nav class="nav-sections svelte-12qhfyh"><a href="/" class="svelte-12qhfyh">Home</a> <a href="/your-work" class="svelte-12qhfyh">Your Work</a> <a href="/organizations" class="svelte-12qhfyh">Organizations</a> <a href="/projects" class="svelte-12qhfyh">Projects</a> <a href="/analytics" class="svelte-12qhfyh">Analytics</a> <a href="/settings" class="svelte-12qhfyh">Settings</a> <a href="/favorites" class="svelte-12qhfyh">Favorites</a></nav></aside> <main class="content svelte-12qhfyh"><!--[-->`,
    );
    slot($$renderer, $$props, "default", {}, null);
    $$renderer.push(`<!--]--></main></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
//#endregion
export { _layout as default };
