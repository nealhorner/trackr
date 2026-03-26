var e = Object.defineProperty,
  t = (t, n) => {
    let r = {};
    for (var i in t) e(r, i, { get: t[i], enumerable: !0 });
    return (n || e(r, Symbol.toStringTag, { value: `Module` }), r);
  },
  n = Array.isArray,
  r = Array.prototype.indexOf,
  i = Array.prototype.includes,
  a = Array.from,
  o = Object.defineProperty,
  s = Object.getOwnPropertyDescriptor,
  c = Object.getOwnPropertyDescriptors,
  l = Object.prototype,
  u = Array.prototype,
  d = Object.getPrototypeOf,
  f = Object.isExtensible,
  p = () => {};
function m(e) {
  return e();
}
function h(e) {
  for (var t = 0; t < e.length; t++) e[t]();
}
function g() {
  var e, t;
  return {
    promise: new Promise((n, r) => {
      ((e = n), (t = r));
    }),
    resolve: e,
    reject: t,
  };
}
var _ = 1024,
  v = 2048,
  y = 4096,
  b = 8192,
  x = 16384,
  S = 32768,
  ee = 1 << 25,
  C = 65536,
  te = 1 << 19,
  ne = 1 << 20,
  re = 1 << 25,
  ie = 65536,
  ae = 1 << 21,
  oe = 1 << 22,
  se = 1 << 23,
  ce = Symbol(`$state`),
  le = Symbol(`legacy props`),
  ue = Symbol(``),
  w = new (class extends Error {
    name = `StaleReactionError`;
    message =
      "The reaction that called `getAbortSignal()` was re-run or destroyed";
  })(),
  de =
    !!globalThis.document?.contentType &&
    globalThis.document.contentType.includes(`xml`);
function fe(e) {
  throw Error(`https://svelte.dev/e/experimental_async_required`);
}
function pe(e) {
  throw Error(`https://svelte.dev/e/lifecycle_outside_component`);
}
function me() {
  throw Error(`https://svelte.dev/e/missing_context`);
}
function he() {
  throw Error(`https://svelte.dev/e/async_derived_orphan`);
}
function ge(e, t, n) {
  throw Error(`https://svelte.dev/e/each_key_duplicate`);
}
function _e(e) {
  throw Error(`https://svelte.dev/e/effect_in_teardown`);
}
function ve() {
  throw Error(`https://svelte.dev/e/effect_in_unowned_derived`);
}
function ye(e) {
  throw Error(`https://svelte.dev/e/effect_orphan`);
}
function be() {
  throw Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
}
function xe() {
  throw Error(`https://svelte.dev/e/fork_discarded`);
}
function Se() {
  throw Error(`https://svelte.dev/e/fork_timing`);
}
function Ce() {
  throw Error(`https://svelte.dev/e/get_abort_signal_outside_reaction`);
}
function we() {
  throw Error(`https://svelte.dev/e/hydration_failed`);
}
function Te(e) {
  throw Error(`https://svelte.dev/e/lifecycle_legacy_only`);
}
function Ee(e) {
  throw Error(`https://svelte.dev/e/props_invalid_value`);
}
function De() {
  throw Error(`https://svelte.dev/e/set_context_after_init`);
}
function Oe() {
  throw Error(`https://svelte.dev/e/state_descriptors_fixed`);
}
function ke() {
  throw Error(`https://svelte.dev/e/state_prototype_fixed`);
}
function Ae() {
  throw Error(`https://svelte.dev/e/state_unsafe_mutation`);
}
function je() {
  throw Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
}
var Me = {},
  T = Symbol(),
  Ne = `http://www.w3.org/1999/xhtml`;
function Pe(e) {
  console.warn(`https://svelte.dev/e/hydratable_missing_but_expected`);
}
function Fe(e) {
  console.warn(`https://svelte.dev/e/hydration_mismatch`);
}
function Ie() {
  console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
}
var E = !1;
function D(e) {
  E = e;
}
var O;
function k(e) {
  if (e === null) throw (Fe(), Me);
  return (O = e);
}
function Le() {
  return k(B(O));
}
function Re(e) {
  if (E) {
    if (B(O) !== null) throw (Fe(), Me);
    O = e;
  }
}
function ze(e = 1) {
  if (E) {
    for (var t = e, n = O; t--; ) n = B(n);
    O = n;
  }
}
function Be(e = !0) {
  for (var t = 0, n = O; ; ) {
    if (n.nodeType === 8) {
      var r = n.data;
      if (r === `]`) {
        if (t === 0) return n;
        --t;
      } else
        (r === `[` ||
          r === `[!` ||
          (r[0] === `[` && !isNaN(Number(r.slice(1))))) &&
          (t += 1);
    }
    var i = B(n);
    (e && n.remove(), (n = i));
  }
}
function Ve(e) {
  if (!e || e.nodeType !== 8) throw (Fe(), Me);
  return e.data;
}
function He(e) {
  return e === this.v;
}
function Ue(e, t) {
  return e == e
    ? e !== t || (typeof e == `object` && !!e) || typeof e == `function`
    : t == t;
}
function We(e) {
  return !Ue(e, this.v);
}
var A = !1,
  Ge = !1;
function Ke() {
  Ge = !0;
}
var j = null;
function qe(e) {
  j = e;
}
function Je() {
  let e = {};
  return [() => (Ze(e) || me(), Ye(e)), (t) => Xe(e, t)];
}
function Ye(e) {
  return nt(`getContext`).get(e);
}
function Xe(e, t) {
  let n = nt(`setContext`);
  if (A) {
    var r = q.f;
    (!W && r & 32 && !j.i) || De();
  }
  return (n.set(e, t), t);
}
function Ze(e) {
  return nt(`hasContext`).has(e);
}
function Qe() {
  return nt(`getAllContexts`);
}
function $e(e, t = !1, n) {
  j = {
    p: j,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: q,
    l: Ge && !t ? { s: null, u: null, $: [] } : null,
  };
}
function et(e) {
  var t = j,
    n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n) zn(r);
  }
  return (e !== void 0 && (t.x = e), (t.i = !0), (j = t.p), e ?? {});
}
function tt() {
  return !Ge || (j !== null && j.l === null);
}
function nt(e) {
  return (j === null && pe(e), (j.c ??= new Map(rt(j) || void 0)));
}
function rt(e) {
  let t = e.p;
  for (; t !== null; ) {
    let e = t.c;
    if (e !== null) return e;
    t = t.p;
  }
  return null;
}
var it = [];
function at() {
  var e = it;
  ((it = []), h(e));
}
function ot(e) {
  if (it.length === 0 && !Dt) {
    var t = it;
    queueMicrotask(() => {
      t === it && at();
    });
  }
  it.push(e);
}
function st() {
  for (; it.length > 0; ) at();
}
function ct(e) {
  var t = q;
  if (t === null) return ((W.f |= se), e);
  if (!(t.f & 32768) && !(t.f & 4)) throw e;
  lt(e, t);
}
function lt(e, t) {
  for (; t !== null; ) {
    if (t.f & 128) {
      if (!(t.f & 32768)) throw e;
      try {
        t.b.error(e);
        return;
      } catch (t) {
        e = t;
      }
    }
    t = t.parent;
  }
  throw e;
}
var ut = ~(v | y | _);
function M(e, t) {
  e.f = (e.f & ut) | t;
}
function dt(e) {
  e.f & 512 || e.deps === null ? M(e, _) : M(e, y);
}
function ft(e) {
  if (e !== null)
    for (let t of e) !(t.f & 2) || !(t.f & 65536) || ((t.f ^= ie), ft(t.deps));
}
function pt(e, t, n) {
  (e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), ft(e.deps), M(e, _));
}
function mt(e, t, n) {
  if (e == null) return (t(void 0), n && n(void 0), p);
  let r = wr(() => e.subscribe(t, n));
  return r.unsubscribe ? () => r.unsubscribe() : r;
}
var ht = [];
function gt(e, t) {
  return { subscribe: _t(e, t).subscribe };
}
function _t(e, t = p) {
  let n = null,
    r = new Set();
  function i(t) {
    if (Ue(e, t) && ((e = t), n)) {
      let t = !ht.length;
      for (let t of r) (t[1](), ht.push(t, e));
      if (t) {
        for (let e = 0; e < ht.length; e += 2) ht[e][0](ht[e + 1]);
        ht.length = 0;
      }
    }
  }
  function a(t) {
    i(t(e));
  }
  function o(o, s = p) {
    let c = [o, s];
    return (
      r.add(c),
      r.size === 1 && (n = t(i, a) || p),
      o(e),
      () => {
        (r.delete(c), r.size === 0 && n && (n(), (n = null)));
      }
    );
  }
  return { set: i, update: a, subscribe: o };
}
function vt(e, t, n) {
  let r = !Array.isArray(e),
    i = r ? [e] : e;
  if (!i.every(Boolean))
    throw Error(`derived() expects stores as input, got a falsy value`);
  let a = t.length < 2;
  return gt(n, (e, n) => {
    let o = !1,
      s = [],
      c = 0,
      l = p,
      u = () => {
        if (c) return;
        l();
        let i = t(r ? s[0] : s, e, n);
        a ? e(i) : (l = typeof i == `function` ? i : p);
      },
      d = i.map((e, t) =>
        mt(
          e,
          (e) => {
            ((s[t] = e), (c &= ~(1 << t)), o && u());
          },
          () => {
            c |= 1 << t;
          },
        ),
      );
    return (
      (o = !0),
      u(),
      function () {
        (h(d), l(), (o = !1));
      }
    );
  });
}
function yt(e) {
  let t;
  return (mt(e, (e) => (t = e))(), t);
}
var bt = !1,
  xt = !1,
  St = Symbol();
function Ct(e, t, n) {
  let r = (n[t] ??= { store: null, source: mn(void 0), unsubscribe: p });
  if (r.store !== e && !(St in n))
    if ((r.unsubscribe(), (r.store = e ?? null), e == null))
      ((r.source.v = void 0), (r.unsubscribe = p));
    else {
      var i = !0;
      ((r.unsubscribe = mt(e, (e) => {
        i ? (r.source.v = e) : R(r.source, e);
      })),
        (i = !1));
    }
  return e && St in n ? yt(e) : $(r.source);
}
function wt() {
  let e = {};
  function t() {
    Ln(() => {
      for (var t in e) e[t].unsubscribe();
      o(e, St, { enumerable: !1, value: !0 });
    });
  }
  return [e, t];
}
function Tt(e) {
  var t = xt;
  try {
    return ((xt = !1), [e(), xt]);
  } finally {
    xt = t;
  }
}
var N = new Set(),
  P = null,
  F = null,
  Et = null,
  Dt = !1,
  Ot = !1,
  kt = null,
  At = null,
  jt = 0,
  Mt = 1,
  Nt = class e {
    id = Mt++;
    current = new Map();
    previous = new Map();
    #e = new Set();
    #t = new Set();
    #n = new Map();
    #r = new Map();
    #i = null;
    #a = [];
    #o = new Set();
    #s = new Set();
    #c = new Map();
    is_fork = !1;
    #l = !1;
    #u = new Set();
    #d() {
      return this.is_fork || this.#r.size > 0;
    }
    #f() {
      for (let n of this.#u)
        for (let r of n.#r.keys()) {
          for (var e = !1, t = r; t.parent !== null; ) {
            if (this.#c.has(t)) {
              e = !0;
              break;
            }
            t = t.parent;
          }
          if (!e) return !0;
        }
      return !1;
    }
    skip_effect(e) {
      this.#c.has(e) || this.#c.set(e, { d: [], m: [] });
    }
    unskip_effect(e) {
      var t = this.#c.get(e);
      if (t) {
        this.#c.delete(e);
        for (var n of t.d) (M(n, v), this.schedule(n));
        for (n of t.m) (M(n, y), this.schedule(n));
      }
    }
    #p() {
      if ((jt++ > 1e3 && (N.delete(this), Ft()), !this.#d())) {
        for (let e of this.#o) (this.#s.delete(e), M(e, v), this.schedule(e));
        for (let e of this.#s) (M(e, y), this.schedule(e));
      }
      let t = this.#a;
      ((this.#a = []), this.apply());
      var n = (kt = []),
        r = [],
        i = (At = []);
      for (let e of t)
        try {
          this.#m(e, n, r);
        } catch (t) {
          throw (Ht(e), t);
        }
      if (((P = null), i.length > 0)) {
        var a = e.ensure();
        for (let e of i) a.schedule(e);
      }
      if (((kt = null), (At = null), this.#d() || this.#f())) {
        (this.#h(r), this.#h(n));
        for (let [e, t] of this.#c) Vt(e, t);
      } else {
        (this.#n.size === 0 && N.delete(this),
          this.#o.clear(),
          this.#s.clear());
        for (let e of this.#e) e(this);
        (this.#e.clear(), It(r), It(n), this.#i?.resolve());
      }
      var o = P;
      if (this.#a.length > 0) {
        let e = (o ??= this);
        e.#a.push(...this.#a.filter((t) => !e.#a.includes(t)));
      }
      (o !== null && (N.add(o), o.#p()), N.has(this) || this.#g());
    }
    #m(e, t, n) {
      e.f ^= _;
      for (var r = e.first; r !== null; ) {
        var i = r.f,
          a = (i & 96) != 0;
        if (!((a && i & 1024) || i & 8192 || this.#c.has(r)) && r.fn !== null) {
          a
            ? (r.f ^= _)
            : i & 4
              ? t.push(r)
              : A && i & 16777224
                ? n.push(r)
                : mr(r) && (i & 16 && this.#s.add(r), yr(r));
          var o = r.first;
          if (o !== null) {
            r = o;
            continue;
          }
        }
        for (; r !== null; ) {
          var s = r.next;
          if (s !== null) {
            r = s;
            break;
          }
          r = r.parent;
        }
      }
    }
    #h(e) {
      for (var t = 0; t < e.length; t += 1) pt(e[t], this.#o, this.#s);
    }
    capture(e, t, n = !1) {
      (t !== T && !this.previous.has(e) && this.previous.set(e, t),
        e.f & 8388608 || (this.current.set(e, [e.v, n]), F?.set(e, e.v)));
    }
    activate() {
      P = this;
    }
    deactivate() {
      ((P = null), (F = null));
    }
    flush() {
      try {
        ((Ot = !0), (P = this), this.#p());
      } finally {
        ((jt = 0),
          (Et = null),
          (kt = null),
          (At = null),
          (Ot = !1),
          (P = null),
          (F = null),
          un.clear());
      }
    }
    discard() {
      for (let e of this.#t) e(this);
      (this.#t.clear(), N.delete(this));
    }
    #g() {
      for (let c of N) {
        var e = c.id < this.id,
          t = [];
        for (let [r, [i, a]] of this.current) {
          if (c.current.has(r)) {
            var n = c.current.get(r)[0];
            if (e && i !== n) c.current.set(r, [i, a]);
            else continue;
          }
          t.push(r);
        }
        var r = [...c.current.keys()].filter((e) => !this.current.has(e));
        if (r.length === 0) e && c.discard();
        else if (t.length > 0) {
          c.activate();
          var i = new Set(),
            a = new Map();
          for (var o of t) Lt(o, r, i, a);
          if (c.#a.length > 0) {
            c.apply();
            for (var s of c.#a) c.#m(s, [], []);
            c.#a = [];
          }
          c.deactivate();
        }
      }
      for (let e of N)
        e.#u.has(this) &&
          (e.#u.delete(this),
          e.#u.size === 0 && !e.#d() && (e.activate(), e.#p()));
    }
    increment(e, t) {
      let n = this.#n.get(t) ?? 0;
      if ((this.#n.set(t, n + 1), e)) {
        let e = this.#r.get(t) ?? 0;
        this.#r.set(t, e + 1);
      }
    }
    decrement(e, t, n) {
      let r = this.#n.get(t) ?? 0;
      if ((r === 1 ? this.#n.delete(t) : this.#n.set(t, r - 1), e)) {
        let e = this.#r.get(t) ?? 0;
        e === 1 ? this.#r.delete(t) : this.#r.set(t, e - 1);
      }
      this.#l ||
        n ||
        ((this.#l = !0),
        ot(() => {
          ((this.#l = !1), this.flush());
        }));
    }
    transfer_effects(e, t) {
      for (let t of e) this.#o.add(t);
      for (let e of t) this.#s.add(e);
      (e.clear(), t.clear());
    }
    oncommit(e) {
      this.#e.add(e);
    }
    ondiscard(e) {
      this.#t.add(e);
    }
    settled() {
      return (this.#i ??= g()).promise;
    }
    static ensure() {
      if (P === null) {
        let t = (P = new e());
        Ot ||
          (N.add(P),
          Dt ||
            ot(() => {
              P === t && t.flush();
            }));
      }
      return P;
    }
    apply() {
      if (!A || (!this.is_fork && N.size === 1)) {
        F = null;
        return;
      }
      F = new Map();
      for (let [e, [t]] of this.current) F.set(e, t);
      for (let n of N)
        if (!(n === this || n.is_fork)) {
          var e = !1,
            t = !1;
          if (n.id < this.id)
            for (let [r, [, i]] of n.current)
              i || ((e ||= this.current.has(r)), (t ||= !this.current.has(r)));
          if (e && t) this.#u.add(n);
          else for (let [e, t] of n.previous) F.has(e) || F.set(e, t);
        }
    }
    schedule(e) {
      if (((Et = e), e.b?.is_pending && e.f & 16777228 && !(e.f & 32768))) {
        e.b.defer_effect(e);
        return;
      }
      for (var t = e; t.parent !== null; ) {
        t = t.parent;
        var n = t.f;
        if (
          kt !== null &&
          t === q &&
          (A || ((W === null || !(W.f & 2)) && !bt))
        )
          return;
        if (n & 96) {
          if (!(n & 1024)) return;
          t.f ^= _;
        }
      }
      this.#a.push(t);
    }
  };
function Pt(e) {
  var t = Dt;
  Dt = !0;
  try {
    var n;
    for (e && (P !== null && !P.is_fork && P.flush(), (n = e())); ; ) {
      if ((st(), P === null)) return n;
      P.flush();
    }
  } finally {
    Dt = t;
  }
}
function Ft() {
  try {
    be();
  } catch (e) {
    lt(e, Et);
  }
}
var I = null;
function It(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var r = e[n++];
      if (
        !(r.f & 24576) &&
        mr(r) &&
        ((I = new Set()),
        yr(r),
        r.deps === null &&
          r.first === null &&
          r.nodes === null &&
          r.teardown === null &&
          r.ac === null &&
          Zn(r),
        I?.size > 0)
      ) {
        un.clear();
        for (let e of I) {
          if (e.f & 24576) continue;
          let t = [e],
            n = e.parent;
          for (; n !== null; )
            (I.has(n) && (I.delete(n), t.push(n)), (n = n.parent));
          for (let e = t.length - 1; e >= 0; e--) {
            let n = t[e];
            n.f & 24576 || yr(n);
          }
        }
        I.clear();
      }
    }
    I = null;
  }
}
function Lt(e, t, n, r) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (let i of e.reactions) {
      let e = i.f;
      e & 2
        ? Lt(i, t, n, r)
        : e & 4194320 && !(e & 2048) && zt(i, t, r) && (M(i, v), Bt(i));
    }
}
function Rt(e, t) {
  if (e.reactions !== null)
    for (let n of e.reactions) {
      let e = n.f;
      e & 2 ? Rt(n, t) : e & 131072 && (M(n, v), t.add(n));
    }
}
function zt(e, t, n) {
  let r = n.get(e);
  if (r !== void 0) return r;
  if (e.deps !== null)
    for (let r of e.deps) {
      if (i.call(t, r)) return !0;
      if (r.f & 2 && zt(r, t, n)) return (n.set(r, !0), !0);
    }
  return (n.set(e, !1), !1);
}
function Bt(e) {
  P.schedule(e);
}
function Vt(e, t) {
  if (!(e.f & 32 && e.f & 1024)) {
    (e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), M(e, _));
    for (var n = e.first; n !== null; ) (Vt(n, t), (n = n.next));
  }
}
function Ht(e) {
  M(e, _);
  for (var t = e.first; t !== null; ) (Ht(t), (t = t.next));
}
function Ut(e) {
  (A || fe(`fork`), P !== null && Se());
  var t = Nt.ensure();
  ((t.is_fork = !0), (F = new Map()));
  var n = !1,
    r = t.settled();
  Pt(e);
  for (var [i, a] of t.previous) i.v = a;
  return {
    commit: async () => {
      if (n) {
        await r;
        return;
      }
      (N.has(t) || xe(), (n = !0), (t.is_fork = !1));
      for (var [e, [i]] of t.current) ((e.v = i), (e.wv = pr()));
      (Pt(() => {
        var e = new Set();
        for (var n of t.current.keys()) Rt(n, e);
        (dn(e), gn());
      }),
        t.flush(),
        await r);
    },
    discard: () => {
      for (var e of t.current.keys()) e.wv = pr();
      !n && N.has(t) && t.discard();
    },
  };
}
function Wt(e) {
  let t = 0,
    n = pn(0),
    r;
  return () => {
    In() &&
      ($(n),
      Wn(
        () => (
          t === 0 && (r = wr(() => e(() => _n(n)))),
          (t += 1),
          () => {
            ot(() => {
              (--t, t === 0 && (r?.(), (r = void 0), _n(n)));
            });
          }
        ),
      ));
  };
}
var Gt = C | te;
function Kt(e, t, n, r) {
  new qt(e, t, n, r);
}
var qt = class {
  parent;
  is_pending = !1;
  transform_error;
  #e;
  #t = E ? O : null;
  #n;
  #r;
  #i;
  #a = null;
  #o = null;
  #s = null;
  #c = null;
  #l = 0;
  #u = 0;
  #d = !1;
  #f = new Set();
  #p = new Set();
  #m = null;
  #h = Wt(
    () => (
      (this.#m = pn(this.#l)),
      () => {
        this.#m = null;
      }
    ),
  );
  constructor(e, t, n, r) {
    ((this.#e = e),
      (this.#n = t),
      (this.#r = (e) => {
        var t = q;
        ((t.b = this), (t.f |= 128), n(e));
      }),
      (this.parent = q.b),
      (this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e)),
      (this.#i = Kn(() => {
        if (E) {
          let e = this.#t;
          Le();
          let t = e.data === `[!`;
          if (e.data.startsWith(`[?`)) {
            let t = JSON.parse(e.data.slice(2));
            this.#_(t);
          } else t ? this.#v() : this.#g();
        } else this.#y();
      }, Gt)),
      E && (this.#e = O));
  }
  #g() {
    try {
      this.#a = H(() => this.#r(this.#e));
    } catch (e) {
      this.error(e);
    }
  }
  #_(e) {
    let t = this.#n.failed;
    t &&
      (this.#s = H(() => {
        t(
          this.#e,
          () => e,
          () => () => {},
        );
      }));
  }
  #v() {
    let e = this.#n.pending;
    e &&
      ((this.is_pending = !0),
      (this.#o = H(() => e(this.#e))),
      ot(() => {
        var e = (this.#c = document.createDocumentFragment()),
          t = z();
        (e.append(t),
          (this.#a = this.#x(() => H(() => this.#r(t)))),
          this.#u === 0 &&
            (this.#e.before(e),
            (this.#c = null),
            Qn(this.#o, () => {
              this.#o = null;
            }),
            this.#b(P)));
      }));
  }
  #y() {
    try {
      if (
        ((this.is_pending = this.has_pending_snippet()),
        (this.#u = 0),
        (this.#l = 0),
        (this.#a = H(() => {
          this.#r(this.#e);
        })),
        this.#u > 0)
      ) {
        var e = (this.#c = document.createDocumentFragment());
        nr(this.#a, e);
        let t = this.#n.pending;
        this.#o = H(() => t(this.#e));
      } else this.#b(P);
    } catch (e) {
      this.error(e);
    }
  }
  #b(e) {
    ((this.is_pending = !1), e.transfer_effects(this.#f, this.#p));
  }
  defer_effect(e) {
    pt(e, this.#f, this.#p);
  }
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!this.#n.pending;
  }
  #x(e) {
    var t = q,
      n = W,
      r = j;
    (J(this.#i), K(this.#i), qe(this.#i.ctx));
    try {
      return (Nt.ensure(), e());
    } catch (e) {
      return (ct(e), null);
    } finally {
      (J(t), K(n), qe(r));
    }
  }
  #S(e, t) {
    if (!this.has_pending_snippet()) {
      this.parent && this.parent.#S(e, t);
      return;
    }
    ((this.#u += e),
      this.#u === 0 &&
        (this.#b(t),
        this.#o &&
          Qn(this.#o, () => {
            this.#o = null;
          }),
        (this.#c &&= (this.#e.before(this.#c), null))));
  }
  update_pending_count(e, t) {
    (this.#S(e, t),
      (this.#l += e),
      !(!this.#m || this.#d) &&
        ((this.#d = !0),
        ot(() => {
          ((this.#d = !1), this.#m && hn(this.#m, this.#l));
        })));
  }
  get_effect_pending() {
    return (this.#h(), $(this.#m));
  }
  error(e) {
    var t = this.#n.onerror;
    let n = this.#n.failed;
    if (!t && !n) throw e;
    ((this.#a &&= (U(this.#a), null)),
      (this.#o &&= (U(this.#o), null)),
      (this.#s &&= (U(this.#s), null)),
      E && (k(this.#t), ze(), k(Be())));
    var r = !1,
      i = !1;
    let a = () => {
        if (r) {
          Ie();
          return;
        }
        ((r = !0),
          i && je(),
          this.#s !== null &&
            Qn(this.#s, () => {
              this.#s = null;
            }),
          this.#x(() => {
            this.#y();
          }));
      },
      o = (e) => {
        try {
          ((i = !0), t?.(e, a), (i = !1));
        } catch (e) {
          lt(e, this.#i && this.#i.parent);
        }
        n &&
          (this.#s = this.#x(() => {
            try {
              return H(() => {
                var t = q;
                ((t.b = this),
                  (t.f |= 128),
                  n(
                    this.#e,
                    () => e,
                    () => a,
                  ));
              });
            } catch (e) {
              return (lt(e, this.#i.parent), null);
            }
          }));
      };
    ot(() => {
      var t;
      try {
        t = this.transform_error(e);
      } catch (e) {
        lt(e, this.#i && this.#i.parent);
        return;
      }
      typeof t == `object` && t && typeof t.then == `function`
        ? t.then(o, (e) => lt(e, this.#i && this.#i.parent))
        : o(t);
    });
  }
};
function Jt(e, t, n, r) {
  let i = tt() ? Qt : tn;
  var a = e.filter((e) => !e.settled);
  if (n.length === 0 && a.length === 0) {
    r(t.map(i));
    return;
  }
  var o = q,
    s = Yt(),
    c =
      a.length === 1
        ? a[0].promise
        : a.length > 1
          ? Promise.all(a.map((e) => e.promise))
          : null;
  function l(e) {
    s();
    try {
      r(e);
    } catch (e) {
      o.f & 16384 || lt(e, o);
    }
    Xt();
  }
  if (n.length === 0) {
    c.then(() => l(t.map(i)));
    return;
  }
  var u = Zt();
  function d() {
    Promise.all(n.map((e) => $t(e)))
      .then((e) => l([...t.map(i), ...e]))
      .catch((e) => lt(e, o))
      .finally(() => u());
  }
  c
    ? c.then(() => {
        (s(), d(), Xt());
      })
    : d();
}
function Yt() {
  var e = q,
    t = W,
    n = j,
    r = P;
  return function (i = !0) {
    (J(e), K(t), qe(n), i && !(e.f & 16384) && (r?.activate(), r?.apply()));
  };
}
function Xt(e = !0) {
  (J(null), K(null), qe(null), e && P?.deactivate());
}
function Zt() {
  var e = q,
    t = e.b,
    n = P,
    r = t.is_rendered();
  return (
    t.update_pending_count(1, n),
    n.increment(r, e),
    (i = !1) => {
      (t.update_pending_count(-1, n), n.decrement(r, e, i));
    }
  );
}
function Qt(e) {
  var t = 2 | v,
    n = W !== null && W.f & 2 ? W : null;
  return (
    q !== null && (q.f |= te),
    {
      ctx: j,
      deps: null,
      effects: null,
      equals: He,
      f: t,
      fn: e,
      reactions: null,
      rv: 0,
      v: T,
      wv: 0,
      parent: n ?? q,
      ac: null,
    }
  );
}
function $t(e, t, n) {
  let r = q;
  r === null && he();
  var i = void 0,
    a = pn(T),
    o = !W,
    s = new Map();
  return (
    Un(() => {
      var t = q,
        n = g();
      i = n.promise;
      try {
        Promise.resolve(e()).then(n.resolve, n.reject).finally(Xt);
      } catch (e) {
        (n.reject(e), Xt());
      }
      var c = P;
      if (o) {
        if (t.f & 32768) var l = Zt();
        if (r.b.is_rendered()) (s.get(c)?.reject(w), s.delete(c));
        else {
          for (let e of s.values()) e.reject(w);
          s.clear();
        }
        s.set(c, n);
      }
      let u = (e, n = void 0) => {
        if ((l && l(n === w), !(n === w || t.f & 16384))) {
          if ((c.activate(), n)) ((a.f |= se), hn(a, n));
          else {
            (a.f & 8388608 && (a.f ^= se), hn(a, e));
            for (let [e, t] of s) {
              if ((s.delete(e), e === c)) break;
              t.reject(w);
            }
          }
          c.deactivate();
        }
      };
      n.promise.then(u, (e) => u(null, e || `unknown`));
    }),
    Ln(() => {
      for (let e of s.values()) e.reject(w);
    }),
    new Promise((e) => {
      function t(n) {
        function r() {
          n === i ? e(a) : t(i);
        }
        n.then(r, r);
      }
      t(i);
    })
  );
}
function en(e) {
  let t = Qt(e);
  return (A || sr(t), t);
}
function tn(e) {
  let t = Qt(e);
  return ((t.equals = We), t);
}
function nn(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1) U(t[n]);
  }
}
function rn(e) {
  for (var t = e.parent; t !== null; ) {
    if (!(t.f & 2)) return t.f & 16384 ? null : t;
    t = t.parent;
  }
  return null;
}
function an(e) {
  var t,
    n = q;
  J(rn(e));
  try {
    ((e.f &= ~ie), nn(e), (t = gr(e)));
  } finally {
    J(n);
  }
  return t;
}
function on(e) {
  var t = e.v,
    n = an(e);
  if (
    !e.equals(n) &&
    ((e.wv = pr()),
    (!P?.is_fork || e.deps === null) &&
      ((e.v = n), P?.capture(e, t, !0), e.deps === null))
  ) {
    M(e, _);
    return;
  }
  ar || (F === null ? dt(e) : (In() || P?.is_fork) && F.set(e, n));
}
function sn(e) {
  if (e.effects !== null)
    for (let t of e.effects)
      (t.teardown || t.ac) &&
        (t.teardown?.(),
        t.ac?.abort(w),
        (t.teardown = p),
        (t.ac = null),
        vr(t, 0),
        Jn(t));
}
function cn(e) {
  if (e.effects !== null) for (let t of e.effects) t.teardown && yr(t);
}
var ln = new Set(),
  un = new Map();
function dn(e) {
  ln = e;
}
var fn = !1;
function pn(e, t) {
  return { f: 0, v: e, reactions: null, equals: He, rv: 0, wv: 0 };
}
function L(e, t) {
  let n = pn(e, t);
  return (sr(n), n);
}
function mn(e, t = !1, n = !0) {
  let r = pn(e);
  return (
    t || (r.equals = We),
    Ge && n && j !== null && j.l !== null && (j.l.s ??= []).push(r),
    r
  );
}
function R(e, t, n = !1) {
  return (
    W !== null &&
      (!G || W.f & 131072) &&
      tt() &&
      W.f & 4325394 &&
      (Y === null || !i.call(Y, e)) &&
      Ae(),
    hn(e, n ? yn(t) : t, At)
  );
}
function hn(e, t, n = null) {
  if (!e.equals(t)) {
    var r = e.v;
    (ar ? un.set(e, t) : un.set(e, r), (e.v = t));
    var i = Nt.ensure();
    if ((i.capture(e, r), e.f & 2)) {
      let t = e;
      (e.f & 2048 && an(t), F === null && dt(t));
    }
    ((e.wv = pr()),
      vn(e, v, n),
      tt() &&
        q !== null &&
        q.f & 1024 &&
        !(q.f & 96) &&
        (Q === null ? cr([e]) : Q.push(e)),
      !i.is_fork && ln.size > 0 && !fn && gn());
  }
  return t;
}
function gn() {
  fn = !1;
  for (let e of ln) (e.f & 1024 && M(e, y), mr(e) && yr(e));
  ln.clear();
}
function _n(e) {
  R(e, e.v + 1);
}
function vn(e, t, n) {
  var r = e.reactions;
  if (r !== null)
    for (var i = tt(), a = r.length, o = 0; o < a; o++) {
      var s = r[o],
        c = s.f;
      if (!(!i && s === q)) {
        var l = (c & v) === 0;
        if ((l && M(s, t), c & 2)) {
          var u = s;
          (F?.delete(u), c & 65536 || (c & 512 && (s.f |= ie), vn(u, y, n)));
        } else if (l) {
          var d = s;
          (c & 16 && I !== null && I.add(d), n === null ? Bt(d) : n.push(d));
        }
      }
    }
}
function yn(e) {
  if (typeof e != `object` || !e || ce in e) return e;
  let t = d(e);
  if (t !== l && t !== u) return e;
  var r = new Map(),
    i = n(e),
    a = L(0),
    o = null,
    c = dr,
    f = (e) => {
      if (dr === c) return e();
      var t = W,
        n = dr;
      (K(null), fr(c));
      var r = e();
      return (K(t), fr(n), r);
    };
  return (
    i && r.set(`length`, L(e.length, o)),
    new Proxy(e, {
      defineProperty(e, t, n) {
        (!(`value` in n) ||
          n.configurable === !1 ||
          n.enumerable === !1 ||
          n.writable === !1) &&
          Oe();
        var i = r.get(t);
        return (
          i === void 0
            ? f(() => {
                var e = L(n.value, o);
                return (r.set(t, e), e);
              })
            : R(i, n.value, !0),
          !0
        );
      },
      deleteProperty(e, t) {
        var n = r.get(t);
        if (n === void 0) {
          if (t in e) {
            let e = f(() => L(T, o));
            (r.set(t, e), _n(a));
          }
        } else (R(n, T), _n(a));
        return !0;
      },
      get(t, n, i) {
        if (n === ce) return e;
        var a = r.get(n),
          c = n in t;
        if (
          (a === void 0 &&
            (!c || s(t, n)?.writable) &&
            ((a = f(() => L(yn(c ? t[n] : T), o))), r.set(n, a)),
          a !== void 0)
        ) {
          var l = $(a);
          return l === T ? void 0 : l;
        }
        return Reflect.get(t, n, i);
      },
      getOwnPropertyDescriptor(e, t) {
        var n = Reflect.getOwnPropertyDescriptor(e, t);
        if (n && `value` in n) {
          var i = r.get(t);
          i && (n.value = $(i));
        } else if (n === void 0) {
          var a = r.get(t),
            o = a?.v;
          if (a !== void 0 && o !== T)
            return { enumerable: !0, configurable: !0, value: o, writable: !0 };
        }
        return n;
      },
      has(e, t) {
        if (t === ce) return !0;
        var n = r.get(t),
          i = (n !== void 0 && n.v !== T) || Reflect.has(e, t);
        return (n !== void 0 || (q !== null && (!i || s(e, t)?.writable))) &&
          (n === void 0 && ((n = f(() => L(i ? yn(e[t]) : T, o))), r.set(t, n)),
          $(n) === T)
          ? !1
          : i;
      },
      set(e, t, n, c) {
        var l = r.get(t),
          u = t in e;
        if (i && t === `length`)
          for (var d = n; d < l.v; d += 1) {
            var p = r.get(d + ``);
            p === void 0
              ? d in e && ((p = f(() => L(T, o))), r.set(d + ``, p))
              : R(p, T);
          }
        if (l === void 0)
          (!u || s(e, t)?.writable) &&
            ((l = f(() => L(void 0, o))), R(l, yn(n)), r.set(t, l));
        else {
          u = l.v !== T;
          var m = f(() => yn(n));
          R(l, m);
        }
        var h = Reflect.getOwnPropertyDescriptor(e, t);
        if ((h?.set && h.set.call(c, n), !u)) {
          if (i && typeof t == `string`) {
            var g = r.get(`length`),
              _ = Number(t);
            Number.isInteger(_) && _ >= g.v && R(g, _ + 1);
          }
          _n(a);
        }
        return !0;
      },
      ownKeys(e) {
        $(a);
        var t = Reflect.ownKeys(e).filter((e) => {
          var t = r.get(e);
          return t === void 0 || t.v !== T;
        });
        for (var [n, i] of r) i.v !== T && !(n in e) && t.push(n);
        return t;
      },
      setPrototypeOf() {
        ke();
      },
    })
  );
}
var bn, xn, Sn, Cn;
function wn() {
  if (bn === void 0) {
    ((bn = window), (xn = /Firefox/.test(navigator.userAgent)));
    var e = Element.prototype,
      t = Node.prototype,
      n = Text.prototype;
    ((Sn = s(t, `firstChild`).get),
      (Cn = s(t, `nextSibling`).get),
      f(e) &&
        ((e.__click = void 0),
        (e.__className = void 0),
        (e.__attributes = null),
        (e.__style = void 0),
        (e.__e = void 0)),
      f(n) && (n.__t = void 0));
  }
}
function z(e = ``) {
  return document.createTextNode(e);
}
function Tn(e) {
  return Sn.call(e);
}
function B(e) {
  return Cn.call(e);
}
function En(e, t) {
  if (!E) return Tn(e);
  var n = Tn(O);
  if (n === null) n = O.appendChild(z());
  else if (t && n.nodeType !== 3) {
    var r = z();
    return (n?.before(r), k(r), r);
  }
  return (t && Mn(n), k(n), n);
}
function Dn(e, t = !1) {
  if (!E) {
    var n = Tn(e);
    return n instanceof Comment && n.data === `` ? B(n) : n;
  }
  if (t) {
    if (O?.nodeType !== 3) {
      var r = z();
      return (O?.before(r), k(r), r);
    }
    Mn(O);
  }
  return O;
}
function On(e, t = 1, n = !1) {
  let r = E ? O : e;
  for (var i; t--; ) ((i = r), (r = B(r)));
  if (!E) return r;
  if (n) {
    if (r?.nodeType !== 3) {
      var a = z();
      return (r === null ? i?.after(a) : r.before(a), k(a), a);
    }
    Mn(r);
  }
  return (k(r), r);
}
function kn(e) {
  e.textContent = ``;
}
function An() {
  return !A || I !== null ? !1 : (q.f & S) !== 0;
}
function jn(e, t, n) {
  let r = n ? { is: n } : void 0;
  return document.createElementNS(t ?? `http://www.w3.org/1999/xhtml`, e, r);
}
function Mn(e) {
  if (e.nodeValue.length < 65536) return;
  let t = e.nextSibling;
  for (; t !== null && t.nodeType === 3; )
    (t.remove(), (e.nodeValue += t.nodeValue), (t = e.nextSibling));
}
function Nn(e) {
  var t = W,
    n = q;
  (K(null), J(null));
  try {
    return e();
  } finally {
    (K(t), J(n));
  }
}
function Pn(e) {
  (q === null && (W === null && ye(e), ve()), ar && _e(e));
}
function Fn(e, t) {
  var n = t.last;
  n === null
    ? (t.last = t.first = e)
    : ((n.next = e), (e.prev = n), (t.last = e));
}
function V(e, t) {
  var n = q;
  n !== null && n.f & 8192 && (e |= b);
  var r = {
      ctx: j,
      deps: null,
      nodes: null,
      f: e | v | 512,
      first: null,
      fn: t,
      last: null,
      next: null,
      parent: n,
      b: n && n.b,
      prev: null,
      teardown: null,
      wv: 0,
      ac: null,
    },
    i = r;
  if (e & 4) kt === null ? Nt.ensure().schedule(r) : kt.push(r);
  else if (t !== null) {
    try {
      yr(r);
    } catch (e) {
      throw (U(r), e);
    }
    i.deps === null &&
      i.teardown === null &&
      i.nodes === null &&
      i.first === i.last &&
      !(i.f & 524288) &&
      ((i = i.first), e & 16 && e & 65536 && i !== null && (i.f |= C));
  }
  if (
    i !== null &&
    ((i.parent = n), n !== null && Fn(i, n), W !== null && W.f & 2 && !(e & 64))
  ) {
    var a = W;
    (a.effects ??= []).push(i);
  }
  return r;
}
function In() {
  return W !== null && !G;
}
function Ln(e) {
  let t = V(8, null);
  return (M(t, _), (t.teardown = e), t);
}
function Rn(e) {
  Pn(`$effect`);
  var t = q.f;
  if (!W && t & 32 && !(t & 32768)) {
    var n = j;
    (n.e ??= []).push(e);
  } else return zn(e);
}
function zn(e) {
  return V(4 | ne, e);
}
function Bn(e) {
  return (Pn(`$effect.pre`), V(8 | ne, e));
}
function Vn(e) {
  Nt.ensure();
  let t = V(64 | te, e);
  return (e = {}) =>
    new Promise((n) => {
      e.outro
        ? Qn(t, () => {
            (U(t), n(void 0));
          })
        : (U(t), n(void 0));
    });
}
function Hn(e) {
  return V(4, e);
}
function Un(e) {
  return V(oe | te, e);
}
function Wn(e, t = 0) {
  return V(8 | t, e);
}
function Gn(e, t = [], n = [], r = []) {
  Jt(r, t, n, (t) => {
    V(8, () => e(...t.map($)));
  });
}
function Kn(e, t = 0) {
  return V(16 | t, e);
}
function H(e) {
  return V(32 | te, e);
}
function qn(e) {
  var t = e.teardown;
  if (t !== null) {
    let e = ar,
      n = W;
    (or(!0), K(null));
    try {
      t.call(null);
    } finally {
      (or(e), K(n));
    }
  }
}
function Jn(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    let e = n.ac;
    e !== null &&
      Nn(() => {
        e.abort(w);
      });
    var r = n.next;
    (n.f & 64 ? (n.parent = null) : U(n, t), (n = r));
  }
}
function Yn(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    (t.f & 32 || U(t), (t = n));
  }
}
function U(e, t = !0) {
  var n = !1;
  ((t || e.f & 262144) &&
    e.nodes !== null &&
    e.nodes.end !== null &&
    (Xn(e.nodes.start, e.nodes.end), (n = !0)),
    M(e, ee),
    Jn(e, t && !n),
    vr(e, 0));
  var r = e.nodes && e.nodes.t;
  if (r !== null) for (let e of r) e.stop();
  (qn(e), (e.f ^= ee), (e.f |= x));
  var i = e.parent;
  (i !== null && i.first !== null && Zn(e),
    (e.next =
      e.prev =
      e.teardown =
      e.ctx =
      e.deps =
      e.fn =
      e.nodes =
      e.ac =
      e.b =
        null));
}
function Xn(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : B(e);
    (e.remove(), (e = n));
  }
}
function Zn(e) {
  var t = e.parent,
    n = e.prev,
    r = e.next;
  (n !== null && (n.next = r),
    r !== null && (r.prev = n),
    t !== null &&
      (t.first === e && (t.first = r), t.last === e && (t.last = n)));
}
function Qn(e, t, n = !0) {
  var r = [];
  $n(e, r, !0);
  var i = () => {
      (n && U(e), t && t());
    },
    a = r.length;
  if (a > 0) {
    var o = () => --a || i();
    for (var s of r) s.out(o);
  } else i();
}
function $n(e, t, n) {
  if (!(e.f & 8192)) {
    e.f ^= b;
    var r = e.nodes && e.nodes.t;
    if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
    for (var i = e.first; i !== null; ) {
      var a = i.next,
        o = (i.f & 65536) != 0 || ((i.f & 32) != 0 && (e.f & 16) != 0);
      ($n(i, t, o ? n : !1), (i = a));
    }
  }
}
function er(e) {
  tr(e, !0);
}
function tr(e, t) {
  if (e.f & 8192) {
    ((e.f ^= b), e.f & 1024 || (M(e, v), Nt.ensure().schedule(e)));
    for (var n = e.first; n !== null; ) {
      var r = n.next,
        i = (n.f & 65536) != 0 || (n.f & 32) != 0;
      (tr(n, i ? t : !1), (n = r));
    }
    var a = e.nodes && e.nodes.t;
    if (a !== null) for (let e of a) (e.is_global || t) && e.in();
  }
}
function nr(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, r = e.nodes.end; n !== null; ) {
      var i = n === r ? null : B(n);
      (t.append(n), (n = i));
    }
}
var rr = null,
  ir = !1,
  ar = !1;
function or(e) {
  ar = e;
}
var W = null,
  G = !1;
function K(e) {
  W = e;
}
var q = null;
function J(e) {
  q = e;
}
var Y = null;
function sr(e) {
  W !== null && (!A || W.f & 2) && (Y === null ? (Y = [e]) : Y.push(e));
}
var X = null,
  Z = 0,
  Q = null;
function cr(e) {
  Q = e;
}
var lr = 1,
  ur = 0,
  dr = ur;
function fr(e) {
  dr = e;
}
function pr() {
  return ++lr;
}
function mr(e) {
  var t = e.f;
  if (t & 2048) return !0;
  if ((t & 2 && (e.f &= ~ie), t & 4096)) {
    for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
      var a = n[i];
      if ((mr(a) && on(a), a.wv > e.wv)) return !0;
    }
    t & 512 && F === null && M(e, _);
  }
  return !1;
}
function hr(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !(!A && Y !== null && i.call(Y, e)))
    for (var a = 0; a < r.length; a++) {
      var o = r[a];
      o.f & 2
        ? hr(o, t, !1)
        : t === o && (n ? M(o, v) : o.f & 1024 && M(o, y), Bt(o));
    }
}
function gr(e) {
  var t = X,
    n = Z,
    r = Q,
    i = W,
    a = Y,
    o = j,
    s = G,
    c = dr,
    l = e.f;
  ((X = null),
    (Z = 0),
    (Q = null),
    (W = l & 96 ? null : e),
    (Y = null),
    qe(e.ctx),
    (G = !1),
    (dr = ++ur),
    e.ac !== null &&
      (Nn(() => {
        e.ac.abort(w);
      }),
      (e.ac = null)));
  try {
    e.f |= ae;
    var u = e.fn,
      d = u();
    e.f |= S;
    var f = e.deps,
      p = P?.is_fork;
    if (X !== null) {
      var m;
      if ((p || vr(e, Z), f !== null && Z > 0))
        for (f.length = Z + X.length, m = 0; m < X.length; m++) f[Z + m] = X[m];
      else e.deps = f = X;
      if (In() && e.f & 512)
        for (m = Z; m < f.length; m++) (f[m].reactions ??= []).push(e);
    } else !p && f !== null && Z < f.length && (vr(e, Z), (f.length = Z));
    if (tt() && Q !== null && !G && f !== null && !(e.f & 6146))
      for (m = 0; m < Q.length; m++) hr(Q[m], e);
    if (i !== null && i !== e) {
      if ((ur++, i.deps !== null))
        for (let e = 0; e < n; e += 1) i.deps[e].rv = ur;
      if (t !== null) for (let e of t) e.rv = ur;
      Q !== null && (r === null ? (r = Q) : r.push(...Q));
    }
    return (e.f & 8388608 && (e.f ^= se), d);
  } catch (e) {
    return ct(e);
  } finally {
    ((e.f ^= ae),
      (X = t),
      (Z = n),
      (Q = r),
      (W = i),
      (Y = a),
      qe(o),
      (G = s),
      (dr = c));
  }
}
function _r(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var a = r.call(n, e);
    if (a !== -1) {
      var o = n.length - 1;
      o === 0 ? (n = t.reactions = null) : ((n[a] = n[o]), n.pop());
    }
  }
  if (n === null && t.f & 2 && (X === null || !i.call(X, t))) {
    var s = t;
    (s.f & 512 && ((s.f ^= 512), (s.f &= ~ie)), dt(s), sn(s), vr(s, 0));
  }
}
function vr(e, t) {
  var n = e.deps;
  if (n !== null) for (var r = t; r < n.length; r++) _r(e, n[r]);
}
function yr(e) {
  var t = e.f;
  if (!(t & 16384)) {
    M(e, _);
    var n = q,
      r = ir;
    ((q = e), (ir = !0));
    try {
      (t & 16777232 ? Yn(e) : Jn(e), qn(e));
      var i = gr(e);
      ((e.teardown = typeof i == `function` ? i : null), (e.wv = lr));
    } finally {
      ((ir = r), (q = n));
    }
  }
}
async function br() {
  if (A)
    return new Promise((e) => {
      (requestAnimationFrame(() => e()), setTimeout(() => e()));
    });
  (await Promise.resolve(), Pt());
}
function xr() {
  return Nt.ensure().settled();
}
function $(e) {
  var t = (e.f & 2) != 0;
  if (
    (rr?.add(e),
    W !== null &&
      !G &&
      !(q !== null && q.f & 16384) &&
      (Y === null || !i.call(Y, e)))
  ) {
    var n = W.deps;
    if (W.f & 2097152)
      e.rv < ur &&
        ((e.rv = ur),
        X === null && n !== null && n[Z] === e
          ? Z++
          : X === null
            ? (X = [e])
            : X.push(e));
    else {
      (W.deps ??= []).push(e);
      var r = e.reactions;
      r === null ? (e.reactions = [W]) : i.call(r, W) || r.push(W);
    }
  }
  if (ar && un.has(e)) return un.get(e);
  if (t) {
    var a = e;
    if (ar) {
      var o = a.v;
      return (
        ((!(a.f & 1024) && a.reactions !== null) || Cr(a)) && (o = an(a)),
        un.set(a, o),
        o
      );
    }
    var s = (a.f & 512) == 0 && !G && W !== null && (ir || (W.f & 512) != 0),
      c = (a.f & S) === 0;
    (mr(a) && (s && (a.f |= 512), on(a)), s && !c && (cn(a), Sr(a)));
  }
  if (F?.has(e)) return F.get(e);
  if (e.f & 8388608) throw e.v;
  return e.v;
}
function Sr(e) {
  if (((e.f |= 512), e.deps !== null))
    for (let t of e.deps)
      ((t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (cn(t), Sr(t)));
}
function Cr(e) {
  if (e.v === T) return !0;
  if (e.deps === null) return !1;
  for (let t of e.deps) if (un.has(t) || (t.f & 2 && Cr(t))) return !0;
  return !1;
}
function wr(e) {
  var t = G;
  try {
    return ((G = !0), e());
  } finally {
    G = t;
  }
}
function Tr(e) {
  if (!(typeof e != `object` || !e || e instanceof EventTarget)) {
    if (ce in e) Er(e);
    else if (!Array.isArray(e))
      for (let t in e) {
        let n = e[t];
        typeof n == `object` && n && ce in n && Er(n);
      }
  }
}
function Er(e, t = new Set()) {
  if (typeof e == `object` && e && !(e instanceof EventTarget) && !t.has(e)) {
    (t.add(e), e instanceof Date && e.getTime());
    for (let n in e)
      try {
        Er(e[n], t);
      } catch {}
    let n = d(e);
    if (
      n !== Object.prototype &&
      n !== Array.prototype &&
      n !== Map.prototype &&
      n !== Set.prototype &&
      n !== Date.prototype
    ) {
      let t = c(n);
      for (let n in t) {
        let r = t[n].get;
        if (r)
          try {
            r.call(e);
          } catch {}
      }
    }
  }
}
[
  ...`allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback`.split(
    `.`,
  ),
];
var Dr = [`touchstart`, `touchmove`];
function Or(e) {
  return Dr.includes(e);
}
var kr = Symbol(`events`),
  Ar = new Set(),
  jr = new Set(),
  Mr = null;
function Nr(e) {
  var t = this,
    n = t.ownerDocument,
    r = e.type,
    i = e.composedPath?.() || [],
    a = i[0] || e.target;
  Mr = e;
  var s = 0,
    c = Mr === e && e[kr];
  if (c) {
    var l = i.indexOf(c);
    if (l !== -1 && (t === document || t === window)) {
      e[kr] = t;
      return;
    }
    var u = i.indexOf(t);
    if (u === -1) return;
    l <= u && (s = l);
  }
  if (((a = i[s] || e.target), a !== t)) {
    o(e, `currentTarget`, {
      configurable: !0,
      get() {
        return a || n;
      },
    });
    var d = W,
      f = q;
    (K(null), J(null));
    try {
      for (var p, m = []; a !== null; ) {
        var h = a.assignedSlot || a.parentNode || a.host || null;
        try {
          var g = a[kr]?.[r];
          g != null && (!a.disabled || e.target === a) && g.call(a, e);
        } catch (e) {
          p ? m.push(e) : (p = e);
        }
        if (e.cancelBubble || h === t || h === null) break;
        a = h;
      }
      if (p) {
        for (let e of m)
          queueMicrotask(() => {
            throw e;
          });
        throw p;
      }
    } finally {
      ((e[kr] = t), delete e.currentTarget, K(d), J(f));
    }
  }
}
var Pr =
  globalThis?.window?.trustedTypes &&
  globalThis.window.trustedTypes.createPolicy(`svelte-trusted-html`, {
    createHTML: (e) => e,
  });
function Fr(e) {
  return Pr?.createHTML(e) ?? e;
}
function Ir(e) {
  var t = jn(`template`);
  return ((t.innerHTML = Fr(e.replaceAll(`<!>`, `<!---->`))), t.content);
}
function Lr(e, t) {
  var n = q;
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
function Rr(e, t) {
  var n = (t & 1) != 0,
    r = (t & 2) != 0,
    i,
    a = !e.startsWith(`<!>`);
  return () => {
    if (E) return (Lr(O, null), O);
    i === void 0 && ((i = Ir(a ? e : `<!>` + e)), n || (i = Tn(i)));
    var t = r || xn ? document.importNode(i, !0) : i.cloneNode(!0);
    if (n) {
      var o = Tn(t),
        s = t.lastChild;
      Lr(o, s);
    } else Lr(t, t);
    return t;
  };
}
function zr(e = ``) {
  if (!E) {
    var t = z(e + ``);
    return (Lr(t, t), t);
  }
  var n = O;
  return (n.nodeType === 3 ? Mn(n) : (n.before((n = z())), k(n)), Lr(n, n), n);
}
function Br() {
  if (E) return (Lr(O, null), O);
  var e = document.createDocumentFragment(),
    t = document.createComment(``),
    n = z();
  return (e.append(t, n), Lr(t, n), e);
}
function Vr(e, t) {
  if (E) {
    var n = q;
    ((!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = O), Le());
    return;
  }
  e !== null && e.before(t);
}
function Hr(e, t) {
  var n = t == null ? `` : typeof t == `object` ? `${t}` : t;
  n !== (e.__t ??= e.nodeValue) && ((e.__t = n), (e.nodeValue = `${n}`));
}
function Ur(e, t) {
  return Kr(e, t);
}
function Wr(e, t) {
  (wn(), (t.intro = t.intro ?? !1));
  let n = t.target,
    r = E,
    i = O;
  try {
    for (var a = Tn(n); a && (a.nodeType !== 8 || a.data !== `[`); ) a = B(a);
    if (!a) throw Me;
    (D(!0), k(a));
    let r = Kr(e, { ...t, anchor: a });
    return (D(!1), r);
  } catch (r) {
    if (
      r instanceof Error &&
      r.message
        .split(
          `
`,
        )
        .some((e) => e.startsWith(`https://svelte.dev/e/`))
    )
      throw r;
    return (
      r !== Me && console.warn(`Failed to hydrate: `, r),
      t.recover === !1 && we(),
      wn(),
      kn(n),
      D(!1),
      Ur(e, t)
    );
  } finally {
    (D(r), k(i));
  }
}
var Gr = new Map();
function Kr(
  e,
  {
    target: t,
    anchor: n,
    props: r = {},
    events: i,
    context: o,
    intro: s = !0,
    transformError: c,
  },
) {
  wn();
  var l = void 0,
    u = Vn(() => {
      var s = n ?? t.appendChild(z());
      Kt(
        s,
        { pending: () => {} },
        (t) => {
          $e({});
          var n = j;
          if (
            (o && (n.c = o),
            i && (r.$$events = i),
            E && Lr(t, null),
            (l = e(t, r) || {}),
            E &&
              ((q.nodes.end = O),
              O === null || O.nodeType !== 8 || O.data !== `]`))
          )
            throw (Fe(), Me);
          et();
        },
        c,
      );
      var u = new Set(),
        d = (e) => {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            if (!u.has(r)) {
              u.add(r);
              var i = Or(r);
              for (let e of [t, document]) {
                var a = Gr.get(e);
                a === void 0 && ((a = new Map()), Gr.set(e, a));
                var o = a.get(r);
                o === void 0
                  ? (e.addEventListener(r, Nr, { passive: i }), a.set(r, 1))
                  : a.set(r, o + 1);
              }
            }
          }
        };
      return (
        d(a(Ar)),
        jr.add(d),
        () => {
          for (var e of u)
            for (let n of [t, document]) {
              var r = Gr.get(n),
                i = r.get(e);
              --i == 0
                ? (n.removeEventListener(e, Nr),
                  r.delete(e),
                  r.size === 0 && Gr.delete(n))
                : r.set(e, i);
            }
          (jr.delete(d), s !== n && s.parentNode?.removeChild(s));
        }
      );
    });
  return (qr.set(l, u), l);
}
var qr = new WeakMap();
function Jr(e, t) {
  let n = qr.get(e);
  return n ? (qr.delete(e), n(t)) : Promise.resolve();
}
var Yr = class {
  anchor;
  #e = new Map();
  #t = new Map();
  #n = new Map();
  #r = new Set();
  #i = !0;
  constructor(e, t = !0) {
    ((this.anchor = e), (this.#i = t));
  }
  #a = (e) => {
    if (this.#e.has(e)) {
      var t = this.#e.get(e),
        n = this.#t.get(t);
      if (n) (er(n), this.#r.delete(t));
      else {
        var r = this.#n.get(t);
        r &&
          (this.#t.set(t, r.effect),
          this.#n.delete(t),
          r.fragment.lastChild.remove(),
          this.anchor.before(r.fragment),
          (n = r.effect));
      }
      for (let [t, n] of this.#e) {
        if ((this.#e.delete(t), t === e)) break;
        let r = this.#n.get(n);
        r && (U(r.effect), this.#n.delete(n));
      }
      for (let [e, r] of this.#t) {
        if (e === t || this.#r.has(e)) continue;
        let i = () => {
          if (Array.from(this.#e.values()).includes(e)) {
            var t = document.createDocumentFragment();
            (nr(r, t),
              t.append(z()),
              this.#n.set(e, { effect: r, fragment: t }));
          } else U(r);
          (this.#r.delete(e), this.#t.delete(e));
        };
        this.#i || !n ? (this.#r.add(e), Qn(r, i, !1)) : i();
      }
    }
  };
  #o = (e) => {
    this.#e.delete(e);
    let t = Array.from(this.#e.values());
    for (let [e, n] of this.#n)
      t.includes(e) || (U(n.effect), this.#n.delete(e));
  };
  ensure(e, t) {
    var n = P,
      r = An();
    if (t && !this.#t.has(e) && !this.#n.has(e))
      if (r) {
        var i = document.createDocumentFragment(),
          a = z();
        (i.append(a), this.#n.set(e, { effect: H(() => t(a)), fragment: i }));
      } else
        this.#t.set(
          e,
          H(() => t(this.anchor)),
        );
    if ((this.#e.set(n, e), r)) {
      for (let [t, r] of this.#t)
        t === e ? n.unskip_effect(r) : n.skip_effect(r);
      for (let [t, r] of this.#n)
        t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
      (n.oncommit(this.#a), n.ondiscard(this.#o));
    } else (E && (this.anchor = O), this.#a(n));
  }
};
function Xr(e, t, n = !1) {
  var r;
  E && ((r = O), Le());
  var i = new Yr(e),
    a = n ? C : 0;
  function o(e, t) {
    if (E) {
      var n = Ve(r);
      if (e !== parseInt(n.substring(1))) {
        var a = Be();
        (k(a), (i.anchor = a), D(!1), i.ensure(e, t), D(!0));
        return;
      }
    }
    i.ensure(e, t);
  }
  Kn(() => {
    var e = !1;
    (t((t, n = 0) => {
      ((e = !0), o(n, t));
    }),
      e || o(-1, null));
  }, a);
}
function Zr(e, t) {
  return t;
}
function Qr(e, t, n) {
  for (var r = [], i = t.length, o, s = t.length, c = 0; c < i; c++) {
    let n = t[c];
    Qn(
      n,
      () => {
        if (o) {
          if ((o.pending.delete(n), o.done.add(n), o.pending.size === 0)) {
            var t = e.outrogroups;
            ($r(e, a(o.done)),
              t.delete(o),
              t.size === 0 && (e.outrogroups = null));
          }
        } else --s;
      },
      !1,
    );
  }
  if (s === 0) {
    var l = r.length === 0 && n !== null;
    if (l) {
      var u = n,
        d = u.parentNode;
      (kn(d), d.append(u), e.items.clear());
    }
    $r(e, t, !l);
  } else
    ((o = { pending: new Set(t), done: new Set() }),
      (e.outrogroups ??= new Set()).add(o));
}
function $r(e, t, n = !0) {
  var r;
  if (e.pending.size > 0) {
    r = new Set();
    for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
  }
  for (var i = 0; i < t.length; i++) {
    var a = t[i];
    r?.has(a)
      ? ((a.f |= re), nr(a, document.createDocumentFragment()))
      : U(t[i], n);
  }
}
var ei;
function ti(e, t, r, i, o, s = null) {
  var c = e,
    l = new Map();
  if (t & 4) {
    var u = e;
    c = E ? k(Tn(u)) : u.appendChild(z());
  }
  E && Le();
  var d = null,
    f = tn(() => {
      var e = r();
      return n(e) ? e : e == null ? [] : a(e);
    }),
    p,
    m = new Map(),
    h = !0;
  function g(e) {
    v.effect.f & 16384 ||
      (v.pending.delete(e),
      (v.fallback = d),
      ri(v, p, c, t, i),
      d !== null &&
        (p.length === 0
          ? d.f & 33554432
            ? ((d.f ^= re), ai(d, null, c))
            : er(d)
          : Qn(d, () => {
              d = null;
            })));
  }
  function _(e) {
    v.pending.delete(e);
  }
  var v = {
    effect: Kn(() => {
      p = $(f);
      var e = p.length;
      let n = !1;
      E && (Ve(c) === `[!`) != (e === 0) && ((c = Be()), k(c), D(!1), (n = !0));
      for (var a = new Set(), u = P, v = An(), y = 0; y < e; y += 1) {
        E && O.nodeType === 8 && O.data === `]` && ((c = O), (n = !0), D(!1));
        var b = p[y],
          x = i(b, y),
          S = h ? null : l.get(x);
        (S
          ? (S.v && hn(S.v, b), S.i && hn(S.i, y), v && u.unskip_effect(S.e))
          : ((S = ii(l, h ? c : (ei ??= z()), b, x, y, o, t, r)),
            h || (S.e.f |= re),
            l.set(x, S)),
          a.add(x));
      }
      if (
        (e === 0 &&
          s &&
          !d &&
          (h
            ? (d = H(() => s(c)))
            : ((d = H(() => s((ei ??= z())))), (d.f |= re))),
        e > a.size && ge(``, ``, ``),
        E && e > 0 && k(Be()),
        !h)
      )
        if ((m.set(u, a), v)) {
          for (let [e, t] of l) a.has(e) || u.skip_effect(t.e);
          (u.oncommit(g), u.ondiscard(_));
        } else g(u);
      (n && D(!0), $(f));
    }),
    flags: t,
    items: l,
    pending: m,
    outrogroups: null,
    fallback: d,
  };
  ((h = !1), E && (c = O));
}
function ni(e) {
  for (; e !== null && !(e.f & 32); ) e = e.next;
  return e;
}
function ri(e, t, n, r, i) {
  var o = (r & 8) != 0,
    s = t.length,
    c = e.items,
    l = ni(e.effect.first),
    u,
    d = null,
    f,
    p = [],
    m = [],
    h,
    g,
    _,
    v;
  if (o)
    for (v = 0; v < s; v += 1)
      ((h = t[v]),
        (g = i(h, v)),
        (_ = c.get(g).e),
        _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= new Set()).add(_)));
  for (v = 0; v < s; v += 1) {
    if (((h = t[v]), (g = i(h, v)), (_ = c.get(g).e), e.outrogroups !== null))
      for (let t of e.outrogroups) (t.pending.delete(_), t.done.delete(_));
    if (
      (_.f & 8192 &&
        (er(_), o && (_.nodes?.a?.unfix(), (f ??= new Set()).delete(_))),
      _.f & 33554432)
    )
      if (((_.f ^= re), _ === l)) ai(_, null, n);
      else {
        var y = d ? d.next : l;
        (_ === e.effect.last && (e.effect.last = _.prev),
          _.prev && (_.prev.next = _.next),
          _.next && (_.next.prev = _.prev),
          oi(e, d, _),
          oi(e, _, y),
          ai(_, y, n),
          (d = _),
          (p = []),
          (m = []),
          (l = ni(d.next)));
        continue;
      }
    if (_ !== l) {
      if (u !== void 0 && u.has(_)) {
        if (p.length < m.length) {
          var b = m[0],
            x;
          d = b.prev;
          var S = p[0],
            ee = p[p.length - 1];
          for (x = 0; x < p.length; x += 1) ai(p[x], b, n);
          for (x = 0; x < m.length; x += 1) u.delete(m[x]);
          (oi(e, S.prev, ee.next),
            oi(e, d, S),
            oi(e, ee, b),
            (l = b),
            (d = ee),
            --v,
            (p = []),
            (m = []));
        } else
          (u.delete(_),
            ai(_, l, n),
            oi(e, _.prev, _.next),
            oi(e, _, d === null ? e.effect.first : d.next),
            oi(e, d, _),
            (d = _));
        continue;
      }
      for (p = [], m = []; l !== null && l !== _; )
        ((u ??= new Set()).add(l), m.push(l), (l = ni(l.next)));
      if (l === null) continue;
    }
    (_.f & 33554432 || p.push(_), (d = _), (l = ni(_.next)));
  }
  if (e.outrogroups !== null) {
    for (let t of e.outrogroups)
      t.pending.size === 0 && ($r(e, a(t.done)), e.outrogroups?.delete(t));
    e.outrogroups.size === 0 && (e.outrogroups = null);
  }
  if (l !== null || u !== void 0) {
    var C = [];
    if (u !== void 0) for (_ of u) _.f & 8192 || C.push(_);
    for (; l !== null; )
      (!(l.f & 8192) && l !== e.fallback && C.push(l), (l = ni(l.next)));
    var te = C.length;
    if (te > 0) {
      var ne = r & 4 && s === 0 ? n : null;
      if (o) {
        for (v = 0; v < te; v += 1) C[v].nodes?.a?.measure();
        for (v = 0; v < te; v += 1) C[v].nodes?.a?.fix();
      }
      Qr(e, C, ne);
    }
  }
  o &&
    ot(() => {
      if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
    });
}
function ii(e, t, n, r, i, a, o, s) {
  var c = o & 1 ? (o & 16 ? pn(n) : mn(n, !1, !1)) : null,
    l = o & 2 ? pn(i) : null;
  return {
    v: c,
    i: l,
    e: H(
      () => (
        a(t, c ?? n, l ?? i, s),
        () => {
          e.delete(r);
        }
      ),
    ),
  };
}
function ai(e, t, n) {
  if (e.nodes)
    for (
      var r = e.nodes.start,
        i = e.nodes.end,
        a = t && !(t.f & 33554432) ? t.nodes.start : n;
      r !== null;
    ) {
      var o = B(r);
      if ((a.before(r), r === i)) return;
      r = o;
    }
}
function oi(e, t, n) {
  (t === null ? (e.effect.first = n) : (t.next = n),
    n === null ? (e.effect.last = t) : (n.prev = t));
}
function si(e, t, n, r, i) {
  E && Le();
  var a = t.$$slots?.[n],
    o = !1;
  (a === !0 && ((a = t[n === `default` ? `children` : n]), (o = !0)),
    a === void 0 ? i !== null && i(e) : a(e, o ? () => r : r));
}
function ci(e) {
  return (t, ...n) => {
    var r = e(...n),
      i;
    E ? ((i = O), Le()) : ((i = Tn(Ir(r.render().trim()))), t.before(i));
    let a = r.setup?.(i);
    (Lr(i, i), typeof a == `function` && Ln(a));
  };
}
function li(e, t, n) {
  var r;
  E && ((r = O), Le());
  var i = new Yr(e);
  Kn(() => {
    var e = t() ?? null;
    if (E && (Ve(r) === `[`) != (e !== null)) {
      var a = Be();
      (k(a), (i.anchor = a), D(!1), i.ensure(e, e && ((t) => n(t, e))), D(!0));
      return;
    }
    i.ensure(e, e && ((t) => n(t, e)));
  }, C);
}
var ui = Symbol(`is custom element`),
  di = Symbol(`is html`),
  fi = de ? `link` : `LINK`;
function pi(e, t, n, r) {
  var i = mi(e);
  (E &&
    ((i[t] = e.getAttribute(t)),
    t === `src` || t === `srcset` || (t === `href` && e.nodeName === fi))) ||
    (i[t] !== (i[t] = n) &&
      (t === `loading` && (e[ue] = n),
      n == null
        ? e.removeAttribute(t)
        : typeof n != `string` && gi(e).includes(t)
          ? (e[t] = n)
          : e.setAttribute(t, n)));
}
function mi(e) {
  return (e.__attributes ??= {
    [ui]: e.nodeName.includes(`-`),
    [di]: e.namespaceURI === Ne,
  });
}
var hi = new Map();
function gi(e) {
  var t = e.getAttribute(`is`) || e.nodeName,
    n = hi.get(t);
  if (n) return n;
  hi.set(t, (n = []));
  for (var r, i = e, a = Element.prototype; a !== i; ) {
    for (var o in ((r = c(i)), r)) r[o].set && n.push(o);
    i = d(i);
  }
  return n;
}
function _i(e, t) {
  return e === t || e?.[ce] === t;
}
function vi(e = {}, t, n, r) {
  var i = j.r,
    a = q;
  return (
    Hn(() => {
      var o, s;
      return (
        Wn(() => {
          ((o = s),
            (s = r?.() || []),
            wr(() => {
              e !== n(...s) &&
                (t(e, ...s), o && _i(n(...o), e) && t(null, ...o));
            }));
        }),
        () => {
          let r = a;
          for (; r !== i && r.parent !== null && r.parent.f & 33554432; )
            r = r.parent;
          let o = () => {
              s && _i(n(...s), e) && t(null, ...s);
            },
            c = r.teardown;
          r.teardown = () => {
            (o(), c?.());
          };
        }
      );
    }),
    e
  );
}
function yi(e = !1) {
  let t = j,
    n = t.l.u;
  if (!n) return;
  let r = () => Tr(t.s);
  if (e) {
    let e = 0,
      n = {},
      i = Qt(() => {
        let r = !1,
          i = t.s;
        for (let e in i) i[e] !== n[e] && ((n[e] = i[e]), (r = !0));
        return (r && e++, e);
      });
    r = () => $(i);
  }
  (n.b.length &&
    Bn(() => {
      (bi(t, r), h(n.b));
    }),
    Rn(() => {
      let e = wr(() => n.m.map(m));
      return () => {
        for (let t of e) typeof t == `function` && t();
      };
    }),
    n.a.length &&
      Rn(() => {
        (bi(t, r), h(n.a));
      }));
}
function bi(e, t) {
  if (e.l.s) for (let t of e.l.s) $(t);
  t();
}
function xi(e, t, n, r) {
  var i = !Ge || (n & 2) != 0,
    a = (n & 8) != 0,
    o = (n & 16) != 0,
    c = r,
    l = !0,
    u = () => (l && ((l = !1), (c = o ? wr(r) : r)), c);
  let d;
  if (a) {
    var f = ce in e || le in e;
    d = s(e, t)?.set ?? (f && t in e ? (n) => (e[t] = n) : void 0);
  }
  var p,
    m = !1;
  (a ? ([p, m] = Tt(() => e[t])) : (p = e[t]),
    p === void 0 && r !== void 0 && ((p = u()), d && (i && Ee(t), d(p))));
  var h = i
    ? () => {
        var n = e[t];
        return n === void 0 ? u() : ((l = !0), n);
      }
    : () => {
        var n = e[t];
        return (n !== void 0 && (c = void 0), n === void 0 ? c : n);
      };
  if (i && !(n & 4)) return h;
  if (d) {
    var g = e.$$legacy;
    return function (e, t) {
      return arguments.length > 0
        ? ((!i || !t || g || m) && d(t ? h() : e), e)
        : h();
    };
  }
  var _ = !1,
    v = (n & 1 ? Qt : tn)(() => ((_ = !1), h()));
  a && $(v);
  var y = q;
  return function (e, t) {
    if (arguments.length > 0) {
      let n = t ? $(v) : i && a ? yn(e) : e;
      return (R(v, n), (_ = !0), c !== void 0 && (c = n), e);
    }
    return (ar && _) || y.f & 16384 ? v.v : $(v);
  };
}
function Si(e) {
  return class extends Ci {
    constructor(t) {
      super({ component: e, ...t });
    }
  };
}
var Ci = class {
  #e;
  #t;
  constructor(e) {
    var t = new Map(),
      n = (e, n) => {
        var r = mn(n, !1, !1);
        return (t.set(e, r), r);
      };
    let r = new Proxy(
      { ...(e.props || {}), $$events: {} },
      {
        get(e, r) {
          return $(t.get(r) ?? n(r, Reflect.get(e, r)));
        },
        has(e, r) {
          return r === le
            ? !0
            : ($(t.get(r) ?? n(r, Reflect.get(e, r))), Reflect.has(e, r));
        },
        set(e, r, i) {
          return (R(t.get(r) ?? n(r, i), i), Reflect.set(e, r, i));
        },
      },
    );
    ((this.#t = (e.hydrate ? Wr : Ur)(e.component, {
      target: e.target,
      anchor: e.anchor,
      props: r,
      context: e.context,
      intro: e.intro ?? !1,
      recover: e.recover,
      transformError: e.transformError,
    })),
      !A && (!e?.props?.$$host || e.sync === !1) && Pt(),
      (this.#e = r.$$events));
    for (let e of Object.keys(this.#t))
      e === `$set` ||
        e === `$destroy` ||
        e === `$on` ||
        o(this, e, {
          get() {
            return this.#t[e];
          },
          set(t) {
            this.#t[e] = t;
          },
          enumerable: !0,
        });
    ((this.#t.$set = (e) => {
      Object.assign(r, e);
    }),
      (this.#t.$destroy = () => {
        Jr(this.#t);
      }));
  }
  $set(e) {
    this.#t.$set(e);
  }
  $on(e, t) {
    this.#e[e] = this.#e[e] || [];
    let n = (...e) => t.call(this, ...e);
    return (
      this.#e[e].push(n),
      () => {
        this.#e[e] = this.#e[e].filter((e) => e !== n);
      }
    );
  }
  $destroy() {
    this.#t.$destroy();
  }
};
function wi(e, t) {
  if ((A || fe(`hydratable`), E)) {
    let t = window.__svelte?.h;
    if (t?.has(e)) return t.get(e);
    Pe(e);
  }
  return t();
}
var Ti = t({
  afterUpdate: () => Mi,
  beforeUpdate: () => ji,
  createContext: () => Je,
  createEventDispatcher: () => Ai,
  createRawSnippet: () => ci,
  flushSync: () => Pt,
  fork: () => Ut,
  getAbortSignal: () => Ei,
  getAllContexts: () => Qe,
  getContext: () => Ye,
  hasContext: () => Ze,
  hydratable: () => wi,
  hydrate: () => Wr,
  mount: () => Ur,
  onDestroy: () => Oi,
  onMount: () => Di,
  setContext: () => Xe,
  settled: () => xr,
  tick: () => br,
  unmount: () => Jr,
  untrack: () => wr,
});
function Ei() {
  return (W === null && Ce(), (W.ac ??= new AbortController()).signal);
}
function Di(e) {
  (j === null && pe(`onMount`),
    Ge && j.l !== null
      ? Ni(j).m.push(e)
      : Rn(() => {
          let t = wr(e);
          if (typeof t == `function`) return t;
        }));
}
function Oi(e) {
  (j === null && pe(`onDestroy`), Di(() => () => wr(e)));
}
function ki(e, t, { bubbles: n = !1, cancelable: r = !1 } = {}) {
  return new CustomEvent(e, { detail: t, bubbles: n, cancelable: r });
}
function Ai() {
  let e = j;
  return (
    e === null && pe(`createEventDispatcher`),
    (t, r, i) => {
      let a = e.s.$$events?.[t];
      if (a) {
        let o = n(a) ? a.slice() : [a],
          s = ki(t, r, i);
        for (let t of o) t.call(e.x, s);
        return !s.defaultPrevented;
      }
      return !0;
    }
  );
}
function ji(e) {
  (j === null && pe(`beforeUpdate`),
    j.l === null && Te(`beforeUpdate`),
    Ni(j).b.push(e));
}
function Mi(e) {
  (j === null && pe(`afterUpdate`),
    j.l === null && Te(`afterUpdate`),
    Ni(j).a.push(e));
}
function Ni(e) {
  var t = e.l;
  return (t.u ??= { a: [], b: [], m: [] });
}
export {
  en as A,
  ze as B,
  Rn as C,
  On as D,
  Dn as E,
  Ye as F,
  et as I,
  $e as L,
  Ct as M,
  vt as N,
  R as O,
  _t as P,
  Xe as R,
  Gn as S,
  En as T,
  Re as V,
  zr as _,
  yi as a,
  br as b,
  li as c,
  Zr as d,
  Xr as f,
  Rr as g,
  Br as h,
  xi as i,
  wt as j,
  L as k,
  si as l,
  Vr as m,
  Di as n,
  vi as o,
  Hr as p,
  Si as r,
  pi as s,
  Ti as t,
  ti as u,
  $ as v,
  Bn as w,
  wr as x,
  xr as y,
  Ke as z,
};
