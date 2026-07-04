'use client';

import { SEVERITY_COLORS, CATEGORY_COLORS } from '../data/patterns.js';

/**
 * PipelineFlow — horizontal visualization of the full decision pipeline.
 * Shows the path: Primitives → Engine → Pattern Selection → Components → Audit
 *
 * Used in the engine panel to improve visualization (commit 15).
 */
export function PipelineFlow({ result }) {
  const steps = [
    {
      id: 'primitives',
      label: 'Primitives',
      sublabel: 'P1–P10',
      status: 'complete',
      color: '#6366f1',
      detail: `10 inputs evaluated`,
    },
    {
      id: 'rules',
      label: 'Rule Evaluation',
      sublabel: `${result.meta.rulesActivated} activated`,
      status: result.meta.rulesActivated > 0 ? 'active' : 'idle',
      color: '#06b6d4',
      detail: `${result.rules.length} rules · ${result.meta.terminatedEarly ? 'early termination' : 'full evaluation'}`,
    },
    {
      id: 'patterns',
      label: 'Pattern Selection',
      sublabel: `${result.patterns.length} patterns`,
      status: result.patterns.length > 0 ? 'active' : 'idle',
      color: '#f59e0b',
      detail: result.patterns.map(p => p.id).join(', ') || 'none',
    },
    {
      id: 'composition',
      label: 'Composition',
      sublabel: result.composition.appliedConstraints.length > 0
        ? `${result.composition.appliedConstraints.length} constraints`
        : 'no constraints',
      status: result.composition.appliedConstraints.length > 0 ? 'active' : 'idle',
      color: '#8b5cf6',
      detail: 'Precedence + mutual exclusion applied',
    },
    {
      id: 'components',
      label: 'Components',
      sublabel: `${result.components.length} rendered`,
      status: result.components.length > 0 ? 'active' : 'idle',
      color: '#22c55e',
      detail: result.components.map(c => `${c.component}/${c.variant}`).join(' · ') || 'none',
    },
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 0,
      padding: '12px 0',
      overflowX: 'auto',
      minWidth: 0,
    }}>
      {steps.map((step, i) => (
        <div key={step.id} style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
          <PipelineStep step={step} />
          {i < steps.length - 1 && (
            <PipelineArrow active={step.status === 'active'} />
          )}
        </div>
      ))}
    </div>
  );
}

function PipelineStep({ step }) {
  const isActive = step.status === 'active';
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: 80,
      flex: 1,
    }}>
      <div style={{
        width: 36, height: 36,
        borderRadius: '50%',
        background: isActive ? `${step.color}20` : 'var(--pg-border)',
        border: `2px solid ${isActive ? step.color : 'var(--pg-border)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
        transition: 'all 150ms ease',
      }}>
        <span style={{ fontSize: 14 }}>{STEP_ICONS[step.id]}</span>
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: isActive ? step.color : 'var(--pg-text-dim)', textAlign: 'center', lineHeight: 1.2 }}>
        {step.label}
      </div>
      <div style={{ fontSize: 9, color: 'var(--pg-text-dim)', textAlign: 'center', marginTop: 2 }}>
        {step.sublabel}
      </div>
    </div>
  );
}

function PipelineArrow({ active }) {
  return (
    <div style={{
      flex: 'none',
      width: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: active ? 'var(--pg-text-dim)' : 'var(--pg-border)',
      fontSize: 12,
      marginBottom: 18,
    }}>
      →
    </div>
  );
}

const STEP_ICONS = {
  primitives:  '⚙',
  rules:       '⚖',
  patterns:    '◈',
  composition: '⊕',
  components:  '◻',
};
