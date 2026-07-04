/**
 * Selection rules for the Guardrail Decision Engine
 * Implements: docs/decision-flows/pattern-selection-engine.md
 * Precedence: docs/decision-flows/pattern-precedence-engine.md
 *
 * Each rule has:
 *   ruleId, label, description, docRef — identification
 *   priority — evaluation order (lower = higher priority)
 *   terminatesEvaluation — if true, no further rules evaluate after activation
 *   test(primitives) — returns boolean
 *   onActivate(primitives) — returns { activatedPatterns, skippedPatterns, reason }
 *   onSkip(primitives) — returns { reason }
 */

export const SELECTION_RULES = [
  // ─── Tier 1: Policy (highest precedence) ────────────────────────────────
  {
    ruleId: 'R01',
    label: 'Policy Block',
    description: 'Tenant or deployment policy match forces policy-refusal, superseding all other refusal and warning patterns.',
    docRef: 'docs/decision-flows/pattern-selection-engine.md § Policy Priority (Row 1)',
    category: 'Policy',
    priority: 1,
    terminatesEvaluation: true,

    test: (p) => ['tenant', 'deployment'].includes(p.P5),

    onActivate: (p) => ({
      activatedPatterns: [
        'policy-refusal',
        ...(p.P1 >= 4 ? ['emergency-escalation'] : []),
        'redirect-recovery',
        'limitation-disclosure',
      ],
      skippedPatterns: ['safe-refusal', 'blocking-warning', 'inline-warning', 'ambient-warning', 'human-handoff'],
      reason: `P5 = ${p.P5} (policy match at ${p.P5} level). policy-refusal takes precedence over all other refusal and warning patterns.${p.P1 >= 4 ? ' P1 = Critical — concurrent emergency-escalation fires.' : ''}`,
    }),

    onSkip: (p) => ({
      reason: `P5 = ${p.P5} — no policy rule matches this interaction.`,
    }),
  },

  // ─── Tier 2: Unresolvable state ─────────────────────────────────────────
  {
    ruleId: 'R02',
    label: 'Emergency Escalation — Unresolvable at Critical Risk',
    description: 'Unresolvable-state at Risk=4 mandates emergency escalation and abandon-recovery. No output is produced.',
    docRef: 'docs/decision-flows/state-transition-engine.md § UR → Emergency Escalation',
    category: 'Uncertainty',
    priority: 2,
    terminatesEvaluation: true,

    test: (p) => p.P2 === 'unresolvable' && p.P1 >= 4,

    onActivate: (p) => ({
      activatedPatterns: ['unresolvable-state', 'emergency-escalation', 'abandon-recovery'],
      skippedPatterns: ['constrained-completion', 'partial-completion', 'safe-refusal', 'retry-recovery', 'redirect-recovery'],
      reason: `P2 = unresolvable + P1 = ${p.P1} (Critical). Emergency escalation and abandon-recovery are mandatory. No output is produced. Conservative policy: treat threshold breach as real.`,
    }),

    onSkip: (p) => ({
      reason: p.P2 === 'unresolvable'
        ? `P2 = unresolvable but P1 = ${p.P1} (not Critical). Falls through to R03.`
        : `P2 = ${p.P2} — not unresolvable.`,
    }),
  },

  {
    ruleId: 'R03',
    label: 'Safe Refusal — Unresolvable at Lower Risk',
    description: 'Unresolvable-state below Critical risk forces safe-refusal with redirect. No output is produced.',
    docRef: 'docs/decision-flows/state-transition-engine.md § UR → Safe Refusal',
    category: 'Uncertainty',
    priority: 3,
    terminatesEvaluation: false,

    test: (p) => p.P2 === 'unresolvable' && p.P1 < 4,

    onActivate: (p) => ({
      activatedPatterns: ['unresolvable-state', 'safe-refusal', 'redirect-recovery'],
      skippedPatterns: ['constrained-completion', 'partial-completion'],
      reason: `P2 = unresolvable + P1 = ${p.P1}. Safe-refusal required. No output is possible when the conflict cannot be resolved.`,
    }),

    onSkip: (p) => ({
      reason: `P2 = ${p.P2} — not unresolvable.`,
    }),
  },

  // ─── Tier 3: Permission ──────────────────────────────────────────────────
  {
    ruleId: 'R04',
    label: 'Permission Block — Unauthorized at High Risk',
    description: 'Unauthorized P4 at Risk≥3 activates blocking-warning and offers role escalation.',
    docRef: 'docs/decision-flows/pattern-selection-engine.md § Permission Priority',
    category: 'Permission',
    priority: 4,

    test: (p) => p.P4 === 'unauthorized' && p.P1 >= 3,

    onActivate: (p) => ({
      activatedPatterns: ['blocking-warning', ...(p.P1 >= 3 ? ['role-escalation'] : [])],
      skippedPatterns: ['inline-warning', 'ambient-warning'],
      reason: `P4 = unauthorized + P1 = ${p.P1}. Blocking-warning activates. Passive-dismissal = denial is enforced. Role escalation offered.`,
    }),

    onSkip: (p) => ({
      reason: p.P4 === 'unauthorized'
        ? `P4 = unauthorized but P1 = ${p.P1} < 3. Inline-warning instead of blocking.`
        : `P4 = ${p.P4} — authorized or partial.`,
    }),
  },

  {
    ruleId: 'R04B',
    label: 'Scoped Permission Gate',
    description: 'Partial P4 at any risk activates scoped-permission gate (blocking severity).',
    docRef: 'docs/decision-flows/pattern-selection-engine.md § Permission Priority',
    category: 'Permission',
    priority: 5,

    test: (p) => p.P4 === 'partial',

    onActivate: (p) => ({
      activatedPatterns: ['scoped-permission'],
      skippedPatterns: [],
      reason: `P4 = partial. Scoped-permission gate activates at blocking severity. User can proceed within defined scope only.`,
    }),

    onSkip: (p) => ({
      reason: `P4 = ${p.P4} — not partial.`,
    }),
  },

  // ─── Tier 4: Conflicting evidence ────────────────────────────────────────
  {
    ruleId: 'R05',
    label: 'Conflicting Evidence — Safe Refusal (High Risk)',
    description: 'CE state at Risk≥3 forces safe-refusal. CE ≠ LC: a hedged recommendation is forbidden.',
    docRef: 'docs/decision-flows/state-transition-engine.md § CE State → Safe Refusal',
    category: 'Uncertainty',
    priority: 6,

    test: (p) => p.P2 === 'conflicting' && p.P1 >= 3,

    onActivate: (p) => ({
      activatedPatterns: ['conflicting-evidence-state', 'safe-refusal', 'reasoning-trace', 'source-citation', 'redirect-recovery'],
      skippedPatterns: ['constrained-completion', 'partial-completion'],
      reason: `P2 = conflicting + P1 = ${p.P1}. Safe-refusal mandatory. CE state cannot be treated as LC. A recommendation based on one source while another contradicts it is forbidden.`,
    }),

    onSkip: (p) => ({
      reason: p.P2 === 'conflicting'
        ? `P2 = conflicting but P1 = ${p.P1} < 3. Advisory disclosure only.`
        : `P2 = ${p.P2} — not conflicting evidence.`,
    }),
  },

  {
    ruleId: 'R05B',
    label: 'Conflicting Evidence — Advisory Disclosure (Lower Risk)',
    description: 'CE state at Risk<3 activates advisory conflicting-evidence disclosure (no forced refusal).',
    docRef: 'docs/decision-flows/state-transition-engine.md § CE State',
    category: 'Uncertainty',
    priority: 7,

    test: (p) => p.P2 === 'conflicting' && p.P1 < 3,

    onActivate: (p) => ({
      activatedPatterns: ['conflicting-evidence-state', 'source-citation', 'reasoning-trace'],
      skippedPatterns: [],
      reason: `P2 = conflicting + P1 = ${p.P1}. Advisory disclosure: surfacing the conflict without forcing refusal.`,
    }),

    onSkip: (p) => ({
      reason: `P2 = ${p.P2} — not conflicting evidence.`,
    }),
  },

  // ─── Tier 5: Insufficient information ────────────────────────────────────
  {
    ruleId: 'R06',
    label: 'Insufficient Information — Clarification Required',
    description: 'II state forces clarification-request. II ≠ LC: required inputs are absent, not just sparse.',
    docRef: 'docs/decision-flows/state-transition-engine.md § II State',
    category: 'Uncertainty',
    priority: 8,

    test: (p) => p.P2 === 'insufficient',

    onActivate: (p) => ({
      activatedPatterns: ['insufficient-information-state', 'clarification-request', 'partial-completion', 'limitation-disclosure'],
      skippedPatterns: ['constrained-completion', 'safe-refusal'],
      reason: `P2 = insufficient. Clarification-request activates. Constrained-completion is wrong here — the required inputs are absent, not sparse.`,
    }),

    onSkip: (p) => ({
      reason: `P2 = ${p.P2} — not insufficient information.`,
    }),
  },

  // ─── Tier 6: Low confidence ──────────────────────────────────────────────
  {
    ruleId: 'R07',
    label: 'Low Confidence + Decision-Support → Constrained Completion',
    description: 'LC state with decision-support intent allows constrained output. Critical distinction for clinical/advisory contexts.',
    docRef: 'docs/decision-flows/pattern-selection-engine.md § LC × Intent',
    category: 'Uncertainty',
    priority: 9,

    test: (p) => p.P2 === 'low' && p.P6 === 'decision-support' && p.P3 !== 'incapable',

    onActivate: (p) => ({
      activatedPatterns: [
        'low-confidence-state',
        'constrained-completion',
        'confidence-disclosure',
        'limitation-disclosure',
        'source-citation',
        ...(p.P1 >= 3 ? ['role-escalation'] : []),
      ],
      skippedPatterns: ['safe-refusal'],
      reason: `P2 = low + P6 = decision-support + P3 = ${p.P3}. Constrained output is correct — the user needs available evidence to support their own decision.${p.P1 >= 3 ? ' Role escalation offered (P1 ≥ 3).' : ''}`,
    }),

    onSkip: (p) => ({
      reason: p.P2 !== 'low'
        ? `P2 = ${p.P2} — not low confidence.`
        : p.P6 !== 'decision-support'
        ? `P2 = low but P6 = ${p.P6} — action-execution requires safe-refusal under LC (see R08).`
        : `P3 = incapable — capability boundary prevents output.`,
    }),
  },

  {
    ruleId: 'R08',
    label: 'Low Confidence + Action-Execution → Safe Refusal',
    description: 'LC state with action-execution intent forces safe-refusal. Agents must not execute actions under uncertainty.',
    docRef: 'docs/decision-flows/pattern-selection-engine.md § LC × Intent',
    category: 'Uncertainty',
    priority: 10,

    test: (p) => p.P2 === 'low' && p.P6 !== 'decision-support',

    onActivate: (p) => ({
      activatedPatterns: ['low-confidence-state', 'safe-refusal', 'confidence-disclosure', 'limitation-disclosure', 'alternative-suggestion'],
      skippedPatterns: ['constrained-completion'],
      reason: `P2 = low + P6 = ${p.P6}. Safe-refusal required — AI must not execute actions under low confidence. Alternatives offered.`,
    }),

    onSkip: (p) => ({
      reason: `P2 = ${p.P2} — not low confidence.`,
    }),
  },

  // ─── Tier 7: Stale context ────────────────────────────────────────────────
  {
    ruleId: 'R09',
    label: 'Stale Context Disclosure',
    description: 'Stale P2 or stale P9 activates staleness disclosure. Compounds with other confidence states.',
    docRef: 'docs/decision-flows/decision-primitives.md § P9 × P2',
    category: 'Uncertainty',
    priority: 11,

    test: (p) => p.P2 === 'stale' || p.P9 === 'stale',

    onActivate: (p) => ({
      activatedPatterns: [
        'stale-context-state',
        'ambient-warning',
        'limitation-disclosure',
        ...(p.P1 >= 3 ? ['role-escalation'] : []),
      ],
      skippedPatterns: [],
      reason: `${p.P2 === 'stale' ? 'P2 = stale' : 'P9 = stale'}. Staleness must be disclosed on each affected claim. Compounds with other active confidence patterns.`,
    }),

    onSkip: (p) => ({
      reason: `P2 = ${p.P2}, P9 = ${p.P9} — no staleness signal.`,
    }),
  },

  // ─── Tier 8: Moderate confidence ─────────────────────────────────────────
  {
    ruleId: 'R10',
    label: 'Moderate Confidence Disclosure',
    description: 'MC state at Risk≥3 requires confidence disclosure. Surface badge optional at lower risk.',
    docRef: 'docs/decision-flows/decision-primitives.md § P2 × P1',
    category: 'Uncertainty',
    priority: 12,

    test: (p) => p.P2 === 'moderate',

    onActivate: (p) => ({
      activatedPatterns: ['moderate-confidence-state', ...(p.P1 >= 3 ? ['confidence-disclosure'] : [])],
      skippedPatterns: [],
      reason: `P2 = moderate + P1 = ${p.P1}. ${p.P1 >= 3 ? 'Confidence disclosure required at Risk≥3.' : 'Surface badge optional at Risk<3 — deployment team discretion.'}`,
    }),

    onSkip: (p) => ({
      reason: `P2 = ${p.P2} — not moderate confidence.`,
    }),
  },

  // ─── Tier 9: High confidence ──────────────────────────────────────────────
  {
    ruleId: 'R11',
    label: 'High Confidence — No Epistemic Disclosure',
    description: 'HC state requires no confidence disclosure. Other patterns may still activate based on P1, P4, P5.',
    docRef: 'docs/decision-flows/decision-primitives.md § P2 HC State',
    category: 'Uncertainty',
    priority: 13,

    test: (p) => p.P2 === 'high',

    onActivate: (p) => ({
      activatedPatterns: ['high-confidence-state'],
      skippedPatterns: [],
      reason: `P2 = high. No epistemic disclosure needed. Forbidden: showing an uncertainty indicator while in HC state.`,
    }),

    onSkip: (p) => ({
      reason: `P2 = ${p.P2} — not high confidence.`,
    }),
  },

  // ─── Tier 10: Secondary activation rules ─────────────────────────────────
  {
    ruleId: 'R12',
    label: 'Low Source Reliability → Citation Required',
    description: 'P10 < 2 at Risk≥2 requires source citation to establish claim provenance.',
    docRef: 'docs/decision-flows/decision-primitives.md § P10',
    category: 'Explanation',
    priority: 14,

    test: (p) => p.P10 < 2 && p.P1 >= 2,

    onActivate: (p) => ({
      activatedPatterns: ['source-citation'],
      skippedPatterns: [],
      reason: `P10 = ${p.P10} (low reliability) + P1 = ${p.P1}. Source attribution required for all claims.`,
    }),

    onSkip: (p) => ({
      reason: `P10 = ${p.P10} (sufficient reliability), P1 = ${p.P1}.`,
    }),
  },

  {
    ruleId: 'R13',
    label: 'High Business Impact → Limitation Disclosure',
    description: 'P7 = high at Risk≥2 amplifies to limitation-disclosure if not already activated.',
    docRef: 'docs/decision-flows/decision-primitives.md § P7',
    category: 'Explanation',
    priority: 15,

    test: (p) => p.P7 === 'high' && p.P1 >= 2,

    onActivate: (p) => ({
      activatedPatterns: ['limitation-disclosure'],
      skippedPatterns: [],
      reason: `P7 = high + P1 = ${p.P1}. Business impact amplifies to limitation-disclosure regardless of confidence state.`,
    }),

    onSkip: (p) => ({
      reason: `P7 = ${p.P7}, P1 = ${p.P1} — no business impact amplification.`,
    }),
  },

  {
    ruleId: 'R14',
    label: 'Unauthorized + Lower Risk → Inline Warning',
    description: 'Unauthorized P4 below Risk 3 renders an inline (non-blocking) warning.',
    docRef: 'docs/decision-flows/pattern-selection-engine.md § Permission at Lower Risk',
    category: 'Permission',
    priority: 16,

    test: (p) => p.P4 === 'unauthorized' && p.P1 < 3,

    onActivate: (p) => ({
      activatedPatterns: ['inline-warning'],
      skippedPatterns: [],
      reason: `P4 = unauthorized + P1 = ${p.P1} < 3. Inline warning (advisory severity). Blocking-warning reserved for Risk≥3.`,
    }),

    onSkip: (p) => ({
      reason: `P4 = ${p.P4}, P1 = ${p.P1} — condition not met.`,
    }),
  },
];
