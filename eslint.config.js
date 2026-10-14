// ESLint (flat config) — PGC 5.3: zero erros em script.js e nos testes.
import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', 'dist/', 'coverage/'] },
  js.configs.recommended,
  {
    files: ['script.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: globals.browser,
    },
    rules: {
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    files: ['**/*.config.js', 'tests/**/*.js', 'scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
  },
];
