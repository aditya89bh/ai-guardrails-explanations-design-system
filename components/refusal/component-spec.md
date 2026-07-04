# Refusal Component Specification

**Implements patterns:** Safe refusal, policy refusal, partial completion, constrained completion, alternative suggestion, clarification request, human handoff (refusal category)
**Phase:** 4
**Status:** stable
**Decision engine reference:** `docs/decision-flows/pattern-selection-engine.md` § Refusal Category Selection

---

## Purpose

Refusal components communicate outcome unavailability without being dismissive or opaque. They always provide context for why the refusal occurred and at least one productive path forward. The exception is safe refusal with no alternative path — in that case, the component communicates clearly that no alternative exists, and why.

---

## Component Variants

| Variant | Primary function | Always has alternative |
|---|---|---|
| `safe-refusal` | Communicates safety-based decline | No — abandon may be the only path |
| `policy-refusal` | Communicates rule-based decline with attribution | Yes — exception path or redirect |
| `partial-completion` | Delivers what was completable | Yes — redirect for excluded parts |
| `constrained-completion` | Delivers modified output | Yes — scope/delegated permission path |
| `alternative-suggestion` | Lists alternative approaches | Yes — by definition |
| `clarification-request` | Requests input to resolve ambiguity | Yes — user provides input |
| `human-handoff` | Transfers to human handler | Yes — handoff is the path |

---

## Anatomy

### RefusalCard (safe-refusal, policy-refusal)

```
[Icon-refusal] [Title: What was declined]
─────────────────────────────────────────
[Reason: why this was declined]
[Policy attribution: if policy-refusal]
[What was attempted before declining]
─────────────────────────────────────────
[Available paths: list or buttons]
[Audit indicator]
```

Named parts:
- **refusal-icon** — `icon-refusal`. Required.
- **refusal-title** — What was declined (not "Error" or "Sorry" — be specific). Required.
- **reason-statement** — Why the decline occurred. Required. For policy refusal: includes policy name/ID (`policyLabel`, `policyId`).
- **policy-attribution** — Policy-refusal only: "This action is restricted by: [policy name]". Required for policy refusal.
- **available-paths** — List of what the user can do next. Required for policy refusal (at minimum, an exception or redirect path). May be empty for safe refusal when no alternative exists.
- **audit-indicator** — Required for all refusal components. Refusals are always audit-relevant.

### PartialCompletionCard

```
[Completed output section]
─────────────────────────────────────────
[Notice: "The following portions could not be completed"]
[Excluded portions list: reason per item]
[Path forward for excluded: redirect suggestion]
[Audit indicator]
```

Named parts:
- **completion-section** — The completed output. Full fidelity — does not indicate its own incompleteness.
- **exclusion-notice** — Header signaling that some parts were excluded.
- **exclusion-list** — Each excluded item with its specific reason.
- **redirect-suggestion** — Embedded AlternativeSuggestionCard or redirect link for the excluded portions.

### AlternativeSuggestionCard

```
[Icon] [Header: "Alternative approaches"]
[Alternative 1: icon + label + description] [Select]
[Alternative 2: ...]                        [Select]
[Alternative 3: ...]                        [Select]
[None of these — help me with something else]
```

Named parts:
- **alternative-item** — Each alternative has a label, short description, and select control. Minimum 1, maximum 5 alternatives per rendering.
- **none-option** — Required. Allows the user to exit without selecting. Label: "None of these" or "Start over".

### ClarificationRequest

```
[Icon] [Header: "I need clarification to continue"]
[Clarification question: plain language]
[Input: text field OR option set for multiple-choice]
[Submit] [Cancel]
```

Named parts:
- **clarification-question** — The specific question. Required; must be answerable — not a generic "Please be more specific."
- **input** — Text field for open clarification or a radio/checkbox group for structured options.
- **submit-control** — Submits the clarification and re-evaluates the request.
- **cancel-control** — Returns user to their prior state without submitting.

### HumanHandoffCard (refusal category)

```
[Icon-escalation] [Header: "This request needs a human"]
[Why: specific reason]
[Who will help: role (not personal name)]
[What to expect: handoff process]
[Status: Routing... / Connected / No handler available]
[Audit indicator]
```

Named parts:
- **handoff-reason** — Why human handling is required. Required.
- **handler-role** — Role of the human handler (not personal identity). Required.
- **process-description** — What happens next: wait time, contact method, reference ID.
- **status-indicator** — Current handoff status. Auto-updates.

---

## Input Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `variant` | Variant enum | Yes | Refusal type |
| `refusalId` | `string` | Yes | Unique identifier |
| `refusalReason` | `string` | Yes | Why the refusal occurred |
| `policyId` | `string` | Policy variant | Policy rule identifier |
| `policyLabel` | `string` | Policy variant | Human-readable policy name |
| `completedOutput` | `any` | Partial, constrained | The completable portion |
| `excludedItems` | `ExcludedItem[]` | Partial | Items not completed + reasons |
| `alternatives` | `Alternative[]` | Alternative, policy | Each: `{ id, label, description, handler }` |
| `clarificationQuestion` | `string` | Clarification | The specific question |
| `clarificationOptions` | `string[]` | Clarification | If structured options, the option list |
| `handoffReason` | `string` | Handoff | Why human handling is needed |
| `handlerRole` | `string` | Handoff | Handler role label |
| `handoffStatus` | `'routing' \| 'connected' \| 'failed'` | Handoff | Current status |
| `onAlternativeSelect` | `(id: string) => void` | Alternative | Called on selection |
| `onClarificationSubmit` | `(input: string) => void` | Clarification | Called on submit |
| `auditId` | `string` | Yes — all variants | All refusals require audit records |

---

## Output / Callbacks

| Callback | Trigger | Payload |
|---|---|---|
| `onAlternativeSelect` | User selects an alternative | `{ alternativeId, refusalId, auditId }` |
| `onClarificationSubmit` | User submits clarification | `{ input, refusalId, auditId }` |
| `onHandoffConfirm` | User confirms handoff | `{ handoffId, refusalId, auditId }` |
| `onNoneSelect` | User selects "None of these" | `{ refusalId, auditId }` |
| `onMount` | Component renders | `{ variant, refusalId, auditId }` |

---

## States

| State | Trigger | Visual |
|---|---|---|
| `active` | Refusal rendered | Default |
| `alternative-selected` | User selects alternative | Selected alternative highlighted; others fade |
| `clarification-submitted` | User submits | Loading state while re-evaluating |
| `handoff-routing` | Handoff initiated | Spinner on status |
| `handoff-connected` | Handler accepts | Success state in handoff card |
| `handoff-failed` | No handler available | Error state with abandon option |
| `error` | Async operation failed | Error message with retry |

---

## Do / Do Not

| Do | Do not |
|---|---|
| Always state the specific reason for the refusal | Use generic messages like "This is not something I can help with" |
| Always provide at least one path forward for policy refusal | Leave users with only a deny and no direction |
| Use `icon-refusal` consistently | Use warning icons for refusal components (different semantic meaning) |
| Name the policy (with ID) in policy refusals | Apply policy refusal without attribution |

---

## Related Patterns

- `patterns/refusal/safe-refusal.md`
- `patterns/refusal/policy-refusal.md`
- `patterns/refusal/partial-completion.md`
- `patterns/refusal/constrained-completion.md`
- `patterns/refusal/alternative-suggestion.md`
- `patterns/refusal/clarification-request.md`
- `patterns/refusal/human-handoff.md`

## Related Decision Engine Rules

- `docs/decision-flows/pattern-selection-engine.md` § Refusal Category Selection
- `docs/decision-flows/pattern-precedence-engine.md` § Refusal Intra-Category Precedence
- `docs/decision-flows/pattern-composition-engine.md` § Refusal + Recovery Flow
