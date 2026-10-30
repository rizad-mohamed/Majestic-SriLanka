import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import globals from "globals";
export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".astro/**",
      ".agents/**",
      ".taste-skill/**",
      ".local/**",
      "playwright-report/**",
      "test-results/**",
      ".lighthouseci/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  {
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
];
