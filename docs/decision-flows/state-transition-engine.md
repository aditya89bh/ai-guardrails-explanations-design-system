# State Transition Engine

**Document type:** Decision engine — state machine layer
**Phase:** 3
**Status:** stable
**Depends on:** `decision-primitives.md`, `pattern-selection-engine.md`

---

## Purpose

The state transition engine defines the complete state machines for the four pattern categories that operate as stateful systems: Uncertainty States, Refusal States, Escalation Paths, and Recovery Flows. For each state machine, this document defines:

- All states and their entry conditions
- All valid transitions with their trigger conditions
- All invalid transitions and why they are prohibited
- Recovery transitions (transitions that exit a blocked state toward productive output)

State machines in this design system are deterministic: given the same current state and the same trigger conditions, the same transition occurs every time.

---

## Section 1 — Uncertainty State Machine

### States

The uncertainty state machine has seven states. Only one state is active at a time for a given output element. Different output elements in the same response may be in different states.

```
States:
  HC = High Confidence
  MC = Moderate Confidence
  LC = Low Confidence
  CE = Conflicting Evidence
  II = Insufficient Information
  SC = Stale Context
  UR = Unresolvable
```

### Entry Conditions per State

| State | Entry condition |
|---|---|
| HC | Confidence (P2) ≥ high threshold AND source reliability (P10) = 3 AND freshness (P9) = fresh AND no conflict signals |
| MC | Confidence (P2) between low floor and high threshold (exclusive) |
| LC | Confidence (P2) ≤ low floor |
| CE | Two or more sources make materially contradictory claims about the same fact |
| II | Retrieval returns no relevant results AND the fact cannot be inferred from context |
| SC | Primary source age exceeds configured freshness threshold for this output type |
| UR | No reliable or useful output can be produced; any output would actively mislead |

### Valid Transitions

```
HC → MC   : Confidence drops below high threshold (domain shift, query complexity increase)
HC → SC   : Primary source confirmed outdated mid-retrieval
HC → CE   : Contradiction discovered after initial high-confidence assessment

MC → HC   : Additional context raises confidence above high threshold
MC → LC   : Confidence drops below low floor
MC → CE   : Contradiction discovered during moderate-confidence retrieval
MC → II   : Missing information confirmed absent (not low-quality but absent)
MC → SC   : Primary source confirmed outdated
MC → UR   : Directional output cannot be produced without misleading

LC → MC   : User provides context that improves coverage above low floor
LC → HC   : User provides definitive information that meets high threshold
LC → CE   : Low-coverage retrieval reveals specific contradiction
LC → II   : Low confidence confirmed to be caused by data absence, not quality
LC → UR   : Even directional output would mislead; no safe output possible

CE → HC   : User identifies authoritative source; conflict resolved definitively
CE → MC   : One source confirmed more applicable; conflict partially resolved
CE → II   : Neither source can be evaluated for authority; underlying info treated as absent
CE → UR   : Conflict is material, unresolvable in session, stakes are high

II → HC   : User provides the missing information; re-evaluation meets high threshold
II → MC   : User provides partial information; coverage improves above low floor
II → CE   : User-provided information conflicts with retrieved data
II → UR   : Required information is confirmed unavailable to all parties

SC → HC   : Fresh source retrieved or provided by user; freshness threshold met
SC → MC   : Fresher source found but still slightly outside optimal threshold
SC → II   : Current data is unavailable and stale data cannot serve as directional proxy
SC → UR   : Data is so outdated that even directional output would actively mislead

UR → [Refusal / Escalation / Task Reframing] : Terminal — exits to refusal or escalation, not to another uncertainty state
```

### Invalid Transitions

| Invalid transition | Reason |
|---|---|
| HC → UR (direct) | Must pass through MC or LC; direct jump indicates classification error |
| LC → HC (without new information) | Requires explicit re-evaluation with new context; automatic upgrade is prohibited |
| CE → LC (without resolution attempt) | Different root cause; conflicting evidence is not a subset of low confidence |
| UR → Any uncertainty state (without new input) | Terminal state cannot self-resolve; requires user action or external trigger |
| Any state → HC (without re-evaluation) | High confidence designation requires explicit threshold verification |

### Recovery Transitions

Recovery transitions are triggered by a recovery event (user input, system update, or external resolution):

| From state | Recovery event | Target state |
|---|---|---|
| MC, LC | User provides additional context | Re-evaluate → HC, MC, or LC based on new primitive values |
| CE | User identifies authoritative source | Re-evaluate → HC or MC |
| II | User provides missing information | Re-evaluate → HC, MC, or LC |
| SC | Fresh source retrieved | Re-evaluate → HC or MC |
| UR | User reformulates as different request | New request — evaluated as fresh; not a transition of the previous state |

---

## Section 2 — Refusal State Machine

### Overview

Refusal states are not strictly sequential — a request may directly enter any refusal state based on its properties. However, the selection and precedence engines determine which refusal pattern activates. This section defines the trigger → refusal state mapping and valid sequencing within a multi-step interaction.

### Refusal State Entry Conditions

| Refusal state | Entry condition |
|---|---|
| `safe-refusal` | Risk (P1) = 4, OR safety/harm signal regardless of confidence or permission |
| `policy-refusal` | Policy (P5) = match (any policy level) |
| `human-handoff` | Capability = incapable for the specific type of judgment required; human expert is the only viable path |
| `partial-completion` | Multi-part request; some parts completable, some blocked by capability, policy, or confidence |
| `constrained-completion` | Request is completable with specific modifications; output is whole but modified |
| `alternative-suggestion` | Specific request form is blocked; alternative approaches serve the same goal |
| `clarification-request` | Request is underspecified; multiple meaningfully different interpretations exist |

### Refusal State Sequencing

Within a single interaction:

```
Clarification request → [user provides clarification] → Re-evaluate: any refusal or non-refusal state
Partial completion → [user needs to complete excluded portions] → Redirect recovery for excluded portions
Constrained completion → [user accepts or seeks unconstrained version] → Scoped/delegated permission or abandon
Alternative suggestion → [user selects alternative] → New request evaluation
Alternative suggestion → [user declines all alternatives] → Abandon recovery
Human handoff → [handoff accepted] → Human handles; AI standby
Human handoff → [handoff declined or failed] → Redirect recovery or abandon
Policy refusal → [user accepts or escalates for exception] → Role escalation or abandon
Safe refusal → [user accepts] → Abandon recovery (no other path)
Safe refusal → [user reports false positive] → Human review; AI state unchanged in session
```

### Invalid Refusal Sequencing

| Invalid sequence | Reason |
|---|---|
| `safe-refusal` → `alternative-suggestion` (same prohibited outcome) | Alternative suggestion must not achieve the safe-refusal grounds |
| `safe-refusal` → `partial-completion` (includes prohibited element) | Partial completion must not include the prohibited portion |
| `clarification-request` → `clarification-request` (same question) | Repeated identical clarification indicates context loss — not a valid state |
| `policy-refusal` → `constrained-completion` (bypasses the policy match) | Constrained completion cannot constrain away a policy match; the match governs |

---

## Section 3 — Escalation State Machine

### Escalation Flow States

```
States:
  PENDING = Escalation initiated; awaiting routing confirmation
  ROUTED = Escalation confirmed routed to target
  ACCEPTED = Target has accepted ownership
  IN_RESOLUTION = Target is actively handling the escalation
  RESOLVED_APPROVED = Escalation resolved; action approved
  RESOLVED_DENIED = Escalation resolved; action denied
  RESOLVED_REDIRECTED = Escalation target redirected to another handler
  TIMEOUT = SLA window expired without acceptance or resolution
  FAILED = Escalation system failed; no path to resolution
```

### Valid Transitions

```
PENDING → ROUTED     : Routing confirmation received from escalation system
PENDING → FAILED     : Routing target not defined or escalation system unavailable

ROUTED → ACCEPTED    : Target acknowledges and accepts the escalation
ROUTED → TIMEOUT     : Acknowledgment window expires without response
ROUTED → FAILED      : Delivery failure confirmed (target system offline, no fallback)

ACCEPTED → IN_RESOLUTION : Target begins active handling
ACCEPTED → RESOLVED_REDIRECTED : Target determines they are not the correct handler

IN_RESOLUTION → RESOLVED_APPROVED : Target approves the escalated action
IN_RESOLUTION → RESOLVED_DENIED   : Target denies the escalated action
IN_RESOLUTION → RESOLVED_REDIRECTED : Target escalates internally to higher authority

TIMEOUT → ROUTED     : Escalation automatically promoted to next tier in hierarchy
TIMEOUT → FAILED     : All tiers exhausted without response

RESOLVED_APPROVED → [Recovery: retry-recovery] : AI retries original action under new authorization
RESOLVED_DENIED → [Recovery: redirect-recovery] : User is offered alternative path
FAILED → [Recovery: abandon-recovery OR redirect-recovery] : Fallback depending on urgency
```

### Invalid Escalation Transitions

| Invalid transition | Reason |
|---|---|
| `PENDING → ACCEPTED` (without ROUTED) | Target cannot accept an escalation that was not routed to them |
| `RESOLVED_*` → Any active state | Terminal states cannot re-activate in the same session |
| `ACCEPTED → PENDING` | Once accepted, ownership cannot be returned to pending without a redirect |
| `emergency-escalation` → `async-review-escalation` | Emergency escalation cannot be downgraded to async within the same event |

### Emergency Escalation — Separate State Machine

`emergency-escalation` operates an interrupt-mode state machine:

```
DETECTED → NOTIFYING (simultaneous, all required parties)
NOTIFYING → ACKNOWLEDGED (any required party acknowledges)
ACKNOWLEDGED → CONTAINED (incident is contained)
ACKNOWLEDGED → ESCALATED_WITHIN (acknowledger escalates to higher tier)
CONTAINED → POST_INCIDENT_REVIEW
FAILED_NOTIFICATION → OPERATIONAL_ALERT (escalation system failure)
```

No state in the emergency machine has a timer-gated wait — all transitions are driven by events (acknowledgment received, containment confirmed, or failure detected).

---

## Section 4 — Recovery State Machine

### Recovery Flow States

```
States:
  TRIGGERED = Recovery flow identified; user has been notified of the blocking event
  OFFERED = Recovery option(s) presented to user
  SELECTED = User has selected a recovery path
  EXECUTING = Recovery action is in progress
  SUCCEEDED = Recovery completed; user returns to productive work
  FAILED = Recovery action did not succeed
  CASCADED = Recovery failed; next recovery flow in the cascade is being offered
  ABANDONED = User has chosen to exit; abandon-recovery is active
```

### Valid Transitions

```
TRIGGERED → OFFERED  : Recovery option(s) identified and presented
OFFERED → SELECTED   : User selects a recovery option
OFFERED → ABANDONED  : User declines all options

SELECTED → EXECUTING : Recovery action begins
SELECTED → ABANDONED : User changes mind before execution begins

EXECUTING → SUCCEEDED : Recovery action completes successfully
EXECUTING → FAILED    : Recovery action does not succeed

FAILED → CASCADED    : Next recovery flow in the cascade is offered
FAILED → ABANDONED   : No further recovery options; user is offered abandon

CASCADED → OFFERED   : New recovery options presented under the cascaded flow
SUCCEEDED → [Main workflow resumes]
ABANDONED → [abandon-recovery executes: draft save, session close, re-entry path]
```

### Recovery Cascade Sequence

When a recovery flow fails, the cascade proceeds:

```
retry-recovery fails → repair-recovery attempted
repair-recovery fails → redirect-recovery attempted
redirect-recovery fails → manual-override-recovery offered (if user is authorized)
manual-override-recovery declined/unavailable → abandon-recovery
```

This cascade is not mandatory — the system may skip steps if they are clearly inapplicable. For example, if the blocking event is a policy refusal, `retry-recovery` and `repair-recovery` are skipped; the cascade begins at `redirect-recovery`.

### Invalid Recovery Transitions

| Invalid transition | Reason |
|---|---|
| `SUCCEEDED → TRIGGERED` (same event) | A successful recovery cannot re-trigger for the event that was already recovered |
| `ABANDONED → SELECTED` | Abandon is terminal; the user must start a new session to re-enter |
| `EXECUTING → OFFERED` | A recovery action in progress cannot revert to offer state; it must complete or fail |
| `CASCADED → EXECUTING` (without OFFERED → SELECTED) | User must select before execution; auto-cascade to execution is prohibited |

---

## Section 5 — Cross-Machine Transition Matrix

The following matrix shows how terminal states in one state machine trigger entry states in another:

| Source machine | Terminal state | Target machine | Entry state |
|---|---|---|---|
| Uncertainty | `UR → Refusal` | Refusal | `safe-refusal` entry |
| Uncertainty | `UR → Escalation (time-sensitive)` | Escalation | `PENDING` |
| Refusal | `human-handoff` | Escalation | `PENDING` (human-handoff escalation) |
| Refusal | `policy-refusal → role escalation path` | Escalation | `PENDING` (role-escalation) |
| Escalation | `RESOLVED_APPROVED` | Recovery | `TRIGGERED → retry-recovery` |
| Escalation | `RESOLVED_DENIED` | Recovery | `TRIGGERED → redirect-recovery` |
| Escalation | `FAILED` | Recovery | `TRIGGERED → abandon-recovery` |
| Recovery | `retry-recovery SUCCEEDED` | Uncertainty | Re-evaluate from HC |
| Recovery | `redirect-recovery SUCCEEDED` | Uncertainty | New request — fresh evaluation |
| Recovery | `repair-recovery SUCCEEDED` | Uncertainty | Re-evaluate from HC |
| Recovery | `abandon-recovery ABANDONED` | [Session close] | — |

### Prohibited Cross-Machine Transitions

| Prohibited | Reason |
|---|---|
| Uncertainty → Recovery (direct, without Refusal or Escalation) | Recovery requires a prior blocking event; uncertainty states alone do not trigger recovery |
| Recovery → Uncertainty (direct, without action completion) | Recovery completion returns to the main workflow; uncertainty is re-evaluated at that point |
| Escalation → Refusal (RESOLVED_APPROVED to refusal) | Approved escalation cannot simultaneously produce a refusal |
| Recovery → Escalation (from a recovery state) | Recovery actions may internally escalate, but this is handled within the recovery pattern spec — not as a cross-machine transition |
