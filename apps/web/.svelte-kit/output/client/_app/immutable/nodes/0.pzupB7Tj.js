import {
  B as e,
  D as t,
  I as n,
  L as r,
  M as i,
  N as a,
  R as o,
  S as s,
  T as c,
  V as l,
  a as u,
  d,
  g as f,
  j as p,
  l as m,
  m as h,
  p as g,
  s as _,
  u as v,
  v as y,
} from "../chunks/z3NksYcX.js";
import { n as b } from "../chunks/ByKYz4xh.js";
import "../chunks/CT0T0Gak.js";
import "../chunks/xBZOLoWV.js";
var x = () => {
    let e = b;
    return {
      page: { subscribe: e.page.subscribe },
      navigating: { subscribe: e.navigating.subscribe },
      updated: e.updated,
    };
  },
  S = {
    subscribe(e) {
      return x().page.subscribe(e);
    },
  };
function C() {
  return a(S, (e) => {
    let t = e.url.pathname,
      n = [
        { label: `Overview`, href: `/` },
        { label: `Recent`, href: `/your-work` },
      ];
    return t === `/` || t === ``
      ? { contextTitle: `Home`, tabs: n }
      : t.startsWith(`/your-work`)
        ? {
            contextTitle: `Your Work`,
            tabs: [
              { label: `Assigned`, href: `/your-work` },
              { label: `Mentions`, href: `/your-work` },
            ],
          }
        : t.startsWith(`/organizations`)
          ? {
              contextTitle: `Organizations`,
              tabs: [
                { label: `List`, href: `/organizations` },
                { label: `Members`, href: `/organizations` },
              ],
            }
          : t.startsWith(`/projects`)
            ? {
                contextTitle: `Projects`,
                tabs: [
                  { label: `Board`, href: `/projects` },
                  { label: `Backlog`, href: `/projects` },
                ],
              }
            : t.startsWith(`/analytics`)
              ? {
                  contextTitle: `Analytics`,
                  tabs: [{ label: `Overview`, href: `/analytics` }],
                }
              : t.startsWith(`/settings`)
                ? {
                    contextTitle: `Settings`,
                    tabs: [
                      { label: `Profile`, href: `/settings` },
                      { label: `Notifications`, href: `/settings` },
                    ],
                  }
                : t.startsWith(`/favorites`)
                  ? {
                      contextTitle: `Favorites`,
                      tabs: [{ label: `Saved`, href: `/favorites` }],
                    }
                  : { contextTitle: `Trackr`, tabs: n };
  });
}
var w = f(`<a class="tab svelte-12qhfyh"> </a>`),
  T = f(
    `<div class="app-shell svelte-12qhfyh"><header class="top-nav svelte-12qhfyh"><div class="title-and-tabs svelte-12qhfyh"><div class="context-title svelte-12qhfyh"> </div> <nav class="context-tabs svelte-12qhfyh"></nav></div> <div class="global-search svelte-12qhfyh"><input type="search" placeholder="Search organizations, projects, tickets..." aria-label="Global search" class="svelte-12qhfyh"/></div></header> <div class="body svelte-12qhfyh"><aside class="left-nav svelte-12qhfyh"><div class="tenant-name svelte-12qhfyh">Tenant Name</div> <nav class="nav-sections svelte-12qhfyh"><a href="/" class="svelte-12qhfyh">Home</a> <a href="/your-work" class="svelte-12qhfyh">Your Work</a> <a href="/organizations" class="svelte-12qhfyh">Organizations</a> <a href="/projects" class="svelte-12qhfyh">Projects</a> <a href="/analytics" class="svelte-12qhfyh">Analytics</a> <a href="/settings" class="svelte-12qhfyh">Settings</a> <a href="/favorites" class="svelte-12qhfyh">Favorites</a></nav></aside> <main class="content svelte-12qhfyh"><!></main></div></div>`,
  );
function E(a, f) {
  r(f, !1);
  let b = () => i(E, `$shell`, x),
    [x, S] = p(),
    E = C();
  (o(`shell`, E), u());
  var D = T(),
    O = c(D),
    k = c(O),
    A = c(k),
    j = c(A, !0);
  l(A);
  var M = t(A, 2);
  (v(
    M,
    5,
    () => b().tabs,
    d,
    (e, t) => {
      var n = w(),
        r = c(n, !0);
      (l(n),
        s(() => {
          (_(n, `href`, y(t).href), g(r, y(t).label));
        }),
        h(e, n));
    },
  ),
    l(M),
    l(k),
    e(2),
    l(O));
  var N = t(O, 2),
    P = t(c(N), 2);
  (m(c(P), f, `default`, {}, null),
    l(P),
    l(N),
    l(D),
    s(() => g(j, b().contextTitle)),
    h(a, D),
    n(),
    S());
}
export { E as component };
