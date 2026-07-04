/**
 * Config Bridge — connects the playground engine to reference YAML configurations.
 *
 * This module does NOT duplicate YAML config logic.
 * It provides JS runtime representations of the configurations defined in:
 *   reference/yaml/healthcare-config.yaml
 *   reference/yaml/finance-config.yaml
 *   reference/yaml/developer-copilot-config.yaml
 *   reference/yaml/industrial-ai-config.yaml
 *
 * And the default values from:
 *   reference/config/default-policy.md
 *   reference/config/risk-thresholds.md
 *   reference/config/confidence-mapping.md
 *
 * These values are consumed by the evaluator to show how deployment-specific
 * calibration affects the engine's behavior.
 */

// ── Default policy ── reference/config/default-policy.md ─────────────────
export const DEFAULT_POLICY = {
  policyId: 'default-system-policy',
  version: '1.0.0',
  level: 'system',
  industry: 'general',

  riskThresholds: {
    informational: 0,
    advisory:      1,
    caution:       2,
    blocking:      3,
    critical:      4,
  },

  confidenceThresholds: {
    high:         { min: 0.90 },
    moderate:     { min: 0.70 },
    low:          { min: 0.50 },
  },

  escalation: {
    roleEscalationSlaMinutes:        30,
    asyncReviewSlaHours:              4,
    emergencyEscalationSlaMinutes:    0, // self-authorizing
  },

  auditRequirements: {
    allPatterns:    false,
    blockingEvents: true,
    criticalEvents: true,
    permissionGrants: true,
    permissionDenials: true,
    escalations:    true,
  },
};

// ── Healthcare ── reference/yaml/healthcare-config.yaml ──────────────────
export const HEALTHCARE_CONFIG = {
  policyId: 'healthcare-clinical-ai',
  version: '1.0.0',
  level: 'deployment',
  industry: 'healthcare',

  riskThresholds: {
    // Risk calibrated upward — conservative for patient safety
    informational: 0,
    advisory:      0, // All Risk≥0 surfaces advisory
    caution:       1,
    blocking:      3,
    critical:      4,
  },

  confidenceThresholds: {
    // Tighter confidence windows for clinical use
    high:     { min: 0.95 }, // Raised from 0.90
    moderate: { min: 0.80 }, // Raised from 0.70
    low:      { min: 0.50 },
  },

  policyRules: [
    { id: 'hc-rule-01', description: 'Require confidence-disclosure for all clinical recommendations regardless of confidence state' },
    { id: 'hc-rule-02', description: 'Require source-citation for all pharmacological claims' },
    { id: 'hc-rule-03', description: 'staleness threshold: 18 months for clinical guidelines' },
    { id: 'hc-rule-04', description: 'Escalate to supervising physician for any P1≥3 action-execution request' },
  ],

  escalation: {
    roleEscalationSlaMinutes:        5,   // 5-minute SLA for clinical
    emergencyEscalationSlaMinutes:   0,
  },

  auditRequirements: {
    allPatterns:       true,
    blockingEvents:    true,
    criticalEvents:    true,
    permissionGrants:  true,
    permissionDenials: true,
    escalations:       true,
    immutableLog:      true,
    regulatoryFramework: ['HIPAA', 'FDA-21CFR-Part-11'],
  },
};

// ── Finance ── reference/yaml/finance-config.yaml ─────────────────────────
export const FINANCE_CONFIG = {
  policyId: 'finance-trading-aml',
  version: '1.0.0',
  level: 'tenant',
  industry: 'finance',

  riskThresholds: {
    informational: 0,
    advisory:      1,
    caution:       2,
    blocking:      3,
    critical:      4,
  },

  policyRules: [
    { id: 'fin-rule-01', description: 'AML hold: new international beneficiary + amount ≥ $10,000 → policy-refusal + emergency-escalation' },
    { id: 'fin-rule-02', description: 'Wire transfer ≥ $50,000 → role-escalation (supervisor approval required)' },
    { id: 'fin-rule-03', description: 'Require one-time-permission for all wire transfers' },
    { id: 'fin-rule-04', description: 'All transaction pattern activations require immutable audit log entry' },
  ],

  escalation: {
    roleEscalationSlaMinutes:    30,
    asyncReviewSlaHours:          2,
    emergencyEscalationSlaMinutes: 0,
  },

  auditRequirements: {
    allPatterns:       true,
    blockingEvents:    true,
    criticalEvents:    true,
    permissionGrants:  true,
    permissionDenials: true,
    escalations:       true,
    immutableLog:      true,
    regulatoryFramework: ['SOX', 'PCI-DSS', 'BSA-AML'],
  },
};

// ── Developer Copilot ── reference/yaml/developer-copilot-config.yaml ─────
export const DEVELOPER_COPILOT_CONFIG = {
  policyId: 'developer-copilot-security',
  version: '1.0.0',
  level: 'deployment',
  industry: 'developer',

  riskThresholds: {
    // Security-focused calibration
    informational: 0,
    advisory:      1,
    caution:       2,
    blocking:      3,
    critical:      4,
  },

  policyRules: [
    { id: 'dev-rule-01', description: 'Conflicting security evidence → always safe-refusal regardless of P1 level' },
    { id: 'dev-rule-02', description: 'Source citation required for all cryptographic and security recommendations' },
    { id: 'dev-rule-03', description: 'reasoning-trace required when conflicting-evidence-state is active' },
    { id: 'dev-rule-04', description: 'staleness threshold: 6 months for CVE and vulnerability data' },
  ],

  escalation: {
    roleEscalationSlaMinutes:    60,
    asyncReviewSlaHours:          8,
  },

  auditRequirements: {
    blockingEvents: true,
    criticalEvents: true,
    escalations:    true,
  },
};

// ── Industrial AI ── reference/yaml/industrial-ai-config.yaml ─────────────
export const INDUSTRIAL_AI_CONFIG = {
  policyId: 'industrial-predictive-maintenance',
  version: '1.0.0',
  level: 'deployment',
  industry: 'industrial',

  riskThresholds: {
    informational: 0,
    advisory:      1,
    caution:       2,
    blocking:      3,
    critical:      4, // Unresolvable sensor conflict → Critical
  },

  policyRules: [
    { id: 'ind-rule-01', description: 'Conflicting sensor readings for safety-critical parameters → unresolvable after 30 minutes' },
    { id: 'ind-rule-02', description: 'Unresolvable + action-execution → emergency-escalation + safe-shutdown + abandon-recovery' },
    { id: 'ind-rule-03', description: 'Conservative policy: treat threshold breach as real (no probabilistic hedging)' },
    { id: 'ind-rule-04', description: 'All safety-critical pattern events → immutable safety log + HSE notification' },
  ],

  escalation: {
    roleEscalationSlaMinutes:     0, // Immediate for safety
    emergencyEscalationSlaMinutes: 0,
  },

  auditRequirements: {
    allPatterns:       true,
    blockingEvents:    true,
    criticalEvents:    true,
    escalations:       true,
    immutableLog:      true,
    regulatoryFramework: ['IEC-61511', 'ISO-13849'],
  },
};

// ── Config selector ────────────────────────────────────────────────────────
export const INDUSTRY_CONFIGS = {
  healthcare:       HEALTHCARE_CONFIG,
  finance:          FINANCE_CONFIG,
  developer:        DEVELOPER_COPILOT_CONFIG,
  industrial:       INDUSTRIAL_AI_CONFIG,
  'customer-support': DEFAULT_POLICY,
  general:          DEFAULT_POLICY,
};

export function getConfig(industry) {
  return INDUSTRY_CONFIGS[industry] ?? DEFAULT_POLICY;
}

// ── Risk threshold label helpers ───────────────────────────────────────────
export function getSeverityForRisk(riskLevel, config) {
  const thresholds = config?.riskThresholds ?? DEFAULT_POLICY.riskThresholds;
  if (riskLevel >= thresholds.critical)      return 'critical';
  if (riskLevel >= thresholds.blocking)      return 'blocking';
  if (riskLevel >= thresholds.caution)       return 'caution';
  if (riskLevel >= thresholds.advisory)      return 'advisory';
  return 'informational';
}
