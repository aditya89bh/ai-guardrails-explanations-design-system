# Policy Refusal

**Category:** Refusal state
**Sub-type:** Policy enforcement refusal
**Severity:** Blocking (Level 3)
**Status:** stable
**Phase:** 2E

---

## Definition

A policy refusal is a complete refusal of a request on the grounds that fulfilling it would violate a configured organizational, regulatory, or platform policy — regardless of safety signals. Unlike a safe refusal, which is triggered by harm risk, a policy refusal is triggered by a defined rule: a specific policy has been explicitly configured to prohibit this request type, scope, or content in this deployment.

Policy refusals are rule-governed, not judgment-governed. The AI does not evaluate whether the specific instance of the request would be harmful — the policy prohibits the category, and the AI enforces it consistently. This predictability is a feature, not a limitation: enterprise organizations rely on policy refusals to enforce compliance consistently across all users and sessions.

---

## Trigger Conditions

A policy refusal is triggered when:

- A configured policy rule matches the current request — by content type, topic, data scope, user role, session context, or output type
- The user's request falls within a category that is prohibited in the current deployment configuration (e.g., generating external communications in a deployment restricted to internal use, accessing a data category the user's role does not permit)
- A regulatory compliance rule prohibits this request type for this user or tenant (e.g., generating financial advice for a non-licensed user on a platform with financial services compliance requirements)
- A policy constraint active for this session (e.g., a time-limited policy restriction during an active regulatory audit) prohibits the request
- The user's request would cause the AI to act outside its authorized operational boundary for this deployment

---

## Why Refusal Occurred

A policy refusal explanation must:
- State that a policy governs this refusal — not the AI's judgment, not a safety signal, but a configured policy rule
- Identify the policy category or rule name (at the level of specificity the deployment's disclosure policy allows)
- Be honest about whether the policy is tenant-level (configurable by the organization's administrators) or platform-level (not configurable)
- Not imply that the request is harmful or that the user has bad intent — a policy refusal is a scope restriction, not an accusation

The reason the policy exists should be explained if:
- It is a regulatory compliance requirement (the user may not know the regulation applies)
- It is an organizational policy that the user can verify or appeal through proper channels
- The explanation helps the user understand how to get their need met through an authorized path

---

## User Messaging

**Structure:** `[What is being refused] + [The policy that governs it] + [Whether the policy is fixed or configurable] + [What the user can do to get their need met through an authorized path]`

**Good examples:**
```
This request cannot be completed in this deployment.

Policy: This AI assistant is configured for internal use only. Drafting external 
communications — including emails to customers, partners, or vendors — is outside 
its authorized scope.

If you need to draft an external communication:
• Use your organization's approved external communication tools
• Request access to the customer-facing AI assistant (if available for your role)

If you believe this scope restriction is incorrect for your role, contact your 
system administrator.
```

```
This data cannot be accessed for this request.

Policy: Your current role does not have access to personally identifiable customer 
financial data. This restriction is set by your organization's data classification 
policy in compliance with [applicable regulatory framework].

To proceed with an analysis that requires this data, the appropriate data steward 
must grant scoped access for this specific task. Contact [data governance team] 
to initiate that request.
```

**Tone:** Authoritative but not punitive. The user is hitting a boundary, not committing a violation. The tone should be matter-of-fact: "This is the policy. Here is what you can do."

---

## What Can Still Be Completed

Assess whether any part of the request falls outside the policy's scope and can be completed:
- If yes, complete the permitted parts and clearly label what was excluded due to policy
- If the entire request is prohibited, say so directly and provide the authorized path

Do not complete a prohibited request and then add a policy note at the end — the compliance risk is in the completion, not the note.

---

## Alternatives

For each policy refusal, provide:
- The authorized channel for the refused request type (a different system, a request approval process, an authorized role)
- Whether the policy can be overridden by an administrator and how to initiate that process
- A scoped version of the task that falls within the policy boundary, if one exists

If there is no alternative path, say so directly: "This request cannot be fulfilled through any path in this deployment."

---

## Recovery Path

Policy refusals have defined recovery paths — they are rule-governed, which means the rules also define how they can be lifted:
- **Policy change:** An administrator reconfigures the policy for the deployment or user
- **Role upgrade:** The user's role is elevated to one that is permitted for this request type
- **Scoped access grant:** A data steward or authorizer grants temporary, scoped access for the specific task
- **Alternative channel:** The user completes the request through an authorized system outside this AI deployment

The AI should surface whichever of these paths is applicable, with specific instructions for initiating it.

---

## Related Uncertainty States

- **Unresolvable State** → A policy refusal may be preceded by the unresolvable state if the AI determined that no configuration of the request would fall within policy
- Policy refusals are not uncertainty-driven — they do not depend on confidence levels or data quality

---

## Related Permission Patterns

- **Scoped permission** — a policy refusal may be lifted for a specific task by a scoped permission grant from an authorized party
- **Delegated permission** — for high-level policy exceptions, a delegated permission from an administrator or compliance officer may be required
- **Persistent permission** — for users who regularly require access beyond the default policy scope, a persistent permission upgrade may be the appropriate resolution

---

## Enterprise Audit Considerations

**Audit logging:** Required. Policy refusals are compliance events. Log:
- The refused request (summary level)
- The specific policy rule triggered (by rule ID or category)
- The user and session identifiers
- Whether the user attempted to work around the refusal
- The timestamp

**Policy consistency:** All instances of the same policy rule must trigger the same refusal response — inconsistent policy enforcement is a compliance and legal risk. Policy refusal responses should be generated from a rule-driven template, not from free-form AI generation, to ensure consistency.

**Policy audit trail:** The active policy configuration at the time of each refusal must be captured in the audit log. Policy changes are not retroactive — a refusal that was correct under the policy at the time must not be retroactively flagged as an error if the policy is later changed.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Policy refusal without policy citation | User is refused but not told what policy applies | User cannot understand, verify, or appeal the refusal |
| Inconsistent enforcement | The same request type is refused for one user but not another with the same role | Compliance failure; creates a discoverable audit gap |
| Accusatory policy refusal | The refusal implies the user intended a violation | Damages trust; treats policy scope limits as moral failures |
| No recovery path stated | User is refused with no information on how to proceed | User is blocked with no path forward; task fails permanently for no actionable reason |
| Partial completion of a prohibited request | The AI completes part of the request before applying the policy check | The prohibited content is generated before it is refused; the completion is the compliance violation |

---

## Example Scenario

**Context:** An enterprise AI deployed for a financial services firm's internal analyst team is asked by a junior analyst to generate a personalized investment recommendation for a named client, based on their portfolio data. The deployment policy prohibits the AI from generating personalized investment advice — this must be done by a licensed financial advisor with appropriate disclosures. The analyst's role is "Analyst (non-licensed)" in the system.

**Policy refusal response:**
```
This request cannot be completed.

Policy: Generating personalized investment recommendations requires a licensed financial 
advisor role in this deployment. Your current role (Analyst — non-licensed) is not 
authorized for this output type under [applicable regulatory framework].

This policy applies regardless of the quality of the underlying analysis — the restriction 
is on the output type, not the data.

What you can do:
• Run the portfolio analysis without the personalized recommendation — I can produce 
  the data summary, risk metrics, and scenario analysis for you to hand to a licensed 
  advisor for recommendation generation
• Submit a request to [Compliance Team] if you believe your role classification needs 
  to be updated

[Generate portfolio analysis without recommendation] 
[Contact compliance team ↗]
```

The analyst understands: (1) exactly what policy applies and why, (2) that this is a role restriction not a capability limit, (3) two specific paths forward. The AI offers the non-prohibited portion of the task immediately.
