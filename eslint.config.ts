// eslint.config.ts
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
  files: ['**/*.ts', '**/*.tsx'],
  ignores: ['dist', 'node_modules', 'coverage', 'src/gen'],

  plugins: {
    import: importPlugin
  },

  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: ['./tsconfig.json'],
      ecmaVersion: 2020,
      sourceType: 'module'
    }
  },

  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json'
      }
    }
  },

  rules: {
    ...prettier.rules,
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }]
  }
});
