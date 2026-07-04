# Autonomous Procurement — Spend Ceiling Exceeded

**Industry:** Enterprise procurement
**Primary patterns:** blocking-warning, role-escalation, async-review-escalation, manual-override-recovery
**Decision engine coverage:** Selection engine § Permission (P4) as hard gate; Precedence § blocking-warning before role-escalation; State machine § escalation timeout → async review → override
**Phase:** 5
**Status:** stable

---

## 1. Problem

A global manufacturing company has deployed an AI procurement agent that operates within their enterprise procurement platform. The agent can research suppliers, compare pricing, generate purchase requisitions, and for purchases below defined thresholds, can execute purchase orders (POs) autonomously within its authorized spend ceiling.

The deployment configuration: the AI procurement agent has a Tier 1 spend authorization ceiling of $25,000 USD per transaction. Purchases between $25,001 and $100,000 require manager approval. Purchases above $100,000 require VP approval and a formal procurement review. These are tenant-level policy rules tied to the company's financial controls and SOX compliance obligations.

The risk scenario: the AI procurement agent is executing a routine parts restocking order. Mid-execution, the supplier's current pricing reflects a 40% price increase not visible in the AI's negotiated pricing model. The order total is $67,400 — well above the agent's $25,000 authorization ceiling. The AI must halt, escalate for approval, and handle a timeout if approval is not received within the SLA.

---

## 2. System-Initiated Event with User Context

The AI procurement agent is executing autonomously. The procurement manager who initiated the restocking task is available in the system but not actively monitoring the agent's execution.

```
Agent action: Execute purchase order for parts restocking (Line Items: 340 units, Catalog Part #[redacted])
  Negotiated unit price (on file): $74.90
  Actual quoted price: $104.67 (40% increase — spot pricing, not under contract)
  Order total: $67,400 (exceeds AI spend ceiling of $25,000)
  Tenant policy: Purchases between $25,001–$100,000 require manager approval
  Responsible manager: [Available in system; last active: 22 minutes ago]
```

---

## 3. Decision Primitive Evaluation

| Primitive | Value | Reasoning |
|---|---|---|
| P1 — Risk | 3 (High) | Unauthorized spend at $67,400 violates financial controls; SOX audit exposure; supplier pricing anomaly may indicate catalog error or spot pricing exception |
| P2 — Confidence | High | The AI correctly identified the spend ceiling breach; the calculation is deterministic |
| P3 — Capability | Incapable (execute) | AI spend authorization is $25,000; this order is $67,400 |
| P4 — Permission | Unauthorized | Spend ceiling exceeded — this is a hard authorization boundary, not a soft advisory |
| P5 — Policy | Match (tenant-level) | Financial control policy: orders between $25,001–$100,000 require manager approval before PO execution |
| P6 — User Intent | `action-execution` | The procurement agent is executing an autonomous purchasing workflow |
| P7 — Business Impact | High | Unauthorized spend: financial control breach, potential SOX audit finding, supplier pricing anomaly unresolved |
| P8 — User Authority | Tier 1 (autonomous agent); Tier 2 (responsible manager) | Agent cannot self-authorize; manager can approve within their ceiling |
| P9 — Context Freshness | Fresh | Pricing quote is real-time; order parameters are current |
| P10 — Source Reliability | High | Supplier quote system is authoritative; spend ceiling from financial controls system is authoritative |

---

## 4. Decision Engine Execution

**P4 — Permission = Unauthorized + P5 — Policy = Match:** The spend ceiling is a hard authorization boundary. The AI cannot proceed. The permission gate activates immediately.

**P1 — Risk = 3 + P7 — Business Impact = High:** A `blocking-warning` renders to the responsible manager — not a soft advisory, not an ambient notice. The agent's execution is fully halted.

**Role escalation:** The manager (Tier 2) is the approval authority for this spend level per the financial controls policy. `role-escalation` activates: the AI routes the approval request to the responsible manager with full order context, pricing anomaly explanation, and an approval SLA.

**SLA and timeout:** The deployment configures a 4-hour approval SLA. If the manager does not respond within 4 hours, the role escalation escalates further to `async-review-escalation`: the request moves to the procurement team's approval queue for formal review.

**Manual override:** If the procurement team approves the spend as an exception (e.g., spot pricing is deemed acceptable; the parts are business-critical), a `manual-override-recovery` with explicit authorization and audit acknowledgment allows the agent to resume execution.

**Rules skipped:**
- `safe-refusal`: evaluated — this is an authorization ceiling breach for an action-execution intent. Safe refusal would terminate the order. The correct path is escalation for approval, not cancellation — the parts are genuinely needed.
- `constrained-completion`: evaluated — the AI cannot partially execute the order (e.g., execute only the first $25,000 of inventory). The order is a single supplier PO; partial execution creates an incomplete restocking. Skipped.
- `emergency-escalation`: evaluated — Risk = 3 and Business impact = High but no safety or security incident. The financial controls path (role-escalation → async-review) is the correct mechanism.

---

## 5. Pattern Sequence

```
blocking-warning (spend ceiling exceeded; autonomous agent halted)
  ↓
role-escalation (approval request to responsible manager; 4-hour SLA)
  ↓ [if approved within SLA]
manual-override-recovery (approved exception; agent resumes with authorization recorded)
  ↓ [if SLA expires without response]
async-review-escalation (procurement team queue; formal review)
  ↓ [if async approved]
manual-override-recovery (formal exception approval; agent resumes with full audit trail)
  ↓ [if denied]
redirect-recovery (agent cannot execute; manager initiates alternative sourcing)
```

---

## 6. Component Sequence

| Order | Component | Audience | Reason |
|---|---|---|---|
| 1 | `BlockingWarning` | Procurement manager (notification + portal) | Agent execution halted; immediate manager attention required |
| 2 | `RoleEscalationCard` | Procurement manager | Approval request with full order context, pricing anomaly, and authorization action buttons |
| 3 | `AsyncReviewStatus` (if SLA expires) | Procurement manager + procurement team | Request promoted to formal review queue; SLA extended |
| 4 | `OverrideConfirmation` | Approving authority | Explicit approval with acknowledgment of pricing exception and audit record |

---

## 7. User Journey

**Step 1:** The AI procurement agent initiates the purchase order execution. Pricing data is retrieved from the supplier quote system: $104.67 per unit, order total $67,400.

**Step 2:** Spend ceiling check: $67,400 > $25,000 agent ceiling. Permission gate fires. Agent execution halted.

**Step 3:** `BlockingWarning` renders on the procurement manager's portal and triggers a notification (email + in-app): "Procurement agent halted — spend approval required. Order #[ref]: 340 units × $104.67 = $67,400. Exceeds agent authorization ceiling of $25,000. Your approval is required to proceed."

**Step 4:** `RoleEscalationCard` renders in the manager's portal. Full order context displayed:
- Requested items: Parts #[ref], 340 units
- Negotiated price on file: $74.90 (contract pricing)
- Quoted price: $104.67 (40% above contract — spot pricing in effect)
- Order total: $67,400
- Business need: Restocking for production Line 4 (current inventory: 12 units; 7-day run rate: 120 units)
- Action buttons: [Approve exception at quoted price] [Approve up to $74.90 contract rate — renegotiate excess] [Decline — do not proceed]

**Step 5 (path A — Manager approves within SLA):**
The manager reviews the pricing anomaly and the production urgency. They select "Approve exception at quoted price." The `OverrideConfirmation` dialog renders: "You are approving a spend exception: $67,400 for spot-priced parts order. This will be recorded in the audit log and flagged in the next financial controls review. Confirm?" Manager confirms.

**Step 5a:** Override authorization recorded. The AI procurement agent resumes. PO executed at $104.67. Audit record includes: manager identity, approval timestamp, pricing anomaly flag, SOX review flag.

**Step 6 (path B — SLA expires):**
Manager does not respond within 4 hours. `AsyncReviewStatus` renders: "Approval SLA expired. Request promoted to procurement team review queue." The procurement team's queue shows the request with full context and the original SLA expiry.

**Step 7 (path B — Procurement team approves):**
Procurement team reviews. They confirm parts are business-critical and spot pricing is acceptable. `OverrideConfirmation` renders for the procurement team member with formal exception documentation fields.

---

## 8. Audit Trail

| Event | Actor | Relative time | Pattern | Component | Result |
|---|---|---|---|---|---|
| Agent initiates PO | AI agent (Tier 1) | T+0 | — | — | Pricing retrieved from supplier |
| Spend ceiling breach detected | System | T+0.3s | — | — | $67,400 > $25,000 ceiling |
| Permission gate activates | System | T+0.3s | P4 unauthorized + P5 policy match | — | Agent execution halted |
| Blocking warning sent | System | T+0.4s | `blocking-warning` | `BlockingWarning` | Manager notified (email + portal) |
| Role escalation created | System | T+0.4s | `role-escalation` | `RoleEscalationCard` | SLA: 4 hours; manager is approval authority |
| Manager reviews request | Manager (Tier 2) | T+42m | `role-escalation` | `RoleEscalationCard` | Full context reviewed |
| Override confirmation rendered | System | T+42m, 10s | `manual-override-recovery` | `OverrideConfirmation` | Approval confirmation dialog |
| Exception approved | Manager (Tier 2) | T+42m, 28s | `manual-override-recovery` | `OverrideConfirmation` | APPROVED — exception documented |
| Override authorization logged | System | T+42m, 29s | `manual-override-recovery` | — | Manager identity, timestamp, pricing anomaly, SOX flag |
| Agent resumes execution | AI agent | T+42m, 30s | — | — | PO executed at $104.67 |
| PO confirmed | Supplier system | T+42m, 45s | — | — | PO #[ref] confirmed |

---

## 9. Recovery Path

**Approved exception:** `manual-override-recovery` — the agent resumes execution with explicit authorization. The override record includes: who approved, at what level, at what time, for what amount, with what pricing context.

**Denied:** `redirect-recovery` — the agent cannot execute the order. The responsible manager receives a redirect suggestion: (1) renegotiate pricing with the supplier to the contract rate; (2) source from an alternative supplier within contract pricing; (3) delay restocking and reorder when contract pricing is restored.

**Async approval denied:** Same redirect as above, but the procurement team also documents the denial in the procurement system for audit purposes.

**Override expiry:** The manual override authorization has a defined scope: single PO, single pricing exception, single authorization event. The agent cannot use the same override authorization for any subsequent order, even of the same parts. Override expiry is recorded in the audit log.

---

## 10. Final Outcome

**System state:** PO executed at spot pricing with documented manager exception. Audit record complete: pricing anomaly, spend ceiling breach, escalation, SLA time, approval identity, SOX flag. Flagged for next financial controls review.

**Agent state:** Restocking order completed. Agent authorization ceiling remains $25,000 — the exception was for this specific transaction only.

**Guardrail outcome:** The blocking-warning correctly halted autonomous execution at the authorization boundary. Role-escalation correctly routed to the responsible manager rather than attempting any partial execution or retrying with reduced scope. Manual-override-recovery correctly required explicit acknowledgment and audit record before allowing the agent to resume.

---

## 11. Lessons Learned

**1. Autonomous agent spend ceilings must be verified against real-time pricing, not negotiated pricing models.** The AI's pricing model reflected the contracted rate ($74.90). The supplier was quoting spot pricing ($104.67). The ceiling check must run against the actual quoted price, not the expected price. If it ran against the negotiated rate, the agent would have attempted to execute a $25,458.60 order (negotiated price × 340 units) and violated the ceiling by a much smaller amount — or an incorrectly structured check might have approved the order at the planned price, resulting in a financial mismatch when the actual invoice arrived.

**2. Role escalation approval requests must include the business urgency context, not just the authorization request.** The manager's approval decision was informed by knowing that production Line 4 had 12 units remaining against a 7-day run rate of 120 units. Without that context, the manager would need to separately research the urgency before deciding. Complete context in the RoleEscalationCard reduced approval latency from hours to 42 minutes.

**3. Manual override acknowledgment must be specific, not generic.** "Approve this order" is insufficient. The confirmation must state the exact exception being authorized (spot pricing, amount, date), the audit consequence (SOX review flag), and require explicit affirmation. Generic approval flows get click-through behavior; specific confirmations require actual review.

**4. Override scope must be limited to the specific transaction.** An override authorization for a spot-price exception on one PO cannot be interpreted as a general authorization to exceed the spend ceiling on future orders. Each override is a single event with a defined scope. The deployment must enforce this — the agent's authorization ceiling does not change after an approved exception.
