import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import vitestPlugin from "eslint-plugin-vitest";

export default defineConfig([
  {
    ignores: ["dist/**/*"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
  tseslint.configs.strictTypeChecked,
  {
    files: ["**/*.test.ts"],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
