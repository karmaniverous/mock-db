import eslint from '@eslint/js';
import prettierPlugin from 'eslint-config-prettier';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import tsDocPlugin from 'eslint-plugin-tsdoc';
import vitestPlugin from 'eslint-plugin-vitest';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Ignore build artifacts and coverage
  { ignores: ['coverage/**/*', 'dist/**/*'] },
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
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-unused-vars': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'tsdoc/syntax': 'warn',
    },
  },
  // Vitest rules and globals for test files
  {
    files: ['**/*.test.ts'],
    plugins: {
      vitest: vitestPlugin,
    },
    languageOptions: {
      globals: vitestPlugin.environments?.env?.globals ?? {},
    },
    rules: {
      ...(vitestPlugin.configs?.recommended?.rules ?? {}),
      // Allow Chai-style chainers provided by Vitest (e.g., .to.equal)
      'vitest/valid-expect': 'off',
    },
  },
);
