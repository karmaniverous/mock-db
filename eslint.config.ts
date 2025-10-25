import eslint from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import prettierPlugin from 'eslint-config-prettier';
import prettierEslintPlugin from 'eslint-plugin-prettier';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import tsDocPlugin from 'eslint-plugin-tsdoc';
import tseslint from 'typescript-eslint';

// Safely extract Vitest's recommended rules with concrete typing,
// avoiding any/unknown in the config object.
const vitestRecommendedRules = (
  vitest.configs as unknown as {
    recommended: { rules: Record<string, unknown> };
  }
).recommended.rules;

export default defineConfig([
  // Global ignores (keep ESLint away from build/cache JS)
  {
    ignores: [
      'coverage/**/*',
      'dist/**/*',
      'docs/**/*',
      '.rollup.cache/**/*',
      '**/*.js',
    ],
  },
  // Base + strict type-checked rules
  {
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      prettierPlugin,
    ],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
      tsdoc: tsDocPlugin,
      prettier: prettierEslintPlugin,
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-unused-vars': 'off',
      'prettier/prettier': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'tsdoc/syntax': 'warn',
    },
  },
  // Vitest rules and globals for test files
  {
    files: ['**/*.test.ts'],
    plugins: {
      vitest: vitest as never,
    },
    rules: {
      ...vitestRecommendedRules,
      // Allow Chai-style chainers provided by Vitest (e.g., .to.equal)
      'vitest/valid-expect': 'off',
    },
  },
]);
