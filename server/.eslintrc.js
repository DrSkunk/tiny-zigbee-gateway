module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  root: true,
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    'no-console': 'error',
    'prettier/prettier': 'error',
  },
};
