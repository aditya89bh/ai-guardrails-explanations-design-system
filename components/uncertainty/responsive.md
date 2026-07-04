# Uncertainty Component Responsive Behavior

**Component category:** Uncertainty
**Phase:** 4
**Status:** stable

---

## UncertaintyIndicator Responsive Behavior

UncertaintyIndicator renders inline adjacent to its output and adapts to text flow. No breakpoint-specific layout changes.

Tooltip → bottom sheet on `xs`/`sm` (see explanation/responsive.md for tooltip pattern).

Touch target: ensure the badge is ≥ 44×44px on `xs`/`sm` using surrounding padding.

---

## ConflictingEvidenceCard Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Single column: Source A section → Source B section, vertically stacked |
| `sm` | Single column |
| `md`, `lg` | Two-column side-by-side layout |

On `xs`/`sm`, each source section has its own visible heading so users understand they are reading two different positions.

---

## StaleContextBadge Responsive Behavior

Inline badge — no breakpoint behavior. Staleness date may truncate on `xs` to "As of [date]" (abbreviated). Full label on `sm`+.

---

## UnresolvableStateCard Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `xs` | Full-width card; next-step options stacked vertically, full-width buttons |
| `sm` | Full-width card; options may be side by side if 2 options |
| `md`, `lg` | Card at max 560px; options side by side |
