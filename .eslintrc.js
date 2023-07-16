module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "no-console": "error",
    "object-curly-spacing": ["error", "always", { "objectsInObjects": false, "arraysInObjects": false }],
    'quotes': ["error", "single"],
    "key-spacing": [
      "error",
      {
        "beforeColon": false,
        "afterColon": true,
        "align": "value"
      }
    ],
    "keyword-spacing": "error",
    "linebreak-style": [
      "error",
      "unix"
    ],
    "lines-between-class-members": [
      "warn",
      "always",
      {
        "exceptAfterSingleLine": true
      }
    ],
    "max-len": [
      "error",
      120,
      {
        "ignoreTemplateLiterals": true,
        "ignoreStrings": true,
        "ignoreUrls": true,
        "ignoreComments": true,
        "ignoreRegExpLiterals": true
      }
    ],
    "no-trailing-spaces": "error",
    "@typescript-eslint/ban-ts-comment": "off"
  },
};
