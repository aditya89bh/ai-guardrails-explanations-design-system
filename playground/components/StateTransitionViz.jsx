'use client';

/**
 * StateTransitionViz — visualizes P2 Confidence state transitions.
 * Source: docs/decision-flows/state-transition-engine.md
 *         reference/config/confidence-mapping.md
 *
 * Shows the confidence state machine with the current state highlighted
 * and valid/invalid transitions marked.
 */

const STATES = [
  { id: 'high',         label: 'High Confidence',          color: '#22c55e', tier: 1 },
  { id: 'moderate',     label: 'Moderate Confidence',       color: '#86efac', tier: 1 },
  { id: 'low',          label: 'Low Confidence',            color: '#f59e0b', tier: 2 },
  { id: 'stale',        label: 'Stale Context',             color: '#a855f7', tier: 2 },
  { id: 'conflicting',  label: 'Conflicting Evidence (CE)', color: '#f97316', tier: 3 },
  { id: 'insufficient', label: 'Insufficient Information',  color: '#fb923c', tier: 3 },
  { id: 'unresolvable', label: 'Unresolvable (CE + time)',  color: '#ef4444', tier: 4 },
];

// Valid transitions (from → to) — documented in state-transition-engine.md
const VALID_TRANSITIONS = [
  { from: 'high',        to: 'moderate',     label: 'evidence degrades' },
  { from: 'high',        to: 'stale',        label: 'age threshold exceeded' },
  { from: 'moderate',    to: 'low',          label: 'score drops < 0.70' },
  { from: 'moderate',    to: 'stale',        label: 'age threshold exceeded' },
  { from: 'low',         to: 'moderate',     label: 'new evidence' },
  { from: 'low',         to: 'insufficient', label: 'required inputs absent' },
  { from: 'stale',       to: 'high',         label: 'context refreshed' },
  { from: 'stale',       to: 'conflicting',  label: 'stale source conflicts fresh' },
  { from: 'conflicting', to: 'low',          label: 'resolved within window' },
  { from: 'conflicting', to: 'unresolvable', label: '> resolution window (30 min)' },
  { from: 'insufficient','to': 'low',        label: 'inputs provided' },
];

// What each state prohibits
const STATE_PROHIBITIONS = {
  conflicting:  'Constrained-completion or any hedged recommendation',
  insufficient: 'Constrained-completion (II ≠ LC)',
  unresolvable: 'All output. No completion is produced.',
  low:          'Constrained-completion when P6 = action-execution',
};

export function StateTransitionViz({ currentState }) {
  const current = STATES.find(s => s.id === currentState) ?? STATES[0];

  const outgoingTransitions = VALID_TRANSITIONS.filter(t => t.from === currentState);
  const incomingTransitions = VALID_TRANSITIONS.filter(t => t.to === currentState);

  return (
    <div>
      <div className="pg-section-title">P2 Confidence State Machine</div>
      <p style={{ fontSize: 10, color: 'var(--pg-text-dim)', marginBottom: 12, lineHeight: 1.5 }}>
        Source:{' '}
        <code style={{ fontFamily: 'var(--guardrail-font-mono)', color: 'var(--pg-text-muted)' }}>
          docs/decision-flows/state-transition-engine.md
        </code>
      </p>

      {/* Current state highlight */}
      <div style={{
        padding: 12,
        borderRadius: 'var(--guardrail-radius-md)',
        background: `${current.color}12`,
        border: `2px solid ${current.color}44`,
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: current.color, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: current.color }}>
            Current: {current.label}
          </span>
        </div>
        {STATE_PROHIBITIONS[currentState] && (
          <p style={{ fontSize: 11, color: '#ef4444', margin: 0 }}>
            ⛔ Prohibited: {STATE_PROHIBITIONS[currentState]}
          </p>
        )}
      </div>

      {/* All states */}
      <div className="pg-section-title">All states</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
        {STATES.map(state => {
          const isCurrent = state.id === currentState;
          return (
            <div key={state.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 8px',
              borderRadius: 'var(--guardrail-radius-sm)',
              background: isCurrent ? `${state.color}12` : 'transparent',
              border: isCurrent ? `1px solid ${state.color}33` : '1px solid transparent',
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: state.color,
                flexShrink: 0,
                opacity: isCurrent ? 1 : 0.5,
              }} />
              <span style={{
                fontSize: 11,
                fontWeight: isCurrent ? 700 : 400,
                color: isCurrent ? state.color : 'var(--pg-text-muted)',
              }}>
                {state.label}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--pg-text-dim)', fontFamily: 'var(--guardrail-font-mono)' }}>
                T{state.tier}
              </span>
            </div>
          );
        })}
      </div>

      {/* Transitions from current state */}
      {outgoingTransitions.length > 0 && (
        <>
          <div className="pg-section-title">Transitions from current state</div>
          {outgoingTransitions.map((t, i) => {
            const target = STATES.find(s => s.id === t.to);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 11 }}>
                <span style={{ color: current.color, fontWeight: 700 }}>{current.label}</span>
                <span style={{ color: 'var(--pg-text-dim)' }}>→</span>
                <span style={{ color: target?.color ?? '#6b7280' }}>{target?.label ?? t.to}</span>
                <span style={{ color: 'var(--pg-text-dim)', fontSize: 10, marginLeft: 4 }}>
                  ({t.label})
                </span>
              </div>
            );
          })}
        </>
      )}

      {/* Transitions into current state */}
      {incomingTransitions.length > 0 && (
        <>
          <div className="pg-section-title" style={{ marginTop: 12 }}>Transitions into current state</div>
          {incomingTransitions.map((t, i) => {
            const source = STATES.find(s => s.id === t.from);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 11 }}>
                <span style={{ color: source?.color ?? '#6b7280' }}>{source?.label ?? t.from}</span>
                <span style={{ color: 'var(--pg-text-dim)' }}>→</span>
                <span style={{ color: current.color, fontWeight: 700 }}>{current.label}</span>
                <span style={{ color: 'var(--pg-text-dim)', fontSize: 10, marginLeft: 4 }}>
                  ({t.label})
                </span>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
