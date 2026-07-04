# Developer Copilot — Conflicting CVE Advisory

**Industry:** Developer tools
**Primary patterns:** conflicting-evidence-state, source-citation (claim-level), reasoning-trace, safe-refusal, alternative-suggestion, redirect-recovery
**Decision engine coverage:** Selection engine § CE state; Composition § refusal + alternative; State machine § CE → alternatives; Source reliability P10 as primary differentiator
**Phase:** 5
**Status:** stable

---

## 1. Problem

An enterprise software team has deployed an AI developer copilot integrated into their IDE. The copilot can recommend libraries, review code, explain APIs, generate boilerplate, and surface security advisories. The deployment is configured with an internal security advisory feed (refreshed weekly) and access to open-source vulnerability databases.

The risk scenario: a developer queries the copilot for guidance on whether to use a specific cryptography library for a new service. Two sources in the copilot's knowledge base directly contradict each other on a critical security characteristic of the library. One source (the internal security team's advisory, updated 3 weeks ago) classifies the library's key derivation function implementation as vulnerable to a timing attack and recommends against production use. A second source (the library's own documentation, retrieved from the upstream package registry) describes the same function as resistant to timing attacks and references a third-party audit conducted 18 months prior.

The copilot cannot determine which source is correct. This is a genuine conflict of evidence — not a confidence question about one source, but two authoritative sources saying opposite things.

---

## 2. User Request

```
User: Should we use [CryptoLibX] v2.4.1 for key derivation in our new auth service? 
Our team is debating the timing attack resistance of the PBKDF2 implementation.
```

---

## 3. Decision Primitive Evaluation

| Primitive | Value | Reasoning |
|---|---|---|
| P1 — Risk | 3 (High) | Cryptographic library selection for authentication is a high-risk decision; a timing attack vulnerability in a production auth service = credential exposure |
| P2 — Confidence | Conflicting Evidence (CE) | Two sources with comparable authority contradict each other on a material fact (timing attack resistance); not resolvable by the AI |
| P3 — Capability | Capable (surface and explain conflict); incapable (resolve the conflict) | The copilot can document both claims and their sources; it cannot determine which claim is factually correct |
| P4 — Permission | Authorized | Developer is authorized for security library queries |
| P5 — Policy | No match | Library selection queries are permitted |
| P6 — User Intent | `decision-support` | Developer is using copilot output to inform a team decision |
| P7 — Business Impact | High | Incorrect library selection for auth = security incident risk |
| P8 — User Authority | Tier 1 (developer) | Can make implementation decisions within team norms; should escalate security-critical decisions to security team |
| P9 — Context Freshness | Mixed | Internal security advisory: 3 weeks old (relatively fresh). Library documentation: reflects 18-month-old audit (stale relative to active vulnerability research) |
| P10 — Source Reliability | Conflicting | Internal security team advisory (high reliability for production deployment guidance) vs. upstream library documentation (medium reliability — self-reported; cites a third-party audit that pre-dates the claimed fix) |

---

## 4. Decision Engine Execution

**P2 — Confidence = Conflicting Evidence:** The primary driver. The AI has two claims that cannot be reconciled from available evidence. Low confidence (LC) would apply if there were only one source with sparse evidence. CE applies when sources with comparable authority make incompatible assertions about the same fact.

**P10 — Source Reliability = Conflicting:** Compounds the CE state. The internal security team advisory has institutional authority in this deployment context (it governs production library decisions). The library's own documentation cannot be considered neutral. Neither source can simply override the other by the AI's assessment.

**P1 × P7 — Risk = 3 × Business Impact = High:** A recommendation to use or avoid the library without disclosing the conflict would be a guardrail failure. The safe-refusal applies: the AI must not recommend using or avoiding the library without fully disclosing the conflicting evidence.

**Pattern selection:**
- `conflicting-evidence-state` activates.
- `reasoning-trace` activates — the developer needs to understand the exact nature of the conflict, not just that conflict exists.
- `source-citation` at claim-level — each contradictory assertion must be attributed to its specific source.
- `safe-refusal` — the AI declines to make a binary "use/don't use" recommendation.
- `alternative-suggestion` — two actionable alternatives are offered: (1) consult the internal security team; (2) use an alternative library with a more settled security posture.
- `redirect-recovery` — the developer is redirected to the internal security team for resolution of the conflict.

**Rules skipped:**
- `constrained-completion`: evaluated — cannot partially complete a library recommendation in a CE state without potentially misleading the developer. If the AI hedged toward one source without disclosing the conflict, it would be providing guidance that misrepresents the situation.
- `low-confidence-state`: evaluated — CE is more precise than LC for this scenario. LC implies the evidence is sparse; CE implies the evidence is contradictory. The pattern selection engine distinguishes them and selects CE.
- `human-handoff (refusal)`: evaluated — the developer should be redirected to the internal security team, but this is `redirect-recovery`, not `human-handoff`. The copilot is not handing off the session; it is pointing the developer toward the right authoritative source.

---

## 5. Pattern Sequence

```
conflicting-evidence-state (CE: two authoritative sources contradict each other)
  ↓
reasoning-trace (documents the exact nature of the conflict, claim by claim)
  ↓
source-citation (claim-level: each assertion attributed to its source)
  ↓
safe-refusal (declines to make a binary use/avoid recommendation)
  ↓
alternative-suggestion (two alternatives: internal security team consultation; alternative library)
  ↓
redirect-recovery (developer directed to internal security advisory process)
```

---

## 6. Component Sequence

| Order | Component | Reason |
|---|---|---|
| 1 | `ConflictingEvidenceCard` | Presents both claims side by side with sources; visualizes the conflict, not a consensus |
| 2 | `ReasoningTrace` | Documents: what was retrieved, why the sources conflict, what the AI cannot determine, what would be needed to resolve it |
| 3 | `SourceList` (claim-level) | Each assertion attributed: internal security advisory (citation: advisory ref + date); library documentation (citation: package registry + audit report reference — marked stale) |
| 4 | `RefusalCard` (safe-refusal) | "I cannot recommend for or against [CryptoLibX] v2.4.1 for this use case. The two sources I have access to make incompatible claims about its timing attack resistance." |
| 5 | `AlternativeSuggestionCard` | Two alternatives with context: (1) Submit the conflict to your internal security team advisory process; (2) Consider [AlternativeLibX] — its timing attack resistance for PBKDF2 is consistently documented across three independent sources |

---

## 7. User Journey

**Step 1:** Developer submits the library selection query.

**Step 2:** The copilot retrieves: the internal security advisory (recommends against: timing attack vulnerability), the library documentation (self-attests resistance, cites 18-month-old audit).

**Step 3:** CE state confirmed. Conflict is material: both sources address the exact same function and characteristic.

**Step 4:** `ConflictingEvidenceCard` renders:

| Source | Claim | Date | Type |
|---|---|---|---|
| Internal Security Advisory | PBKDF2 implementation is vulnerable to a timing attack (non-constant-time comparison branch). Avoid production use. | 3 weeks ago | Internal advisory (tenant authoritative) |
| CryptoLibX Documentation | PBKDF2 implementation uses constant-time comparison. Confirmed resistant to timing attacks per [3rd party audit]. | Library docs (18-month-old audit) | Upstream (self-reported) |

**Step 5:** `ReasoningTrace` renders below: "These two sources make directly contradictory assertions about the same function in the same version of the library. I cannot determine from available evidence which claim is correct. Possibilities include: (1) the library's v2.4 release introduced the vulnerability after the audit; (2) the internal advisory's analysis of the specific build artifact differs from the upstream release; (3) the audit scope did not cover the exact code path in question. Resolving this requires a direct code review of the v2.4.1 PBKDF2 implementation."

**Step 6:** `SourceList` renders with claim-level attribution.

**Step 7:** `RefusalCard` renders: "I cannot make a production recommendation for this library in this version for key derivation. The conflict between these sources is material and unresolved."

**Step 8:** `AlternativeSuggestionCard` renders with two options clearly explained.

**Step 9:** Developer takes the conflict to the internal security team with the copilot's `ConflictingEvidenceCard` output as supporting documentation.

---

## 8. Audit Trail

| Event | Actor | Relative time | Pattern | Component | Result |
|---|---|---|---|---|---|
| Library query submitted | Developer (Tier 1) | T+0 | — | — | Retrieval initiated |
| Internal advisory retrieved | System | T+0.6s | — | — | Recommends against: vulnerability documented |
| Library docs retrieved | System | T+0.7s | — | — | Claims resistance: audit cited |
| CE state confirmed | System | T+0.8s | `conflicting-evidence-state` | — | Contradictory claims on same function |
| Conflicting evidence card rendered | System | T+1.2s | `conflicting-evidence-state` | `ConflictingEvidenceCard` | Side-by-side conflict displayed |
| Reasoning trace rendered | System | T+1.2s | `reasoning-trace` | `ReasoningTrace` | Conflict analysis documented |
| Source citation rendered | System | T+1.2s | `source-citation` | `SourceList` | Both sources attributed at claim level |
| Safe refusal rendered | System | T+1.2s | `safe-refusal` | `RefusalCard` | No use/avoid recommendation issued |
| Alternative suggestion rendered | System | T+1.2s | `alternative-suggestion` | `AlternativeSuggestionCard` | Two alternatives presented |
| Alternatives reviewed | Developer | T+3m | — | — | Developer copies conflict evidence for security team |
| Session closed | Developer | T+4m | — | — | No library selection made; escalated to security team |

---

## 9. Recovery Path

**Primary recovery:** `redirect-recovery` — the developer is redirected to the internal security advisory process. This is the correct recovery because the conflict requires a human security expert, not the AI, to resolve.

**Resolution path (external to AI system):** The security team reviews the v2.4.1 source code directly. They confirm the internal advisory is correct — a code change in v2.4.0 introduced a branch in the comparison that is timing-observable under certain conditions. The library documentation had not been updated after the v2.4 release.

**Return to copilot:** After resolution, the developer can return to the copilot with the security team's determination. The copilot can then help with the alternative library integration — a new, unblocked query outside the CE state.

---

## 10. Final Outcome

**System state:** CE state documented. No library recommendation issued. Conflict surfaced to security team via developer. Audit record: both sources, both claims, conflict determination, refusal, alternatives offered.

**Developer state:** Did not use [CryptoLibX] pending security team review. Security team confirmed the vulnerability. Team selected the alternative library.

**Guardrail outcome:** The copilot correctly identified that this was a CE state rather than a LC state, correctly declined to make a hedged recommendation that would have masked the conflict, and correctly provided the developer with enough structured evidence to take the issue to the security team.

---

## 11. Lessons Learned

**1. CE state and LC state produce different refusal types.** LC state → constrained-completion with confidence disclosure (some output, hedged). CE state → safe-refusal (no recommendation at all). Making a "hedged" recommendation in a CE state is worse than no recommendation — it implies the AI has a view but is uncertain, when in fact the AI cannot form a view.

**2. Reasoning traces in CE state must explain what would resolve the conflict, not just that conflict exists.** "Two sources disagree" is not enough. The developer needs to know what evidence would settle the question. In this case: a direct code review of the v2.4.1 build artifact. This gives the security team a specific task, not an open-ended dispute.

**3. Internal organizational sources should be weighted higher than upstream vendor documentation for production decisions.** The deployment's internal security advisory team has institutional authority for production library decisions. The copilot's source reliability weighting should reflect this: P10 = High for internal advisories in this context.

**4. Source staleness must be displayed at claim level, not at session level.** The 18-month-old audit reference in the library documentation is a staleness signal on the specific claim it supports — not a general stale-context signal for the entire session. Claim-level source citation is the only way to show this accurately.
