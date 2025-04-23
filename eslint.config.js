import globals from "globals";
import tseslint from "typescript-eslint";
import vitestPlugin from "eslint-plugin-vitest";

export default tseslint.config(
  {
    ignores: ["**/*.js"],
  },
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: ["./tsconfig.dev.json"],
      },
    },
  },
  {
    files: ["**/*.test.ts"],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  }
);
