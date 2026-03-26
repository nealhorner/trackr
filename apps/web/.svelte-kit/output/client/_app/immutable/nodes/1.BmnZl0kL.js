import {
  D as e,
  E as t,
  I as n,
  L as r,
  S as i,
  T as a,
  V as o,
  a as s,
  g as c,
  m as l,
  p as u,
} from "../chunks/z3NksYcX.js";
import { i as d, n as f, r as p } from "../chunks/ByKYz4xh.js";
import "../chunks/CT0T0Gak.js";
import "../chunks/xBZOLoWV.js";
var m = {
  get data() {
    return d.data;
  },
  get error() {
    return d.error;
  },
  get form() {
    return d.form;
  },
  get params() {
    return d.params;
  },
  get route() {
    return d.route;
  },
  get state() {
    return d.state;
  },
  get status() {
    return d.status;
  },
  get url() {
    return d.url;
  },
};
(Object.defineProperty(
  {
    get from() {
      return p.current ? p.current.from : null;
    },
    get to() {
      return p.current ? p.current.to : null;
    },
    get type() {
      return p.current ? p.current.type : null;
    },
    get willUnload() {
      return p.current ? p.current.willUnload : null;
    },
    get delta() {
      return p.current ? p.current.delta : null;
    },
    get complete() {
      return p.current ? p.current.complete : null;
    },
  },
  `current`,
  {
    get() {
      throw Error(`Replace navigating.current.<prop> with navigating.<prop>`);
    },
  },
),
  f.updated.check);
var h = m,
  g = c(`<h1> </h1> <p> </p>`, 1);
function _(c, d) {
  (r(d, !1), s());
  var f = g(),
    p = t(f),
    m = a(p, !0);
  o(p);
  var _ = e(p, 2),
    v = a(_, !0);
  (o(_),
    i(() => {
      (u(m, h.status), u(v, h.error?.message));
    }),
    l(c, f),
    n());
}
export { _ as component };
