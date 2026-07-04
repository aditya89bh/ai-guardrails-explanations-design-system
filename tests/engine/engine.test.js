/**
 * Decision Engine Validation Tests
 *
 * Verifies that the evaluate() function in playground/engine/evaluator.js
 * produces correct pattern activation for known input combinations.
 *
 * Tests cover:
 *   - All 5 scenario outputs
 *   - Key rule conditions (R01, R02, R05, R07, R08)
 *   - Precedence resolution
 *   - Composition constraints
 *   - Default (no-guardrail) state
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { evaluate } from '../../playground/engine/evaluator.js';
import { DEFAULT_PRIMITIVES } from '../../playground/engine/primitives.js';
import { SCENARIOS } from '../../playground/data/scenarios.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hasPattern(result, patternId) {
  return result.patterns.some(p => p.id === patternId);
}

function hasComponent(result, componentId) {
  return result.components.some(c => c.component === componentId);
}

function isEarlyTermination(result) {
  return result.meta.rulesNotEvaluated > 0;
}

// ─── Default state ────────────────────────────────────────────────────────────

describe('Default primitives (no guardrail state)', () => {
  const result = evaluate(DEFAULT_PRIMITIVES);

  it('returns a valid result object', () => {
    assert.ok(result, 'result is defined');
    assert.ok(Array.isArray(result.patterns), 'patterns is array');
    assert.ok(Array.isArray(result.components), 'components is array');
    assert.ok(Array.isArray(result.rules), 'rules is array');
    assert.ok(result.meta, 'meta is defined');
  });

  it('has the expected number of rules (≥14)', () => {
    assert.ok(result.rules.length >= 14, `result must have at least 14 rules, got ${result.rules.length}`);
  });

  it('does not activate policy-refusal with default primitives', () => {
    assert.equal(hasPattern(result, 'policy-refusal'), false, 'policy-refusal must not be active at default state');
  });

  it('does not activate emergency-escalation with default primitives', () => {
    assert.equal(hasPattern(result, 'emergency-escalation'), false, 'emergency-escalation must not be active at default state');
  });

  it('does not early-terminate at default state', () => {
    assert.equal(isEarlyTermination(result), false, 'no early termination at default state');
  });
});

// ─── Rule R01: Policy Block (early termination) ───────────────────────────────

describe('R01 — Policy Block (tenant policy)', () => {
  const result = evaluate({
    ...DEFAULT_PRIMITIVES,
    P5: 'tenant',
    P1: 2,
  });

  it('activates policy-refusal', () => {
    assert.ok(hasPattern(result, 'policy-refusal'), 'policy-refusal must activate on P5=tenant');
  });

  it('causes early termination', () => {
    assert.ok(isEarlyTermination(result), 'remaining rules must be skipped after R01 terminates');
  });

  it('rulesActivated is 1 (only R01)', () => {
    assert.equal(result.meta.rulesActivated, 1, 'only R01 activates when policy block terminates');
  });
});

// ─── Rule R02: Unresolvable + Critical (early termination) ───────────────────

describe('R02 — Unresolvable + Critical Risk (early termination)', () => {
  const result = evaluate({
    ...DEFAULT_PRIMITIVES,
    P2: 'unresolvable',
    P1: 4,
  });

  it('activates emergency-escalation', () => {
    assert.ok(hasPattern(result, 'emergency-escalation'), 'emergency-escalation must activate at UR + Critical');
  });

  it('activates abandon-recovery', () => {
    assert.ok(hasPattern(result, 'abandon-recovery'), 'abandon-recovery must activate at UR + Critical');
  });

  it('causes early termination', () => {
    assert.ok(isEarlyTermination(result), 'remaining rules must be skipped after R02 terminates');
  });

  it('does NOT activate safe-refusal (emergency supersedes)', () => {
    assert.equal(hasPattern(result, 'safe-refusal'), false, 'safe-refusal must not co-exist with emergency-escalation at UR+Critical');
  });
});

// ─── Rule R07: LC + Decision-Support → constrained-completion ────────────────

describe('R07 — Low Confidence + Decision-Support → constrained-completion', () => {
  const result = evaluate({
    ...DEFAULT_PRIMITIVES,
    P2: 'low',
    P6: 'decision-support',
    P3: 'capable',
    P5: 'none',
  });

  it('activates constrained-completion', () => {
    assert.ok(hasPattern(result, 'constrained-completion'), 'constrained-completion must activate at LC + decision-support');
  });

  it('activates confidence-disclosure', () => {
    assert.ok(hasPattern(result, 'confidence-disclosure'), 'confidence-disclosure must accompany constrained-completion');
  });

  it('does NOT activate safe-refusal', () => {
    assert.equal(hasPattern(result, 'safe-refusal'), false, 'safe-refusal must not activate when constrained-completion is selected');
  });
});

// ─── Rule R08: LC + Action-Execution → safe-refusal ─────────────────────────

describe('R08 — Low Confidence + Action-Execution → safe-refusal', () => {
  const result = evaluate({
    ...DEFAULT_PRIMITIVES,
    P2: 'low',
    P6: 'action-execution',
    P5: 'none',
  });

  it('activates safe-refusal', () => {
    assert.ok(hasPattern(result, 'safe-refusal'), 'safe-refusal must activate at LC + action-execution');
  });

  it('does NOT activate constrained-completion', () => {
    assert.equal(hasPattern(result, 'constrained-completion'), false, 'constrained-completion is forbidden at LC + action-execution');
  });
});

// ─── Rule R05: Conflicting Evidence + High Risk ───────────────────────────────

describe('R05 — Conflicting Evidence + High Risk → safe-refusal', () => {
  const result = evaluate({
    ...DEFAULT_PRIMITIVES,
    P2: 'conflicting',
    P1: 3,
    P5: 'none',
  });

  it('activates safe-refusal', () => {
    assert.ok(hasPattern(result, 'safe-refusal'), 'safe-refusal must activate at CE + Risk>=3');
  });

  it('activates reasoning-trace', () => {
    assert.ok(hasPattern(result, 'reasoning-trace'), 'reasoning-trace must accompany safe-refusal in CE state');
  });

  it('does NOT activate constrained-completion', () => {
    assert.equal(hasPattern(result, 'constrained-completion'), false, 'constrained-completion is forbidden in CE state at Risk>=3');
  });
});

// ─── Composition: max one warning pattern ────────────────────────────────────

describe('Composition constraint — max 1 warning pattern', () => {
  // Trigger conditions that could activate multiple warning types
  const result = evaluate({
    ...DEFAULT_PRIMITIVES,
    P4: 'unauthorized',
    P1: 3,
    P5: 'none',
  });

  it('renders at most one warning component', () => {
    const warningComponents = result.components.filter(c =>
      ['WarningBanner'].includes(c.component)
    );
    assert.ok(warningComponents.length <= 1, `At most 1 WarningBanner may render, got ${warningComponents.length}`);
  });
});

// ─── Scenario: Healthcare ─────────────────────────────────────────────────────

describe('Healthcare scenario', () => {
  const scenario = SCENARIOS.find(s => s.id === 'healthcare');
  assert.ok(scenario, 'Healthcare scenario exists');
  const result = evaluate(scenario.primitives);

  it('activates constrained-completion', () => {
    assert.ok(hasPattern(result, 'constrained-completion'), 'Healthcare must produce constrained-completion');
  });

  it('activates confidence-disclosure', () => {
    assert.ok(hasPattern(result, 'confidence-disclosure'), 'Healthcare must disclose confidence');
  });

  it('does not early-terminate', () => {
    assert.equal(isEarlyTermination(result), false, 'Healthcare scenario must not early terminate');
  });
});

// ─── Scenario: Finance (AML) ──────────────────────────────────────────────────

describe('Finance scenario (AML policy block)', () => {
  const scenario = SCENARIOS.find(s => s.id === 'finance');
  assert.ok(scenario, 'Finance scenario exists');
  const result = evaluate(scenario.primitives);

  it('activates policy-refusal', () => {
    assert.ok(hasPattern(result, 'policy-refusal'), 'Finance must produce policy-refusal');
  });

  it('early-terminates (R01)', () => {
    assert.ok(isEarlyTermination(result), 'Finance policy block must early-terminate');
  });
});

// ─── Scenario: Developer Copilot ─────────────────────────────────────────────

describe('Developer Copilot scenario (conflicting evidence)', () => {
  const scenario = SCENARIOS.find(s => s.id === 'developer-copilot');
  assert.ok(scenario, 'Developer Copilot scenario exists');
  const result = evaluate(scenario.primitives);

  it('activates safe-refusal', () => {
    assert.ok(hasPattern(result, 'safe-refusal'), 'Developer Copilot must produce safe-refusal');
  });
});

// ─── Scenario: Industrial AI ──────────────────────────────────────────────────

describe('Industrial AI scenario (unresolvable + critical)', () => {
  const scenario = SCENARIOS.find(s => s.id === 'industrial-ai');
  assert.ok(scenario, 'Industrial AI scenario exists');
  const result = evaluate(scenario.primitives);

  it('activates emergency-escalation', () => {
    assert.ok(hasPattern(result, 'emergency-escalation'), 'Industrial AI must produce emergency-escalation');
  });

  it('activates abandon-recovery', () => {
    assert.ok(hasPattern(result, 'abandon-recovery'), 'Industrial AI must produce abandon-recovery');
  });

  it('early-terminates (R02)', () => {
    assert.ok(isEarlyTermination(result), 'Industrial AI must early-terminate at UR + Critical');
  });
});

// ─── Scenario: Customer Support ───────────────────────────────────────────────

describe('Customer Support scenario (insufficient information)', () => {
  const scenario = SCENARIOS.find(s => s.id === 'customer-support');
  assert.ok(scenario, 'Customer Support scenario exists');
  const result = evaluate(scenario.primitives);

  it('activates clarification-request or safe-refusal', () => {
    const hasClarification = hasPattern(result, 'clarification-request');
    const hasSafeRefusal = hasPattern(result, 'safe-refusal');
    assert.ok(hasClarification || hasSafeRefusal, 'Customer Support must activate clarification-request or safe-refusal');
  });
});

// ─── Meta: result structure integrity ────────────────────────────────────────

describe('Engine result structure integrity', () => {
  const result = evaluate(DEFAULT_PRIMITIVES);

  it('meta rule counts are non-negative integers', () => {
    assert.ok(result.meta.rulesActivated >= 0, 'rulesActivated must be non-negative');
    assert.ok(result.meta.rulesSkipped >= 0, 'rulesSkipped must be non-negative');
    assert.ok(result.meta.rulesNotEvaluated >= 0, 'rulesNotEvaluated must be non-negative');
  });

  it('all rules have a result field', () => {
    for (const rule of result.rules) {
      assert.ok(
        rule.result !== undefined,
        `Rule ${rule.ruleId ?? rule.id ?? '?'} missing result field`
      );
    }
  });

  it('patterns have required fields', () => {
    for (const pattern of result.patterns) {
      assert.ok(pattern.id, `Pattern missing id`);
      assert.ok(pattern.name, `Pattern ${pattern.id} missing name`);
      assert.ok(pattern.severity, `Pattern ${pattern.id} missing severity`);
    }
  });
});
