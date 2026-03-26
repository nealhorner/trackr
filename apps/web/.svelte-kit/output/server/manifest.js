export const manifest = (() => {
  function __memo(fn) {
    let value;
    return () => (value ??= value = fn());
  }

  return {
    appDir: "_app",
    appPath: "_app",
    assets: new Set([]),
    mimeTypes: {},
    _: {
      client: {
        start: "_app/immutable/entry/start.BdA3sfdV.js",
        app: "_app/immutable/entry/app.cjnWGvbb.js",
        imports: [
          "_app/immutable/entry/start.BdA3sfdV.js",
          "_app/immutable/chunks/ByKYz4xh.js",
          "_app/immutable/chunks/z3NksYcX.js",
          "_app/immutable/entry/app.cjnWGvbb.js",
          "_app/immutable/chunks/z3NksYcX.js",
          "_app/immutable/chunks/DXb0ZbaM.js",
          "_app/immutable/chunks/CT0T0Gak.js",
        ],
        stylesheets: [],
        fonts: [],
        uses_env_dynamic_public: false,
      },
      nodes: [
        __memo(() => import("./nodes/0.js")),
        __memo(() => import("./nodes/1.js")),
        __memo(() => import("./nodes/2.js")),
        __memo(() => import("./nodes/3.js")),
        __memo(() => import("./nodes/4.js")),
        __memo(() => import("./nodes/5.js")),
        __memo(() => import("./nodes/6.js")),
        __memo(() => import("./nodes/7.js")),
        __memo(() => import("./nodes/8.js")),
      ],
      remotes: {},
      routes: [
        {
          id: "/",
          pattern: /^\/$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 2 },
          endpoint: null,
        },
        {
          id: "/analytics",
          pattern: /^\/analytics\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 3 },
          endpoint: null,
        },
        {
          id: "/favorites",
          pattern: /^\/favorites\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 4 },
          endpoint: null,
        },
        {
          id: "/organizations",
          pattern: /^\/organizations\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 5 },
          endpoint: null,
        },
        {
          id: "/projects",
          pattern: /^\/projects\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 6 },
          endpoint: null,
        },
        {
          id: "/settings",
          pattern: /^\/settings\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 7 },
          endpoint: null,
        },
        {
          id: "/your-work",
          pattern: /^\/your-work\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 8 },
          endpoint: null,
        },
      ],
      prerendered_routes: new Set([]),
      matchers: async () => {
        return {};
      },
      server_assets: {},
    },
  };
})();
