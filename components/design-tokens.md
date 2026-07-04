# Design Tokens

**Document type:** Component library — design foundation
**Phase:** 4
**Status:** stable

---

## Purpose

Design tokens are the named, role-specific values that all guardrail components consume. They abstract raw values (hex codes, milliseconds, pixels) into semantic names that reflect the role of each value within the trust and safety design system. Changing a token value updates all components that reference it — tokens are the single source of truth for visual consistency.

All tokens are defined in category–role–modifier format: `[category]-[role]-[modifier]`. Teams implementing this system should map these tokens to their own design token infrastructure (CSS custom properties, Figma variables, Style Dictionary, etc.).

---

## Severity Tokens

Severity tokens map to the five severity levels defined in `docs/taxonomy/index.md`: Informational, Advisory, Caution, Blocking, Critical.

### Color Tokens — Surface

Surface tokens are used for component backgrounds at each severity level.

| Token | Role | Light mode guidance | Dark mode guidance |
|---|---|---|---|
| `severity-informational-surface` | Background for informational severity | Low-saturation blue tint | Low-saturation blue-gray tint |
| `severity-advisory-surface` | Background for advisory severity | Low-saturation amber tint | Low-saturation amber-gray tint |
| `severity-caution-surface` | Background for caution severity | Low-saturation orange tint | Low-saturation orange-gray tint |
| `severity-blocking-surface` | Background for blocking severity | Low-saturation red tint | Low-saturation red-gray tint |
| `severity-critical-surface` | Background for critical severity | High-saturation red | High-saturation red-gray |

### Color Tokens — Text

Text tokens ensure sufficient contrast against the corresponding surface token.

| Token | Role | Contrast requirement |
|---|---|---|
| `severity-informational-text` | Text on informational surface | ≥ 4.5:1 against `severity-informational-surface` |
| `severity-advisory-text` | Text on advisory surface | ≥ 4.5:1 against `severity-advisory-surface` |
| `severity-caution-text` | Text on caution surface | ≥ 4.5:1 against `severity-caution-surface` |
| `severity-blocking-text` | Text on blocking surface | ≥ 4.5:1 against `severity-blocking-surface` |
| `severity-critical-text` | Text on critical surface | ≥ 4.5:1 against `severity-critical-surface` |

### Color Tokens — Icon and Border

| Token | Role |
|---|---|
| `severity-informational-icon` | Icon fill/stroke at informational severity |
| `severity-advisory-icon` | Icon fill/stroke at advisory severity |
| `severity-caution-icon` | Icon fill/stroke at caution severity |
| `severity-blocking-icon` | Icon fill/stroke at blocking severity |
| `severity-critical-icon` | Icon fill/stroke at critical severity |
| `severity-informational-border` | Border or left-edge accent at informational severity |
| `severity-advisory-border` | Border or left-edge accent at advisory severity |
| `severity-caution-border` | Border or left-edge accent at caution severity |
| `severity-blocking-border` | Border or left-edge accent at blocking severity |
| `severity-critical-border` | Border or left-edge accent at critical severity |

### Non-severity Component Colors

| Token | Role |
|---|---|
| `component-surface-default` | Default background for neutral components (explanation, uncertainty disclosure without warning) |
| `component-surface-subtle` | Subdued background for passive disclosures |
| `component-text-primary` | Primary text on default surface |
| `component-text-secondary` | Secondary / supporting text on default surface |
| `component-text-disabled` | Text in disabled state |
| `component-border-default` | Default border color |
| `component-border-focus` | Focus ring color — must meet WCAG 2.1 AA focus-visible requirements (3:1 contrast against adjacent colors) |

---

## Priority (Z-Index) Tokens

Z-index tokens define stacking order for components that must appear above other content.

| Token | Value range | Usage |
|---|---|---|
| `priority-inline` | Base document flow | Inline components (inline warning, confidence badge) |
| `priority-banner` | Sticky layer above content | Banner components (ambient warning, blocking warning banner) |
| `priority-overlay` | Overlay layer | Semi-transparent overlays behind modals |
| `priority-modal` | Modal layer | Modal dialogs (modal warning, permission gate, refusal modal) |
| `priority-escalation` | Above modal layer | Emergency escalation notifications |
| `priority-tooltip` | Tooltip layer | Explanation tooltips, source citation popovers |

**Rule:** No component may arbitrarily exceed its assigned priority tier. Emergency escalation components are the only components that may interrupt an in-progress modal interaction.

---

## Elevation Tokens

Elevation tokens define shadow treatment to communicate the layer position of a component.

| Token | Role | Usage |
|---|---|---|
| `elevation-0` | No shadow | Inline components in document flow |
| `elevation-1` | Subtle shadow | Banners, inline notifications |
| `elevation-2` | Moderate shadow | Cards, drawers |
| `elevation-3` | Prominent shadow | Modals, permission gates |
| `elevation-4` | Maximum shadow | Emergency escalation modals, blocking overlays |

---

## Spacing Tokens

Spacing tokens define internal padding, gap, and margin for component layouts.

| Token | Scale | Typical usage |
|---|---|---|
| `spacing-xs` | 4px | Icon-to-text gap within a label |
| `spacing-sm` | 8px | Internal component padding (compact mode) |
| `spacing-md` | 12px | Standard component internal padding |
| `spacing-lg` | 16px | Component section separation |
| `spacing-xl` | 24px | Component-to-content separation |
| `spacing-2xl` | 32px | Between major component sections |
| `spacing-3xl` | 48px | Between component groups |

**Touch target minimum:** All interactive controls must have a minimum clickable area of 44×44px regardless of visual size. Use padding to achieve this where the visual element is smaller.

---

## Icon Tokens

Icon tokens define the named icons for each severity level and pattern category. Implementation teams supply their own icon assets; these tokens define the semantic role each icon must fulfill.

| Token | Semantic role | Notes |
|---|---|---|
| `icon-severity-informational` | Informational notice | Circle with "i" — not alarming |
| `icon-severity-advisory` | Advisory notice | Triangle or exclamation — mild urgency |
| `icon-severity-caution` | Caution notice | Triangle with exclamation — clear urgency |
| `icon-severity-blocking` | Blocking notice | Filled circle with stop symbol or X |
| `icon-severity-critical` | Critical emergency | High-contrast filled warning |
| `icon-confidence-high` | High confidence indicator | Solid indicator — implies reliability |
| `icon-confidence-moderate` | Moderate confidence indicator | Partial or hollow indicator |
| `icon-confidence-low` | Low confidence indicator | Minimal indicator or dash |
| `icon-permission-gate` | Permission request | Lock or shield symbol |
| `icon-permission-granted` | Permission granted | Unlocked lock or checkmark |
| `icon-permission-revoked` | Permission revoked or denied | Locked lock or X on shield |
| `icon-refusal` | Request declined | X or stop symbol |
| `icon-escalation` | Escalated to human/system | Arrow-up or person-with-arrow |
| `icon-recovery` | Recovery action available | Arrow-circle or refresh symbol |
| `icon-audit` | Audit log entry exists | Shield-with-checkmark or clipboard |
| `icon-dismiss` | Dismiss control | X or close symbol |
| `icon-expand` | Expand section | Chevron-down |
| `icon-collapse` | Collapse section | Chevron-up |
| `icon-external` | External link | Arrow-up-right |

**Icon accessibility rule:** Every icon used to communicate severity, state, or action must have an associated accessible label (aria-label, aria-describedby, or visually hidden text). Icons may never be the sole communicator of meaning.

---

## Animation and Timing Tokens

Animation tokens define durations and easing functions. All animations must respect the `prefers-reduced-motion` media query — see the reduced motion fallback column.

### Duration Tokens

| Token | Value | Usage | Reduced motion fallback |
|---|---|---|---|
| `duration-instant` | 0ms | Immediate state updates (disabled states, value changes) | Same — no animation expected |
| `duration-fast` | 100ms | Micro-interactions (icon state change, badge count update) | 0ms — instant |
| `duration-moderate` | 200ms | Standard UI transitions (expand, collapse, tab switch) | 0ms — instant |
| `duration-standard` | 300ms | Component entrance/exit (inline notification, drawer) | 0ms — instant |
| `duration-deliberate` | 400ms | Consequential transitions (modal open, blocking overlay) | 100ms — minimal |
| `duration-long` | 600ms | Emphasis transitions (critical warning entrance) | 150ms — minimal |

### Easing Tokens

| Token | Curve | Usage |
|---|---|---|
| `easing-enter` | Decelerate (ease-out) | Component entering the screen — starts fast, slows to rest |
| `easing-exit` | Accelerate (ease-in) | Component leaving the screen — starts slow, exits fast |
| `easing-standard` | Ease-in-out | State changes within a visible component |
| `easing-spring` | Spring curve (bounce-very-low) | Confirmation or success state — adds sense of resolution |
| `easing-linear` | Linear | Progress indicators, timers |

---

## Border Treatment Tokens

| Token | Role | Usage |
|---|---|---|
| `border-radius-sm` | Small radius (4px) | Inline badges, chips |
| `border-radius-md` | Medium radius (8px) | Notification banners, cards |
| `border-radius-lg` | Large radius (12px) | Modal dialogs, drawer headers |
| `border-radius-full` | Pill (50%) | Status indicators, confidence dots |
| `border-width-default` | 1px | Default borders |
| `border-width-accent` | 3px | Severity left-edge accent (blocking, critical) |
| `border-width-focus` | 2px | Focus ring stroke width |

---

## Focus Indicator Tokens

Focus indicators must meet WCAG 2.1 AA requirements for focus-visible. They must have a contrast ratio of at least 3:1 against adjacent colors and must be visually distinct from the unfocused state.

| Token | Role |
|---|---|
| `focus-ring-color` | Color of the focus ring — maps to `component-border-focus` |
| `focus-ring-width` | Width of the focus ring — maps to `border-width-focus` |
| `focus-ring-offset` | Offset between the element and the focus ring (2px default) |
| `focus-ring-style` | Solid outline (not outline: none) |

**Prohibited:** `outline: none` or `outline: 0` without a compliant custom focus indicator replacement. All interactive components must show visible focus.

---

## Disabled State Tokens

| Token | Role |
|---|---|
| `disabled-surface` | Background for disabled components |
| `disabled-text` | Text color in disabled state — still meets 3:1 contrast against disabled-surface |
| `disabled-border` | Border in disabled state |
| `disabled-icon` | Icon fill/stroke in disabled state |
| `disabled-opacity` | Opacity modifier for disabled state (0.4 as a fallback if token-level disabled colors are not supported) |

**Rule:** Disabled controls must not use opacity alone to indicate the disabled state to assistive technology. The `aria-disabled="true"` attribute must be set in addition to any visual treatment.

---

## Audit Indicator Tokens

Audit indicators appear on components when an audit record has been created for the interaction. They must be visually subtle — they communicate traceability, not user-facing status.

| Token | Role |
|---|---|
| `audit-indicator-color` | Fill color for the audit indicator icon (`icon-audit`) |
| `audit-indicator-size` | Size of the audit indicator (16px default) |
| `audit-indicator-opacity` | Opacity of the audit indicator — lower than primary content (0.6 default) |

---

## Token Usage Rules

1. **Never use raw hex values or pixel values in component implementations.** Always reference a named token. Raw values create drift between components when tokens are updated.

2. **Severity token selection is owned by the decision engine, not the component.** The component receives a `severity` prop whose value is one of `informational | advisory | caution | blocking | critical`. The component maps that prop to the appropriate severity token. The component does not determine which severity level applies.

3. **Reduced motion is a token consumer, not a token.** Components check `prefers-reduced-motion` at render time and apply `duration-instant` or `duration-fast` instead of standard duration tokens. No separate "reduced motion token" is needed.

4. **Audit indicator tokens are applied by the component automatically when `auditId` is present in the component's props.** Implementations must not suppress the audit indicator without explicit system configuration.
