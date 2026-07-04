'use client';

import { CATEGORY_COLORS, SEVERITY_COLORS } from '../data/patterns.js';

/**
 * CompositionViz — visualizes the pattern composition layer.
 * Shows the raw pattern set → composition constraints → resolved patterns.
 * Source: docs/decision-flows/pattern-composition-engine.md
 */
export function CompositionViz({ result }) {
  const { rawPatterns, patterns, composition } = result;

  // Patterns that were removed by composition
  const removedByComposition = rawPatterns.filter(id => !patterns.find(p => p.id === id));
  const retained = patterns;

  return (
    <div>
      <div className="pg-section-title">Pattern Composition Layer</div>
      <p style={{ fontSize: 10, color: 'var(--pg-text-dim)', marginBottom: 12, lineHeight: 1.5 }}>
        Source:{' '}
        <code style={{ fontFamily: 'var(--guardrail-font-mono)', color: 'var(--pg-text-muted)' }}>
          docs/decision-flows/pattern-composition-engine.md
        </code>
      </p>

      {/* Flow: Raw → Composition → Resolved */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 16 }}>
        {/* Raw patterns */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pg-text-dim)', marginBottom: 6 }}>
            Raw selection ({rawPatterns.length})
          </div>
          {rawPatterns.length === 0 ? (
            <span style={{ fontSize: 10, color: 'var(--pg-text-dim)' }}>—</span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {rawPatterns.map(id => (
                <span key={id} style={{
                  fontSize: 10,
                  fontFamily: 'var(--guardrail-font-mono)',
                  color: removedByComposition.includes(id) ? 'var(--pg-red)' : 'var(--pg-text)',
                  textDecoration: removedByComposition.includes(id) ? 'line-through' : 'none',
                  opacity: removedByComposition.includes(id) ? 0.6 : 1,
                }}>
                  {id}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Arrow */}
        <div style={{ color: 'var(--pg-text-dim)', fontSize: 16, marginTop: 20, flexShrink: 0 }}>→</div>

        {/* Resolved patterns */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--pg-green)', marginBottom: 6 }}>
            Resolved ({retained.length})
          </div>
          {retained.length === 0 ? (
            <span style={{ fontSize: 10, color: 'var(--pg-text-dim)' }}>—</span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {retained.map(p => (
                <span key={p.id} style={{
                  fontSize: 10,
                  fontFamily: 'var(--guardrail-font-mono)',
                  color: 'var(--pg-green)',
                }}>
                  {p.id}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Applied constraints detail */}
      <div className="pg-section-title">Applied constraints</div>
      {composition.appliedConstraints.length === 0 ? (
        <p style={{ fontSize: 11, color: 'var(--pg-text-dim)', marginBottom: 8 }}>
          No constraints applied — all selected patterns are compatible.
        </p>
      ) : (
        composition.appliedConstraints.map((c, i) => (
          <div key={i} style={{
            padding: '7px 9px',
            borderRadius: 'var(--guardrail-radius-sm)',
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.2)',
            marginBottom: 5,
            fontSize: 11,
          }}>
            <div style={{ fontWeight: 600, color: '#f59e0b', marginBottom: 2 }}>{c.rule}</div>
            {c.trigger && <div style={{ color: 'var(--pg-text-muted)', fontFamily: 'var(--guardrail-font-mono)', fontSize: 10 }}>trigger: {c.trigger}</div>}
            {c.removed?.length > 0 && (
              <div style={{ color: 'var(--pg-text-muted)', marginTop: 2, fontSize: 10 }}>
                suppressed: {c.removed.join(', ')}
              </div>
            )}
          </div>
        ))
      )}

      {/* Precedence layer */}
      <div className="pg-section-title" style={{ marginTop: 12 }}>Precedence order (default)</div>
      <p style={{ fontSize: 10, color: 'var(--pg-text-dim)', marginBottom: 6, lineHeight: 1.4 }}>
        From{' '}
        <code style={{ fontFamily: 'var(--guardrail-font-mono)', color: 'var(--pg-text-muted)' }}>
          reference/config/default-policy.md § precedence
        </code>
      </p>
      {PRECEDENCE_ORDER.map((tier, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: '1px solid var(--pg-border-subtle)', fontSize: 11 }}>
          <span style={{ width: 18, height: 18, borderRadius: 4, background: 'var(--pg-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--pg-text-muted)', flexShrink: 0 }}>
            {i + 1}
          </span>
          <span style={{ color: 'var(--pg-text-muted)' }}>{tier.label}</span>
          <span style={{ marginLeft: 'auto', fontSize: 9, color: CATEGORY_COLORS[tier.category] ?? 'var(--pg-text-dim)' }}>
            {tier.category}
          </span>
        </div>
      ))}
    </div>
  );
}

const PRECEDENCE_ORDER = [
  { label: 'emergency-escalation',   category: 'escalation' },
  { label: 'policy-refusal',         category: 'refusal' },
  { label: 'blocking-warning',       category: 'warning' },
  { label: 'role-escalation',        category: 'escalation' },
  { label: 'safe-refusal',           category: 'refusal' },
  { label: 'permission-gate',        category: 'permission' },
  { label: 'confidence-disclosure',  category: 'explanation' },
  { label: 'constrained-completion', category: 'refusal' },
  { label: 'inline-warning',         category: 'warning' },
  { label: 'ambient-warning',        category: 'warning' },
  { label: 'recovery-prompts',       category: 'recovery' },
  { label: 'source-citation',        category: 'explanation' },
];
