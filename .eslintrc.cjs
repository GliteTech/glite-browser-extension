// .eslintrc.cjs
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'prettier', // Integrates Prettier rules
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  env: {
    node: true, // For config files and potential Node.js scripts
    webextensions: true, // Adds browser extension globals
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json', // Important for type-aware rules
  },
  rules: {
    'prettier/prettier': 'warn', // Show prettier differences as warnings
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn about unused vars, allowing unused args starting with _
    // Add any project-specific rules here
  },
  ignorePatterns: [
    '.eslintrc.cjs', // Don't lint the linter config itself
    'dist/',
    'node_modules/',
    'vite.config.ts', // Often involves different patterns
  ],
};
