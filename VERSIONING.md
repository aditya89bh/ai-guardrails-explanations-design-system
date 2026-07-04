# Versioning Policy

The AI Guardrails & Explanations Design System follows [Semantic Versioning](https://semver.org/) (SemVer) with documentation-specific interpretations.

---

## Version Format

```
MAJOR.MINOR.PATCH
```

---

## What Counts as a Breaking Change (MAJOR)

Breaking changes require a major version bump because they break existing implementations or create incompatibilities:

- **Taxonomy changes** — renaming, removing, or reclassifying a pattern category, pattern, or severity level
- **JSON schema field removal** — removing a field from any of the 4 JSON schemas
- **JSON schema type change** — changing the type of an existing field (e.g., string → enum)
- **Decision engine rule removal or behavior change** — changing which patterns a rule activates or suppresses
- **Mandatory field additions** — adding a required field to an existing schema
- **Pattern removal** — removing any of the 36 pattern specifications
- **Primitive redefinition** — changing the type, range, or canonical values of P1–P10

---

## What Counts as a New Feature (MINOR)

New features extend the system without breaking existing implementations:

- New case studies
- New Mermaid diagrams or visual documentation
- New example payloads
- New templates
- New enterprise playbooks or regulated-industry content
- New optional fields in JSON schemas (additive, non-breaking)
- New decision primitives in a new namespace that do not affect existing rule logic
- New React component implementations (additive)
- New playground scenarios

---

## What Counts as a Fix (PATCH)

Patches correct without changing meaning or breaking compatibility:

- Broken links
- Typos and grammatical corrections
- Clarifying wording that does not change the specified behavior
- Correcting incorrect cross-references
- Fixing broken CI workflows
- Fixing playground bugs that do not change engine output
- Correcting example payloads that do not conform to the schema

---

## Taxonomy Lock

**The taxonomy is locked at v1.0.0.** Taxonomy changes (pattern names, categories, severity levels) are breaking changes regardless of scope. Even renaming a single pattern requires a major version bump because:

1. Audit records reference canonical pattern names
2. Policy configuration files reference canonical pattern names
3. Component IDs reference canonical pattern names

Any proposed taxonomy change must go through a taxonomy amendment process that assesses cross-reference impact across all 36 pattern specs, 47 component specs, 4 schemas, and 4 YAML configs.

---

## Schema Stability

JSON schemas are backward-compatible within a major version:

- Fields may be added (new optional fields)
- Fields may never be removed or renamed within a major version
- `additionalProperties: false` schemas must not add required fields without a major bump

---

## Pre-release Identifiers

Pre-release versions use the following identifiers:

| Identifier | Meaning |
|---|---|
| `v1.1.0-draft` | Draft in progress — do not implement |
| `v1.1.0-rc.1` | Release candidate — stable for review |

---

## Version History

| Version | Date | Type | Summary |
|---|---|---|---|
| v1.0.0 | Phase 9 complete | Major | Initial stable release — 216 commits across Phases 1–9; 36 patterns, 165 tests, 5 CI workflows |
