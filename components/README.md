# Component Specifications

The `components/` directory contains UI component specifications for the visual and interactive elements that implement guardrail patterns. These specifications describe component anatomy, states, behavior, and accessibility requirements — not implementation code.

Component specifications are implementation-agnostic. They define what a component must do and how it must behave, not how it is built. Teams are expected to implement components in their own stack, using these specifications as the behavioral and design contract.

---

## Relationship to Pattern Specifications

Pattern specifications (in `patterns/`) define decision logic: when a pattern fires and what information must be communicated. Component specifications define presentation: how that information is rendered for users.

A single pattern may be implemented by multiple components depending on context (e.g., an inline warning component, a banner warning component, and a modal warning component all implement warning patterns at different severity levels).

---

## Directory Structure

```
components/
├── README.md                        # This file
├── warning/                         # Warning pattern components
│   ├── inline-warning-component.md
│   ├── warning-banner-component.md
│   ├── warning-modal-component.md
│   └── progressive-warning-component.md
├── explanation/                     # Explanation pattern components
│   ├── confidence-badge-component.md
│   ├── source-list-component.md
│   ├── reasoning-trace-component.md
│   └── explanation-drawer-component.md
├── permission/                      # Permission gate components
│   ├── soft-gate-component.md
│   ├── hard-gate-modal-component.md
│   └── audit-gate-component.md
├── uncertainty/                     # Uncertainty state components
│   ├── confidence-indicator-component.md
│   └── uncertainty-disclosure-component.md
├── refusal/                         # Refusal state components
│   ├── refusal-message-component.md
│   └── graceful-degradation-component.md
├── escalation/                      # Escalation path components
│   ├── escalation-banner-component.md
│   └── handoff-confirmation-component.md
└── recovery/                        # Recovery flow components
    ├── retry-prompt-component.md
    ├── redirect-suggestion-component.md
    └── manual-override-component.md
```

---

## Component Specification Format

Every component specification must follow this structure:

```markdown
# [Component Name]

**Implements pattern:** [pattern name and link]
**Component type:** [inline | banner | modal | drawer | badge | overlay]
**Status:** [draft | review | stable]

## Purpose
What this component does and which pattern(s) it implements.

## Anatomy
The named parts of the component and what each is responsible for.
- **Part 1:** Description
- **Part 2:** Description

## States
The defined states the component can be in and how each renders.

| State | Trigger | Visual treatment |
|---|---|---|
| default | Normal display | ... |
| active | ... | ... |
| dismissed | User dismissed | ... |
| error | Component error | ... |

## Interaction Behavior
What happens when users interact with each part of the component.

## Content Requirements
What text, labels, or data must be present in each part.

## Accessibility Requirements
- ARIA roles and attributes required
- Keyboard navigation requirements
- Focus management on open/close
- Screen reader announcement requirements
- Color contrast requirements (minimum WCAG AA)

## Motion and Animation
Behavior for entrance, exit, and state transitions.

## Responsive Behavior
How the component adapts across breakpoints or container sizes.

## Do / Do Not
Common implementation mistakes and correct approaches.

## Related Components
Other components frequently used alongside this one.
```

---

## Accessibility Requirements (All Components)

Every component in this system must meet the following baseline requirements regardless of type:

- **Color contrast:** All text must meet WCAG 2.1 AA minimum (4.5:1 for normal text, 3:1 for large text)
- **Not color-only communication:** Status, severity, and state must not be communicated by color alone. Icons, labels, or patterns must supplement color.
- **Keyboard accessible:** All interactive elements must be operable by keyboard
- **Screen reader compatible:** All information must be conveyed to assistive technology via appropriate ARIA roles and labels
- **Focus visible:** Focus indicators must be visible and meet WCAG 2.1 AA focus-visible requirements
- **Motion respectful:** Components with animation must respect `prefers-reduced-motion`

---

## Phase Status

- **Phase 1:** Directory structure and README only
- **Phase 4:** Full component specifications for all listed components

_Total planned component specifications: ~20_
