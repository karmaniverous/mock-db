# Development Plan

## Next up

- Verify CI picks up Vitest coverage artifacts (html/lcov) as expected.
- Optionally adopt eslint-plugin-vitest for additional test linting rules.
- Consider excluding eslint.config.js from TS checking or disabling checkJs
  if typedoc/build encounters JS config typing issues (out of scope for this
  test migration).

## Completed (recent)

- Migrate tests to Vitest:
  - Replaced Mocha/NYC with Vitest and @vitest/coverage-v8.
  - Converted test files to use Vitest APIs (describe/it/expect).
  - Added vitest.config.ts with V8 coverage and reporters (text, text-summary,
    html, lcov).
  - Removed legacy Mocha/NYC config files (.mocharc.json, .nycrc.json).
  - Updated package.json scripts and devDependencies accordingly.
  - Dropped mocha plugin from ESLint config.
  - Updated VS Code recommendations/settings for Vitest.

