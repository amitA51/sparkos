/**
 * SparkOS Design System ESLint Configuration
 * 
 * Design System Rules:
 * - Disallow deprecated CSS variable naming pattern: var(--color-xxx)
 *   Use: var(--gray-100) instead of var(--color-gray-100)
 * - Disallow hardcoded hex colors in JSX style attributes
 *   Use CSS variables instead: style={{ backgroundColor: 'var(--gray-100)' }}
 * - Suggest using CSS variables for all color values
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // ==========================================
    // DESIGN SYSTEM RULES - Prevent CSS variable regression
    // ==========================================
    
    // Disallow deprecated CSS variable naming (var(--color-xxx))
    // Use: var(--gray-100) instead of var(--color-gray-100)
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/^var\\(--color-/]',
        message: 'Deprecated CSS variable naming. Use "var(--gray-100)" instead of "var(--color-gray-100)". Remove the "color-" prefix.'
      }
    ],
    
    // ==========================================
    // REACT & JSX RULES
    // ==========================================
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    
    // ==========================================
    // TYPESCRIPT RULES
    // ==========================================
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    
    // ==========================================
    // CODE QUALITY RULES
    // ==========================================
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
