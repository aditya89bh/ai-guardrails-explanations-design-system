/**
 * Schema Bridge — connects the playground engine to the reference JSON schemas.
 *
 * This module does NOT duplicate schema logic.
 * It references the schema files in reference/json/ and maps their
 * structural contracts to the runtime objects used by the evaluator.
 *
 * Referenced schemas:
 *   reference/json/decision-engine.schema.json  — primitives, selection rules
 *   reference/json/patterns.schema.json          — pattern structure
 *   reference/json/component.schema.json         — component structure
 *   reference/json/guardrail-policy.schema.json  — policy configuration
 *
 * The engine is the authoritative runtime consumer of these schemas.
 * Each schema property maps to a field used in engine/evaluator.js.
 */

// ── Schema-aligned primitive type contracts ───────────────────────────────
// Corresponds to: decision-engine.schema.json § primitives
export const PRIMITIVE_SCHEMA_TYPES = {
  P1:  { jsonSchemaType: 'integer', refPath: '#/definitions/P1_Risk',           minimum: 0, maximum: 4 },
  P2:  { jsonSchemaType: 'string',  refPath: '#/definitions/P2_Confidence',     enum: ['high','moderate','low','conflicting','insufficient','stale','unresolvable'] },
  P3:  { jsonSchemaType: 'string',  refPath: '#/definitions/P3_Capability',     enum: ['capable','partial','incapable'] },
  P4:  { jsonSchemaType: 'string',  refPath: '#/definitions/P4_Permission',     enum: ['authorized','partial','unauthorized'] },
  P5:  { jsonSchemaType: 'string',  refPath: '#/definitions/P5_Policy',         enum: ['none','deployment','tenant'] },
  P6:  { jsonSchemaType: 'string',  refPath: '#/definitions/P6_Intent',         enum: ['decision-support','action-execution','content-generation','workflow-automation'] },
  P7:  { jsonSchemaType: 'string',  refPath: '#/definitions/P7_BusinessImpact', enum: ['low','medium','high'] },
  P8:  { jsonSchemaType: 'integer', refPath: '#/definitions/P8_Authority',      minimum: 1, maximum: 3 },
  P9:  { jsonSchemaType: 'string',  refPath: '#/definitions/P9_Freshness',      enum: ['fresh','stale'] },
  P10: { jsonSchemaType: 'integer', refPath: '#/definitions/P10_Reliability',   minimum: 0, maximum: 3 },
};

// ── Pattern schema property mapping ──────────────────────────────────────
// Corresponds to: patterns.schema.json § required fields
export const PATTERN_SCHEMA_FIELDS = {
  id:                   { type: 'string',  description: 'Unique pattern identifier (kebab-case)' },
  category:             { type: 'string',  enum: ['warning','explanation','permission','uncertainty','refusal','escalation','recovery'] },
  name:                 { type: 'string',  description: 'Human-readable pattern name' },
  severity:             { type: 'string',  enum: ['informational','advisory','caution','blocking','critical'] },
  specRef:              { type: 'string',  description: 'Relative path to the pattern specification' },
  auditRequired:        { type: 'boolean', description: 'Whether this pattern must generate an audit event' },
  compositionPrecedence:{ type: 'integer', description: 'Lower value = higher priority in composition resolution' },
};

// ── Component schema property mapping ─────────────────────────────────────
// Corresponds to: component.schema.json § required fields
export const COMPONENT_SCHEMA_FIELDS = {
  id:               { type: 'string',  description: 'Component identifier' },
  patternId:        { type: 'string',  description: 'Pattern this component implements' },
  displayName:      { type: 'string',  description: 'Human-readable name' },
  accessibilityRole:{ type: 'string',  enum: ['alert','alertdialog','status','region','dialog'] },
  ariaLive:         { type: 'string',  enum: ['assertive','polite','off'] },
  focusBehavior:    { type: 'string',  enum: ['none','focus-first-action','focus-deny','trap'] },
};

// ── Policy schema property mapping ────────────────────────────────────────
// Corresponds to: guardrail-policy.schema.json § required fields
export const POLICY_SCHEMA_FIELDS = {
  policyId:     { type: 'string',  description: 'Unique policy identifier' },
  version:      { type: 'string',  description: 'Semantic version of this policy document' },
  level:        { type: 'string',  enum: ['system','tenant','deployment'] },
  industry:     { type: 'string',  enum: ['general','healthcare','finance','developer','industrial','customer-support'] },
  riskThresholds:{
    informational: { type: 'integer', description: 'P1 level triggering informational pattern' },
    advisory:      { type: 'integer', description: 'P1 level triggering advisory pattern' },
    caution:       { type: 'integer', description: 'P1 level triggering caution pattern' },
    blocking:      { type: 'integer', description: 'P1 level triggering blocking pattern' },
    critical:      { type: 'integer', description: 'P1 level triggering critical pattern' },
  },
};

// ── Schema validation helper (runtime) ───────────────────────────────────
export function validatePrimitives(primitives) {
  const errors = [];
  for (const [id, schema] of Object.entries(PRIMITIVE_SCHEMA_TYPES)) {
    const value = primitives[id];
    if (value === undefined || value === null) {
      errors.push({ primitive: id, error: 'Required primitive is missing' });
      continue;
    }
    if (schema.jsonSchemaType === 'integer') {
      if (!Number.isInteger(value)) errors.push({ primitive: id, error: `Expected integer, got ${typeof value}` });
      if (schema.minimum !== undefined && value < schema.minimum) errors.push({ primitive: id, error: `Value ${value} below minimum ${schema.minimum}` });
      if (schema.maximum !== undefined && value > schema.maximum) errors.push({ primitive: id, error: `Value ${value} above maximum ${schema.maximum}` });
    }
    if (schema.jsonSchemaType === 'string') {
      if (schema.enum && !schema.enum.includes(value)) errors.push({ primitive: id, error: `Value "${value}" not in enum: ${schema.enum.join(', ')}` });
    }
  }
  return { valid: errors.length === 0, errors };
}

// ── Schema source registry ────────────────────────────────────────────────
// Maps runtime concepts to their authoritative schema source
export const SCHEMA_SOURCE_REGISTRY = {
  primitives:    { file: 'reference/json/decision-engine.schema.json', section: '§ primitives' },
  selectionRules:{ file: 'reference/json/decision-engine.schema.json', section: '§ selectionRules' },
  patterns:      { file: 'reference/json/patterns.schema.json',         section: '§ root' },
  components:    { file: 'reference/json/component.schema.json',        section: '§ root' },
  policy:        { file: 'reference/json/guardrail-policy.schema.json', section: '§ root' },
  auditRecord:   { file: 'reference/json/decision-engine.schema.json', section: '§ auditRecord' },
};
