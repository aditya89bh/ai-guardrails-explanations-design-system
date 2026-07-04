/**
 * Decision Primitive definitions
 * Source: docs/decision-flows/decision-primitives.md
 * Validates against: reference/json/decision-engine.schema.json § primitives
 */

export const PRIMITIVE_DEFINITIONS = {
  P1: {
    id: 'P1',
    label: 'Risk',
    description: 'Consequence severity if AI output is incorrect or action fails',
    docRef: 'docs/decision-flows/decision-primitives.md § P1',
    type: 'integer',
    min: 0,
    max: 4,
    default: 2,
    levels: {
      0: { label: 'None', color: '#6b7280', description: 'No meaningful risk. Informational output only.' },
      1: { label: 'Low', color: '#22c55e', description: 'Reversible, low-stakes. Easily correctable.' },
      2: { label: 'Moderate', color: '#f59e0b', description: 'Recoverable. Meaningful consequences; recovery path exists.' },
      3: { label: 'High', color: '#f97316', description: 'Significant impact. Potentially irreversible. Regulatory exposure possible.' },
      4: { label: 'Critical', color: '#ef4444', description: 'Safety, security, or compliance incident risk. Harm at scale.' },
    },
  },

  P2: {
    id: 'P2',
    label: 'Confidence',
    description: "AI's epistemic state about the accuracy and completeness of its output",
    docRef: 'docs/decision-flows/decision-primitives.md § P2',
    type: 'enum',
    default: 'moderate',
    values: [
      { value: 'high', label: 'High Confidence', color: '#22c55e', description: 'Score ≥ 0.90. Output is well-supported. No disclosure required.' },
      { value: 'moderate', label: 'Moderate Confidence', color: '#86efac', description: 'Score 0.70–0.89. Some limitations. Surface disclosure optional.' },
      { value: 'low', label: 'Low Confidence', color: '#f59e0b', description: 'Score 0.50–0.69. Significant uncertainty. Detailed disclosure required.' },
      { value: 'conflicting', label: 'Conflicting Evidence', color: '#f97316', description: 'Source conflict detected. Not a score — a structural issue. Safe-refusal at Risk≥3.' },
      { value: 'insufficient', label: 'Insufficient Information', color: '#fb923c', description: 'Required inputs absent. Clarification-request activates (not constrained-completion).' },
      { value: 'stale', label: 'Stale Context', color: '#a855f7', description: 'Data age exceeds freshness threshold. Compounds with other confidence states.' },
      { value: 'unresolvable', label: 'Unresolvable', color: '#ef4444', description: 'CE state sustained beyond window. No output possible. Emergency or abandon.' },
    ],
  },

  P3: {
    id: 'P3',
    label: 'Capability',
    description: "Whether the AI system can complete the requested action",
    docRef: 'docs/decision-flows/decision-primitives.md § P3',
    type: 'enum',
    default: 'capable',
    values: [
      { value: 'capable', label: 'Capable', color: '#22c55e', description: 'AI can fully complete the requested action.' },
      { value: 'partial', label: 'Partial', color: '#f59e0b', description: 'AI can complete part of the request. Constrained output is appropriate.' },
      { value: 'incapable', label: 'Incapable', color: '#ef4444', description: 'AI cannot complete this action type at all. Hard capability boundary.' },
    ],
  },

  P4: {
    id: 'P4',
    label: 'Permission',
    description: "Whether the requesting user or system is authorized for the requested action",
    docRef: 'docs/decision-flows/decision-primitives.md § P4',
    type: 'enum',
    default: 'authorized',
    values: [
      { value: 'authorized', label: 'Authorized', color: '#22c55e', description: 'User is fully authorized. No permission gate activates.' },
      { value: 'partial', label: 'Partial', color: '#f59e0b', description: 'Authorized for a subset. Scoped-permission gate activates.' },
      { value: 'unauthorized', label: 'Unauthorized', color: '#ef4444', description: 'No authorization. Blocking-warning and permission gate required. Passive dismissal = denial.' },
    ],
  },

  P5: {
    id: 'P5',
    label: 'Policy',
    description: "Whether a configured policy rule matches the current interaction",
    docRef: 'docs/decision-flows/decision-primitives.md § P5',
    type: 'enum',
    default: 'none',
    values: [
      { value: 'none', label: 'No Policy Match', color: '#6b7280', description: 'No policy rule applies. Pattern selection proceeds normally.' },
      { value: 'deployment', label: 'Deployment Policy', color: '#f97316', description: 'A deployment-level rule matches. policy-refusal activates.' },
      { value: 'tenant', label: 'Tenant Policy', color: '#ef4444', description: 'A tenant-level rule matches. Highest authority. policy-refusal activates, terminates other selection.' },
    ],
  },

  P6: {
    id: 'P6',
    label: 'Intent',
    description: "The category of action the user is requesting",
    docRef: 'docs/decision-flows/decision-primitives.md § P6',
    type: 'enum',
    default: 'decision-support',
    values: [
      { value: 'decision-support', label: 'Decision Support', color: '#6366f1', description: 'User wants information or recommendations to inform their own decision. Constrained output is acceptable under LC.' },
      { value: 'action-execution', label: 'Action Execution', color: '#f97316', description: 'AI executes an action (transaction, command, system change). Safe-refusal required under LC.' },
      { value: 'content-generation', label: 'Content Generation', color: '#8b5cf6', description: 'AI generates content (document, email, code). Intermediate risk profile.' },
      { value: 'workflow-automation', label: 'Workflow Automation', color: '#ec4899', description: 'AI executes a multi-step automated workflow. Highest autonomy risk.' },
    ],
  },

  P7: {
    id: 'P7',
    label: 'Business Impact',
    description: "Organizational consequence of the AI action if it fails or is incorrect",
    docRef: 'docs/decision-flows/decision-primitives.md § P7',
    type: 'enum',
    default: 'medium',
    values: [
      { value: 'low', label: 'Low Impact', color: '#6b7280', description: 'Minimal business consequence. No amplification of other patterns.' },
      { value: 'medium', label: 'Medium Impact', color: '#f59e0b', description: 'Meaningful business consequence. Moderate amplification.' },
      { value: 'high', label: 'High Impact', color: '#ef4444', description: 'Significant organizational consequence. Amplifies limitation-disclosure at Risk≥2.' },
    ],
  },

  P8: {
    id: 'P8',
    label: 'Authority',
    description: "User's authorization tier for consequential decisions",
    docRef: 'docs/decision-flows/decision-primitives.md § P8',
    type: 'integer',
    min: 1,
    max: 3,
    default: 1,
    levels: {
      1: { label: 'Tier 1 — Standard', color: '#6b7280', description: 'Standard user. No override authority. Cannot self-authorize consequential actions.' },
      2: { label: 'Tier 2 — Power User', color: '#f59e0b', description: 'Supervisor / licensed professional. Can approve within authority ceiling.' },
      3: { label: 'Tier 3 — Admin', color: '#22c55e', description: 'Admin / executive. Can authorize policy exceptions. Can reset AI advisory modes.' },
    },
  },

  P9: {
    id: 'P9',
    label: 'Context Freshness',
    description: "Whether the AI's knowledge and data are current for this query",
    docRef: 'docs/decision-flows/decision-primitives.md § P9',
    type: 'enum',
    default: 'fresh',
    values: [
      { value: 'fresh', label: 'Fresh', color: '#22c55e', description: 'Data is within the configured freshness threshold. No staleness disclosure.' },
      { value: 'stale', label: 'Stale', color: '#a855f7', description: 'Data age exceeds staleThresholdDays. Staleness disclosure required. Compounds with P2.' },
    ],
  },

  P10: {
    id: 'P10',
    label: 'Source Reliability',
    description: "Assessed credibility of the AI's information sources",
    docRef: 'docs/decision-flows/decision-primitives.md § P10',
    type: 'integer',
    min: 0,
    max: 3,
    default: 2,
    levels: {
      0: { label: 'None (0)', color: '#ef4444', description: 'No reliable source. Source citation mandatory. Safe-refusal likely.' },
      1: { label: 'Low (1)', color: '#f97316', description: 'Low reliability. Source citation required at Risk≥2.' },
      2: { label: 'Medium (2)', color: '#f59e0b', description: 'Medium reliability. Source citation at claim-level for Risk≥3.' },
      3: { label: 'High (3)', color: '#22c55e', description: 'High reliability. Well-established, authoritative sources.' },
    },
  },
};

export const DEFAULT_PRIMITIVES = {
  P1: 2,
  P2: 'moderate',
  P3: 'capable',
  P4: 'authorized',
  P5: 'none',
  P6: 'decision-support',
  P7: 'medium',
  P8: 1,
  P9: 'fresh',
  P10: 2,
};

export function getPrimitiveLabel(id, value) {
  const def = PRIMITIVE_DEFINITIONS[id];
  if (!def) return String(value);
  if (def.type === 'integer') {
    return def.levels?.[value]?.label ?? String(value);
  }
  return def.values?.find(v => v.value === value)?.label ?? String(value);
}

export function getPrimitiveColor(id, value) {
  const def = PRIMITIVE_DEFINITIONS[id];
  if (!def) return '#6b7280';
  if (def.type === 'integer') {
    return def.levels?.[value]?.color ?? '#6b7280';
  }
  return def.values?.find(v => v.value === value)?.color ?? '#6b7280';
}
