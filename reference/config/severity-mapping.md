# Severity Mapping

**Document type:** Configuration reference
**Consumes:** `docs/taxonomy/index.md`, `components/design-tokens.md`, `components/warning/component-spec.md`
**Phase:** 6
**Status:** stable

---

## Purpose

Maps the five canonical severity levels to design tokens, ARIA roles, component variants, and behavioral rules. Use this document to understand the implications of assigning a severity level to a pattern or component.

---

## Severity Level Reference

### Informational

| Property | Value |
|---|---|
| Severity token | `informational` |
| Surface token | `--guardrail-severity-informational-surface` |
| Text token | `--guardrail-severity-informational-text` |
| Icon token | `--guardrail-severity-informational-icon` |
| ARIA role | `status` |
| `aria-live` | `polite` |
| Focus trap | No |
| Blocks interaction | No |
| Auto-dismiss | Optional (configurable) |
| Entrance duration | `--guardrail-duration-100` |
| Z-index tier | `--guardrail-priority-inline` |
| User action required | No |
| Audit level | `standard` |

**Use for:** Passive disclosures, contextual tips, high-confidence state badges that appear without user request. The user should be aware but not interrupted.

---

### Advisory

| Property | Value |
|---|---|
| Severity token | `advisory` |
| Surface token | `--guardrail-severity-advisory-surface` |
| Text token | `--guardrail-severity-advisory-text` |
| Icon token | `--guardrail-severity-advisory-icon` |
| ARIA role | `status` |
| `aria-live` | `polite` |
| Focus trap | No |
| Blocks interaction | No |
| Auto-dismiss | Configurable |
| Entrance duration | `--guardrail-duration-200` |
| Z-index tier | `--guardrail-priority-ambient` |
| User action required | No (optional acknowledge) |
| Audit level | `standard` |

**Use for:** Moderate-confidence disclosures, inline warnings on first failure, ambient stale-context badges. The user should notice but can proceed.

---

### Caution

| Property | Value |
|---|---|
| Severity token | `caution` |
| Surface token | `--guardrail-severity-caution-surface` |
| Text token | `--guardrail-severity-caution-text` |
| Icon token | `--guardrail-severity-caution-icon` |
| ARIA role | `alert` |
| `aria-live` | `polite` |
| Focus trap | No |
| Blocks interaction | No (but visually prominent) |
| Auto-dismiss | Not recommended |
| Entrance duration | `--guardrail-duration-300` |
| Z-index tier | `--guardrail-priority-warning` |
| User action required | Yes (explicit acknowledgment) |
| Audit level | `standard` |

**Use for:** Low-confidence disclosures with meaningful risk, session-level progressive warnings at Turn 2+, clarification requests in complex workflows. The user must read and decide.

---

### Blocking

| Property | Value |
|---|---|
| Severity token | `blocking` |
| Surface token | `--guardrail-severity-blocking-surface` |
| Text token | `--guardrail-severity-blocking-text` |
| Icon token | `--guardrail-severity-blocking-icon` |
| ARIA role | `alertdialog` |
| `aria-live` | `assertive` |
| Focus trap | Yes |
| Blocks interaction | Yes — all underlying UI inaccessible |
| Auto-dismiss | Never |
| Entrance duration | `--guardrail-duration-400` |
| Z-index tier | `--guardrail-priority-blocking` |
| User action required | Yes — explicit grant, deny, or acknowledge |
| Audit level | `detailed` |

**Use for:** Permission gates, blocking warnings, policy warnings, modal confirmations before consequential actions. The user cannot proceed without explicitly acting.

---

### Critical

| Property | Value |
|---|---|
| Severity token | `critical` |
| Surface token | `--guardrail-severity-critical-surface` |
| Text token | `--guardrail-severity-critical-text` |
| Icon token | `--guardrail-severity-critical-icon` |
| ARIA role | `alertdialog` |
| `aria-live` | `assertive` |
| Focus trap | Yes — full keyboard capture |
| Blocks interaction | Yes — interrupt mode |
| Auto-dismiss | Never |
| Entrance duration | `--guardrail-duration-600` |
| Z-index tier | `--guardrail-priority-escalation` |
| User action required | Yes — explicit acknowledgment with audit record |
| Audit level | `critical` |

**Use for:** Emergency escalation overlays, unresolvable-state notifications in safety-critical contexts. Reserved exclusively for Risk = 4 events.

---

## Severity-to-Pattern Mapping

| Pattern | Default severity | Can override? |
|---|---|---|
| `inline-warning` | advisory | Yes — to caution |
| `ambient-warning` | informational | Yes — to advisory |
| `modal-warning` | caution | Yes — to blocking |
| `blocking-warning` | blocking | No |
| `progressive-warning` | advisory → caution → blocking (escalates) | No |
| `policy-warning` | blocking | No |
| `confidence-disclosure` | informational → advisory (by depth) | Yes |
| `limitation-disclosure` | advisory → caution (by depth) | Yes |
| `source-citation` | informational | No |
| `reasoning-trace` | informational | No |
| `decision-summary` | informational | No |
| `structured-uncertainty-disclosure` | advisory | Yes — to caution |
| `one-time-permission` | blocking | No |
| `session-permission` | blocking | No |
| `persistent-permission` | blocking | No |
| `scoped-permission` | blocking | No |
| `delegated-permission` | blocking | No |
| `revocation` | advisory | Yes — to caution |
| `high-confidence-state` | none (no component) | N/A |
| `moderate-confidence-state` | informational | Yes |
| `low-confidence-state` | advisory | Yes |
| `conflicting-evidence-state` | caution | No |
| `insufficient-information-state` | caution | No |
| `stale-context-state` | advisory | Yes |
| `unresolvable-state` | critical (safety) / blocking (non-safety) | Safety context: No |
| `safe-refusal` | caution | No |
| `partial-completion` | advisory | Yes |
| `constrained-completion` | advisory | Yes |
| `alternative-suggestion` | advisory | Yes |
| `clarification-request` | advisory | Yes |
| `human-handoff` (refusal) | caution | No |
| `policy-refusal` | blocking | No |
| `human-handoff` (escalation) | caution | No |
| `role-escalation` | caution | No |
| `system-escalation` | caution | No |
| `emergency-escalation` | critical | No |
| `async-review-escalation` | advisory | No |
| `retry-recovery` | advisory | Yes |
| `redirect-recovery` | advisory | Yes |
| `repair-recovery` | advisory | Yes |
| `manual-override-recovery` | blocking (requires explicit acknowledgment) | No |
| `abandon-recovery` | advisory | Yes |

---

## Progressive Warning Escalation

The `progressive-warning` pattern escalates severity across session turns:

| Turn | Severity | Component | Trigger |
|---|---|---|---|
| 1 (first failure) | advisory | `WarningBanner` (inline) | First retrieval failure |
| 2–3 | caution | `WarningBanner` (session) | Second failure or negative sentiment |
| 4+ or explicit request | blocking | `ModalWarning` | User frustration threshold or explicit escalation request |

Deployment teams may configure the turn thresholds but not the severity escalation direction.
