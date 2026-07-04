# Explanation Components

**Pattern category:** Explanation patterns
**Phase:** 4
**Status:** stable
**Pattern specs:** `patterns/explanation/`

---

## Purpose

Explanation components make AI reasoning, confidence, and sourcing legible to users without requiring them to understand the underlying model. They surface structured disclosure at the appropriate depth — surface, contextual, or detailed — based on what the decision engine determines is required for the current output.

Explanation components are primarily passive (no required user action) but may include interactive elements for users who want to explore further.

---

## Components in This Category

| Component | Implements pattern | Default interaction |
|---|---|---|
| `ConfidenceBadge` | `confidence-disclosure` | Passive; tooltip on hover/focus |
| `SourceList` | `source-citation` | Expandable list |
| `ReasoningTrace` | `reasoning-trace` | Collapsible drawer |
| `DecisionSummary` | `decision-summary` | Card with expandable sections |
| `LimitationDisclosure` | `limitation-disclosure` | Inline or banner |
| `StructuredUncertaintyCard` | `structured-uncertainty-disclosure` | Card with confidence, sources, limitations |

---

## Files in This Directory

| File | Contents |
|---|---|
| `README.md` | This file |
| `component-spec.md` | Full specification for all explanation components |
| `interaction-model.md` | Expand/collapse, source navigation, keyboard behavior |
| `accessibility.md` | ARIA roles for live regions, tooltips, expandable sections |
| `motion.md` | Expand/collapse animation, tooltip entrance |
| `responsive.md` | Drawer to card fallback on narrow viewports |
