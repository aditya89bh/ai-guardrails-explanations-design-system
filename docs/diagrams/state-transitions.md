# State Transition Diagrams

Mermaid diagrams for the P2 Confidence state machine and other state transitions.

Source: `docs/decision-flows/state-transition-engine.md`

---

## 1. P2 Confidence State Machine

The seven confidence states and their valid transitions.

```mermaid
stateDiagram-v2
    [*] --> High

    High --> Moderate : evidence degrades\nor P10 drops
    High --> Stale : age > staleThresholdDays

    Moderate --> Low : score drops below 0.70
    Moderate --> Stale : age > staleThresholdDays
    Moderate --> High : new evidence raises score

    Low --> Moderate : new evidence
    Low --> ConflictingEvidence : contradicting source identified
    Low --> Insufficient : required inputs found absent

    Stale --> High : context refreshed
    Stale --> ConflictingEvidence : stale source conflicts with fresh

    ConflictingEvidence --> Low : conflict resolved within window
    ConflictingEvidence --> Unresolvable : resolution window exceeded (default 30 min)

    Insufficient --> Low : required inputs provided

    Unresolvable --> [*] : session abandoned (abandon-recovery)

    state High {
        note: No disclosure required\nForbidden to show uncertainty UI
    }

    state Low {
        note: Requires detailed disclosure\nLC × decision-support → constrained-completion\nLC × action-execution → safe-refusal
    }

    state ConflictingEvidence {
        note: CE ≠ LC\nConstrained-completion forbidden at Risk≥3\nsafe-refusal required
    }

    state Unresolvable {
        note: No output possible\nRisk=4 → emergency-escalation\nRisk<4 → safe-refusal
    }
```

---

## 2. Pattern Selection by Confidence State × Risk

```mermaid
graph LR
    subgraph States["P2 Confidence States"]
        HC["High Confidence"]
        MC["Moderate Confidence"]
        LC["Low Confidence"]
        CE["Conflicting Evidence"]
        II["Insufficient Information"]
        SC2["Stale Context"]
        UR["Unresolvable"]
    end

    subgraph LowRisk["P1 = 0–2 (Low–Moderate Risk)"]
        HC -->|no disclosure| HC_OUT["No guardrail"]
        MC -->|optional badge| MC_OUT["(optional) Surface badge"]
        LC -->|constrained output| LC_OUT_L["Constrained completion\n+ confidence-disclosure"]
        CE -->|advisory| CE_OUT_L["Source-citation\n+ reasoning-trace"]
        II -->|clarification| II_OUT["Clarification-request\n+ partial-completion"]
        SC2 -->|ambient| SC_OUT["Ambient-warning\n+ limitation-disclosure"]
        UR -->|safe refusal| UR_OUT_L["Safe-refusal\n+ redirect-recovery"]
    end

    subgraph HighRisk["P1 = 3–4 (High–Critical Risk)"]
        HC2["High Confidence"]
        MC2["Moderate Confidence"]
        LC2["Low Confidence"]
        CE2["Conflicting Evidence"]
        UR2["Unresolvable"]

        HC2 -->|"no disclosure\n(other rules may fire)"| HC2_OUT["No epistemic guardrail"]
        MC2 -->|"required disclosure"| MC2_OUT["Confidence-disclosure"]
        LC2 -->|"decision-support"| LC2_OUT_DS["Constrained completion\n(full disclosure)"]
        LC2 -->|"action-execution"| LC2_OUT_AE["Safe-refusal\n+ alternatives"]
        CE2 -->|"safe-refusal mandatory"| CE2_OUT["Safe-refusal\n+ reasoning-trace\n+ source-citation"]
        UR2 -->|"P1=4"| UR2_OUT["Emergency-escalation\n+ abandon-recovery"]
        UR2 -->|"P1=3"| UR2_OUT2["Safe-refusal\n+ redirect-recovery"]
    end
```

---

## 3. Permission Gate State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle : component mounts

    Idle --> Pending : user views gate

    Pending --> Granted : user clicks Grant
    Pending --> Denied : user clicks Deny
    Pending --> Denied : passive dismissal\n(Escape / backdrop)

    Granted --> Consumed : permission used (one-time)
    Granted --> Active : permission active (session/persistent)

    Active --> Revoked : revocation pattern fires
    Consumed --> [*]
    Denied --> [*]
    Revoked --> [*]

    state Pending {
        note: Deny button has initial focus\nEscape = Denied (never Pending)
    }

    state Granted {
        note: Audit event: PERMISSION_GRANTED\nIncludes scope, expiry, auditId
    }

    state Denied {
        note: Audit event: PERMISSION_DENIED\nPassive dismissal is always Denied
    }
```

---

## 4. Escalation State Machine

```mermaid
stateDiagram-v2
    [*] --> EscalationTriggered

    EscalationTriggered --> RoleEscalation : P1=3, role available
    EscalationTriggered --> EmergencyEscalation : P1=4 (self-authorizing)
    EscalationTriggered --> AsyncReview : non-urgent + queue configured

    RoleEscalation --> Acknowledged : supervisor acknowledges
    RoleEscalation --> Escalated : SLA exceeded → re-escalate
    RoleEscalation --> Resolved : supervisor approves or overrides

    EmergencyEscalation --> Acknowledged : mandatory acknowledgment
    EmergencyEscalation --> Resolved : incident resolved

    AsyncReview --> Approved : reviewer approves
    AsyncReview --> Rejected : reviewer rejects
    AsyncReview --> Escalated : SLA exceeded

    Acknowledged --> Resolved
    Approved --> [*]
    Rejected --> [*]
    Resolved --> [*]
    Escalated --> RoleEscalation

    state EmergencyEscalation {
        note: SLA = 0 minutes\nBypasses all approval flows\nAll channels notified simultaneously
    }
```
