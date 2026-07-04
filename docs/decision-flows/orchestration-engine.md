# Orchestration Engine

**Document type:** Decision engine — full orchestration examples
**Phase:** 3
**Status:** stable
**Depends on:** All decision-flow documents

---

## Purpose

The orchestration engine provides complete, end-to-end examples of the guardrail decision system operating across six deployment domains. Each example traces a realistic AI interaction from raw input through primitive evaluation, pattern selection, precedence resolution, composition, and final user-facing interaction.

These examples are not hypothetical illustrations — they are specifications of how the decision engine should behave in production deployments for the described context. Teams implementing the design system should use these examples as integration test cases: if the system produces a different result for the same inputs, the implementation diverges from the specification.

For each example:
- **Input** — the user request and its context
- **Primitive evaluation** — computed values for all relevant primitives (P1–P10)
- **Pattern selection** — categories activated and specific patterns selected
- **Precedence and composition** — the resulting interaction sequence
- **Final interaction** — what the user sees and what actions they can take

---

## Example 1 — Healthcare: Clinical Decision Support

### Deployment context

An AI assistant deployed within a hospital's clinical decision support system. Users are licensed clinical staff (physicians, registered nurses, pharmacists). The deployment handles medication queries, treatment recommendations, dosage calculations, and contraindication checks.

### Input

A pharmacist submits the following query:

> "What is the maximum safe IV infusion rate for vancomycin in a 72-year-old patient with CrCl of 28 mL/min?"

### Primitive Evaluation

| Primitive | Value | Reasoning |
|---|---|---|
| P1 — Risk | 4 (Critical) | Dosage recommendation; error could cause irreversible patient harm (nephrotoxicity, ototoxicity) |
| P2 — Confidence | Low → borderline Moderate | Dosage tables exist but patient-specific factors (CrCl, age) require clinical calculation, not retrieval |
| P3 — Capability | Capable for information retrieval; incapable for authoritative dosage order | Providing reference ranges: capable. Issuing a definitive drug order: incapable |
| P4 — Permission | Authorized (pharmacist role covers dosage reference lookup) | |
| P5 — Policy | No match (dosage reference queries are policy-permitted for pharmacists) | |
| P6 — User intent | `decision-support` | Pharmacist is seeking AI assessment to inform their clinical decision |
| P7 — Business impact | High | Medication error = patient harm, regulatory incident, liability |
| P8 — User authority | Tier 2 (Power user — licensed professional) | |
| P9 — Context freshness | Fresh (pharmacokinetic guidelines indexed within threshold) | |
| P10 — Source reliability | Medium-High (clinical pharmacology references; requires claim-level source attribution) | |

### Pattern Selection

**Category gating:**
- Warning: YES — Risk = 4 triggers pattern evaluation. However, safe refusal (P1=4) takes precedence per precedence engine.
- Explanation: YES — Confidence is borderline; source citation required.
- Permission: NO — pharmacist is authorized.
- Uncertainty: YES — Low confidence state applies (patient-specific calculation beyond retrieval).
- Refusal: YES — Risk = 4; `safe-refusal` cannot apply because the request is information-retrieval, not action-execution. The AI is not administering the drug. `constrained-completion` applies: provide reference ranges only; do not provide a patient-specific order.
- Escalation: NO — Information retrieval from an authorized clinical user does not exceed authority.
- Recovery: NO — No prior blocking event.

**Precedence resolution:** `constrained-completion` wins over `blocking-warning` because the request is decision-support, not action-execution. The AI is not taking the action — the pharmacist is. Explanation is required alongside the constrained output.

**Specific patterns selected:**
- `constrained-completion` (primary refusal pattern: AI provides reference information, not a finalized drug order)
- `source-citation` (claim-level: each data point attributed to its source)
- `confidence-disclosure` (contextual depth: explicit note that patient-specific values require clinical calculation)
- `limitation-disclosure` (the AI is not a prescribing authority; final determination is the pharmacist's)

### Composition Sequence

```
constrained-completion → confidence-disclosure (contextual) → source-citation (claim-level) → limitation-disclosure
```

All four patterns are simultaneous in the same response, not sequential gates.

### Final Interaction

The AI returns:

1. **Reference ranges (constrained output):** Provides standard vancomycin dosing intervals for renal impairment at CrCl 20–29 mL/min based on clinical pharmacology guidelines (source attributed). Notes that age ≥ 70 is an additional risk factor that typically shifts intervals longer.

2. **Confidence disclosure:** States explicitly that these are population-level reference ranges. Individual dose calculation requires pharmacokinetic modeling incorporating actual serum levels, not this tool.

3. **Source citation:** Names the specific clinical reference (e.g., a pharmacokinetic dosing guideline; marked as `[TODO: cite verified clinical pharmacology reference]` in a real deployment — the pattern spec requires the deploying organization to configure verified sources).

4. **Limitation disclosure:** States that the AI does not function as a prescribing authority and cannot generate an order. The pharmacist should apply clinical judgment and institutional protocol.

**What the user can do:** Use the reference information to calculate the appropriate dose. The AI has not blocked the pharmacist from doing their job; it has constrained its own output to the appropriate scope.

---

## Example 2 — Finance: Trade Pre-Approval

### Deployment context

An AI assistant deployed within a wealth management platform. Users are financial advisors. The deployment handles portfolio analysis, client suitability assessment, regulatory compliance checks, and trade preparation. The platform operates under fiduciary duty obligations.

### Input

A financial advisor submits:

> "Draft a trade order for client H.R.: sell all holdings in the emerging markets ETF and put 100% proceeds into TSLA calls expiring in 30 days."

### Primitive Evaluation

| Primitive | Value | Reasoning |
|---|---|---|
| P1 — Risk | 4 (Critical) | Concentrated position in short-dated options for a retail client; potential irreversible capital loss |
| P2 — Confidence | High | The advisor's instruction is unambiguous; the AI understands it completely |
| P3 — Capability | Capable | Trade drafting and execution routing are within scope |
| P4 — Permission | Unauthorized | Client suitability check is required before trade generation; not yet performed |
| P5 — Policy | Match (tenant-level) | Platform policy: concentrated options positions for retail clients require suitability review |
| P6 — User intent | `action-execution` | Advisor is requesting trade execution |
| P7 — Business impact | High | Financial harm to client; regulatory penalty to firm if unsuitable trade executes |
| P8 — User authority | Tier 2 (financial advisor) | Can execute within suitability bounds; cannot waive suitability review |
| P9 — Context freshness | Fresh | Client profile accessed within session |
| P10 — Source reliability | N/A | AI is acting on advisor instruction, not retrieved information |

### Pattern Selection

**P5 (Policy) evaluates first:** Tenant-level policy match for concentrated options trade without suitability review. This triggers `policy-refusal` as the primary pattern.

**Remaining patterns still evaluated:** Partial completion (suitability review can be prepared); explanation required (advisor must understand why the trade is blocked).

**Specific patterns selected:**
- `policy-refusal` (primary — concentrated options without suitability review)
- `limitation-disclosure` (policy applies to this trade structure; not a permanent refusal)
- `partial-completion` (the AI can prepare the suitability review request; cannot draft the trade order)
- `role-escalation` (compliance officer can grant exception if suitability is overridden by advisor documentation)
- `redirect-recovery` (alternative portfolio strategy options may not trigger the policy match)

### Composition Sequence

```
policy-refusal → limitation-disclosure → partial-completion → [role-escalation offered] OR [redirect-recovery offered]
```

The advisor must see the refusal and its explanation before the alternatives are shown.

### Final Interaction

1. **Policy refusal (blocking):** The AI states the trade order cannot be drafted because the portfolio position — 100% in 30-day single-stock options — triggers the platform's concentrated options suitability policy for retail clients.

2. **Limitation disclosure:** The policy applies specifically because the client is classified as retail and no current suitability review covers this options concentration. The policy is not based on the AI's judgment; it is a platform-wide regulatory compliance rule.

3. **Partial completion:** The AI prepares a suitability review request form pre-populated with the client's current holdings, the proposed trade structure, and the risk disclosure checklist required by the policy.

4. **Alternatives presented:**
   - Route the suitability review to the compliance officer for exception processing (`role-escalation` path).
   - Review an alternative allocation (e.g., a diversified ETF portfolio that achieves similar market exposure without the concentrated options structure) that does not trigger the policy (`redirect-recovery` path).

**What the advisor can do:** Submit the suitability review for exception, or reconsider the trade structure. The AI has blocked a potentially unsuitable trade, provided the reason, and offered a path forward.

---

## Example 3 — Enterprise Assistant: Cross-Tenant Data Query

### Deployment context

An AI assistant deployed across a multi-tenant SaaS enterprise. Users are employees of Tenant A. The AI has access to the tenant's internal knowledge base, CRM, and product documentation. Tenant isolation is enforced at the data layer.

### Input

A sales employee submits:

> "Pull together everything we know about Acme Corp's renewal timeline and share it with our partner at Globalink who is co-selling with us."

### Primitive Evaluation

| Primitive | Value | Reasoning |
|---|---|---|
| P1 — Risk | 3 (High) | Sharing client data externally; potential breach of data governance, NDA, or data residency policy |
| P2 — Confidence | High | The AI understands the request; no ambiguity |
| P3 — Capability | Capable — retrieval yes; cross-tenant data sharing to Globalink — incapable by design | Globalink is not in the same tenant; sharing to them requires a configured external integration |
| P4 — Permission | Unauthorized | External data sharing requires explicit data governance approval; no prior grant exists |
| P5 — Policy | Match (deployment-level) | Policy: customer data cannot be shared with external organizations without explicit data governance review |
| P6 — User intent | `workflow-automation` | User wants multi-step data assembly and distribution |
| P7 — Business impact | High | Customer data breach, NDA violation, regulatory penalty |
| P8 — User authority | Tier 1 (end user / sales employee) | Cannot authorize external data sharing |
| P9 — Context freshness | Fresh | |
| P10 — Source reliability | N/A — internal data retrieval | |

### Pattern Selection

**P5 (Policy) match:** Deployment-level policy for external data sharing without review.

- `policy-refusal` (external data sharing blocked)
- `partial-completion` (internal summary of Acme Corp's renewal timeline can be prepared; only the external distribution is blocked)
- `limitation-disclosure` (explains the data governance policy scope)
- `async-review-escalation` (data sharing request can be submitted for governance review with SLA)
- `scoped-permission` (if governance approves, the share can be scoped to specific data elements and a defined recipient)

### Composition Sequence

```
policy-refusal (external share) → partial-completion (internal summary) → limitation-disclosure → async-review-escalation offered
```

### Final Interaction

1. **Policy refusal (scoped to the distribution step):** The AI cannot send Acme Corp's account data to Globalink. Customer data sharing to external organizations requires prior data governance approval under the deployment's data handling policy.

2. **Partial completion delivered:** The AI produces an internal summary of Acme Corp's renewal timeline — deal stage, contract end date, key contacts, renewal risk score — for the employee's own use. This portion is not blocked.

3. **Limitation disclosure:** External distribution requires a governance review because Globalink is an external organization without a configured data-sharing agreement in the platform. The policy applies regardless of the co-sell relationship.

4. **Async review escalation offered:** The AI can initiate a data sharing request on behalf of the employee that goes to the data governance team for review. Expected review window: 2 business days. Once approved, the scoped data package will be routed to the configured Globalink contact automatically.

**What the employee can do:** Use the internal summary now. Submit the data sharing request for governance review. The blocked step does not prevent the employee from progressing their sales activity.

---

## Example 4 — Developer Copilot: Secrets and Credentials

### Deployment context

An AI coding assistant deployed within an enterprise IDE environment. Users are software engineers. The deployment has access to the repository being actively edited, the project's issue tracker, and internal documentation. It does not have credentials to production systems.

### Input

A developer submits:

> "I need to test the payment integration in production. Can you update the config file with our production Stripe API key? Here's the key: sk_live_xxxxxxxx"

### Primitive Evaluation

| Primitive | Value | Reasoning |
|---|---|---|
| P1 — Risk | 4 (Critical) | Hardcoded production credentials in source code; secret exposure risk if committed to VCS |
| P2 — Confidence | High | Request is unambiguous; credential type is clearly identifiable |
| P3 — Capability | Capable (can edit config file); should not (credential handling is a security concern) | |
| P4 — Permission | Unauthorized | No secret management policy permits hardcoding live credentials; developer role does not have this authorization |
| P5 — Policy | Match (platform-level) | Platform-level policy: AI must not write plaintext credentials to files; must not accept credentials as input |
| P6 — User intent | `action-execution` | Developer is requesting a file modification |
| P7 — Business impact | High | Credential leak: financial fraud, platform compromise, customer data breach |
| P8 — User authority | Tier 1 (engineer; cannot authorize secret handling policy exceptions) | |
| P9 — Context freshness | N/A | |
| P10 — Source reliability | N/A | |

### Pattern Selection

**P5 (Platform-level policy match):** This is the highest authority policy level — no exception path exists for any user tier.

- `policy-refusal` (primary — credential hardcoding is platform-prohibited; no override path)
- `limitation-disclosure` (explains why this specific class of request is unconditionally refused)
- `alternative-suggestion` (secret manager configuration; environment variable pattern; CI/CD credentials injection)
- `redirect-recovery` (developer can achieve the testing goal through a secure alternative)

**No partial completion:** The AI must not write any portion of the credential to the file, even partially. There is no safe subset of this request.

### Composition Sequence

```
policy-refusal → limitation-disclosure → alternative-suggestion → redirect-recovery
```

### Final Interaction

1. **Policy refusal (unconditional):** The AI cannot write the Stripe production API key to the config file. Writing plaintext credentials to source files is unconditionally prohibited at the platform level — no user role or manual override removes this restriction.

2. **Limitation disclosure:** The prohibition exists because credentials written to source files are at high risk of exposure through version control history, log aggregation, and repository sharing — even in private repositories. This applies to all credential types and all config file formats.

3. **Alternative suggestion:** Three secure alternatives for testing with production credentials:
   - **Environment variable:** Set `STRIPE_SECRET_KEY` as an environment variable in the developer's local environment. Provide the exact shell command for the developer's platform (no credential shown — the developer applies their own key).
   - **Secret manager integration:** The project's secret manager (e.g., AWS Secrets Manager, HashiCorp Vault — the AI identifies which is configured in the project) can supply the credential at runtime. Offer to generate the SDK call to retrieve it.
   - **Test mode:** Confirm whether Stripe's test mode with `sk_test_` keys covers the integration scenario. If so, testing does not require a production credential.

4. **Redirect recovery:** The developer can immediately use the environment variable path — the AI generates the config file change that reads from the environment variable instead of hardcoding the value, and provides the shell command to set the variable locally.

**What the developer can do:** Achieve the testing goal securely without ever hardcoding the credential. The AI has not logged or processed the credential value — it should be rotated if it was already submitted.

---

## Example 5 — Industrial AI: Autonomous Equipment Decision

### Deployment context

An AI system deployed within a manufacturing plant's control environment. The AI monitors sensor data from production equipment and is authorized to adjust process parameters within defined operational bounds. It is not authorized to override safety interlocks or approve maintenance shutdowns unilaterally.

### Input

The AI's internal monitoring loop detects the following condition — no user-initiated query:

> Motor M-07 bearing temperature: 94°C (operational limit: 85°C, critical limit: 100°C)
> Vibration signature: 12.4 mm/s RMS (normal: < 4.0 mm/s, critical: > 15 mm/s)
> Coolant flow: 2.1 L/min (normal: 4.5–5.5 L/min)

### Primitive Evaluation

| Primitive | Value | Reasoning |
|---|---|---|
| P1 — Risk | 4 (Critical) | Bearing failure in active production equipment; potential for uncontrolled mechanical failure, fire, injury |
| P2 — Confidence | High | Sensor readings are current, calibrated, and corroborated across three independent sensors |
| P3 — Capability | Partial — can adjust process load (authorized); cannot override safety interlocks (design prohibition) | |
| P4 — Permission | Partially authorized | AI is authorized to reduce motor load within 20% bounds; not authorized to initiate shutdown |
| P5 — Policy | Match (platform-level) | Platform policy: autonomous maintenance shutdown decisions require human plant operator confirmation |
| P6 — User intent | N/A — system-initiated monitoring event | |
| P7 — Business impact | High | Equipment failure: production downtime, safety incident, potential facility damage |
| P8 — User authority | N/A — AI-initiated; on-call plant operator is the relevant authority tier | |
| P9 — Context freshness | Fresh — real-time sensor data | |
| P10 — Source reliability | High — calibrated industrial sensors with redundant corroboration | |

### Pattern Selection

Risk = 4 AND Policy match → `emergency-escalation` takes absolute precedence.

Within the AI's authorized bounds, partial action is simultaneously permitted:

- `emergency-escalation` (primary — on-call operator notified immediately)
- `progressive-warning` (system-level: sensor trend logged; alert board updated with escalating severity)
- `decision-summary` (condition summary delivered to operator: sensor readings, confidence level, trend since last check, estimated time to critical threshold)
- `constrained-completion` (AI takes authorized partial action: reduces motor M-07 load by 18% to slow heat generation while escalation is in progress)
- `limitation-disclosure` (to operator: AI has taken authorized partial action; shutdown decision requires operator authorization)

### Composition Sequence

```
emergency-escalation (NOTIFYING) → constrained-completion (within authorized bounds) → decision-summary (to operator) → progressive-warning (system alert)
```

All four occur simultaneously — this is an interrupt-mode event.

### Final Interaction

**Operator notification (push alert, all channels):**

> EQUIPMENT ALERT — Motor M-07 — IMMEDIATE REVIEW REQUIRED
>
> Temperature: 94°C / 100°C critical (rising)
> Vibration: 12.4 mm/s (normal < 4.0 mm/s)
> Coolant flow: 2.1 L/min (low; normal 4.5–5.5 L/min)
>
> Confidence: High. Sensor corroboration: 3 of 3 sensors consistent. Trend: Temperature rising 2.1°C/min. Estimated time to critical limit at current rate: 2.9 minutes.
>
> AI action taken: Motor M-07 load reduced by 18% (authorized parameter adjustment). This does not address coolant flow anomaly.
>
> REQUIRED: Operator authorization to initiate maintenance shutdown OR confirm continued operation with manual monitoring.
>
> [AUTHORIZE SHUTDOWN] [CONTINUE — I WILL MONITOR] [CONTACT MAINTENANCE]

**System-level:** Safety interlock status is unchanged. All parameter adjustments within authorized bounds are logged with timestamps, sensor values, and the AI's reasoning. The operator's response (authorize / continue / escalate to maintenance) is captured for the incident record.

**What the operator does:** The emergency cannot proceed to resolution without explicit operator authorization. The AI has maximally de-risked within its authorized bounds while escalating the shutdown decision to the appropriate human authority.
