import { defineConfig } from 'vitest/config';

// Testes do comportamento de script.js e da integridade do index.html (PGC 5.1 e 5.3).
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['script.js'],
      reporter: ['text', 'html', 'lcov'],
      // Quality gate de cobertura (PGC 5.3): abaixo disso o CI falha.
      thresholds: { lines: 60, statements: 60, functions: 60, branches: 50 },
    },
  },
});
