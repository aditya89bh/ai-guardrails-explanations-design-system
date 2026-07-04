/**
 * Guardrail Decision Engine — main evaluator
 * Implements: docs/decision-flows/pattern-selection-engine.md
 *             docs/decision-flows/pattern-precedence-engine.md
 *             docs/decision-flows/pattern-composition-engine.md
 *
 * Input: primitive values (P1–P10)
 * Output: complete engine result with rules, patterns, components, audit seed
 */

import { SELECTION_RULES } from './rules.js';
import { PRIMITIVE_DEFINITIONS, getPrimitiveLabel, getPrimitiveColor } from './primitives.js';
import { PATTERN_REGISTRY } from '../data/patterns.js';

// ── Pattern → Component mapping ───────────────────────────────────────────
const PATTERN_TO_COMPONENT = {
  'policy-refusal':              { component: 'RefusalCard', variant: 'policy', order: 1 },
  'safe-refusal':                { component: 'RefusalCard', variant: 'safe', order: 2 },
  'constrained-completion':      { component: 'RefusalCard', variant: 'constrained', order: 2 },
  'partial-completion':          { component: 'RefusalCard', variant: 'partial', order: 2 },
  'clarification-request':       { component: 'RefusalCard', variant: 'clarification', order: 2 },
  'human-handoff':               { component: 'RefusalCard', variant: 'handoff', order: 3 },
  'alternative-suggestion':      { component: 'RefusalCard', variant: 'alternative', order: 3 },
  'emergency-escalation':        { component: 'EscalationOverlay', variant: 'emergency', order: 0 },
  'role-escalation':             { component: 'EscalationCard', variant: 'role', order: 4 },
  'async-review-escalation':     { component: 'EscalationCard', variant: 'async', order: 4 },
  'blocking-warning':            { component: 'WarningBanner', variant: 'blocking', order: 1 },
  'inline-warning':              { component: 'WarningBanner', variant: 'inline', order: 2 },
  'ambient-warning':             { component: 'WarningBanner', variant: 'ambient', order: 3 },
  'scoped-permission':           { component: 'PermissionGate', variant: 'scoped', order: 1 },
  'one-time-permission':         { component: 'PermissionGate', variant: 'one-time', order: 1 },
  'confidence-disclosure':       { component: 'ConfidenceBadge', variant: 'detailed', order: 5 },
  'source-citation':             { component: 'ConfidenceBadge', variant: 'sources', order: 6 },
  'limitation-disclosure':       { component: 'ConfidenceBadge', variant: 'limitation', order: 6 },
  'reasoning-trace':             { component: 'ConfidenceBadge', variant: 'reasoning', order: 6 },
  'redirect-recovery':           { component: 'RecoveryPrompt', variant: 'redirect', order: 8 },
  'retry-recovery':              { component: 'RecoveryPrompt', variant: 'retry', order: 8 },
  'abandon-recovery':            { component: 'RecoveryPrompt', variant: 'abandon', order: 8 },
  'repair-recovery':             { component: 'RecoveryPrompt', variant: 'repair', order: 8 },
};

// ── Composition constraints ───────────────────────────────────────────────
const COMPOSITION_CONSTRAINTS = [
  { rule: 'Max one warning pattern', max: 1, category: 'warning', patterns: ['blocking-warning', 'inline-warning', 'ambient-warning', 'policy-warning', 'modal-warning'] },
  { rule: 'Max one refusal pattern', max: 1, category: 'refusal', patterns: ['policy-refusal', 'safe-refusal', 'constrained-completion', 'partial-completion', 'clarification-request', 'human-handoff', 'alternative-suggestion'] },
  { rule: 'Max one recovery pattern', max: 1, category: 'recovery', patterns: ['redirect-recovery', 'retry-recovery', 'abandon-recovery', 'repair-recovery', 'manual-override-recovery'] },
  { rule: 'emergency-escalation supersedes all other escalation', supersedes: ['role-escalation', 'async-review-escalation', 'system-escalation'], trigger: 'emergency-escalation' },
  { rule: 'policy-refusal supersedes safe-refusal', supersedes: ['safe-refusal'], trigger: 'policy-refusal' },
  { rule: 'blocking-warning supersedes inline-warning and ambient-warning', supersedes: ['inline-warning', 'ambient-warning'], trigger: 'blocking-warning' },
];

// ── Primary selections ─────────────────────────────────────────────────────
function resolvePrimarySelections(patterns) {
  const warningPatterns = ['policy-warning', 'blocking-warning', 'modal-warning', 'inline-warning', 'ambient-warning'];
  const refusalPatterns = ['policy-refusal', 'safe-refusal', 'constrained-completion', 'partial-completion', 'clarification-request', 'human-handoff'];
  const recoveryPatterns = ['redirect-recovery', 'retry-recovery', 'abandon-recovery', 'repair-recovery'];
  const escalationPatterns = ['emergency-escalation', 'role-escalation', 'async-review-escalation'];

  const set = new Set(patterns);
  return {
    warning: warningPatterns.find(p => set.has(p)) ?? null,
    refusal: refusalPatterns.find(p => set.has(p)) ?? null,
    recovery: recoveryPatterns.find(p => set.has(p)) ?? null,
    escalation: escalationPatterns.find(p => set.has(p)) ?? null,
  };
}

// ── Composition enforcement ────────────────────────────────────────────────
function applyComposition(rawPatterns) {
  let patterns = [...rawPatterns];
  const violations = [];
  const appliedConstraints = [];

  for (const constraint of COMPOSITION_CONSTRAINTS) {
    if (constraint.trigger && patterns.includes(constraint.trigger)) {
      const removed = patterns.filter(p => constraint.supersedes.includes(p));
      if (removed.length > 0) {
        patterns = patterns.filter(p => !constraint.supersedes.includes(p));
        appliedConstraints.push({
          rule: constraint.rule,
          removed,
          trigger: constraint.trigger,
        });
      }
    }

    if (constraint.max) {
      const present = patterns.filter(p => constraint.patterns.includes(p));
      if (present.length > constraint.max) {
        const keep = present[0];
        const remove = present.slice(1);
        patterns = patterns.filter(p => !remove.includes(p));
        violations.push({ rule: constraint.rule, kept: keep, removed: remove });
        appliedConstraints.push({ rule: constraint.rule, kept: keep, removed: remove });
      }
    }
  }

  return { patterns: [...new Set(patterns)], violations, appliedConstraints };
}

// ── Primitive evaluation enrichment ─────────────────────────────────────────
function enrichPrimitives(primitives) {
  const result = {};
  for (const [id, value] of Object.entries(primitives)) {
    const def = PRIMITIVE_DEFINITIONS[id];
    if (!def) continue;
    result[id] = {
      id,
      value,
      label: def.label,
      valueLabel: getPrimitiveLabel(id, value),
      color: getPrimitiveColor(id, value),
      description: def.type === 'integer'
        ? def.levels?.[value]?.description ?? ''
        : def.values?.find(v => v.value === value)?.description ?? '',
    };
  }
  return result;
}

// ── Component sequence ────────────────────────────────────────────────────
function buildComponentSequence(patterns, primitives) {
  const seen = new Set();
  const components = [];

  for (const patternId of patterns) {
    const mapping = PATTERN_TO_COMPONENT[patternId];
    if (!mapping || seen.has(mapping.component + mapping.variant)) continue;
    seen.add(mapping.component + mapping.variant);

    const patternDef = PATTERN_REGISTRY[patternId];
    components.push({
      component: mapping.component,
      variant: mapping.variant,
      patternId,
      order: mapping.order,
      severity: patternDef?.severity ?? 'advisory',
      category: patternDef?.category ?? 'unknown',
      description: patternDef?.name ?? patternId,
    });
  }

  return components.sort((a, b) => a.order - b.order);
}

// ── Main evaluate function ────────────────────────────────────────────────
export function evaluate(primitives) {
  const enriched = enrichPrimitives(primitives);
  const ruleResults = [];
  let rawPatterns = [];
  let terminated = false;

  for (const rule of SELECTION_RULES) {
    const met = !terminated && rule.test(primitives);
    if (met) {
      const { activatedPatterns, skippedPatterns, reason } = rule.onActivate(primitives);
      rawPatterns.push(...activatedPatterns);
      ruleResults.push({
        ruleId: rule.ruleId,
        label: rule.label,
        description: rule.description,
        docRef: rule.docRef,
        category: rule.category,
        priority: rule.priority,
        result: 'ACTIVATED',
        reason,
        activatedPatterns,
        skippedPatterns,
      });
      if (rule.terminatesEvaluation) terminated = true;
    } else {
      const { reason } = rule.onSkip(primitives);
      ruleResults.push({
        ruleId: rule.ruleId,
        label: rule.label,
        description: rule.description,
        docRef: rule.docRef,
        category: rule.category,
        priority: rule.priority,
        result: terminated ? 'NOT_EVALUATED' : 'SKIPPED',
        reason: terminated ? 'Prior rule terminated evaluation.' : reason,
        activatedPatterns: [],
        skippedPatterns: [],
      });
    }
  }

  const { patterns, violations, appliedConstraints } = applyComposition(rawPatterns);
  const selections = resolvePrimarySelections(patterns);
  const components = buildComponentSequence(patterns, primitives);

  const enrichedPatterns = patterns.map(id => ({
    id,
    ...(PATTERN_REGISTRY[id] ?? { name: id, category: 'unknown', severity: 'advisory' }),
  }));

  return {
    primitives: enriched,
    rules: ruleResults,
    rawPatterns: [...new Set(rawPatterns)],
    patterns: enrichedPatterns,
    selections,
    composition: { violations, appliedConstraints },
    components,
    meta: {
      rulesActivated: ruleResults.filter(r => r.result === 'ACTIVATED').length,
      rulesSkipped: ruleResults.filter(r => r.result === 'SKIPPED').length,
      rulesNotEvaluated: ruleResults.filter(r => r.result === 'NOT_EVALUATED').length,
      terminatedEarly: terminated,
      patternsCount: patterns.length,
      componentsCount: components.length,
    },
  };
}
