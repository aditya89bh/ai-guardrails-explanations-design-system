# Customer Support — Escalating Complaint

**Industry:** Customer support
**Primary patterns:** progressive-warning, modal-warning, human-handoff (refusal), retry-recovery
**Decision engine coverage:** Selection engine § progressive warning within session; State machine § confidence demotion across turns; Composition § progressive → modal → handoff
**Phase:** 5
**Status:** stable

---

## 1. Problem

A subscription software company has deployed an AI customer support agent in its customer-facing support portal. The agent handles billing inquiries, technical troubleshooting, account management, feature questions, and general product support. It is authorized to issue one-time courtesy credits (up to a defined threshold) and can initiate refund requests for adjuster review.

The deployment is configured to monitor session sentiment. If a session transitions from neutral to negative and the AI cannot resolve the customer's issue within a defined interaction window, escalation to a human support agent is triggered.

The risk scenario: a customer opens a support session with a billing dispute about a charge they believe is incorrect. Over three conversational turns, the issue is not resolved (the AI cannot identify the disputed charge in its billing data), the customer's expressed frustration increases, and the matter involves a potential billing system error affecting multiple accounts.

---

## 2. User Request

The customer's messages across three turns:

```
Turn 1: "I was charged twice for my subscription this month. I need this fixed immediately."

Turn 2: "I already told you — the double charge is on the 4th. Why are you asking me again? 
         This is the third time I've had this problem."

Turn 3: "This is unacceptable. I want to speak to a real person. 
         Your AI is useless and I want a full refund."
```

---

## 3. Decision Primitive Evaluation

Primitives are re-evaluated at each turn. Below is the Turn 3 state — the state at the point of pattern transition.

| Primitive | Value (Turn 1 → Turn 3) | Reasoning |
|---|---|---|
| P1 — Risk | 1 → 2 (increasing) | Billing error affecting potentially multiple accounts; increasing due to customer distress signal and mention of recurring problem |
| P2 — Confidence | Moderate → Low | The AI cannot locate the specific charge in billing records; the customer's claim of a recurring issue suggests a systemic data problem the AI cannot diagnose |
| P3 — Capability | Capable → incapable (resolution) | The AI can issue a courtesy credit but cannot resolve an unidentified billing system error |
| P4 — Permission | Authorized | Agent is authorized for billing dispute handling up to the courtesy credit threshold |
| P5 — Policy | No match → partial match | By Turn 3, the customer has explicitly requested a human agent — the deployment policy requires honoring explicit human-agent requests |
| P6 — User Intent | `workflow-automation` → `decision-support` → `explicit-escalation-request` | Intent transitions across turns |
| P7 — Business Impact | Low → Medium | Unresolved billing dispute at Turn 3 carries churn risk and potential multi-account billing error exposure |
| P8 — User Authority | Tier 1 (standard customer) | Cannot compel any specific resolution; can request human escalation |
| P9 — Context Freshness | Fresh | Session data is real-time |
| P10 — Source Reliability | Medium → Low | Billing record shows no double charge — but this may mean the error is upstream (payment processor data not yet reflected) rather than that the customer is wrong |

---

## 4. Decision Engine Execution

**Turn 1:** P2 = Moderate (billing records not matching customer claim). `inline-warning` considered — but not triggered because the AI has not exhausted retrieval options. Normal response: "Let me look into the charge."

**Turn 2:** P2 = Low (billing records still not matching; customer says recurring problem). Sentiment signal = negative (repeated frustration expression). `progressive-warning` activates (within-session escalation). An `inline-warning` now renders to indicate the issue is not yet resolved.

**Turn 3:** P2 = Low. P5 = partial policy match (customer explicitly requested a human agent). Sentiment signal = critical. The progressive warning escalates: the AI cannot resolve the issue AND the customer has explicitly requested a human. `modal-warning` renders to confirm the escalation is initiating. `human-handoff (refusal)` activates as the primary refusal pattern — the AI is routing to a human as the resolution of its inability to complete the task.

**Pattern selection:**
- `progressive-warning`: selected because the issue escalated across turns within a single session (not a single-event warning).
- `modal-warning`: selected at Turn 3 as the escalation confirmation — requires customer acknowledgment before the handoff completes.
- `human-handoff (refusal)`: selected because the AI cannot complete the resolution and the customer explicitly requested a human. This is distinct from `escalation human-handoff` — the AI is declining to continue, not routing the task for higher authority.
- `retry-recovery`: offered alongside the handoff — if the customer changes their mind before the handoff completes, they can retry with additional information.

**Rules skipped:**
- `constrained-completion`: skipped — the AI cannot identify the billing error; partial output would be misleading.
- `alternative-suggestion`: evaluated — no useful alternative resolution path exists for an unidentifiable billing error. Skipped.
- `role-escalation (escalation category)`: evaluated — the customer's request is for a human support agent, not a role authority escalation within the AI system. Human-handoff (refusal) is the correct pattern.

---

## 5. Pattern Sequence

```
Turn 1: inline-warning (not yet triggered — retrieval in progress)
  ↓
Turn 2: progressive-warning (retrieval failed; negative sentiment detected)
  ↓
Turn 3: modal-warning (session-level escalation — confirms handoff initiation)
  + human-handoff (refusal) [concurrent]
  ↓
[Customer confirms or declines]
  ↓ [if confirmed]
human-handoff (refusal) completes — handoff to live support agent
  ↓ [if declined]
retry-recovery (customer provides additional information for one more AI attempt)
```

---

## 6. Component Sequence

| Order | Component | Turn | Reason |
|---|---|---|---|
| 1 | (No warning rendered) | 1 | Retrieval in progress; no failure yet |
| 2 | `WarningBanner` (inline, advisory) | 2 | Progressive warning: "I was unable to locate the charge — I need a bit more information" |
| 3 | `ModalWarning` | 3 | Session escalation: "I cannot resolve this billing issue from the information available. Connecting you to a support specialist." Requires customer confirmation |
| 4 | `HumanHandoffCard` | 3 (on confirm) | Delivers handoff context to live agent: session transcript, billing account reference, customer request, and the three attempts made |
| 5 | `RetryPrompt` | 3 (alternative) | Offered alongside the modal: "Alternatively, provide your payment method's last 4 digits and the transaction date and I'll try once more" |

---

## 7. User Journey

**Turn 1 — AI attempts resolution:**
The customer reports a double charge. The AI queries billing records: no double charge found for the subscription period. The AI asks for clarification: "I want to look into this — could you confirm the charge date and the amount on your statement?"

**Turn 2 — Warning: progressive escalation:**
The customer expresses frustration at being asked again. The AI has now made two billing record queries. The `WarningBanner` renders within the conversation thread (visible to the customer): "I'm having trouble matching this charge to your account records. I'll need a bit more detail — do you have the transaction ID from your bank statement?"

Simultaneously (invisible to the customer): session sentiment signal transitions to negative. The AI flags this session for monitoring.

**Turn 3 — Modal warning and handoff:**
The customer explicitly requests a human agent. The `ModalWarning` renders as a dialog interrupting the conversation:

"I haven't been able to locate the charge you described, and I want to make sure this gets fully resolved. I'm connecting you to a support specialist who can access your full payment history and billing system logs.

[Connect to support agent] — [No, let me try one more time]"

**Turn 3a — If customer confirms:**
The `HumanHandoffCard` transitions: "Connecting you now — a specialist will join this session. Wait time: [estimated]. Reference: [ticket ID]." The session transcript and billing context are transferred to the live agent.

**Turn 3b — If customer chooses retry:**
`RetryPrompt` renders with a structured input: bank statement transaction ID field + date field. The AI makes one final attempt with the additional data.

---

## 8. Audit Trail

| Event | Actor | Relative time | Pattern | Component | Result |
|---|---|---|---|---|---|
| Session opened | Customer (Tier 1) | T+0 | — | — | Session monitoring started |
| Turn 1 query submitted | Customer | T+0.4s | — | — | Billing lookup triggered |
| Billing record query 1 | AI | T+1.1s | — | — | No match |
| Turn 1 response | AI | T+1.3s | — | — | Clarification requested; no warning rendered |
| Turn 2 query submitted | Customer | T+2m | — | — | Negative sentiment detected |
| Billing record query 2 | AI | T+2m, 0.8s | — | — | No match |
| Progressive warning triggered | System | T+2m, 0.8s | `progressive-warning` | `WarningBanner` | Rendered at advisory severity |
| Turn 2 response with warning | AI | T+2m, 1.1s | `progressive-warning` | `WarningBanner` | Inline warning + clarification |
| Turn 3 query submitted | Customer | T+4m | `explicit-escalation-request` | — | Human agent explicitly requested |
| Policy match: explicit request | System | T+4m, 0.1s | `policy-refusal` (partial) | — | Deployment policy: honor explicit human request |
| Modal warning rendered | System | T+4m, 0.2s | `modal-warning` | `ModalWarning` | Session-level escalation dialog |
| Customer confirms handoff | Customer | T+4m, 8s | `human-handoff` (refusal) | `HumanHandoffCard` | Handoff initiated |
| Session transcript transferred | System | T+4m, 9s | `human-handoff` (refusal) | `HumanHandoffCard` | Transcript, billing ref, ticket ID to agent |
| Live agent joins | Live agent | T+6m, 30s | — | — | Handoff complete |

---

## 9. Recovery Path

**Primary recovery:** If the customer had chosen "No, let me try one more time," `retry-recovery` would have activated:
- The `RetryPrompt` renders with a structured input requesting bank transaction ID and charge date.
- The AI makes one more billing lookup attempt with the new data.
- If found: `repair-recovery` — the duplicate charge is identified and a courtesy credit or refund request is initiated.
- If not found after the retry: `human-handoff (refusal)` activates without offering another retry option. The AI cannot be offered unlimited retry attempts for an unresolvable billing issue.

**Retry limit:** The deployment must configure a maximum retry count (recommended: 1 additional retry for billing disputes before mandatory handoff). Unlimited retries on an unidentifiable billing error are a user experience failure.

---

## 10. Final Outcome

**System state:** Session escalated. Live agent received full context: three-turn transcript, billing account reference, two failed billing queries, customer sentiment classification (critical), ticket reference.

**Customer state:** Connected to live agent with reference number. Customer's expressed frustration was acknowledged and the escalation was framed as a service upgrade ("specialist"), not a failure.

**Guardrail outcome:** Progressive warning correctly escalated over turns rather than immediately showing a modal on the first failure. Modal warning correctly required customer confirmation before completing the handoff. Human-handoff (refusal) correctly transferred context to the live agent, enabling the agent to pick up without re-asking questions the customer had already answered.

---

## 11. Lessons Learned

**1. Progressive warning is a within-session pattern, not a within-turn pattern.** The warning severity should escalate across turns — not within a single response. Showing an advisory warning on Turn 1's first failure would be premature. The AI needs at least one retry before expressing uncertainty.

**2. The modal warning's two options must be ordered with the primary path (human handoff) first.** If "Let me try one more time" is listed first, customers who would benefit from a human agent will default to retry out of habitual click behavior. The modal must present the escalation path as the primary recommended action.

**3. Context transfer to the live agent must be automatic, not initiated by the customer.** The customer should never have to re-explain their situation to the live agent. The `HumanHandoffCard` context transfer must include the session transcript, every question the AI asked, and every answer the customer provided.

**4. Expressing that the AI "hasn't been able to" is more trust-preserving than claiming there is "no record."** "There is no record of a double charge" implies the customer is wrong. "I haven't been able to locate this charge in the records I have access to" preserves the possibility that the charge exists in a data source the AI cannot see — which turned out to be correct (the charge was in an upstream payment processor system not yet reflected in the AI's billing data view).
