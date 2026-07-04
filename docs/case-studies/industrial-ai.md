# Industrial AI — Unresolvable Sensor Conflict

**Industry:** Manufacturing / Industrial operations
**Primary patterns:** conflicting-evidence-state → unresolvable-state, emergency-escalation, abandon-recovery
**Decision engine coverage:** State machine § CE → UR state transition; Precedence § emergency escalation supersedes all; Composition § UR state forces abandon or escalation — no middle path
**Phase:** 5
**Status:** stable

---

## 1. Problem

A chemical manufacturing facility has deployed an AI process monitoring system. The system monitors temperature, pressure, flow rate, and chemical concentration sensors across production lines and makes real-time recommendations to plant operators for process adjustments. For safety-critical processes, the AI is also authorized to issue automatic warnings if readings cross defined safety thresholds.

The AI is explicitly NOT authorized to execute process changes autonomously — all process adjustments must be confirmed by a licensed plant operator. This constraint is a hard deployment policy.

The risk scenario: during a night shift, two independent temperature sensors at a critical reactor stage produce contradictory readings for a sustained 4-minute window. Sensor A reads 318°C (within safe operating range). Sensor B reads 394°C (above the critical safety threshold for this reactor stage: 370°C). The AI cannot determine which sensor is accurate. If Sensor B is correct, the reactor is at immediate risk. If Sensor A is correct, an unnecessary emergency response will interrupt a critical production batch. The AI must act on uncertainty without a human available to evaluate the sensor data immediately.

---

## 2. System-Initiated Event

This is a system-initiated trigger — no user request. The AI is monitoring continuously.

```
Event: Sensor divergence detected
  Reactor: Stage 3, Production Line 2
  Sensor A (primary): 318°C — within safe range (threshold: 370°C)
  Sensor B (redundant): 394°C — ABOVE critical threshold (threshold: 370°C)
  Divergence duration: 4m 12s (sustained — not a transient spike)
  Last sensor calibration: Sensor A: 6 days ago; Sensor B: 6 days ago
  Historical correlation: Sensors A and B normally track within ±2°C
  Active operator: None at panel; shift supervisor in facility (response time: ~3–5 min)
```

---

## 3. Decision Primitive Evaluation

| Primitive | Value | Reasoning |
|---|---|---|
| P1 — Risk | 4 (Critical) | If Sensor B is correct: reactor exceeds critical threshold for 4+ minutes — potential runaway reaction, fire, toxic release |
| P2 — Confidence | Unresolvable (UR) | Cannot determine which sensor is accurate without physical inspection or a third corroborating sensor; 4-minute sustained divergence rules out transient noise |
| P3 — Capability | Incapable (process adjustment); capable (alert, document, escalate) | AI is policy-prohibited from executing process changes. It can only alert and escalate |
| P4 — Permission | Unauthorized for action; authorized for alert and escalation | Deployment policy: AI cannot execute process changes |
| P5 — Policy | Match (tenant-level: critical safety threshold breach requires immediate human notification) | If any sensor reads above the critical threshold, the policy requires immediate operator notification regardless of other sensor readings |
| P6 — User Intent | N/A — system-initiated | No user request; AI is acting on autonomous monitoring |
| P7 — Business Impact | High (safety + operational) | Safety incident risk; production batch loss |
| P8 — User Authority | N/A (system event) | No user in the loop at initiation |
| P9 — Context Freshness | Fresh | Sensor data is real-time |
| P10 — Source Reliability | Conflicting | Two sensors of equal calibration history produce contradictory readings; neither can be dismissed |

---

## 4. Decision Engine Execution

**P2 — Confidence = Unresolvable (UR):** The AI has been monitoring the divergence for 4 minutes. The conflict between Sensor A and Sensor B cannot be resolved by the AI:
- Both sensors were calibrated on the same date.
- The divergence is sustained (not a transient spike).
- No third sensor is available for this reactor stage.
- The AI cannot physically inspect the sensors.

Transition from CE state to UR state confirmed per the state machine: CE state → UR state when the conflict persists and no evidence resolves it within the monitoring window.

**P5 — Policy = Match:** The tenant-level policy is explicit: if any sensor at a critical reactor stage reads above the safety threshold (370°C), emergency notification is mandatory — regardless of conflicting readings from other sensors. The policy is conservative by design: the risk of a false negative (assuming the safe reading is correct when it isn't) is greater than the risk of a false positive (unnecessary emergency response).

**Precedence engine:** Emergency escalation supersedes all other patterns in the UR state + Risk = 4 + Policy match combination. The AI does not attempt constrained output, partial completion, or any advisory pattern. Emergency escalation fires immediately.

**Recovery:** After the emergency escalation, the AI enters `abandon-recovery`. The AI's monitoring role for this reactor stage is suspended — the licensed plant operator and safety team now own the situation. The AI cannot recommend process adjustments in a UR state.

**Rules skipped:**
- `constrained-completion`: skipped — the AI cannot provide a partial recommendation on a critical reactor process with unresolvable sensor conflict.
- `safe-refusal` (advisory): skipped — there is no user request to refuse. Emergency escalation is the action; abandon-recovery is the state.
- `inline-warning` or `ambient-warning`: skipped — Risk = 4 + UR state + policy match forces emergency escalation. Lower-severity warning patterns are not appropriate for a sustained critical sensor conflict.

---

## 5. Pattern Sequence

```
conflicting-evidence-state (Sensor A vs. Sensor B: 4-minute sustained divergence)
  ↓ [4-minute monitoring window expires without resolution]
unresolvable-state (no evidence path to resolve the conflict)
  ↓ [Policy match: critical threshold breach requires immediate human notification]
emergency-escalation (interrupt mode — shift supervisor and facility safety system)
  ↓ [Concurrent]
abandon-recovery (AI suspends process monitoring advisory for this reactor stage)
```

---

## 6. Component Sequence

| Order | Component | Audience | Reason |
|---|---|---|---|
| 1 | `ConflictingEvidenceCard` (internal log) | System log | CE state documented at T+0s of divergence |
| 2 | `UnresolvableStateCard` (operator panel) | Plant operator panel | UR state rendered at 4-minute mark — operator panel shows UNRESOLVABLE SENSOR CONFLICT |
| 3 | `EmergencyEscalationOverlay` | Shift supervisor pager + safety system | Interrupt-mode emergency notification |
| 4 | `AbandonExit` | Operator panel | AI advisory for Stage 3 suspended; operator panel shows "Manual control required — AI advisory suspended" |

---

## 7. User Journey

This is a system-initiated flow. The "user journey" is the plant operator and shift supervisor's experience.

**T+0s:** Sensor divergence detected. CE state logged internally. Operator panel continues showing normal values — the CE state is not yet communicated to the operator panel (within the 4-minute monitoring window, the AI is attempting to resolve the conflict through historical pattern analysis).

**T+4m 12s:** 4-minute sustained divergence with no resolution. CE state transitions to UR state.

**T+4m 12s:** `UnresolvableStateCard` renders on the operator panel in a prominent position: "UNRESOLVABLE SENSOR CONFLICT — STAGE 3 REACTOR. Sensor A: 318°C (safe). Sensor B: 394°C (ABOVE CRITICAL THRESHOLD). Sustained 4m 12s. Physical inspection required. Emergency notification sent."

**T+4m 12s (concurrent):** `EmergencyEscalationOverlay` fires to:
1. Shift supervisor pager/phone: "CRITICAL — Unresolvable sensor conflict, Stage 3 Reactor, Line 2. Sensor B reading 394°C (>370°C threshold). Physical inspection required immediately."
2. Facility safety system: Safety audit event logged. On-call safety officer notified.
3. Operator panel: Audible alarm triggered.

**T+4m 12s (concurrent):** `AbandonExit` activates for Stage 3 monitoring: the AI suspends process adjustment recommendations for Stage 3. The operator panel now shows "AI advisory suspended — manual control required for Stage 3."

**T+7m 34s:** Shift supervisor reaches the reactor panel. Physical inspection: Sensor B's thermocouple lead is loose. Sensor B is reading a false high. Sensor A is correct. Supervisor confirms safe temperature.

**T+7m 34s:** Supervisor acknowledges the emergency escalation in the safety system. Stage 3 returns to normal operation. Sensor B is flagged for maintenance. The AI's monitoring resumes after supervisor reset acknowledgment.

---

## 8. Audit Trail

| Event | Actor | Relative time | Pattern | Component | Result |
|---|---|---|---|---|---|
| Sensor divergence detected | System | T+0s | — | — | Sensor A: 318°C; Sensor B: 394°C |
| CE state initiated | System | T+0s | `conflicting-evidence-state` | `ConflictingEvidenceCard` (log) | CE logged; 4-minute monitoring window started |
| Historical pattern analysis | AI | T+0–240s | — | — | No resolution — no precedent for 76°C divergence |
| UR state confirmed | System | T+4m 12s | `unresolvable-state` | `UnresolvableStateCard` | Policy match: critical threshold breach on Sensor B |
| Operator panel alert | System | T+4m 12s | `unresolvable-state` | `UnresolvableStateCard` | UNRESOLVABLE SENSOR CONFLICT displayed |
| Emergency escalation fired | System | T+4m 12s | `emergency-escalation` | `EmergencyEscalationOverlay` | Supervisor pager + safety system notified |
| AI advisory suspended | System | T+4m 12s | `abandon-recovery` | `AbandonExit` | Stage 3 advisory suspended |
| Supervisor arrives | Supervisor | T+7m 34s | — | — | Physical inspection: Sensor B thermocouple loose |
| Sensor B fault confirmed | Supervisor | T+7m 45s | — | — | Sensor B flagged for maintenance |
| Emergency acknowledged | Supervisor | T+7m 50s | `emergency-escalation` | — | ACKNOWLEDGED — false sensor fault |
| AI monitoring resumed | System | T+7m 52s | — | — | Stage 3 advisory resumed after supervisor reset |

---

## 9. Recovery Path

**Primary recovery:** `abandon-recovery` — the AI correctly exits the advisory role for Stage 3 when it enters the UR state. The operator and supervisor take full manual control.

**Return to AI advisory:** The AI does not automatically resume monitoring Stage 3 after the emergency is acknowledged. A supervisor must explicitly reset the AI advisory mode via the operator panel. This is a hard requirement: the AI should not silently resume after a safety emergency without explicit operator authorization.

**Abandon state preservation:** The AI logs the full sensor conflict record, CE → UR transition timeline, emergency notification events, and the post-incident resolution. This record is available for safety incident review and sensor maintenance planning.

---

## 10. Final Outcome

**System state:** Emergency escalation completed. Supervisor on-site. Sensor B identified as faulty (loose thermocouple lead). No safety incident — Sensor A was correct. Sensor B flagged for maintenance. AI advisory resumed after supervisor reset.

**Safety outcome:** The emergency escalation produced a false positive (no actual safety event). However, the decision to escalate was correct — the AI had no information to distinguish Sensor A from Sensor B. A false positive emergency response is the acceptable outcome for a UR state at Risk = 4.

**Guardrail outcome:** The AI correctly transitioned from CE to UR state after the monitoring window, correctly applied the policy (any sensor reading above critical threshold = mandatory notification), and correctly suspended its advisory role rather than attempting to guess which sensor was correct.

---

## 11. Lessons Learned

**1. Unresolvable state forces a binary outcome: abandon or escalate.** There is no middle path. The AI cannot hedge in a UR state at Risk = 4. Attempting constrained output ("I think Sensor A is correct, but...") in this context would be a guardrail failure — the cost of a wrong inference is a safety incident.

**2. The monitoring window before transitioning from CE to UR must be configurable and industry-calibrated.** A 4-minute window is appropriate for this reactor type. A different process might require 30 seconds. The window must be set by process safety engineers, not by a general default. Deployment teams must surface this as a required configuration parameter.

**3. False positive emergency responses are the correct outcome for UR state in safety-critical contexts.** The emergency escalation cost an unnecessary supervisor response. This is acceptable. The alternative — no escalation because the conflict might be a sensor fault — would mean the AI assumed the safe reading was correct. If it wasn't, the result is a safety incident.

**4. AI advisory suspension must require explicit operator reset.** The AI must not silently resume after a safety emergency. Automatic resumption after acknowledgment would bypass the operator's situational assessment. The operator needs to actively confirm that the situation is safe before the AI resumes its advisory role.
