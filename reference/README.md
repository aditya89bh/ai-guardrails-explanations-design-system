# Reference Implementations

**Phase:** 6
**Status:** stable

This directory contains machine-readable schemas, deployment configurations, and reference implementations that consume the design system's existing Pattern Library, Decision Engine, and Component Library.

---

## Purpose

Phase 6 artifacts are the bridge between design system documentation and working code. They do not introduce new guardrail concepts — they express existing patterns and decision engine logic in machine-readable form and demonstrate how to implement them.

---

## Directory Layout

```
reference/
├── README.md                        # This file
│
├── json/                            # JSON Schema definitions
│   ├── patterns.schema.json         # Schema for guardrail pattern configurations
│   ├── decision-engine.schema.json  # Schema for decision engine rule sets
│   ├── component.schema.json        # Schema for component configuration objects
│   └── guardrail-policy.schema.json # Schema for deployment policy documents
│
├── yaml/                            # Deployment-ready YAML configurations
│   ├── healthcare-config.yaml       # Clinical AI deployment policy
│   ├── finance-config.yaml          # Financial services fraud detection policy
│   ├── developer-copilot-config.yaml # Developer tools policy
│   └── industrial-ai-config.yaml   # Industrial process monitoring policy
│
├── config/                          # Human-readable configuration reference
│   ├── default-policy.md            # Default configuration values and rationale
│   ├── severity-mapping.md          # Severity level to component/behavior mapping
│   ├── risk-thresholds.md           # P1 risk value definitions and pattern triggers
│   ├── confidence-mapping.md        # P2 confidence state definitions and thresholds
│   └── permission-mapping.md        # P4 permission model and role definitions
│
├── react/                           # React component reference implementations
│   ├── WarningBanner.jsx
│   ├── PermissionGate.jsx
│   ├── ConfidenceBadge.jsx
│   ├── RefusalCard.jsx
│   ├── RecoveryPrompt.jsx
│   └── EmergencyEscalationOverlay.jsx
│
├── nextjs/                          # Next.js full-pipeline reference page
│   └── GuardrailDemo.jsx
│
└── examples/                        # Complete JSON example payloads
    ├── healthcare-payload.json
    ├── finance-payload.json
    ├── developer-copilot-payload.json
    └── industrial-ai-payload.json
```

---

## How to Use

### Schemas
Use `reference/json/` schemas to validate your guardrail configuration objects before runtime. Each schema corresponds to a layer of the decision engine.

### YAML Configurations
The `reference/yaml/` files are ready-to-adapt deployment configurations. Copy the closest industry config, adjust thresholds for your deployment, and validate against `guardrail-policy.schema.json`.

### Configuration Reference
`reference/config/` documents explain each configuration dimension (severity, risk, confidence, permission) and map values to patterns and component behaviors. Read these before modifying threshold values.

### React Examples
`reference/react/` contains framework-specific reference implementations for six core components. They are not production-ready — they demonstrate props, states, variants, accessibility attributes, and design token usage. Each component references its specification in `components/`.

### Next.js Demo Page
`reference/nextjs/GuardrailDemo.jsx` demonstrates the full pipeline from primitive evaluation input to rendered component output in a single page component.

### JSON Payloads
`reference/examples/` contains realistic request and response payload examples for four industry scenarios, matching the case studies in `docs/case-studies/`.

---

## Source of Truth

This directory consumes — and does not replace — the following design system documents:

| Source | What it governs |
|---|---|
| `patterns/` | Pattern specifications (the 36 canonical patterns) |
| `docs/decision-flows/` | Decision engine logic (selection, precedence, state machines, composition) |
| `components/` | Component specifications (anatomy, props, states, accessibility, motion, responsive) |
| `components/design-tokens.md` | All design token names used in React examples |
| `docs/taxonomy/index.md` | All terminology used in schemas and configs |
