# Implementation Guidelines

**Document type:** Component library — implementation guidance
**Phase:** 4
**Status:** stable

---

## Purpose

This document guides teams implementing the AI Guardrails & Explanations component library in their own technology stack. It covers the primary implementation environments, framework-specific recommendations, and cross-cutting concerns (dark mode, internationalization, RTL layouts).

The component specifications in this library are implementation-agnostic — they define behavior and semantics, not framework APIs. This document translates those specifications into practical implementation guidance.

---

## Shared Implementation Requirements

Before reading framework-specific guidance, all implementations must satisfy these shared requirements regardless of stack:

1. **Design token infrastructure.** All component implementations must consume design tokens by name (see `design-tokens.md`) rather than hardcoding values. Use CSS custom properties, Figma variables, or an equivalent token layer.

2. **Decision engine integration.** Components must receive severity, variant, and state as props from the calling system — they must not determine these values internally. The decision engine (`docs/decision-flows/`) is the authority on which component renders and at which level.

3. **Audit callback compliance.** Every component that exposes an `auditId` prop must fire `onMount` immediately at render with the `auditId` in the payload. Delayed or omitted audit callbacks are a compliance failure in regulated deployments.

4. **Reduced motion check.** All animation logic must check `prefers-reduced-motion: reduce` at runtime and apply the fallback durations from `design-tokens.md`. This must not be a CSS-only implementation — JavaScript-driven animations require a JS check as well.

5. **Passive dismissal as denial.** For all permission gate components, `onDismiss` (fired on close without explicit grant/deny action) must be treated as denial by the consuming system. This is a security invariant — it must not be configurable.

---

## React

### Component Structure

Implement each component category as a React component with named exports:

```
// Recommended export structure
export { InlineWarning } from './warning/InlineWarning'
export { ModalWarning } from './warning/ModalWarning'
export { BlockingWarning } from './warning/BlockingWarning'
// etc.
```

Avoid barrel exports that include internal components — only export components intended for consumer use.

### State Management

Warning, permission, and escalation components have stateful lifecycles (dismissed, granted, ROUTING, etc.). Keep internal UI state (expanded/collapsed, loading) in local component state. Pass `escalationState` and `delegateStatus` as controlled props — the hosting system owns the authoritative state; the component renders it.

### Focus Management

Use `React.useRef` and `.focus()` for programmatic focus management on mount (modals, blocking warnings, permission gates, emergency overlay, recovery components). Do not rely on `autoFocus` attribute — it is inconsistent across browsers and screen reader combinations.

Implement focus traps using a utility like `focus-trap-react` or a custom implementation that cycles Tab/Shift+Tab within the component boundaries.

### Audit Callbacks

Use `useEffect` with an empty dependency array to fire `onMount` at render time:

```
useEffect(() => {
  onMount?.({ variant, auditId, timestamp: new Date().toISOString() })
}, []) // intentional empty deps — fires once on mount
```

### Token Consumption

Use CSS custom properties for design tokens. Apply a CSS class at the component root that enables the token scope:

```css
.guardrail-component {
  background: var(--severity-blocking-surface);
  color: var(--severity-blocking-text);
  border-left: var(--border-width-accent) solid var(--severity-blocking-border);
}
```

Do not use JavaScript style objects for token values — CSS custom properties allow runtime theme switching.

---

## Vue

### Component Structure

Implement each component as a single-file component (`.vue`) with `defineProps` and `defineEmits`.

```vue
<script setup>
const props = defineProps({
  severity: String,
  variant: String,
  message: String,
  auditId: String
})
const emit = defineEmits(['dismiss', 'action', 'mount'])
onMounted(() => emit('mount', { variant: props.variant, auditId: props.auditId }))
</script>
```

### Focus Management

Use `nextTick` before calling `.focus()` on refs that render conditionally:

```js
watch(isVisible, async (val) => {
  if (val) {
    await nextTick()
    firstFocusableRef.value?.focus()
  }
})
```

### State

Use `v-model` for controlled permission gate state where the host system manages grant/deny state. Use local `ref()` for UI-only state (expanded, loading).

---

## Web Components (Custom Elements)

Implementing as Web Components enables framework-agnostic usage across enterprise environments with diverse stacks.

### Shadow DOM

Use closed shadow DOM for all guardrail components. This prevents external CSS from overriding severity colors and accessibility attributes — a security and compliance consideration.

Exception: design tokens must pierce the shadow boundary. Use CSS custom properties (they inherit through shadow DOM) for all token-based styles.

### Events

Dispatch custom events for all callbacks:

```js
this.dispatchEvent(new CustomEvent('guardrail-dismiss', {
  bubbles: true,
  composed: true,
  detail: { auditId: this.auditId, timestamp: new Date().toISOString() }
}))
```

Use `composed: true` so events cross shadow boundaries.

### Accessibility in Shadow DOM

ARIA attributes on elements inside shadow DOM are accessible to screen readers in modern browsers. However, `aria-labelledby` and `aria-describedby` do not cross shadow boundaries — use `aria-label` directly on the component host element for cross-boundary labeling.

---

## Native Applications (iOS / Android)

### iOS (SwiftUI / UIKit)

- Map severity tokens to semantic color assets in the Asset Catalog — this enables automatic dark mode support.
- Implement permission gates as `UIAlertController` (system sheet) or a custom `UIViewController` presented modally. Do not use `UIAlertController` for blocking warnings — custom presentation gives you full control over focus management.
- Emergency escalation overlays must be presented above all other view controllers using `UIApplication.shared.keyWindow?.rootViewController?.present(...)`.
- Audit callbacks must be dispatched on the main thread.
- Reduced motion: check `UIAccessibility.isReduceMotionEnabled` in Swift.

### Android (Jetpack Compose / View)

- Map severity tokens to Material Theme color roles — this enables automatic dark theme support.
- Implement permission gates as `AlertDialog` (system) or a full-screen `Dialog` composable for complex gates.
- Emergency overlays: use `WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE` carefully — the emergency overlay must not set this flag; it needs focus capture.
- Reduced motion: check `Settings.Global.ANIMATOR_DURATION_SCALE` or use `LocalAccessibilityManager.current.isEnabled` within Compose.
- Accessibility: use `semantics {}` in Compose for ARIA-equivalent role and state announcements.

---

## Enterprise Dashboards

Enterprise dashboard implementations have specific requirements:

### Compact Density

Many enterprise dashboards use compact UI density. Guardrail components must support a `density` prop or CSS class:
- `density="comfortable"` — standard spacing (default).
- `density="compact"` — reduced internal padding (minimum: `spacing-xs` for inline, `spacing-sm` for cards).

Blocking and emergency components are exempt from density reduction — they must maintain full visual presence regardless of dashboard density setting.

### Data Table Integration

Inline warnings and uncertainty indicators frequently appear within data table cells. Implement the inline variant to be width-constrained and truncation-tolerant. The full message should be accessible via tooltip on hover/focus.

### Print and Export

For regulated enterprise dashboards that require printable audit outputs:
- Warning and permission components must render their `auditId` as a visible or hidden-but-copyable data attribute in the print stylesheet.
- Motion is suppressed in print.
- Severity color-only tokens must have a print-safe alternative (use pattern fills or grayscale in `@media print`).

---

## Dark Mode

Map all severity and component tokens to a dual-mode token system. Recommended approach:

1. Define a base token set for light mode.
2. Define overrides for dark mode using a CSS `[data-theme="dark"]` attribute or `@media (prefers-color-scheme: dark)`.
3. Severity colors in dark mode shift from tinted light backgrounds to tinted dark backgrounds — do not simply invert. Low-luminance surfaces with high-luminance text.
4. Audit indicators in dark mode: increase `audit-indicator-opacity` to compensate for dark surface contrast reduction.
5. Focus indicators in dark mode: `component-border-focus` must have ≥ 3:1 contrast against the dark surface.

---

## Internationalization (i18n)

All user-visible text in guardrail components arrives as props from the calling system — components do not contain hardcoded strings. The calling system is responsible for providing localized strings.

Formatting considerations for component implementations:

- **Severity labels** (e.g., "Advisory", "Blocking"): allow string length up to 2× the English length — some languages (German, Finnish) have significantly longer equivalents.
- **Button labels** (e.g., "Allow once", "Don't allow"): use flexible-width containers — never fixed-width for action buttons.
- **Date formatting** (e.g., staleness dates): use the platform's locale-aware date formatter, not hardcoded date strings.
- **Audit IDs and reference IDs**: never localize — display as-is.

---

## RTL (Right-to-Left) Layout Support

All directional layout must respond to the document's `dir="rtl"` attribute.

Specific RTL rules for guardrail components:

| Element | LTR | RTL |
|---|---|---|
| Severity left-edge accent (blocking, critical) | `border-left` | `border-right` |
| Icon position | Leading (left) | Leading (right) |
| Dismiss control (×) | Trailing (right) | Trailing (left) |
| Role chain arrow (escalation) | Left-to-right | Right-to-left |
| Tab order | Left-to-right in LTR | Reversed in RTL — deny still first |

Use CSS logical properties (`border-inline-start`, `padding-inline-start`, `margin-inline-end`) rather than physical properties (`border-left`, `padding-left`) throughout. This provides RTL support automatically in most cases.

Do not flip: icon shapes, alert icons, or any icon that has inherent directionality (e.g., an arrow icon that communicates flow should be flipped; a warning triangle should not be).
