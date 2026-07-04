# Troubleshooting

Common implementation issues and how to resolve them.

---

## Decision Engine Issues

### The engine is activating `safe-refusal` when I expect `constrained-completion`

**Symptom:** P2 = low, but the engine selects `safe-refusal` instead of the expected `constrained-completion`.

**Cause:** `constrained-completion` requires P6 = `decision-support`. When P6 = `action-execution`, `content-generation`, or `workflow-automation`, `safe-refusal` is the correct selection. See Rule R08 in `playground/engine/rules.js`.

**Fix:** Verify your P6 Intent value. If the AI is advising a human who makes the final decision, P6 should be `decision-support`. If the AI is taking an action autonomously, P6 = `action-execution` and `safe-refusal` is correct.

---

### Policy-refusal is activating unexpectedly

**Symptom:** `policy-refusal` activates even though you have no policy rules configured.

**Cause:** P5 = `deployment` or `tenant` in your primitive evaluation. Check your policy configuration — a rule may be matching the current interaction.

**Fix:** Review `policyRules` in your deployment YAML configuration. Check the P5 evaluation logic in your AI system — it should return `none` when no policy rule matches.

---

### The engine produces no output (empty component list)

**Symptom:** All primitives are set but the component sequence is empty.

**Cause:** P2 = `high` with no secondary rule activations. The `high-confidence-state` pattern produces no visible component.

**This is the correct behavior.** In high-confidence state with authorized access, fresh context, and no policy match, no guardrail is needed. Surfacing warnings in this state degrades trust.

---

### Multiple warning components are rendering

**Symptom:** Two warning components appear simultaneously (e.g., both `blocking-warning` and `inline-warning`).

**Cause:** The composition constraint "only one warning pattern may render simultaneously" is not being enforced.

**Fix:** Apply the precedence engine before rendering. `blocking-warning` supersedes `inline-warning` and `ambient-warning`. Remove the lower-priority warning from the render list when a higher-priority warning is present. See `playground/engine/evaluator.js § applyComposition`.

---

### Emergency escalation is not self-authorizing

**Symptom:** `emergency-escalation` is waiting for a supervisor approval step.

**Cause:** Emergency escalation at Risk=4 is self-authorizing by design. It should bypass the normal approval SLA.

**Fix:** Check your escalation routing logic. `emergency-escalation` should immediately notify all configured emergency channels without waiting for a supervisor to respond. The SLA for emergency-escalation is 0 minutes — immediate.

---

## Component Issues

### Permission gate is treating Escape as "pending" rather than "denied"

**Symptom:** User presses Escape on a permission gate. The gate closes but the interaction is logged as neither granted nor denied.

**Cause:** Passive dismissal is not being mapped to denial.

**Fix:** Add an `onDismiss` handler to your permission gate component that fires a `PERMISSION_DENIED` audit event. Passive dismissal (Escape, backdrop click, close button) must always equal denial. See `reference/react/PermissionGate.jsx`.

---

### Screen reader is not announcing warning banners

**Symptom:** Warning banners render visually but are not announced by screen readers.

**Cause:** Missing or incorrect ARIA attributes.

**Fix:** Ensure the component uses the correct ARIA role and aria-live region for its severity:
- Advisory/informational: `role="status"` + `aria-live="polite"`
- Caution: `role="alert"` + `aria-live="polite"`
- Blocking/critical: `role="alertdialog"` + `aria-live="assertive"`

Also verify `aria-atomic="true"` is set so screen readers announce the full message. See `reference/react/WarningBanner.jsx`.

---

### Keyboard focus is not moving to the warning component

**Symptom:** Warning or refusal components render but keyboard focus stays on the triggering element.

**Cause:** Focus management is not implemented.

**Fix:** On critical and blocking severity components, move focus to the first interactive element in the component when it mounts. Use `useEffect` + `ref.current.focus()`. The `EmergencyEscalationOverlay` must trap focus until the user acknowledges.

---

### Permission gate is granting without explicit user action

**Symptom:** Access is granted when the user hasn't clicked the grant button.

**Cause:** Auto-grant is implemented, which violates the non-negotiable invariant.

**Fix:** Remove auto-grant. The only permitted grants are those resulting from an explicit user action on the grant button. Time-based auto-grant, focus-based auto-grant, and default-to-grant patterns are all forbidden.

---

### The `reasoning-trace` component is not rendering in CE state

**Symptom:** Conflicting Evidence state is active but the reasoning trace is not displayed.

**Cause:** `reasoning-trace` is a secondary pattern that activates alongside `safe-refusal` in CE state. It may be suppressed by the composition engine or not rendered by the component logic.

**Fix:** Verify that when `conflicting-evidence-state` activates (R05 or R05B), `reasoning-trace` is in the activated pattern list. Check that your component rendering loop handles the `reasoning` variant of `ConfidenceBadge`. See `playground/components/guardrail/ConfidenceBadge.jsx`.

---

## Playground Issues

### Playground won't start

**Symptom:** `npm run dev` fails with an error.

**Cause (common):** Node.js version below 18.

**Fix:** Verify Node.js version: `node --version`. If below 18, upgrade via nvm: `nvm install 18 && nvm use 18`.

---

### Playground shows "No guardrails active" for all scenarios

**Symptom:** Every scenario produces the empty state.

**Cause:** The engine module may not be loading correctly (ESM/CJS import issue in older Next.js versions).

**Fix:** Verify that `playground/engine/evaluator.js` uses ES module syntax (`export function evaluate`). Check the Next.js version: `npm list next`. Version 14+ is required.

---

### Scenarios are not loading primitive values

**Symptom:** Clicking a scenario button does not change the primitive controls.

**Cause:** The scenario's `primitives` object may have keys that don't match the control IDs.

**Fix:** Verify that `playground/data/scenarios.js` scenario objects have exactly the keys `P1` through `P10`. The control renders by key lookup from `PRIMITIVE_DEFINITIONS` — any missing or misnamed key silently falls back to the default.

---

## Schema Validation Issues

### `additionalProperties` error on policy schema

**Symptom:** Validation fails with "additionalProperties: must NOT have additional properties."

**Cause:** Your policy document includes a field not in `guardrail-policy.schema.json`.

**Fix:** Review `reference/json/guardrail-policy.schema.json` and remove or rename the unexpected field. If the field is legitimate and missing from the schema, open an issue to extend the schema.

---

### Pattern `severity` value not recognized

**Symptom:** Schema validation rejects your `severity` field.

**Cause:** The severity value is not one of the 5 canonical values.

**Fix:** Use only: `informational` / `advisory` / `caution` / `blocking` / `critical`. Other values (e.g., `warning`, `error`, `danger`) are not in the taxonomy.

---

## Audit Issues

### Audit records lack `auditId`

**Symptom:** Audit records are being generated but don't include an `auditId` field.

**Cause:** The `auditId` is not being generated at evaluation time and propagated through the render pipeline.

**Fix:** Generate a unique `auditId` (UUID or similar) when the decision engine evaluates primitives. Pass it as a prop to every component rendered from that evaluation. Include it in every audit event the component emits.

---

### Cannot trace a user interaction back to its engine evaluation

**Symptom:** An audit record shows a `PERMISSION_GRANTED` event but you cannot find the engine evaluation that caused it.

**Cause:** Missing `auditId` propagation — see above. Or audit records from different evaluations are not correlated.

**Fix:** Verify `auditId` is included in both the `ENGINE_EVALUATED` event and all subsequent `PERMISSION_GRANTED`, `PERMISSION_DENIED`, `ESCALATION_ACKNOWLEDGED` events from the same interaction.

---

## Getting More Help

If your issue is not covered here, see [SUPPORT.md](../SUPPORT.md) for how to get help.
