/* eslint-env node */
module.exports = {
  root: true,
  'extends': [
    'eslint:recommended'
  ],
  env: {
    browser: false,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'never']
  }
}
