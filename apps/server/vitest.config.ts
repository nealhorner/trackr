import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      POSTGRES_DATABASE_URL:
        process.env.POSTGRES_DATABASE_URL ??
        "postgresql://postgres:postgres@localhost:5432/trackr_test",
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "00000000000000000000000000000000",
    },
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
    exclude: ["dist/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      thresholds: {
        lines: 26,
        functions: 27,
        branches: 13,
        statements: 25,
      },
    },
  },
});
