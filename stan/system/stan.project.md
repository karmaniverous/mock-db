# Project Prompt (repo-specific policies)

- Testing
  - Use Vitest for all tests. Mocha/NYC are not used.
  - Test files use the pattern *.test.ts and run under the Node environment.
  - The test command runs "vitest run --coverage".
  - Coverage is provided by the V8 provider with reporters: text, text-summary, html, and lcov.
  - Prefer importing Vitest APIs directly:
    - import { describe, it, expect } from 'vitest'
  - Chai-style assertions like expect(x).to.equal(y) are supported via Vitest's expect.

- Editor
  - VS Code: recommend Vitest Explorer instead of Mocha test adapter.

- Lint
  - ESLint config does not include mocha plugin; tests are validated by general TypeScript/ESLint rules.

- Notes
  - If additional Vitest-specific lint rules are desired in the future, consider eslint-plugin-vitest.

