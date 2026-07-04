# Human Handoff

**Category:** Refusal state
**Sub-type:** Escalation refusal
**Severity:** Caution (Level 2) to Blocking (Level 3)
**Status:** stable
**Phase:** 2E

---

## Definition

Human handoff is a refusal pattern in which the AI determines that the user's need requires human expertise, authority, judgment, or identity verification that the AI cannot provide — and actively routes the user to the appropriate human agent, specialist, or team. The AI does not simply stop responding; it effects a transfer, ensuring the user's context and need are passed along rather than lost.

Human handoff is an escalation path, not an abandonment. It must be executed with the same care as completing a task: the user must end the handoff interaction knowing exactly who will handle their request, how, and within what timeframe.

---

## Trigger Conditions

Human handoff is triggered when:

- The task requires a licensed, credentialed, or authoritative human judgment (legal advice, medical diagnosis, financial planning, regulatory interpretation) that the AI cannot provide
- The task requires a decision from a person with organizational authority (budget approval, contract signing, policy exception)
- The user is in distress and needs human support — emotional, crisis, or support escalation scenarios
- The AI is in the unresolvable state and the task is time-sensitive, preventing the user from reformulating and returning
- The AI has been unable to complete a task across multiple attempts and a human can address the underlying issue (e.g., a technical problem with system state that requires admin intervention)
- The user explicitly requests a human
- A policy rule mandates human review for this request type before the AI can proceed (e.g., high-risk action approval)

---

## Why Refusal Occurred

The handoff explanation must distinguish clearly between:
- **Capability handoff:** The AI cannot do this, period (requires a licensed professional, requires physical presence, requires organizational authority)
- **Policy handoff:** The AI is configured to route this to a human because the deployment requires it for this request type
- **Quality handoff:** The AI can engage but the stakes are high enough that human expertise provides a meaningfully better outcome for the user

The user must understand which type of handoff is occurring, because it determines:
- Whether they can come back to the AI for related questions once the human engagement is complete
- Whether the AI played any role in preparing for the handoff (briefing the human agent, passing context)

---

## User Messaging

**Structure:** `[What the AI can confirm about the user's need] + [Why it is routing to a human] + [Who the human is and how to reach them] + [What happens to the user's context] + [Timeframe and follow-up]`

**Good examples:**
```
This looks like a question about specific legal obligations under the new data transfer 
regulation — that requires interpretation from a qualified attorney, not from me.

I'm routing this to your Data Protection Officer team now. I've included a summary of 
your question and relevant background.

DPO contact: dpo@yourcompany.com | Response SLA: 1 business day

In the meantime, I can help you prepare the questions you want to ask them or summarize 
the regulation's general framework if that's useful context to bring into that meeting.
```

```
I can see you're describing a situation that needs immediate human support. 

I'm connecting you now with [Support Team Name]. They are available 24/7 and will 
reach out by [channel] within [timeframe].

Reference number: [ID]

Is there anything you'd like me to include in the brief for them about your situation?
```

**Tone:** Warm, direct, and action-oriented. The user must feel transferred, not abandoned.

---

## What Can Still Be Completed

The AI should assess, at the moment of handoff, whether any preparation work can be completed to make the human interaction more effective:
- Summary of the user's context and need (ready to share with the human agent)
- Preparatory questions the user should bring to the human conversation
- Background information that will help the user have a more productive conversation with the specialist
- Any non-specialist parts of the task that the AI can complete alongside the handoff

---

## Alternatives

In some cases, an alternative to human handoff may exist:
- Self-service resources (documentation, FAQs, policy databases) that address the need without requiring human involvement
- A less urgent alternative that allows the user to reformulate the request and return to the AI
- Asynchronous submission (a request form, a support ticket) where immediate human availability is not required

Offer these as options, not replacements — if the user needs human engagement, do not deflect with self-service as the only path.

---

## Recovery Path

Human handoff completes when the user is connected to the human agent or the handoff has been confirmed. The AI's recovery path is:
- For tasks with a human approval gate: the AI pauses and resumes once the human approval is received
- For tasks that required human expertise: the AI stands ready to assist with follow-on tasks once the human engagement is complete
- For ongoing tasks: preserve session context so the user does not have to rebuild it after the human interaction concludes

---

## Related Uncertainty States

- **Unresolvable State** → Human handoff is the primary escalation path out of the unresolvable state when the task is time-sensitive
- **Low Confidence State** → Human handoff may be triggered if the task requires a decision that cannot be made under low confidence conditions and a human expert can provide the needed assessment

---

## Related Permission Patterns

- **Delegated permission** — when the human handoff is an approval flow (the human is approving an action rather than taking over the task), delegated permission governs the authorization chain
- **Revocation** — if a human agent overrides an AI decision during the handoff, any AI-generated prior outputs in this task should be reviewed for revocation

---

## Enterprise Audit Considerations

**Audit logging:** Required. Human handoff is a significant workflow event. Log:
- The reason for handoff (capability, policy, quality, user request)
- The context summary passed to the human agent
- The identity of the receiving agent or team (if available)
- The timestamp of the handoff initiation and confirmation
- Any continuation by the AI after the human interaction concludes

**Continuity requirements:** In regulated environments (clinical, financial, legal), the handoff record must be preserved as part of the task's audit trail. The human agent's involvement must be attributable.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Handoff without context transfer | The user is routed to a human but no context is passed | The user must repeat everything; trust and efficiency are lost |
| Vague routing | "Please contact support" without a specific team, channel, or timeframe | User does not know who to contact or when; handoff is effectively a dead end |
| Unnecessary handoff | Human handoff used as a convenient exit from a task the AI could handle | Overloads human agents; user receives slower service for a solvable AI task |
| Abandonment framing | The handoff is communicated as "I can't help you" rather than "I'm connecting you with someone who can" | User feels rejected; framing undermines trust |
| No AI role after handoff | The AI disengages entirely even though it could still assist with adjacent tasks | Missed opportunity to continue being useful while the human handles the specific need |

---

## Example Scenario

**Context:** An enterprise AI is assisting an employee who discloses, mid-conversation about a workplace productivity topic, that they are experiencing a serious personal crisis affecting their ability to work. The AI identifies that this requires immediate human support — mental health or employee assistance resources — and transitions from the productivity task to a human handoff.

**Human handoff response:**
```
What you're describing sounds really difficult, and it's important that you have 
the right support right now.

I'm connecting you with your company's Employee Assistance Program, which offers 
confidential support 24 hours a day.

EAP — [Company EAP Provider]: 1-800-XXX-XXXX (free, confidential, 24/7)
Or access online at: [EAP portal link]

If this is an immediate emergency, please call emergency services (911) or 
your local emergency number.

The productivity questions we were working on can wait — please reach out to the 
EAP team today. I'll be here when you're ready to continue with work tasks.
```

The transition is immediate, warm, and unambiguous. The AI provides the specific resource, not a generic "contact HR." It explicitly leaves the door open for continuation of the original task without pressure.
