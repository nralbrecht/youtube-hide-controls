// @ts-check
// Config documentation:
// - https://eslint.org/docs/latest/use/configure/configuration-files
//   - npm install -D @eslint/js @types/eslint__js
// - https://typescript-eslint.io/packages/typescript-eslint/#config
//   - npm un @typescript-eslint/parser @typescript-eslint/eslint-plugin
//   - npm install -D typescript-eslint
// - https://prettier.io/docs/en/integrating-with-linters.html
//   - npm install -D eslint-plugin-prettier eslint-config-prettier @types/eslint-plugin-prettier

import eslint from "@eslint/js";
import pluginPrettier from "eslint-plugin-prettier/recommended";
import tseslint, { config } from "typescript-eslint";

export default tseslint.config({
  files: ["**/*.ts"],
  ignores: [],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    pluginPrettier,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
    },
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
      },
    ],
    "@typescript-eslint/no-floating-promises": "error",

    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/no-empty-function": "warn",

    "require-await": "error",
    "no-process-exit": "off",
  },
});
