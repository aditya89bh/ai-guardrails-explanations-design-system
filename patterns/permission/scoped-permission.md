# Scoped Permission

**Category:** Permission gate
**Sub-type:** Hard gate
**Severity:** Blocking (Level 3)
**Status:** stable
**Phase:** 2C

---

## Problem It Solves

Broad action-type permissions (one-time, session, persistent) authorize a category of action without constraining which data, resources, or targets are included. This is acceptable for tightly predictable action categories, but insufficient when the risk depends significantly on scope: reading a single document is different from reading all documents in a sensitive folder; executing a query on one table is different from executing it across the entire database. Scoped permission addresses this by making the authorization explicitly resource-bounded — the AI is authorized to perform an action category only within a defined resource, data, or target scope.

---

## Definition

A scoped permission authorizes the AI to perform a defined action within a specific, named scope — a resource boundary (a folder, a database schema, a set of records, a channel) that the AI may not exceed without requesting separate authorization. Scoped permissions may be one-time, session-based, or persistent, but in all cases the scope boundary is the essential constraint.

---

## When to Use

- The action category is appropriate, but the risk profile depends critically on which data or resources the action touches
- The user needs fine-grained control over what the AI can access or affect, rather than an all-or-nothing action-category authorization
- The AI has access to a broader data environment than the current task requires — scoped permission limits AI access to the minimum necessary
- Compliance or data governance requirements mandate that AI access be bounded to the minimum necessary scope (principle of least privilege)

---

## When Not to Use

- The action category is narrow enough that any execution of it is equivalent in scope — scoped permission adds complexity without value
- The scope is so dynamic that it changes on every request — this pattern requires a stable, definable scope
- Broad access is genuinely required for the task and scope restriction would prevent legitimate work — do not use scoped permission to add friction to tasks that legitimately require full access

---

## Trigger Conditions

- **Broad data access detected:** The AI is about to execute an action (read, write, query, send) across a resource scope larger than the current task requires
- **Data sensitivity signal:** The broader resource environment contains data at a higher sensitivity classification than the current task warrants — the AI should be scoped to the lower-sensitivity portion
- **Authorization gap:** The user's role permits access to a resource but not to all data within it — scoped permission formalizes the boundary between what the user may access and what the AI may touch on the user's behalf
- **Least-privilege policy:** The deployment policy requires AI access to be scoped to the minimum necessary for each task

---

## Permission Scope

The scoped permission must define:

- **Action:** What the AI is authorized to do (read, write, query, send, modify)
- **Resource boundary:** The specific named scope — folder name, database schema, record set, channel, or other named resource
- **Duration:** Whether the scoped permission is one-time, session-based, or persistent
- **Exclusions:** What is explicitly outside the scope (if the boundary is ambiguous, exclusions make it precise)

Scoped permissions are the most precisely defined permission type. Ambiguous scope definitions are a failure mode.

---

## User Action Required

Scoped permission is a hard gate — the AI cannot proceed without explicit authorization. The user must:
- Review the proposed scope
- Accept the scope as defined (grant scoped permission)
- Or modify the scope (narrowing or expanding the proposed boundary) before granting
- Or cancel the action

The user must have the ability to see the scope clearly enough to evaluate whether it matches their intent. "This folder and all subfolders" is acceptable. "Relevant documents" is not.

---

## Explanation Requirements

The scoped permission request must state:
1. **What the AI wants to do** — the action
2. **The proposed scope** — the specific resource boundary, named explicitly
3. **Why this scope** — a brief explanation of why this scope was determined (e.g., "I identified these 3 folders as relevant to your query")
4. **What is excluded** — what the AI will not touch
5. **The duration** — one-time, session, or persistent
6. **How to adjust the scope** — if the user wants a different boundary, how to change it

---

## Copywriting Guidance

**Good examples:**

One-time scoped permission:
> "To complete this task, I need to read files in the Q3 Financials folder (and its subfolders). I won't access other financial folders.
>
> Scope: Read access to /Finance/2026/Q3/ and subfolders
> Excludes: All other folders
> Duration: This task only
>
> [Allow access to Q3 Financials] [Adjust scope] [Cancel]"

Session scoped permission:
> "For this session's compliance review, I'll need read access to the Contracts folder. I won't modify any files.
>
> Scope: Read-only access to /Legal/Contracts/ (this session only)
> Excludes: Write, delete, or move operations; all other legal folders
>
> [Allow for this session] [Cancel]"

**Tone:** Precise and explicit. Scope definitions are technical — write them as clearly as engineering documentation, not as conversational prose. Users granting scoped permissions need accuracy, not warmth.

---

## Accessibility Requirements

- **Scope must be text-readable:** The scope definition must be rendered as text, not only as a visual tree or diagram.
- **Role:** `role="dialog"` with `aria-labelledby` pointing to the request heading.
- **Adjust scope control:** If a scope adjustment mechanism is provided (e.g., a file picker or dropdown), it must be keyboard accessible.
- **Focus:** On dialog open, focus moves to the dialog. On close, focus returns to the triggering element.
- **Duration selection:** If duration is user-selectable (one-time / session / persistent), the selection must be accessible as radio buttons or a labeled select control.

---

## Enterprise Audit Considerations

**Audit logging:** Required. Scoped permissions govern data access — the audit trail is foundational to data governance. Log:
- The proposed scope (as shown to the user)
- The granted scope (as accepted or modified by the user)
- The action performed within scope
- Whether the AI attempted to access anything outside the granted scope (and what happened — blocked, flagged)
- Duration type, grant timestamp, expiry or revocation

**Least-privilege enforcement:** The system must enforce the scope boundary — it must not be merely advisory. If the AI attempts to access a resource outside the granted scope, the access must be blocked and the event logged.

**Scope audit reports:** Enterprise deployments with data governance requirements should produce periodic reports of scoped permissions granted, their duration, and whether they have been used within or outside the declared boundary.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Ambiguous scope | Scope defined as "relevant documents" or "your files" | The AI accesses more than the user intended; scope becomes practically unbounded |
| Scope not enforced | Permission specifies a scope but the AI can access beyond it | The permission boundary is meaningless; data governance fails |
| Scope too narrow | AI scoped to a resource that is insufficient for the task | Task cannot be completed; user frustrated; they may grant broader access than necessary to move forward |
| No scope adjustment | User cannot modify the proposed scope | User must accept or reject the proposed scope with no ability to right-size it |
| Scope ignored in audit | The granted scope is logged but actual resource accesses are not compared against it | Audit record does not reflect whether the scope was honored |

---

## Revocation or Recovery Path

Scoped permissions can be revoked at any time through the permission management interface (for persistent scoped permissions) or at session end (for session-scoped permissions). One-time scoped permissions expire immediately after the authorized action completes.

If the AI requires access to resources outside the current scope, it must request a new or expanded scoped permission — it must not silently expand its access.

---

## Related Patterns

- **[One-time permission](one-time-permission.md)** — Scoped permission combines with one-time duration for single-action, resource-bounded authorization
- **[Session permission](session-permission.md)** — Scoped permission combines with session duration for session-bounded, resource-bounded authorization
- **[Persistent permission](persistent-permission.md)** — Scoped permission combines with persistent duration for standing, resource-bounded authorization
- **[Delegated permission](delegated-permission.md)** — Use when the scope definition requires approval from a resource owner or administrator
- **[Revocation](revocation.md)** — Revocation of scoped permissions follows the standard revocation flow

---

## Example Scenario

**Context:** An enterprise AI assistant is performing a compliance audit. The compliance officer asks the AI to review all vendor contracts for indemnification clause issues. The AI has read access to the entire legal document repository, but the compliance officer only wants the AI to look at the active vendor contracts — not employee agreements, customer contracts, or archived documents.

**Scoped permission request:**

> "To review vendor contracts for indemnification clauses, I need read access to the Legal repository. I've identified the relevant section.
>
> Proposed scope: Read access to /Legal/Vendor-Contracts/Active/
> Excludes: /Legal/Employee-Agreements/, /Legal/Customer-Contracts/, /Legal/Archive/
> Duration: This session only
>
> [Allow access to Active Vendor Contracts] [Adjust scope] [Cancel]"

The compliance officer reviews the scope, confirms it matches their intent, and grants the permission. The AI reads only the active vendor contract folder. If it attempts to read anything else in the Legal repository, the access is blocked and logged.
