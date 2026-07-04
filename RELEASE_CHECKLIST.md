# Release Checklist

Walk through this checklist before tagging any release. All items must be checked.

---

## Pre-release Validation

### Tests

- [ ] `cd tests && npm install && npm test` — all suites pass
- [ ] Decision engine test suite: all 14 rules evaluated correctly
- [ ] Schema validation test suite: all 4 schemas valid
- [ ] Payload validation test suite: all 4 payloads conform to schemas
- [ ] YAML validation test suite: all 4 configs load without errors
- [ ] No test suite has been disabled or skipped without documented justification

### CI

- [ ] All GitHub Actions workflows are green on `main`
- [ ] `markdown-lint.yml` passes
- [ ] `link-check.yml` passes (or failing links are documented as known-external issues)
- [ ] `playground-build.yml` passes
- [ ] `schema-validation.yml` passes
- [ ] `smoke-tests.yml` passes

### Playground

- [ ] `cd playground && npm install && npm run build` completes without errors
- [ ] All 5 scenarios load and produce expected engine output
- [ ] Healthcare scenario: activates `constrained-completion` + `confidence-disclosure` + `limitation-disclosure`
- [ ] Finance scenario: activates `policy-refusal` + `emergency-escalation` (early termination)
- [ ] Developer Copilot scenario: activates `safe-refusal` + `reasoning-trace` + `source-citation`
- [ ] Industrial AI scenario: activates `emergency-escalation` + `abandon-recovery`
- [ ] Customer Support scenario: activates `clarification-request` + `human-handoff`
- [ ] Reset returns all primitives to default values
- [ ] Keyboard shortcuts operational: 1–5, [, ], D, R, ?
- [ ] Dark mode and light mode both render correctly

---

## Documentation

### Required files

- [ ] `README.md` — up to date with current phase and commit count
- [ ] `CHANGELOG.md` — includes entry for this release
- [ ] `CONTRIBUTING.md` — accurate process description
- [ ] `SECURITY.md` — current contact method and SLA
- [ ] `SUPPORT.md` — current help channels
- [ ] `CODE_OF_CONDUCT.md` — present
- [ ] `ROADMAP.md` — next milestones described
- [ ] `RELEASE.md` — present
- [ ] `VERSIONING.md` — version table updated with this release
- [ ] `RELEASE_NOTES.md` — draft reviewed and finalized
- [ ] `LICENSE` — present, MIT

### Documentation quality

- [ ] No files contain placeholder text that should be real content (search for `TODO`, `FIXME`, `your-org`)
- [ ] `your-org` in GitHub URLs updated to the real repository path (or documented as intentional placeholder)
- [ ] All internal links resolve to files that exist in the repository
- [ ] Mermaid diagrams render correctly on GitHub (verify at least 2)

---

## Schema and Data Integrity

- [ ] `reference/json/patterns.schema.json` — valid JSON
- [ ] `reference/json/decision-engine.schema.json` — valid JSON
- [ ] `reference/json/component.schema.json` — valid JSON
- [ ] `reference/json/guardrail-policy.schema.json` — valid JSON
- [ ] `reference/examples/healthcare-payload.json` — valid JSON
- [ ] `reference/examples/finance-payload.json` — valid JSON
- [ ] `reference/examples/developer-copilot-payload.json` — valid JSON
- [ ] `reference/examples/industrial-ai-payload.json` — valid JSON
- [ ] All YAML configs parse without error

---

## Pattern and Component Coverage

- [ ] 36 pattern specification files present in `patterns/`
- [ ] All 7 pattern categories have an index or directory
- [ ] Component specifications exist for all 7 categories
- [ ] `components/component-matrix.md` is current

---

## Repository Hygiene

- [ ] No co-author lines in commit history (since Phase 1)
- [ ] No AI attribution in any file
- [ ] No unverified external citations (no `TODO: verify citation` remaining)
- [ ] No debug code, console.log statements, or development artifacts committed
- [ ] `.gitignore` covers `node_modules/`, `.next/`, `out/`, `.env*`
- [ ] `playground/node_modules/` is not committed

---

## GitHub Configuration

- [ ] `.github/ISSUE_TEMPLATE/bug_report.md` — present
- [ ] `.github/ISSUE_TEMPLATE/feature_request.md` — present
- [ ] `.github/PULL_REQUEST_TEMPLATE.md` — present
- [ ] All 4 CI workflow files present and syntactically valid

---

## Tagging

- [ ] `CHANGELOG.md` entry for this version is finalized
- [ ] `VERSIONING.md` version history table updated
- [ ] Tag message is descriptive: `v1.0.0 — Initial stable release`
- [ ] Tag is annotated (`git tag -a`)
- [ ] Tag is pushed to origin
- [ ] GitHub Release is created with release notes

---

## Post-release

- [ ] Confirm tag appears on GitHub Releases page
- [ ] Confirm CI runs on the tagged commit and passes
- [ ] Close or update any issues resolved by this release
- [ ] Update project status in `README.md` if needed
