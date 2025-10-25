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
  - Limited TypeScript "include" to src/\*_/_ and disabled allowJs/checkJs to
    avoid pulling JS configs into the TS program.
  - Removed unsupported "all" option from Vitest V8 coverage config.
  - Updated rollup.config.ts to avoid JSON import assertions and corrected
    plugin array usage; externals resolved via function. Added "typecheck" npm script.

- Adopt Rollup config modeled from reference project:
  - Added alias "@", externalized Node built-ins and runtime deps, minified
    library builds, and copied stan.system.md into dist.
  - Kept types output at dist/index.d.ts for package.json compatibility.
- Restrict tsconfig "include" to "src/\*_/_" to avoid type-checking config files
  (resolves build/docs TypeScript errors).
- Enforce repo-wide TS type-check (including config .ts files):
  - tsconfig "include" set to "\*_/_.ts" to include all TS files.
  - Limited ambient types to ["node"] to avoid implicit inclusion of unrelated
    @types packages (prevents TS2688 for eslint\_\_js).
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
    @types/eslint\_\_js, @types/eslint-config-prettier.
  - Added eslint-plugin-vitest and enabled recommended rules/globals for
    \*.test.ts files.

- Vitest ESLint integration:
  - Disabled vitest/valid-expect for \*.test.ts to allow Chai-style chainers
    used by Vitest (e.g., expect(x).to.equal(y)).

- Migrate ESLint config to TypeScript:
  - Replaced eslint.config.js with eslint.config.ts (flat config).
  - Strict, type-aware linting enabled via @typescript-eslint across ALL TS
    files, including tests and configs.
  - Updated lint scripts to lint and format the entire repo (not src-only).

- ESLint TS config hardening:
  - Switched to ESLint's defineConfig API (replaces deprecated tseslint.config).
  - Expanded ignores to exclude .rollup.cache, docs/\*_, and all _.js outputs.
  - Removed unnecessary optional chaining/nullish coalescing in Vitest globals.
  - Lint now targets only TypeScript sources, including tests and configs.

- ESLint config cleanup:
  - Replaced optional chaining/nullish coalescing when spreading Vitest
    recommended rules with direct access to avoid self-lint errors.

- Knip configuration:
  - Added knip.json to ignore docs/\*\* and to ignore devDependencies
    auto-changelog and cross-env.

- Prettier integrated with ESLint:
  - Added eslint-plugin-prettier and enabled 'prettier/prettier' rule so
    `eslint . --fix` also formats with Prettier.
  - Updated knip.json to ignore 'prettier' (used via ESLint plugin).

- ESLint Vitest plugin migration:
  - Replaced deprecated eslint-plugin-vitest with @vitest/eslint-plugin and
    updated eslint.config.ts to use the new plugin import and configs.

- Vitest ESLint plugin typing & dep scope:
  - Cast plugin object to ESLint Plugin type to satisfy TS in eslint.config.ts,
    and removed explicit vitest globals (tests import from 'vitest').
  - Moved @vitest/eslint-plugin to devDependencies.

- ESLint config typing cleanup:
  - Removed invalid type import from 'eslint' and avoided 'any'/unsafe casts by
    extracting Vitest recommended rules with a typed helper and casting the
    plugin at its use site.

- Test fix (Vitest SSR import resolution):
  - Updated src/readme.test.ts to import MockDb from './MockDb' directly to
    avoid "is not a constructor" when bundler resolves '.' differently under SSR.

- Knip cleanup:
  - Removed redundant ignoreDependencies for auto-changelog and prettier.

- Build warnings filter:
  - Updated stan.config.yml build warnPattern to match only plugin typescript
    warnings and explicitly ignore the benign “outputToFilesystem” message.

- Documentation & exports:
  - README: expanded with installation, ESM/CJS usage, complete API overview
    (QueryOptions, QueryReturn, behaviors), examples, and project scripts.
  - Exports: re-exported convenient types (Entity, SortOrder, TranscodeMap,
    DefaultTranscodeMap) so consumers can import all needed types from this
    package without depending on entity-tools directly.