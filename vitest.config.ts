import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: root },
      // `server-only` throws outside a React Server bundle; unit tests run
      // server modules directly.
      { find: "server-only", replacement: `${root}tests/support/empty-module.ts` }
    ]
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node"
  }
});
