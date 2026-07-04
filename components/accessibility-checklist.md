# Accessibility Checklist

**Document type:** Component library — accessibility compliance checklist
**Phase:** 4
**Status:** stable
**Standard:** WCAG 2.1 AA

---

## Purpose

Use this checklist to verify that a guardrail component implementation meets all accessibility requirements before it ships. The checklist is organized by WCAG success criterion and supplemented with component-specific requirements from the per-category `accessibility.md` files.

This is a verification checklist — it assumes the component has been built against the specifications. Each item is a binary pass/fail.

---

## 1. Perceivability

### 1.1 Text Alternatives (WCAG 1.1.1 — Level A)

- [ ] Every icon communicating severity, state, or action has an accessible text alternative (`aria-label`, `aria-describedby`, or visually hidden text).
- [ ] The `icon-severity-{level}` icon is never the sole communicator of severity — a text label accompanies it.
- [ ] The `icon-audit` indicator has visually hidden text: "Audit record logged."
- [ ] Image-only confidence indicators (if used) have `aria-label` describing the confidence level.

### 1.3 Adaptable (WCAG 1.3.1 — Level A)

- [ ] Component uses correct semantic elements (`<button>`, `<dialog>`, `<ul>`, `<input>`) rather than generic `<div>` with `click` handlers.
- [ ] ARIA roles from the per-category `accessibility.md` file are applied correctly (see `role="alert"`, `role="alertdialog"`, `role="dialog"`, `role="status"`, `role="tooltip"`).
- [ ] `aria-labelledby` and `aria-describedby` reference existing IDs on rendered elements.
- [ ] Lists (alternatives, sources, scope items) are marked up as `<ul>` / `<ol>`.

### 1.3.4 Orientation (WCAG 1.3.4 — Level AA)

- [ ] Components do not lock orientation. Blocking warnings and emergency overlays display correctly in both portrait and landscape.

### 1.4 Distinguishable

#### 1.4.1 Use of Color (Level A)
- [ ] Severity is not communicated by color alone. Icon + text label accompanies every severity-colored element.
- [ ] Confidence level is not communicated by color alone.
- [ ] Granted / Denied states are not communicated by color alone.

#### 1.4.3 Contrast Minimum (Level AA)
- [ ] All normal text (< 18pt or < 14pt bold) meets ≥ 4.5:1 contrast ratio against its background.
- [ ] All large text (≥ 18pt or ≥ 14pt bold) meets ≥ 3:1 contrast ratio.
- [ ] Audit indicator icon meets ≥ 3:1 contrast against its surface.

#### 1.4.4 Resize Text (Level AA)
- [ ] All components remain usable when browser text is scaled to 200% without horizontal scroll (except where horizontal scroll is inherent to the component's purpose).

#### 1.4.11 Non-Text Contrast (Level AA)
- [ ] Focus rings meet ≥ 3:1 contrast against adjacent colors.
- [ ] Severity border accents meet ≥ 3:1 contrast against adjacent surface colors.
- [ ] UI component boundaries (button borders, input borders) meet ≥ 3:1 contrast.

#### 1.4.12 Text Spacing (Level AA)
- [ ] Components do not break when user applies these overrides: line height × 1.5, paragraph spacing × 2, letter spacing × 0.12em, word spacing × 0.16em.

#### 1.4.13 Content on Hover or Focus (Level AA)
- [ ] Tooltips on ConfidenceBadge and UncertaintyIndicator can be dismissed with Escape.
- [ ] Tooltip content does not disappear when the pointer moves from the trigger to the tooltip.
- [ ] Tooltips persist until dismissed by user action or focus leaves the trigger.

---

## 2. Operability

### 2.1 Keyboard Accessible (WCAG 2.1.1 — Level A)

- [ ] All interactive controls (dismiss, action buttons, expand, grant, deny, retry, choose alternative, validate, acknowledge) are reachable by Tab.
- [ ] All interactive controls are operable by Enter and/or Space as appropriate for the control type.
- [ ] No keyboard traps exist except in intentional focus traps (permission gates, blocking warnings, emergency overlay) — and those must have a defined exit (Escape, or acknowledgment).

### 2.1.2 No Keyboard Trap (Level A)

- [ ] Focus traps are implemented only for: `PermissionGate`, `ModalWarning`, `BlockingWarning`, `OverrideConfirmation`, `EmergencyEscalationOverlay`.
- [ ] All focus traps have a defined escape: Escape key (except `EmergencyEscalationOverlay` which requires acknowledgment).
- [ ] After a focus trap closes, focus returns to the previously focused element (or a defined logical successor).

### 2.3 Seizures and Physical Reactions (WCAG 2.3.1 — Level A)

- [ ] No content flashes more than 3 times per second.
- [ ] No pulsing animation exceeds 3 pulses per second.
- [ ] The emergency escalation icon pulse animation occurs once only (not looping).

### 2.4 Navigable

#### 2.4.3 Focus Order (Level A)
- [ ] Focus order within each component follows the sequence defined in the per-category `accessibility.md` file.
- [ ] For permission gates: deny control appears before grant control in tab order.
- [ ] For emergency overlay: only the acknowledgment control is in the tab order.

#### 2.4.7 Focus Visible (Level AA)
- [ ] All interactive elements show a visible focus indicator.
- [ ] `outline: none` or `outline: 0` is not applied without a compliant custom focus indicator replacement.
- [ ] Focus ring uses `component-border-focus` token and `border-width-focus` token (2px minimum).

---

## 3. Understandability

### 3.1 Readable (WCAG 3.1.1 — Level A)

- [ ] The `lang` attribute is set on the document root. Components do not override language — all strings are provided by the consuming system with appropriate localization.

### 3.2 Predictable (WCAG 3.2.1, 3.2.2 — Level A)

- [ ] No component initiates an action on focus alone (components with tooltips on focus do not trigger navigation, state changes, or callbacks — only display).
- [ ] No component initiates an irreversible action on a single click/tap alone (override confirmation requires checkbox + button; permission grant requires explicit button click).

### 3.3 Input Assistance (WCAG 3.3.1, 3.3.2 — Level A)

- [ ] ClarificationRequest input has a visible label (the clarification question).
- [ ] RepairCard form fields have visible labels.
- [ ] OverrideConfirmation checkbox has a visible label (the risk acknowledgment text).
- [ ] Error states in forms (repair, clarification) identify the error and describe how to correct it.

---

## 4. Robustness

### 4.1 Compatible (WCAG 4.1.1 — Level A)

- [ ] No duplicate IDs in the rendered DOM within any component.
- [ ] All ARIA attributes reference valid IDs.
- [ ] `aria-labelledby` and `aria-describedby` do not reference IDs that do not exist.

### 4.1.2 Name, Role, Value (Level A)

- [ ] Every interactive element has an accessible name (native label, `aria-label`, or `aria-labelledby`).
- [ ] `aria-disabled="true"` is used (not `disabled` attribute alone) for controls that must remain in the tab order while disabled (confirm override before checkbox checked).
- [ ] `aria-expanded` updates correctly when sections expand/collapse.
- [ ] `aria-live` regions are correctly assigned polite or assertive politeness based on urgency (see per-category `accessibility.md`).

### 4.1.3 Status Messages (Level AA)

- [ ] Status updates (escalation state changes, retry status, delegation status) are announced via `aria-live` regions without focus displacement.
- [ ] Success states ("Approved", "Repair complete") are announced via `role="status"` or `aria-live="polite"`.

---

## Component-Specific Checklist Items

### Warning
- [ ] Blocking warning prevents pointer events on all background content.
- [ ] Auto-dismiss countdown is announced via `aria-live` (not visual animation only).

### Permission
- [ ] Passive dismissal fires `onDismiss` with `dismissedWithoutAction: true`.
- [ ] Grant button is never `aria-disabled` after the user has already granted or denied.
- [ ] Audit indicator renders when `auditId` is present.

### Escalation — Emergency
- [ ] `Tab` focus does not escape the emergency overlay.
- [ ] `Escape` has no effect in the emergency overlay.
- [ ] All background elements are `aria-hidden="true"` while emergency overlay is active.

### Recovery — Override
- [ ] Confirm button is `aria-disabled="true"` (not `disabled`) before checkbox is checked.
- [ ] Checking the checkbox announces "Risk acknowledged. Confirm override is now available."

---

## Automated Testing Guidance

The following automated tools catch a subset of accessibility issues. Automated tools alone are not sufficient — manual testing with a screen reader is required.

- **axe-core** or **axe DevTools** — catches WCAG violations in rendered DOM. Run on each component variant in isolation and in composition.
- **Lighthouse** (accessibility audit) — catches document-level issues. Run on full page renders.
- **Playwright / Cypress with axe** — catches violations during user interaction flows (grant flow, retry flow, emergency acknowledgment flow).

Manual testing must cover:
- Screen reader testing with NVDA + Firefox (Windows), JAWS + Chrome (Windows), VoiceOver + Safari (macOS/iOS).
- Keyboard-only navigation through each interaction flow.
- Reduced motion verification (enable `prefers-reduced-motion` in OS settings).
- 200% text zoom in each browser.
