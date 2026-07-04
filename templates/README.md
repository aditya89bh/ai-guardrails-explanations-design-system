# Reusable Templates

The `templates/` directory contains starting-point templates for teams adopting this design system. Templates are not complete specifications — they are structured scaffolds that accelerate the creation of new pattern specifications, decision flows, component specs, and playbooks.

---

## Available Templates

### Pattern Specification Template
`templates/pattern-specification.md`

A complete empty scaffold for authoring a new guardrail pattern specification. Includes all required sections with inline prompts for each field.

**Use when:** Adding a new pattern to `patterns/`.

---

### Decision Flow Template
`templates/decision-flow.md`

A scaffold for authoring a new decision flow document, including prose logic format, decision table format, and Mermaid flowchart starter.

**Use when:** Adding a new decision flow to `docs/decision-flows/`.

---

### Component Specification Template
`templates/component-specification.md`

A complete empty scaffold for authoring a new UI component specification. Includes anatomy, states, interaction, accessibility, and responsive behavior sections.

**Use when:** Adding a new component specification to `components/`.

---

### Enterprise Playbook Template
`templates/enterprise-playbook.md`

A scaffold for authoring a new enterprise playbook. Structured for governance-ready documentation with sections for policy context, configuration, audit requirements, and rollout guidance.

**Use when:** Adding a new playbook to `docs/enterprise-playbooks/`.

---

### Regulated Industry Document Template
`templates/regulated-industry-document.md`

A scaffold for authoring a domain-specific pattern variant document. Includes sections for regulatory context, pattern delta from baseline, and compliance requirements.

**Use when:** Adding a new document to `docs/regulated-industries/`.

---

### Case Study Template
`templates/case-study.md`

A scaffold for authoring a complete annotated case study. Includes product context, scenario, pattern chain, configuration decisions, and user experience walkthrough sections.

**Use when:** Adding a new case study to `docs/case-studies/`.

---

### Example Template
`templates/example.md`

A scaffold for authoring a focused, annotated pattern example. Includes scenario description, pattern activation, step-by-step walkthrough, and annotation sections.

**Use when:** Adding a new example to `examples/`.

---

## Directory Structure

```
templates/
├── README.md                        # This file
├── pattern-specification.md         # Template for pattern specs
├── decision-flow.md                 # Template for decision flows
├── component-specification.md       # Template for component specs
├── enterprise-playbook.md           # Template for enterprise playbooks
├── regulated-industry-document.md   # Template for regulated industry docs
├── case-study.md                    # Template for case studies
└── example.md                       # Template for annotated examples
```

---

## How to Use Templates

1. Copy the relevant template file to the correct destination directory.
2. Rename the file using the naming convention for that directory (see the relevant `README.md`).
3. Fill in every section. Do not delete sections — mark them `TODO` if content is not yet ready.
4. Set the `Status` field to `draft`.
5. Commit as a separate commit with the appropriate prefix (`pattern:`, `component:`, `docs:`, etc.).

Templates are starting points, not constraints. If a section is genuinely not applicable to the specific pattern or document being authored, replace it with a note explaining why — do not silently delete it.

---

## Template Versioning

Templates are versioned alongside the design system. When the format for a specification type changes:
- The template is updated
- Existing specifications that predate the change are not required to retroactively conform
- The `CHANGELOG.md` records the template change
- New specifications created after the change must use the updated template

_Current template version: 1.0.0 (Phase 1)_

---

## Phase Status

- **Phase 1:** Directory structure, README, and template file list defined
- **Phase 1:** Template files authored and committed (see individual template commits)
- **Phase 8:** Templates reviewed and refined based on Phase 2–7 authoring experience
