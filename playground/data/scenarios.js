/**
 * Predefined playground scenarios
 * Source: docs/examples/ (Phase 5 case studies)
 * Reference configs: reference/yaml/*.yaml
 *
 * Each scenario preloads a set of decision primitive values that reproduce a
 * realistic interaction described in the case studies.  The playground reads
 * these values and feeds them to the decision engine — no new guardrail logic
 * is introduced here.
 */

export const SCENARIOS = [
  // ── Healthcare ──────────────────────────────────────────────────────────
  {
    id: 'healthcare',
    label: 'Healthcare',
    description: 'Clinical AI assistant — drug interaction query with sparse evidence base',
    color: '#06b6d4',
    industry: 'healthcare',
    configRef: 'reference/yaml/healthcare-config.yaml',
    caseStudyRef: 'docs/examples/case-study-01-clinical-decision-support.md',

    context: 'An oncologist queries the clinical AI assistant for a drug interaction assessment between rifampicin and lorlatinib before prescribing. Post-approval PK data is sparse.',

    primitives: {
      P1: 4,               // Critical — potential patient harm
      P2: 'low',           // Low confidence — sparse evidence base
      P3: 'partial',       // Partial capability — PK data indexed, dosage guidance excluded
      P4: 'authorized',    // Physician is authorized
      P5: 'none',          // No policy match
      P6: 'decision-support', // Physician makes the final decision
      P7: 'high',          // Patient safety impact is high
      P8: 2,               // Tier 2 — licensed prescriber
      P9: 'stale',         // Post-approval surveillance data is stale
      P10: 1,              // Low source reliability — small Phase 1 study only
    },

    expectedOutcome: {
      primaryPattern: 'constrained-completion',
      primaryComponent: 'RefusalCard (constrained)',
      note: 'Decision-support intent + LC → constrained completion with full disclosure. Safe-refusal would be wrong — the oncologist needs available evidence.',
    },
  },

  // ── Finance ──────────────────────────────────────────────────────────────
  {
    id: 'finance',
    label: 'Finance',
    description: 'Trading compliance AI — policy-blocked wire transfer',
    color: '#22c55e',
    industry: 'finance',
    configRef: 'reference/yaml/finance-config.yaml',
    caseStudyRef: 'docs/examples/case-study-02-financial-transaction-oversight.md',

    context: 'A trading operations agent attempts to execute a $250K international wire transfer to a new beneficiary. Tenant-level AML policy triggers.',

    primitives: {
      P1: 4,               // Critical — high-value irreversible transaction
      P2: 'high',          // High confidence about policy status
      P3: 'capable',       // Can execute, but policy blocks
      P4: 'authorized',    // Operator is authorized for the system
      P5: 'tenant',        // Tenant AML policy match — highest authority
      P6: 'action-execution', // Agent executes the wire
      P7: 'high',          // $250K business impact
      P8: 1,               // Standard operations user
      P9: 'fresh',         // Real-time transaction data
      P10: 3,              // High reliability — authoritative transaction data
    },

    expectedOutcome: {
      primaryPattern: 'policy-refusal',
      primaryComponent: 'RefusalCard (policy)',
      note: 'Tenant policy match → policy-refusal + emergency-escalation. Terminates all other rule evaluation. AML hold with supervisor escalation.',
    },
  },

  // ── Developer Copilot ────────────────────────────────────────────────────
  {
    id: 'developer-copilot',
    label: 'Developer Copilot',
    description: 'Code security advisor — conflicting vulnerability reports',
    color: '#6366f1',
    industry: 'developer',
    configRef: 'reference/yaml/developer-copilot-config.yaml',
    caseStudyRef: 'docs/examples/case-study-03-developer-copilot.md',

    context: "A developer asks whether a cryptographic library is safe to use in a key derivation context. Two sources make contradictory claims about its timing attack resistance.",

    primitives: {
      P1: 3,               // High — security vulnerability at scale
      P2: 'conflicting',   // Conflicting evidence — two contradictory sources
      P3: 'capable',       // Can answer security questions
      P4: 'authorized',    // Developer is authorized
      P5: 'none',          // No policy match
      P6: 'decision-support', // Developer makes the final architecture decision
      P7: 'high',          // Cryptographic vulnerability has high business impact
      P8: 1,               // Standard developer
      P9: 'fresh',         // Current source data
      P10: 2,              // Medium reliability — mixed source quality
    },

    expectedOutcome: {
      primaryPattern: 'safe-refusal',
      primaryComponent: 'RefusalCard (safe)',
      note: 'CE state at Risk=3 → safe-refusal is mandatory. CE ≠ LC: recommending based on one source while another contradicts it is forbidden. Reasoning-trace + source-citation surface the conflict.',
    },
  },

  // ── Industrial AI ────────────────────────────────────────────────────────
  {
    id: 'industrial-ai',
    label: 'Industrial AI',
    description: 'Predictive maintenance — unresolvable sensor conflict at critical risk',
    color: '#f97316',
    industry: 'industrial',
    configRef: 'reference/yaml/industrial-ai-config.yaml',
    caseStudyRef: 'docs/examples/case-study-04-industrial-process-control.md',

    context: "A predictive maintenance AI is monitoring a refinery heat exchanger. Two redundant sensors report contradictory readings: one shows safe temperatures, the other shows readings consistent with tube failure. The conflict has persisted for 45 minutes beyond the resolution window.",

    primitives: {
      P1: 4,               // Critical — potential equipment failure or safety incident
      P2: 'unresolvable',  // CE state persisted beyond 30-minute window
      P3: 'capable',       // System can normally control the process
      P4: 'authorized',    // Operator is authorized
      P5: 'none',          // No policy match
      P6: 'action-execution', // System must take automated control action
      P7: 'high',          // Production halt + safety risk
      P8: 1,               // Standard operator
      P9: 'stale',         // Sensor data cannot be trusted
      P10: 0,              // No reliable source — sensors conflict
    },

    expectedOutcome: {
      primaryPattern: 'emergency-escalation',
      primaryComponent: 'EscalationCard (emergency)',
      note: 'Unresolvable + Risk=4 → emergency escalation + abandon-recovery. Self-authorizing: bypasses standard approval flow. Conservative policy: treat threshold breach as real.',
    },
  },

  // ── Customer Support ─────────────────────────────────────────────────────
  {
    id: 'customer-support',
    label: 'Customer Support',
    description: 'Support AI — unresolvable billing dispute after retry exhaustion',
    color: '#a855f7',
    industry: 'customer-support',
    configRef: null,
    caseStudyRef: 'docs/examples/',

    context: "A customer support AI is handling a complex billing dispute. The AI has tried all available resolution paths and has exhausted retrieval — it cannot resolve the dispute without account access it does not have.",

    primitives: {
      P1: 2,               // Moderate — financial impact but recoverable
      P2: 'insufficient',  // Insufficient information — account history unavailable
      P3: 'partial',       // Can handle basic refund, not complex dispute
      P4: 'authorized',    // Agent is authorized
      P5: 'none',          // No policy match
      P6: 'action-execution', // Agent executing the resolution
      P7: 'medium',        // Medium business impact (CSAT risk)
      P8: 1,               // Standard support agent
      P9: 'fresh',         // Current session data
      P10: 2,              // Medium reliability — partial account data
    },

    expectedOutcome: {
      primaryPattern: 'human-handoff',
      primaryComponent: 'RefusalCard (handoff)',
      note: 'Insufficient information at action-execution intent → clarification-request + partial-completion. After exhaustion → human-handoff. Retry → redirect recovery path.',
    },
  },
];
