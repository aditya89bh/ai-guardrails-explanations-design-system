# Uncertainty Components

**Pattern category:** Uncertainty states
**Phase:** 4
**Status:** stable
**Pattern specs:** `patterns/uncertainty/`

---

## Purpose

Uncertainty components surface the AI's operating confidence state to users. They are the visible layer over the internal state machine defined in `docs/decision-flows/state-transition-engine.md`. Unlike warning components (which communicate external risk), uncertainty components communicate the AI's internal epistemic state — how reliable its output is for this specific query.

Uncertainty components are typically attached to specific output elements rather than shown as standalone interruptions. They are passive by default and become interactive when the user wants to explore deeper.

---

## Components in This Category

| Component | Implements state | Primary display mode |
|---|---|---|
| `UncertaintyIndicator` | All confidence states | Inline badge/icon |
| `ConflictingEvidenceCard` | `conflicting-evidence-state` | Card with evidence comparison |
| `InsufficientInfoDisclosure` | `insufficient-information-state` | Inline notice |
| `StaleContextBadge` | `stale-context-state` | Badge on output |
| `UnresolvableStateCard` | `unresolvable-state` | Card leading to refusal |

---

## Files in This Directory

| File | Contents |
|---|---|
| `README.md` | This file |
| `component-spec.md` | Full specification for all uncertainty components |
| `interaction-model.md` | State transitions reflected in UI, tooltip interactions |
| `accessibility.md` | Live region announcements for state changes |
| `motion.md` | State transition animations, indicator pulse |
| `responsive.md` | Indicator placement on narrow viewports |
