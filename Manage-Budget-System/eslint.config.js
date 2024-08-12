import globals from "globals";
import pluginJs from "@eslint/js";
import "./polyfill.js";

export default [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: "readonly",
      },
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },
  pluginJs.configs.recommended,
];
