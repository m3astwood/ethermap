module.exports = {
  root: true,
  'env': {
    'browser': true,
    'node': true,
    'es2019': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:lit/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  'rules': {
    'no-var': 'error',
    'semi': [
      'error',
      'never',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'object-curly-spacing': [
      'warn',
      'always',
    ],
    'array-bracket-spacing': [
      'warn',
      'always',
    ],
    'space-in-parens': [
      'warn',
      'never',
    ],
    'array-bracket-newline': [
      'warn',
      'consistent',
    ],
    'object-curly-newline': [
      'warn',
      {
        'consistent': true,
      },
    ],
    'space-before-blocks': [
      'warn',
      'always',
    ],
  },
};
