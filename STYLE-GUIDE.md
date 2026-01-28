# Spades Calculator - Code Style Guide

## File Naming Conventions

### General Principles
- File names should be **descriptive** and **consistent**
- The naming pattern should make it immediately clear what type of file it is
- Test files should mirror the naming of the files they test

---

## Source Files

### React Components
**Pattern:** `PascalCase.jsx`

**Examples:**
- `ActualSection.jsx`
- `PlayerInput.jsx`
- `TeamInputHeading.jsx`
- `ErrorModal.jsx`

**Rationale:** Matches React component naming convention and makes components easily identifiable.

---

### React Hooks
**Pattern:** `useCamelCase.js` or `useCamelCase.jsx`

**Examples:**
- `useValidateActuals.js`
- `useCustomHook.jsx`

**Rationale:** Follows React hooks naming convention (must start with "use").

---

### Utility Functions & Helpers
**Pattern:** `camelCase.js` or `camelCase.jsx`

**Examples:**
- `helperFunctions.js`
- `spadesMath.js`
- `updateInput.js`

**Rationale:** Standard JavaScript module naming for non-component code.

---

### Constants & Configuration
**Pattern:** `camelCase.js` or `SCREAMING_SNAKE_CASE.js`

**Examples:**
- `constants.js`
- `rootReducer.js`
- `CONFIG.js` (if it exports a single constant object)

**Rationale:** Follows JavaScript conventions for configuration modules.

---

## Test Files

### Component Tests
**Pattern:** `ComponentName.test.jsx`

**Rule:** Match the exact name of the component being tested

**Examples:**
- Component: `ActualSection.jsx` → Test: `ActualSection.test.jsx`
- Component: `PlayerInput.jsx` → Test: `PlayerInput.test.jsx`
- Component: `TeamInputHeading.jsx` → Test: `TeamInputHeading.test.jsx`

**For component-specific test suites:**
Use descriptive kebab-case names that indicate what aspect is being tested:
- `ActualSection-team-total.test.jsx` (testing team total feature of ActualSection)
- `PlayerInput-auto-generated.test.jsx` (testing auto-generated feature)

**Important:** No dot notation except for `.test.jsx` - use hyphens to separate words instead.

---

### Hook Tests
**Pattern:** `useHookName.test.js`

**Rule:** Match the exact name of the hook being tested

**Examples:**
- Hook: `useValidateActuals.js` → Test: `useValidateActuals.test.js`
- Hook: `useCustomHook.js` → Test: `useCustomHook.test.js`

---

### Utility/Helper Tests
**Pattern:** `utilityName.test.js`

**Rule:** Match the exact name of the utility file being tested

**Examples:**
- Utility: `helperFunctions.js` → Test: `helperFunctions.test.js`
- Utility: `spadesMath.js` → Test: `spadesMath.test.js`
- Utility: `updateInput.js` → Test: `updateInput.test.js`

---

### Feature/Integration Tests
**Pattern:** `featureName.test.js` or `featureName.test.jsx`

**Rule:** Use camelCase to describe the feature or scenario being tested (Meta/Facebook style)

**Examples:**
- `dealerRotationUnit.test.js`
- `independentTeamScoring.test.jsx`
- `teamTotalStorage.test.js`
- `dealerOverrideScenario.test.js`
- `roundNullHistory.test.jsx`

**Rationale:** Consistent with JavaScript variable naming and Facebook's internal conventions.

---

### Integration Test Directory
**Pattern:** `integration/featureName.test.jsx`

**Examples:**
- `integration/dealerTagIntegration.test.jsx`
- `integration/stateInteractions.test.jsx`
- `integration/userWorkflows.test.jsx`

---

## E2E Test Files (Cypress)

### Pattern: `featureName.cy.js`

**Examples:**
- `dealerRotationFlow.cy.js`
- `newGameFlow.cy.js`
- `pastRoundEditing.cy.js`
- `offline.cy.js`

**Rationale:** Cypress convention uses `.cy.js` suffix; camelCase used for consistency with project style.

---

## File Extensions

### When to use `.js` vs `.jsx`

**Use `.jsx`:**
- Files that contain JSX syntax (React components)
- Test files that render React components
- Integration tests that use React Testing Library

**Use `.js`:**
- Pure JavaScript utilities and helpers
- Configuration files
- Tests that don't render components (pure logic tests)
- Node.js scripts

**Examples:**
- `ActualSection.jsx` ✅ (renders JSX)
- `ActualSection.test.jsx` ✅ (renders component in tests)
- `helperFunctions.js` ✅ (no JSX)
- `helperFunctions.test.js` ✅ (no rendering)
- `spadesMath.js` ✅ (pure functions)

---

## Directory Structure

```
src/
├── components/          # React components (PascalCase.jsx)
│   ├── game/
│   ├── forms/
│   ├── modals/
│   └── ui/
├── helpers/            # Utilities and helpers (camelCase.js)
│   ├── context/
│   ├── math/
│   └── utils/
└── __tests__/          # Test files (mirror source naming)
    ├── integration/    # Integration tests (kebab-case.test.jsx)
    └── *.test.js(x)    # Unit tests (match source file naming)

cypress/
└── e2e/               # E2E tests (kebab-case.cy.js)
```

---

## Naming Anti-Patterns to Avoid

❌ **Mixed casing in single filename:**
- `Round.null-history.test.jsx` → Should be `Round-null-history.test.jsx` or `round-null-history.test.jsx`

❌ **Inconsistent test naming:**
- Component `ActualSection.jsx` with test `actual-section.test.jsx` → Should match: `ActualSection.test.jsx`

❌ **Wrong extension:**
- Pure utility `helperFunctions.jsx` → Should be `.js` (no JSX)
- Component test `ActualSection.test.js` → Should be `.jsx` (renders JSX)

❌ **Unclear feature test names:**
- `test1.test.js` → Should be descriptive: `dealer-rotation-unit.test.js`

❌ **Excessive dot notation:**
- `ActualSection.team-total.test.jsx` → Should use hyphens: `ActualSection-team-total.test.jsx`
- `component.feature.test.jsx` → Should be: `component-feature.test.jsx`
- **Rule:** Only one dot before the extension (`.test.jsx` or `.test.js`)

---

## Quick Reference

| File Type | Pattern | Example |
|-----------|---------|---------|
| React Component | `PascalCase.jsx` | `ActualSection.jsx` |
| React Hook | `useCamelCase.js` | `useValidateActuals.js` |
| Utility/Helper | `camelCase.js` | `helperFunctions.js` |
| Component Test | `ComponentName.test.jsx` | `ActualSection.test.jsx` |
| Hook Test | `useHookName.test.js` | `useValidateActuals.test.js` |
| Utility Test | `utilityName.test.js` | `helperFunctions.test.js` |
| Feature Test | `feature-name.test.js(x)` | `dealer-rotation-unit.test.js` |
| Integration Test | `integration/feature.test.jsx` | `integration/state-interactions.test.jsx` |
| E2E Test | `feature-name.cy.js` | `dealer-rotation-flow.cy.js` |

---

## Additional Style Guidelines

### Import Statements
- Group imports: React → Third-party → Local components → Utilities
- Use named imports for utilities
- Use default imports for components

### Component Organization
- Props destructuring at the top
- Hooks next
- Helper functions
- Event handlers
- Render logic

### Test Organization
- Use `describe` blocks to group related tests
- Use descriptive test names that read like sentences
- Follow AAA pattern: Arrange, Act, Assert

---

## Enforcement

To maintain consistency:
1. Review this guide during code reviews
2. Use ESLint/Prettier for code formatting
3. Consider adding a pre-commit hook to check file naming
4. Update this guide as patterns evolve

---

**Last Updated:** January 27, 2026
