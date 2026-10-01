import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    coverage: {
      include: ["plugins/**/*.ts", "shared/**/*.ts"],
      reporter: ["lcovonly"],
    },
  },
});
