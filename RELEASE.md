# Release Guide

This document describes the release process for the AI Guardrails & Explanations Design System.

---

## Release Types

| Type | Version bump | Trigger |
|---|---|---|
| **Patch** | `1.0.x` | Fixes to documentation, broken links, specification clarifications that do not change behavior |
| **Minor** | `1.x.0` | New content that extends without breaking: new case studies, new diagrams, new example payloads, new templates |
| **Major** | `x.0.0` | Taxonomy changes, breaking changes to JSON schemas, decision engine specification changes, pattern removal or rename |

See [VERSIONING.md](VERSIONING.md) for the full versioning policy.

---

## Release Cadence

There is no fixed release cadence. Releases are triggered by:

1. Completion of a development phase (Phase 9, 10, etc.)
2. Accumulation of patch-level fixes significant enough to warrant a point release
3. Critical corrections to decision engine specifications

---

## Release Process

### 1. Pre-release validation

Run the full validation suite:

```bash
cd tests && npm install && npm test
```

Expected result: all suites pass. Do not release with failing tests.

Verify CI on the `main` branch is green (check `.github/workflows/`).

### 2. Validate release checklist

Walk through [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) line by line. All items must be checked before tagging.

### 3. Update CHANGELOG.md

Add a dated release entry at the top of CHANGELOG.md:

```markdown
## v1.x.x — [date]

**Changes:** [summary]
```

### 4. Update version references

Update any version strings in:
- `README.md` badges (if using a version badge)
- `docs/release-readiness.md` (if present)

### 5. Tag the release

```bash
git tag -a v1.x.x -m "Release v1.x.x — [short summary]"
git push origin v1.x.x
```

### 6. Create GitHub Release

```bash
gh release create v1.x.x \
  --title "v1.x.x — [short summary]" \
  --notes-file RELEASE_NOTES.md
```

### 7. Verify the release

- Confirm the tag is visible on GitHub.
- Confirm the release appears in the GitHub Releases page.
- Confirm CI passes on the tagged commit.

---

## Hotfix Process

For urgent corrections (broken decision engine spec, incorrect safety-critical guidance):

1. Create a branch from the tag: `git checkout -b hotfix/v1.0.1 v1.0.0`
2. Apply the fix.
3. Run the full test suite.
4. Tag and release as a patch: `v1.0.1`.
5. Merge back into `main`.

---

## v1.0.0 Release

The v1.0.0 release represents the first stable, production-ready version of the design system.

**Included in v1.0.0:**
- 36 pattern specifications across 7 categories
- 6-document decision engine (14 selection rules)
- 47 component specifications
- 8 case studies across 8 industries
- 4 JSON schemas
- 4 industry YAML configurations
- 6 React reference implementations
- Interactive playground with 5 scenarios
- Complete documentation suite

**Not included in v1.0.0 (planned for v1.1+):**
See [ROADMAP.md](ROADMAP.md) for planned post-v1.0.0 content.

See [RELEASE_NOTES.md](RELEASE_NOTES.md) for the full v1.0.0 release notes.
