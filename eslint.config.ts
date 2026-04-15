import { defineConfig } from "eslint/config";

import { configs } from "@eslint/js";

import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: configs.recommended,
  allConfig: configs.all
});

export default defineConfig([
  {
    ignores: ["dist/"],
    extends: compat.extends("@repo/eslint-config/index"),

    languageOptions: {
      parserOptions: {
        parser: "@typescript-eslint/parser",
        tsconfigRootDir: __dirname
      }
    }
  }
]);
