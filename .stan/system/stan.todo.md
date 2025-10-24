# Development Plan

## Next up

- Verify CI picks up Vitest coverage artifacts (html/lcov) as expected.
- Optionally adopt eslint-plugin-vitest for additional test linting rules.
- Review and prune unused devDependencies flagged by knip (e.g., ts-node,
  source-map-support, auto-changelog) in a follow-up.

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

- Fix build/docs after Vitest migration:
  - Limited TypeScript "include" to src/**/* and disabled allowJs/checkJs to
    avoid pulling JS configs into the TS program.
  - Removed unsupported "all" option from Vitest V8 coverage config.
  - Updated rollup.config.ts to avoid JSON import assertions and corrected
    plugin array usage; externals resolved via function. Added "typecheck" npm script.

- Adopt Rollup config modeled from reference project:
  - Added alias "@", externalized Node built-ins and runtime deps, minified
    library builds, and copied stan.system.md into dist.
  - Kept types output at dist/index.d.ts for package.json compatibility.
- Restrict tsconfig "include" to "src/**/*" to avoid type-checking config files
  (resolves build/docs TypeScript errors).
- Enforce repo-wide TS type-check (including config .ts files):
  - tsconfig "include" set to "**/*.ts" to include all TS files.
  - Limited ambient types to ["node"] to avoid implicit inclusion of unrelated
    @types packages (prevents TS2688 for eslint__js).
  - Removed unsupported "all" option from Vitest V8 coverage config.
- Fix follow-ups after enabling repo-wide TS checks:
  - Added @types/fs-extra to satisfy TS7016 for rollup.config.ts.
  - Updated src/readme.test.ts to import from './MockDb' directly to avoid
    SSR root import resolving to a non-constructible value in Vitest.

- Refactor rollup config to avoid fs-extra dependency:
  - Replaced fs-extra with Node fs/promises (mkdir/access/copyFile) in
    rollup.config.ts copyDocsPlugin.
  - Removed fs-extra and @types/fs-extra from devDependencies.
  - Resolves TS7016 in typecheck/build/docs while keeping all TS files typed.
- Rollup config typecheck fix:
  - Imported readFileSync from node:fs and used it to read package.json for
    externals list, resolving TS2304 in typecheck/build/docs.

- Prune unused devDependencies and add test linting:
  - Removed devDeps no longer used: ts-node, source-map-support,
    @types/eslint__js, @types/eslint-config-prettier.
  - Added eslint-plugin-vitest and enabled recommended rules/globals for
    *.test.ts files.