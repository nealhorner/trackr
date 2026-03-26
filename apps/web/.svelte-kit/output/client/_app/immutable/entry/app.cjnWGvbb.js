const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "../nodes/0.pzupB7Tj.js",
      "../chunks/z3NksYcX.js",
      "../chunks/ByKYz4xh.js",
      "../chunks/CT0T0Gak.js",
      "../chunks/xBZOLoWV.js",
      "../assets/0.CqBB1Cw6.css",
      "../nodes/1.BmnZl0kL.js",
      "../nodes/2.5CMrxz9W.js",
      "../nodes/3.C6vHY6iD.js",
      "../nodes/4.mfo_h9kK.js",
      "../nodes/5.DkFjxH_s.js",
      "../nodes/6.gpNCPdTl.js",
      "../nodes/7.Ssza-oUe.js",
      "../nodes/8.CFhhDm92.js",
    ]),
) => i.map((i) => d[i]);
import {
  A as e,
  C as t,
  D as n,
  E as r,
  I as i,
  L as a,
  O as o,
  S as s,
  T as c,
  V as l,
  _ as u,
  b as d,
  c as f,
  f as p,
  g as m,
  h,
  i as g,
  k as _,
  m as v,
  n as y,
  o as b,
  p as x,
  r as S,
  v as C,
  w,
} from "../chunks/z3NksYcX.js";
import { t as T } from "../chunks/DXb0ZbaM.js";
import "../chunks/CT0T0Gak.js";
var E = {},
  D = m(
    `<div id="svelte-announcer" aria-live="assertive" aria-atomic="true" style="position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px"><!></div>`,
  ),
  O = m(`<!> <!>`, 1);
function k(m, S) {
  a(S, !0);
  let T = g(S, `components`, 23, () => []),
    E = g(S, `data_0`, 3, null),
    k = g(S, `data_1`, 3, null);
  (w(() => S.stores.page.set(S.page)),
    t(() => {
      (S.stores,
        S.page,
        S.constructors,
        T(),
        S.form,
        E(),
        k(),
        S.stores.page.notify());
    }));
  let A = _(!1),
    j = _(!1),
    M = _(null);
  y(() => {
    let e = S.stores.page.subscribe(() => {
      C(A) &&
        (o(j, !0),
        d().then(() => {
          o(M, document.title || `untitled page`, !0);
        }));
    });
    return (o(A, !0), e);
  });
  let N = e(() => S.constructors[1]);
  var P = O(),
    F = r(P),
    I = (t) => {
      let n = e(() => S.constructors[0]);
      var i = h();
      (f(
        r(i),
        () => C(n),
        (e, t) => {
          b(
            t(e, {
              get data() {
                return E();
              },
              get form() {
                return S.form;
              },
              get params() {
                return S.page.params;
              },
              children: (e, t) => {
                var n = h();
                (f(
                  r(n),
                  () => C(N),
                  (e, t) => {
                    b(
                      t(e, {
                        get data() {
                          return k();
                        },
                        get form() {
                          return S.form;
                        },
                        get params() {
                          return S.page.params;
                        },
                      }),
                      (e) => (T()[1] = e),
                      () => T()?.[1],
                    );
                  },
                ),
                  v(e, n));
              },
              $$slots: { default: !0 },
            }),
            (e) => (T()[0] = e),
            () => T()?.[0],
          );
        },
      ),
        v(t, i));
    },
    L = (t) => {
      let n = e(() => S.constructors[0]);
      var i = h();
      (f(
        r(i),
        () => C(n),
        (e, t) => {
          b(
            t(e, {
              get data() {
                return E();
              },
              get form() {
                return S.form;
              },
              get params() {
                return S.page.params;
              },
            }),
            (e) => (T()[0] = e),
            () => T()?.[0],
          );
        },
      ),
        v(t, i));
    };
  p(F, (e) => {
    S.constructors[1] ? e(I) : e(L, -1);
  });
  var R = n(F, 2),
    z = (e) => {
      var t = D(),
        n = c(t),
        r = (e) => {
          var t = u();
          (s(() => x(t, C(M))), v(e, t));
        };
      (p(n, (e) => {
        C(j) && e(r);
      }),
        l(t),
        v(e, t));
    };
  (p(R, (e) => {
    C(A) && e(z);
  }),
    v(m, P),
    i());
}
var A = S(k),
  j = [
    () =>
      T(
        () => import(`../nodes/0.pzupB7Tj.js`),
        __vite__mapDeps([0, 1, 2, 3, 4, 5]),
        import.meta.url,
      ),
    () =>
      T(
        () => import(`../nodes/1.BmnZl0kL.js`),
        __vite__mapDeps([6, 1, 2, 3, 4]),
        import.meta.url,
      ),
    () =>
      T(
        () => import(`../nodes/2.5CMrxz9W.js`),
        __vite__mapDeps([7, 1, 3, 4]),
        import.meta.url,
      ),
    () =>
      T(
        () => import(`../nodes/3.C6vHY6iD.js`),
        __vite__mapDeps([8, 1, 3, 4]),
        import.meta.url,
      ),
    () =>
      T(
        () => import(`../nodes/4.mfo_h9kK.js`),
        __vite__mapDeps([9, 1, 3, 4]),
        import.meta.url,
      ),
    () =>
      T(
        () => import(`../nodes/5.DkFjxH_s.js`),
        __vite__mapDeps([10, 1, 3, 4]),
        import.meta.url,
      ),
    () =>
      T(
        () => import(`../nodes/6.gpNCPdTl.js`),
        __vite__mapDeps([11, 1, 3, 4]),
        import.meta.url,
      ),
    () =>
      T(
        () => import(`../nodes/7.Ssza-oUe.js`),
        __vite__mapDeps([12, 1, 3, 4]),
        import.meta.url,
      ),
    () =>
      T(
        () => import(`../nodes/8.CFhhDm92.js`),
        __vite__mapDeps([13, 1, 3, 4]),
        import.meta.url,
      ),
  ],
  M = [],
  N = {
    "/": [2],
    "/analytics": [3],
    "/favorites": [4],
    "/organizations": [5],
    "/projects": [6],
    "/settings": [7],
    "/your-work": [8],
  },
  P = {
    handleError: ({ error: e }) => {
      console.error(e);
    },
    reroute: () => {},
    transport: {},
  },
  F = Object.fromEntries(
    Object.entries(P.transport).map(([e, t]) => [e, t.decode]),
  ),
  I = Object.fromEntries(
    Object.entries(P.transport).map(([e, t]) => [e, t.encode]),
  ),
  L = !1,
  R = (e, t) => F[e](t);
export {
  R as decode,
  F as decoders,
  N as dictionary,
  I as encoders,
  L as hash,
  P as hooks,
  E as matchers,
  j as nodes,
  A as root,
  M as server_loads,
};
