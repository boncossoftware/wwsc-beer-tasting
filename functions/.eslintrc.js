module.exports = {
  roots: ['./functions'],
  env: {
    es6: true,
    node: true,
    "jest/globals": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "*.test.*", // Ignore test files.
  ],
  plugins: ["@typescript-eslint", "import", "jest"],
  rules: {
    quotes: ["error", "double"],
    "no-unused-vars": "off",
    indent: ["error", 2],
    "quote-props": "off",
  },
};
