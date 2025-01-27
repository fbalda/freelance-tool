import unusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import eslintParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  compat.extends("next/core-web-vitals", "next/typescript"),
  {
    languageOptions: {
      parser: eslintParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        project: ["./tsconfig.json"],
      },
    },
    plugins: { "unused-imports": unusedImports },
    rules: {
      "no-console": 2,
      "spaced-comment": 2,
      "max-len": 2,
      "prefer-const": [
        2,
        {
          ignoreReadBeforeAssign: true,
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        2,
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/no-unused-vars": 0,
      "unused-imports/no-unused-imports": 2,
      "unused-imports/no-unused-vars": [
        1,
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
    ignores: ["tailwind.config.js", "next.config.js"],
  },
);
