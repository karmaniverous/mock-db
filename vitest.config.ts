import { defineConfig } from 'vitest/config';
//
// Vitest configuration for this project.
// - Node environment
// - Coverage via V8 with common reporters
// - Test glob matches *.test.ts anywhere in the repo (default)
//
export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*'],
      reporter: ['text', 'text-summary', 'html', 'lcov'],
    },
  },
});
