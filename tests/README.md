# Tests

Automated validation suite for the AI Guardrails & Explanations Design System.

Uses the Node.js built-in test runner (`node --test`). No test framework required beyond Node.js 18+.

---

## Running Tests

```bash
cd tests
npm install
npm test           # Run all test suites
npm run test:engine   # Decision engine validation only
npm run test:schemas  # JSON schema validation only
npm run test:payloads # Example payload validation only
npm run test:yaml     # YAML configuration validation only
npm run test:smoke    # Smoke tests (playground structure + accessibility)
```

---

## Test Suites

| Suite | File | What it tests |
|---|---|---|
| Decision engine | `engine/engine.test.js` | All 14 selection rules, precedence, composition, 5 scenarios |
| Schema validation | `schemas/schema.test.js` | JSON syntax + structure of all 4 schemas |
| Payload validation | `payloads/payload.test.js` | Example payloads conform to schema structure |
| YAML validation | `yaml/yaml.test.js` | All 4 configs parse without error, required keys present |
| Smoke tests | `smoke/smoke.test.js` | Playground file presence, accessibility markers, CI file presence |

---

## Expected Output

All tests should pass. A test failure before a release blocks the release.

See [RELEASE_CHECKLIST.md](../RELEASE_CHECKLIST.md) for the full pre-release test requirements.
