# Ambient Warning

**Category:** Warning pattern
**Sub-type:** Ambient warning
**Severity:** Informational (Level 0) to Advisory (Level 1)
**Status:** stable
**Phase:** 2A

---

## Problem It Solves

Some concerns are not tied to a specific output element or a specific action moment — they apply to an entire session, context, or operational mode and remain true throughout the user's interaction. Surfacing these concerns as inline warnings on every output creates habituation and noise. Surfacing them as modals creates disproportionate interruption. The ambient warning pattern maintains a persistent, low-friction disclosure in a secondary UI zone that users can reference without being blocked or disrupted.

---

## Definition

An ambient warning is a persistent, non-blocking disclosure displayed in a secondary zone of the interface — typically a header bar, sidebar, status strip, or session banner — that communicates a concern applying to the current context as a whole. Ambient warnings do not interrupt user actions and do not require dismissal. They remain visible for the duration of the condition they describe.

---

## When to Use

- The concern applies to the entire session, context, or data environment — not a specific output element
- The concern is ongoing rather than event-triggered (e.g., "You are operating in a sandbox", "This data environment has restricted freshness")
- The user needs persistent visibility of the concern without repeated interruption
- The concern would generate too many inline warnings if attached to individual outputs (density problem)
- The concern is Informational or Advisory — not severe enough to require user action

---

## When Not to Use

- The concern applies to a specific piece of content — use an inline warning instead
- The user must acknowledge the concern before proceeding — use a modal warning or blocking warning
- The concern is transient (it resolves once the user completes or exits the current action) — use an inline warning for that action moment
- The concern is severe enough that passive disclosure is insufficient — escalate to a modal or blocking warning
- The warning would appear in the ambient zone while also appearing as an inline warning on the same outputs — this double-stacking degrades both signals

---

## Trigger Conditions

- **Data sensitivity signal (context-level):** The data environment the session is operating against is flagged (e.g., contains personal data, operates on a restricted dataset, has known gaps)
- **Output staleness signal (context-level):** The underlying knowledge base, model, or data source has a freshness constraint that applies to all outputs in the session
- **Scope boundary (session-level):** The AI is operating in a restricted domain or capability mode for this session (e.g., "limited to financial data", "read-only access", "sandbox mode")
- **Confidence threshold breach (context-level):** The deployment configuration has flagged that this category of queries has systematically lower-than-expected confidence (e.g., a newly fine-tuned model in evaluation mode)
- **Manual review flag (session-level):** An administrator or policy engine has flagged this session type for ambient disclosure

---

## Severity Level

**Informational (Level 0) to Advisory (Level 1).** Ambient warnings do not impose friction. They exist to ensure context is available to attentive users without disrupting users who are confident in their use of the system. If a condition escalates beyond Advisory, it should be surfaced through a more prominent pattern — an inline warning at the triggering moment, a modal, or a blocking warning — rather than by increasing the prominence of the ambient warning indefinitely.

---

## User Action Required

None. The ambient warning is informational. Users may:
- Note the warning and adjust their behavior accordingly
- Ignore it and proceed
- Hover or click an expand action (if the ambient warning supports a detail panel) to learn more

The ambient warning must not require dismissal to proceed with any action. If the warning can be dismissed, it must reappear when the condition is still active (e.g., at the start of the next session or after a configurable interval).

---

## Explanation Requirements

The ambient warning must state:
1. **What the condition is** — the specific reason the warning exists (e.g., "This session uses data from a restricted environment")
2. **Scope** — that it applies to the current session or context, not a specific output
3. **Optional detail** — if the ambient zone has space constraints, an expand/details link that opens a panel with fuller explanation is acceptable

The ambient warning must not include:
- Action buttons that require user response
- Content that changes frequently — ambient warnings that update their text repeatedly draw too much attention and lose their ambient character
- Severity language that implies urgency ("Critical", "Danger") — ambient warnings at Informational or Advisory do not warrant urgency framing

---

## Copywriting Guidance

**Structure:** `[Icon] [Short condition label] — [Optional brief elaboration or expand link]`

**Good examples:**
- `⚠ Sandbox mode — Changes will not affect production data`
- `ⓘ Limited data access — Some fields are restricted in this environment`
- `⚠ Knowledge cutoff: Oct 2024 — Responses may not reflect recent events. Learn more ↗`
- `ⓘ Evaluation mode — Outputs are reviewed before use in production`

**Bad examples:**
- `Warning` — no content
- `This AI may produce errors` — non-specific, no actionable context
- `CAUTION: Restricted environment. You must verify all outputs. Do not rely on any data shown here without independent confirmation.` — too long, too alarming for an ambient treatment; use a modal or blocking warning instead

**Tone:** Calm, factual, persistent. Ambient warnings are background context, not alarms. Write as if adding a label to the environment, not issuing a notice.

**Length:** One line. Maximum 12–15 words. An expand/details link may surface additional content without violating the line constraint.

---

## Accessibility Requirements

- **Not color-only:** The ambient warning must include an icon and text label, not color alone. The icon must have descriptive alt text or an aria-label.
- **ARIA role:** Use `role="note"` or `role="status"`. Do not use `role="alert"` — ambient warnings are not time-critical announcements.
- **Reading order:** The ambient warning should appear early in the page's reading order so screen reader users encounter the context before interacting with the main content area.
- **Live region:** If the ambient warning content can change (e.g., the data freshness timestamp updates), use `aria-live="polite"` so screen readers announce changes without interrupting current activity.
- **Contrast:** Ambient warning text and icon must meet WCAG 2.1 AA contrast requirements against the ambient zone background.
- **Not auto-hidden:** Ambient warnings must not disappear based on inactivity, scroll position, or time. They persist as long as the condition is active.

---

## Enterprise Audit Considerations

**Audit logging:** Typically not required for Informational ambient warnings. In regulated contexts, log:
- Session start with ambient warning active
- Ambient warning identifier and condition
- Whether the user expanded or interacted with the detail panel (if applicable)

**Policy configurability:**
- Which conditions trigger ambient warnings must be configurable at the tenant level
- The content of the ambient warning label and detail text must be overridable per tenant (to align with internal terminology)
- Whether ambient warnings can be dismissed (and the interval at which they reappear after dismissal) must be configurable

**Multi-tenant:** Ambient warning conditions are tenant-scoped. A tenant with a restricted data environment configures its own ambient warning conditions independently of other tenants. Shared platform-level ambient warnings (e.g., a system-wide maintenance notice) are separate from tenant-level operational warnings.

---

## Failure Modes

| Failure mode | Description | Consequence |
|---|---|---|
| Ambient warning always present | Warning is shown in every session regardless of actual condition | Users treat it as decorative chrome and stop reading it entirely |
| Text too long | Ambient zone overflows or wraps to multiple lines | Warning competes with primary content; layout disrupted |
| High-severity content in ambient zone | Critical concerns placed in ambient warning because it "feels less disruptive" | Users miss critical information; ambient zone loses its low-friction character |
| Warning disappears on scroll | Ambient zone scrolls out of view on long pages | Users lose context midway through a long session |
| Multiple simultaneous ambient warnings | Two or more ambient warnings displayed simultaneously | Users cannot prioritize; the zone becomes a noise area |
| Dismissed and not restored | User dismisses ambient warning; condition persists but warning is gone | User operates without the contextual information the warning provided |

---

## Recovery Path

Ambient warnings do not block actions and therefore do not have a primary recovery flow. If a user acts on information without noticing the ambient warning and produces an unintended result, the downstream recovery follows the relevant action's recovery flow (retry, redirect, or repair). Ensure the ambient warning is placed prominently enough in the layout that post-hoc "I didn't see it" situations are design failures, not user errors.

---

## Related Patterns

- **[Inline warning](inline-warning.md)** — Use instead when the concern is specific to a particular output element within the session
- **[Modal warning](modal-warning.md)** — Escalate to this when the condition requires user acknowledgment before proceeding
- **[Progressive warning](progressive-warning.md)** — Use alongside to escalate the ambient warning to a more intrusive treatment when the user approaches a risky action
- **[Limitation disclosure](../explanation/limitation-disclosure.md)** — Use alongside when the ambient condition reflects a capability boundary the user needs to understand
- **[Confidence disclosure](../explanation/confidence-disclosure.md)** — Use alongside when the session-level confidence constraint needs elaboration beyond the ambient label

---

## Example Scenario

**Context:** An enterprise AI assistant is deployed for a financial services firm's analyst team. The deployment uses a data environment that excludes real-time market data — analysts have read-only access to a snapshot from the prior trading day. Every session operates under this constraint.

**Ambient warning rendered (in the header bar throughout the session):**

```
ⓘ Data as of previous trading day close — Real-time prices are not available in this environment
```

When an analyst hovers or clicks the ⓘ, a detail panel reads:
> "This session uses a data snapshot from the previous trading day close. Real-time prices, live order book data, and same-day news feeds are not accessible. Outputs involving current prices or today's market conditions are based on prior-day data."

**What the analyst can do:** Work with the AI knowing the data constraint. For time-sensitive decisions, they know to cross-reference a live data terminal.

**What would go wrong without this pattern:** An analyst asks the AI to pull "current" bond yields. The AI returns prior-day values without any disclosure. The analyst places a recommendation based on stale data, not knowing the system was not connected to live feeds.
