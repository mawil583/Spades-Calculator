# AGENTS.md

## Workflow rules

- **TDD is mandatory.** Never ship production code without tests, and never
  write the implementation first:
  1. Write a failing test that captures the requested behavior (red).
  2. Implement the smallest change that makes the test pass (green).
  3. Refactor while keeping the suite green.
  - If you are asked to change existing behavior, demonstrate red first (e.g.
    by running the new tests against the unmodified code) before changing it.
- Run the relevant test files (`npx vitest run <paths>`) and `npx tsc --noEmit`
  before considering any task done.
- Before starting any task, read this file and any files it references.

## Project conventions

- Tests live in `src/__tests__/` (unit) and `src/__tests__/integration/`
  (multi-component), plus `cypress/e2e/` for end-to-end flows.
- Use `createMockGlobalContext` from `src/__tests__/utils/mockContext.ts` to
  build `GlobalContext` values in component tests.
- Feature flags: `src/helpers/utils/featureFlags.ts` (`FLAG_DEFAULTS`,
  `setFeatureFlag`). Always reset flags/localStorage in `beforeEach` so tests
  stay order-independent.
