# Default Policy Configuration

**Document type:** Configuration reference
**Consumes:** `docs/decision-flows/decision-primitives.md`, `docs/decision-flows/pattern-selection-engine.md`
**Phase:** 6
**Status:** stable

---

## Purpose

This document defines the default configuration values for the guardrail policy system. Deployment teams start here and override values for their specific industry context and risk profile. Each YAML configuration in `reference/yaml/` overrides a subset of these defaults.

---

## Default Values

### Risk Thresholds (P1)

| Threshold | Default value | Description |
|---|---|---|
| `emergencyEscalationMin` | 4 | Minimum P1 value that triggers emergency escalation |
| `roleEscalationMin` | 3 | Minimum P1 value for role escalation (when other conditions met) |
| `blockingWarningMin` | 3 | Minimum P1 for blocking-warning pattern |
| `warningMin` | 1 | Minimum P1 to consider any warning pattern |

### Confidence Thresholds (P2)

| Threshold | Default value | Description |
|---|---|---|
| `high` | 0.90 | Minimum score for High confidence classification |
| `moderate` | 0.70 | Minimum score for Moderate confidence |
| `low` | 0.50 | Minimum score for Low confidence |
| Below low | — | Classified as Insufficient Information |
| `unresolvableWindowSeconds` | 300 | Seconds CE state persists before transitioning to UR state |

### Permission Configuration (P4)

| Setting | Default value | Description |
|---|---|---|
| `passiveDismissalEqualsDenial` | `true` | Cannot be overridden to false |
| `delegationExpiryHours` | 48 | Hours before delegated permission expires |
| `overrideScopePerTransaction` | `true` | Override authorization applies to one transaction |

### Escalation SLAs

| Setting | Default value | Description |
|---|---|---|
| `roleEscalationSlaHours` | 4 | Hours before role escalation promotes to async review |
| `asyncReviewSlaDays` | 14 | Days before async review expires |

### Audit Requirements

| Setting | Default value | Description |
|---|---|---|
| `retentionDays` | 365 | Default audit record retention |
| `immutable` | `true` | Audit records are write-once |
| `auditLevel` | `standard` | Default audit detail level per pattern |

### Accessibility

| Setting | Default value | Description |
|---|---|---|
| `wcagLevel` | `AA` | Minimum WCAG compliance level |
| `requireReducedMotionSupport` | `true` | All components must honor prefers-reduced-motion |

---

## Precedence Order (Default)

The decision engine evaluates and renders patterns in this precedence order when multiple categories activate simultaneously. Industry configs may not reorder the first four entries.

```
1. policy-refusal      (highest — always supersedes other patterns)
2. safe-refusal
3. blocking-warning
4. emergency-escalation
5. permission          (gates must resolve before lower items render)
6. explanation
7. uncertainty
8. recovery            (lowest — surfaces only after blocking conditions resolve)
```

---

## Default Composition Rules

These rules apply in all deployments and cannot be overridden:

1. Only one warning pattern may render simultaneously.
2. Only one refusal pattern may render simultaneously.
3. `policy-refusal` and `safe-refusal` are mutually exclusive.
4. `blocking-warning` and `inline-warning` are mutually exclusive.
5. `emergency-escalation` suppresses all other escalation patterns.
6. Any recovery pattern is suppressed while a blocking or critical-severity component is active.
7. Passive dismissal of a permission gate always equals denial — no override.

---

## Override Process

To override a default value for a deployment:

1. Copy the closest industry YAML from `reference/yaml/`.
2. Modify only the values that differ from the default.
3. Validate the modified YAML against `reference/json/guardrail-policy.schema.json`.
4. Document the override rationale in a comment adjacent to each overridden field.
5. Submit for policy review before deploying to production.

Values that cannot be overridden:
- `passiveDismissalEqualsDenial` — must be `true`
- `immutable` (audit records) — must be `true`
- `wcagLevel` — cannot be set below `AA` for regulated industry deployments
- Precedence positions 1–4 — order cannot be changed
