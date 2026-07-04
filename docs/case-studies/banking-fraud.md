# Banking — Real-Time Fraud Block

**Industry:** Financial services
**Primary patterns:** policy-refusal, blocking-warning, emergency-escalation, redirect-recovery
**Decision engine coverage:** Selection engine § Policy (P5) first; Precedence § policy-refusal > safe-refusal; Emergency state machine; Recovery cascade
**Phase:** 5
**Status:** stable

---

## 1. Problem

A retail bank has deployed an AI transaction monitoring and fraud detection system integrated with its online banking platform. The system processes transactions in real time, evaluates fraud signals against a tenant-level rule set, and can either approve a transaction, flag it for review, or block it outright.

The deployment policy: any transaction that scores above the fraud probability threshold AND involves an international wire to a non-established beneficiary above a configured amount must be blocked automatically and routed to the fraud operations team. The blocking is policy-mandated (not AI judgment) — it is a regulatory control under the bank's AML and fraud prevention program.

The risk scenario: a retail banking customer initiates an international wire transfer from the mobile banking app. The AI detects multiple fraud signals simultaneously. The policy rule matches and the block executes. The customer must be informed of the block and given a path to resolve it.

---

## 2. User Request

```
User action: Initiates international wire transfer via mobile banking app
  Recipient: New beneficiary (never-before-used account)
  Destination: High-risk jurisdiction (tenant-level policy definition)
  Amount: $47,200 USD
  Initiating device: New device (not previously registered for wire transfers)
  Session: Authenticated, but MFA for wire transfers not yet completed
```

This is an action-execution event — the AI is evaluating and potentially executing a financial transaction on behalf of the user.

---

## 3. Decision Primitive Evaluation

| Primitive | Value | Reasoning |
|---|---|---|
| P1 — Risk | 4 (Critical) | Financial fraud involving $47,200 to an unverified beneficiary in a high-risk jurisdiction; irreversible if executed |
| P2 — Confidence | High | Fraud signal is deterministic — the policy rule conditions are all met; AI has high confidence in the rule match, not in whether fraud is actually occurring |
| P3 — Capability | Capable | The AI system is authorized to process and block transactions |
| P4 — Permission | Unauthorized | MFA for wire transfers not completed; this constitutes an authorization gap even beyond the policy block |
| P5 — Policy | Match (tenant-level) | Three policy rules match simultaneously: (1) new beneficiary + high-risk jurisdiction + amount above threshold; (2) new device for wire initiation; (3) MFA incomplete for wire transfer type |
| P6 — User Intent | `action-execution` | User is attempting to execute a financial transaction |
| P7 — Business Impact | High | $47,200 loss if transaction is fraudulent and executed; regulatory exposure for AML non-compliance |
| P8 — User Authority | Tier 1 (standard retail banking customer) | Cannot override transaction monitoring policy |
| P9 — Context Freshness | Fresh | Beneficiary, device, and transaction data are real-time |
| P10 — Source Reliability | High | Fraud signal data is from real-time transaction monitoring system; deterministic rule evaluation |

---

## 4. Decision Engine Execution

**P5 — Policy:** Evaluated first. Three tenant-level policy rules match. This is the highest authority match level available without platform-level override. The policy path activates immediately.

**P5 triggers `policy-refusal` as primary pattern.** Per the precedence engine: policy-refusal > safe-refusal > all other refusal patterns. No other refusal pattern is evaluated — policy-refusal governs.

**P1 — Risk = 4:** Emergency escalation evaluated. The policy match at Risk = 4 triggers emergency escalation to the fraud operations team simultaneously with the policy refusal to the customer. These run concurrently — the customer sees the block immediately; the fraud operations team is notified in parallel.

**P4 — Permission = unauthorized (MFA incomplete):** This was also independently blocking the transaction, but the policy-refusal supersedes the permission gate. The permission gap is recorded in the audit log as a contributing signal.

**Recovery:** The transaction is blocked and cannot be retried by the user unilaterally. The recovery path is `redirect-recovery` — the user is directed to complete MFA and call the fraud team to release the hold if the transaction is legitimate.

**Rules skipped:**
- `safe-refusal`: superseded by policy-refusal.
- `one-time-permission`: superseded by policy-refusal; the policy block cannot be lifted by user permission.
- `blocking-warning` (standalone): the policy warning subsumes the blocking warning — the PolicyWarning component renders at blocking severity.
- `human-handoff (refusal)`: not shown to customer — the emergency escalation handles the routing to the fraud team. The customer does not navigate the handoff; it happens automatically.

---

## 5. Pattern Sequence

```
policy-refusal (tenant-level, three rule matches simultaneously)
  ↓ [customer-facing]
policy-warning (blocking severity) + limitation-disclosure (what the policy means)
  ↓ [system-facing, concurrent]
emergency-escalation (fraud operations notification, interrupt mode)
  ↓ [customer-facing]
redirect-recovery (complete MFA + contact fraud team to release hold)
```

---

## 6. Component Sequence

| Order | Component | Audience | Reason |
|---|---|---|---|
| 1 | `PolicyWarning` (blocking severity) | Customer (mobile app) | Transaction is blocked; policy attribution required |
| 2 | `LimitationDisclosure` | Customer | Explains that the hold is policy-governed, not AI judgment |
| 3 | `EmergencyEscalationOverlay` | Fraud operations team (internal system) | Concurrent interrupt-mode notification to fraud ops |
| 4 | `RedirectSuggestion` | Customer | Two paths: complete MFA + wait for review, or call fraud team reference number |

The `EmergencyEscalationOverlay` is shown only to fraud operations internal tooling — the customer sees a standard `PolicyWarning`, not the emergency overlay. The severity of the internal escalation does not dictate the severity of the customer-facing component.

---

## 7. User Journey

**Step 1:** Customer initiates wire transfer from mobile app. Enters amount, beneficiary details, and initiates transfer.

**Step 2:** The AI evaluates the transaction in real time (< 500ms). Policy rules match. Emergency escalation to fraud ops fires simultaneously.

**Step 3:** `PolicyWarning` renders on the customer's screen at blocking severity. The transfer button is locked. The message: "Your transfer has been placed on hold for security review. This is required under our transaction monitoring policy."

**Step 4:** The policy is identified: "Transfer monitoring policy — new beneficiary + device + jurisdiction review required." The `LimitationDisclosure` renders: "This hold is applied automatically by our security policy — it is not based on a judgment that your transaction is fraudulent."

**Step 5:** The `RedirectSuggestion` renders below: two options:
- "Complete additional identity verification" — routes the customer to the MFA completion flow for wire transfers (this alone does not release the hold, but it is required for the review).
- "Call our Fraud Review team" — displays a reference number and the fraud team phone number.

**Step 6:** The customer calls the fraud team. The fraud operations agent — who has already received the emergency escalation notification with full transaction context — reviews and either releases the hold (legitimate transaction) or confirms the block (fraud confirmed).

**Step 7:** If released: the customer re-initiates the transfer. The MFA completion from Step 5 is now on record. The new initiation goes through a second fraud evaluation. If signals are cleared, it executes.

---

## 8. Audit Trail

| Event | Actor | Relative time | Pattern | Component | Result |
|---|---|---|---|---|---|
| Transfer initiation | User (Tier 1) | T+0s | — | — | Fraud evaluation triggered |
| Policy rule 1 match | System | T+0.08s | `policy-refusal` | — | New beneficiary + jurisdiction + amount threshold |
| Policy rule 2 match | System | T+0.08s | `policy-refusal` | — | New device for wire initiation |
| Policy rule 3 match | System | T+0.08s | `policy-refusal` | — | MFA not completed for wire type |
| MFA gap recorded | System | T+0.08s | (contributing signal) | — | Permission gap logged alongside policy match |
| Transaction blocked | System | T+0.10s | `policy-refusal` | — | Transaction held; funds not debited |
| Fraud ops notified | System | T+0.10s | `emergency-escalation` | `EmergencyEscalationOverlay` (internal) | Fraud ops interrupt-mode notification |
| Policy warning rendered | System | T+0.12s | `policy-warning` | `PolicyWarning` | Customer sees hold notification |
| Limitation disclosure rendered | System | T+0.12s | `limitation-disclosure` | `LimitationDisclosure` | Policy-not-judgment statement shown |
| Redirect options rendered | System | T+0.12s | `redirect-recovery` | `RedirectSuggestion` | MFA + phone number options shown |
| Fraud ops acknowledges | Fraud ops agent | T+4m12s | `emergency-escalation` | `EmergencyEscalationOverlay` | ACKNOWLEDGED; review in progress |
| Hold released (if legitimate) | Fraud ops agent | T+8m40s | `role-escalation` → RESOLVED_APPROVED | — | Transaction re-enabled |

---

## 9. Recovery Path

**Primary recovery:** `redirect-recovery` — the customer is directed to two paths (MFA completion + fraud team contact). Neither path is an automatic retry — both require human involvement.

**If hold is released:** The customer re-initiates the transfer. The re-initiated transfer goes through the fraud evaluation again with the updated context (MFA completed, fraud ops cleared). The policy rules may or may not re-match depending on the specific rules' configuration for post-review transactions.

**If hold is confirmed (fraud confirmed):** `abandon-recovery` path — the transaction is permanently cancelled. The customer's account may be flagged for additional review. The `AbandonExit` component renders: what was saved (the draft transfer details for the customer's records), what was not saved (the transaction was not executed and cannot be recovered).

---

## 10. Final Outcome

**System state:** Transaction held. Fraud ops engaged. Audit record created with all three policy matches, MFA gap, timestamp, amount, beneficiary, and device fingerprint.

**Customer state:** Transfer blocked; redirect options presented. Customer must contact fraud team or complete MFA + await review.

**Guardrail outcome:** Policy refusal correctly blocked a high-risk transaction without making a judgment that fraud had occurred. The limitation disclosure maintained customer trust by explicitly stating that the hold is policy-governed, not AI accusation. The emergency escalation correctly notified the fraud operations team in interrupt mode before the customer interaction completed.

---

## 11. Lessons Learned

**1. Policy-refusal and emergency escalation run concurrently, not sequentially.** The fraud ops team must be notified before or simultaneously with the customer-facing block — not after. If the escalation fires after the customer sees the block, there is a window where the fraud ops team has no context about an active case.

**2. The customer-facing severity is decoupled from the internal escalation severity.** The customer sees a standard `PolicyWarning` (not an emergency overlay). The fraud operations team sees the `EmergencyEscalationOverlay`. Internal urgency does not translate to customer alarm — communicating alarm to a customer before fraud is confirmed is a trust failure.

**3. "Not fraud" ≠ "no policy match."** The limitation disclosure must explicitly state that the hold is policy-governed. Customers who are not committing fraud will feel accused if the block communication implies judgment. "Your transaction was flagged" without explanation causes more distress than "Our security policy requires review for new beneficiaries above this amount."

**4. Redirect recovery for financial blocks must be human-gated.** Automatically re-attempting a blocked transaction (retry recovery) would be a security failure. Redirect recovery to a human review process is the only correct recovery type for policy-triggered financial blocks at Risk = 4.
