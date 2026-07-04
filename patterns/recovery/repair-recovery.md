# Repair Recovery

**Category:** Recovery flow
**Sub-type:** Repair
**Severity:** Advisory (Level 1) to Caution (Level 2)
**Status:** stable
**Phase:** 2G

---

## Definition

Repair recovery is the recovery flow that corrects an error, data inconsistency, or invalid state — within the current workflow — and then resumes from the corrected state. Repair does not re-attempt the original action unchanged (that is retry recovery). Repair does not route the user to a different path (that is redirect recovery). Repair identifies what is wrong, fixes it, validates the fix, and then continues from the corrected position.

Repair recovery addresses three categories of problem:

1. **Data repair** — incorrect, malformed, or inconsistent input or stored data that caused the action to fail or produce an unreliable output
2. **State repair** — the workflow's internal state has become invalid or inconsistent (e.g., a multi-step task where an earlier step's output was revised, invalidating later steps that depended on it)
3. **Configuration repair** — a deployment setting, integration parameter, or permission configuration was incorrect in a way that the AI can detect and request correction for

Repair recovery is not error handling in the programming sense. It is a structured interaction pattern — it involves the user in the repair process where human judgment is required, validates the corrected state before resuming, and defines rollback conditions for cases where the repair itself introduces problems.

---

## Problem Solved

Errors and data inconsistencies can block a workflow without making the workflow unachievable. Without repair recovery, the user must either restart from scratch (losing prior work) or attempt to manually reconstruct the correct state without guidance. Repair recovery makes the correction process structured, validated, and reversible.

---

## When to Use

- An action failed because input data was malformed, incomplete, or internally inconsistent — and the AI can identify specifically what is wrong and what the correct form should be
- A prior output in a multi-step task has been revised, and later steps that depended on it now need to be updated or re-executed
- A partial completion left the workflow in an intermediate state that must be resolved before the next step can proceed
- A schema mismatch between systems caused a data transfer to fail — the AI can identify the mismatch and propose a corrected data mapping
- An integration error was caused by a configuration issue that the AI can describe specifically enough for the user or administrator to correct

---

## When NOT to Use

- The action failed due to a transient condition (network timeout, temporary unavailability) — use retry recovery
- The underlying goal requires a different approach entirely — use redirect recovery
- The error is in the AI's output, not the user's input or the system's state — repair recovery does not apply to AI hallucinations or confidence failures (use explanation patterns and, if needed, redirect)
- The repair would require the AI to make assumptions it cannot verify — it must confirm with the user before making any correction

---

## Entry Conditions

Repair recovery activates when:

- A specific error, inconsistency, or invalid state has been identified — vague or undiagnosed errors must be diagnosed before repair recovery activates
- The repair action is defined — the AI must know what to change, not just that something is wrong
- The repair is reversible or the rollback condition is defined before repair begins
- If the repair affects data or state outside the current session (persistent storage, external systems), the user has been informed and consented

---

## Exit Conditions

Repair recovery exits successfully when:

- The corrected state passes validation
- The workflow resumes from the corrected state and the dependent steps complete without error
- No rollback condition is triggered

Repair recovery exits without success when:

- The repair introduces a new error or inconsistency (rollback activates)
- Validation of the corrected state fails and the repair cannot be iterated further without human input
- The repair requires access or authority the AI does not have — exits to escalation

---

## Recovery Objective

Correct the specific error or inconsistency, validate the correction, and resume the workflow from the corrected state — preserving all prior work that remains valid.

**Success criteria:** The workflow resumes from the corrected state. No new errors are introduced by the repair. The user's prior valid work is intact.

**Completion conditions:** The first dependent step after the repair point completes without error. If the repair affects a prior output that other steps depend on, those steps are re-evaluated with the corrected version.

---

## Recovery Owner

| Component | Owner |
|---|---|
| Diagnosing the error | AI |
| Proposing the correction | AI |
| Approving data or state changes that affect external systems | User |
| Executing the repair | AI (for AI-managed state) or User (for user-owned data) |
| Validating the corrected state | AI |
| Deciding whether to rollback a failed repair | AI with user notification |

---

## Repair Strategy

The repair strategy defines what is being corrected and how:

### Data Repair

1. Identify the specific data element that is incorrect, malformed, or inconsistent
2. State the current value and the required form (do not assume the correct value — confirm with the user if the correct value is not derivable from validation rules)
3. If the correct value is derivable, propose it explicitly and ask for confirmation before applying it
4. Apply the correction only after confirmation
5. Validate the corrected data against the relevant schema or constraint before resuming

### State Repair

1. Identify which step in the multi-step workflow produced a state that is now invalid
2. Determine the minimum set of steps that must be re-executed from that point forward to produce a valid state
3. Preserve all prior outputs that remain valid — do not re-execute steps unnecessarily
4. Present the proposed repair scope to the user: "Steps 3–5 need to be re-run with the corrected input from Step 2. Steps 1–2 are unaffected."
5. Confirm with the user before re-executing — especially if re-execution overwrites prior outputs

### Configuration Repair

1. Identify the specific configuration setting that is incorrect
2. Describe the correct value or the constraint the setting must satisfy
3. If the AI can make the correction directly (for AI-managed configuration), propose and request confirmation
4. If the correction requires administrator access, describe it specifically enough for the administrator to act on it, and route to the appropriate escalation path

---

## Validation

Every repair must be validated before the workflow resumes:

- **Pre-repair validation:** Confirm the error is correctly diagnosed before applying any correction (do not correct a symptom of the real problem)
- **Post-repair validation:** Confirm the corrected state satisfies all constraints — schema, business rule, and inter-step dependency validation
- **Dependency validation:** Confirm that all downstream steps that depended on the corrected element are re-evaluated with the corrected value

Validation failures after repair are not a restart condition — they are an opportunity to iterate the repair if a narrower or different correction can succeed.

---

## Rollback Conditions

A rollback is triggered when:

- The repair introduces a new error that cannot be resolved with a further correction
- The user requests a rollback explicitly after reviewing the repair's effect
- A downstream step fails in a way that was not present before the repair, indicating the repair was incomplete or incorrect
- The repaired state conflicts with an external system's expectation and the conflict cannot be resolved without further escalation

Rollback restores the state to the pre-repair condition. If rollback is not possible (because the repair wrote to an external system that cannot be reversed), the user must be notified immediately and an escalation path must be offered.

---

## Resume Conditions

The workflow resumes from the corrected state when:

- Post-repair validation has passed
- All affected downstream steps have been identified and will be re-executed if necessary
- The user has confirmed that the repair outcome is acceptable

Resume does not mean restart — the workflow continues from the corrected point, not from the beginning.

---

## Required Explanation Patterns

- **Reasoning trace** — for complex repairs (especially state repair in multi-step workflows), the AI must provide a reasoning trace of what was wrong, what was changed, and why the correction is expected to resolve the problem
- **Decision summary** — when a repair affects outputs that the user has already seen or acted on, a decision summary documents what changed and what impact it has on prior work
- **Limitation disclosure** — if the repair is partial (the AI can correct some but not all of the identified issues), the limitation must be disclosed before resuming

---

## Required Permission Patterns

- **One-time permission gate** — required before any repair that writes to an external system or modifies data outside the current session's scope
- **Scoped permission** — if the repair requires access to data or configuration outside the AI's standard scope, a scoped permission grant must be obtained before the repair can proceed
- Repairs to AI-managed in-session state do not require a permission gate — this is the AI correcting its own working state, not user data

---

## Related Uncertainty States

- **Conflicting evidence state** → repair recovery may resolve a conflicting evidence state if the conflict was caused by a data error that can be corrected (one source had a typo, an incorrect date, a malformed value)
- **Stale context state** → if stale data caused an output error, repair recovery replaces the stale data with a fresh version and re-runs the affected step

---

## Related Refusal Patterns

- **Partial completion** → repair recovery addresses the incomplete portions of a partial completion when the incompleteness was caused by a correctable error, not a structural capability limit
- **Constrained completion** → if a repair produces a result that requires constraints to be applied (the corrected data changes the output scope), constrained completion may apply to the resumed step

---

## Related Escalation Paths

- **System escalation** → if the repair requires a change to an external system's configuration, system escalation routes the correction request to the appropriate system
- **Role escalation** → if the repair requires authority the current user does not have (e.g., correcting a data field that is locked to a specific role), role escalation routes the correction approval to the appropriate authority

---

## User Communication

**At repair diagnosis:**
```
I found an issue that is blocking [step/action]: [specific error description].

[Current state] vs [required state]

To fix this: [proposed correction] — [what it changes and why]

[Approve correction] [I'll correct it myself] [Cancel]
```

**At repair completion:**
```
Correction applied. [What was changed.]

Continuing from Step [n] with the corrected [data/state].
```

**At rollback:**
```
The correction introduced a new issue: [specific description].

I've restored the previous state. No data was changed externally.

Options: [Try a different correction] [Get help from an administrator] [Exit and preserve draft]
```

---

## Audit Requirements

**Required for any repair that modifies external data or state.** Log:
- The specific error diagnosed
- The pre-repair state (sufficient to enable rollback if needed)
- The correction proposed and whether the user approved it
- The post-repair state
- Whether validation passed
- Whether rollback was triggered and why

For regulated environments where data lineage must be preserved, the repair event must be recorded as a distinct version in the data history — not as a silent overwrite.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Repairing without diagnosis | Applying a correction without confirming the root cause | The symptom is addressed but the underlying error persists; the workflow fails again at the same point |
| Repairing without validation | Applying the correction and resuming without post-repair validation | An invalid corrected state propagates further into the workflow; later steps produce corrupted outputs |
| Irreversible repair without disclosure | Applying a correction that cannot be rolled back without notifying the user | The user cannot undo a change they may not have fully evaluated |
| Silent overwrite | Correcting data without logging the pre-repair state | Audit gap; data lineage is broken; rollback is impossible |
| Re-executing too many steps | Re-running steps from the point of correction that do not need to be re-run | Valid prior outputs are overwritten unnecessarily; work is lost |

---

## Fallback Behavior

If repair recovery cannot succeed:

1. If rollback is possible: restore the pre-repair state and transition to redirect recovery (a different path to the goal)
2. If rollback is not possible: notify the user immediately, provide the specific state of the data or system, and escalate to human handoff for resolution
3. Preserve all context — what was attempted, what state the system is in, and what the error is — so the human agent can complete the repair without starting over

---

## Accessibility Considerations

- Repair prompts that require user input (data correction confirmation) must be presented as form inputs with clear labels, not as conversational text requiring the user to parse and type a correction
- Error state indicators must not rely on color alone — use icons, text labels, and ARIA roles in addition to color
- When the workflow resumes after repair, focus must be positioned at the resumption point — not at the top of the page or the start of the conversation
- Screen readers must be informed when a repair has been completed: use `aria-live="assertive"` for the repair confirmation

---

## Enterprise Considerations

- **Data lineage requirements:** In regulated industries, every correction to production data must be traceable. The pre-repair state, the repair event, and the post-repair state must all be preserved in an immutable record.
- **Four-eyes for high-impact repairs:** Repairs to financial data, clinical records, or compliance-relevant configuration may require a second authorized reviewer before the correction is applied — this triggers role escalation as a precondition to repair execution.
- **Integration state management:** When a repair affects data that has already been sent to an external system (ERP, CRM, compliance platform), the repair must include a reconciliation step with the external system, not just a local correction.

---

## Example Scenario

**Context:** An enterprise AI is helping an accountant prepare a month-end journal entry. The accountant provided a transaction file, but the AI detects that the debit and credit columns are reversed — a data transposition error that would produce incorrect entries in the general ledger.

**Repair recovery:**
```
I found an issue with the journal entry file before posting.

Problem: The debit and credit columns appear to be transposed. 
The total debits ($214,880) match the expected credits, and vice versa.

Proposed correction: Swap the debit and credit columns across all 23 rows.

Effect: The entry will balance correctly. No amounts are changed — only 
which column they appear in.

[Apply correction] [Show me the change first] [I'll fix it in the source file]
```

Accountant selects "Show me the change first." The AI displays a diff of the first five rows showing the before/after column swap. The accountant confirms. The correction is applied, the entry is validated (debits equal credits, all accounts recognized), and the posting proceeds.

The pre-repair and post-repair states are logged with the accountant's approval timestamp, meeting the firm's data lineage requirements for journal entry corrections.
