'use client';

/**
 * RecoveryPrompt — playground adaptation
 * Spec: components/recovery/component-spec.md
 * Full implementation: reference/react/RecoveryPrompt.jsx
 */

export function RecoveryPrompt({ variant = 'redirect', onAuditEvent }) {
  const config = RECOVERY_CONFIG[variant] ?? RECOVERY_CONFIG.redirect;

  return (
    <div
      style={{
        backgroundColor: 'rgba(34,197,94,0.05)',
        border: '1px solid rgba(34,197,94,0.2)',
        borderRadius: 'var(--guardrail-radius-md)',
        padding: 'var(--guardrail-space-md)',
        color: '#e2e8f0',
      }}
      data-guardrail-pattern={`${variant}-recovery`}
      role={variant === 'abandon' ? 'alertdialog' : 'status'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 14 }}>{config.icon}</span>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#22c55e' }}>
          {config.label}
        </span>
      </div>

      <p style={{ fontSize: 13, margin: '0 0 10px', lineHeight: 1.5, color: '#cbd5e1' }}>
        {config.message}
      </p>

      {/* Recovery actions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {config.actions.map((action, i) => (
          <button
            key={i}
            style={{
              height: 32,
              padding: '0 14px',
              borderRadius: 'var(--guardrail-radius-sm)',
              border: i === 0 ? '1px solid rgba(34,197,94,0.4)' : '1px solid var(--pg-border)',
              background: i === 0 ? 'rgba(34,197,94,0.1)' : 'transparent',
              color: i === 0 ? '#22c55e' : '#94a3b8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={() => onAuditEvent?.({ eventType: `RECOVERY_ACTION_${action.label.toUpperCase().replace(/\s/g,'_')}`, severity: 'informational', patternId: `${variant}-recovery`, component: 'RecoveryPrompt' })}
          >
            {action.label}
          </button>
        ))}
      </div>

      {variant === 'abandon' && (
        <p style={{ fontSize: 10, marginTop: 8, color: '#64748b' }}>
          Session state preserved. Re-entry supported within 24 hours.
        </p>
      )}

      <p style={{ fontSize: 9, color: '#334155', margin: '8px 0 0', fontFamily: 'var(--guardrail-font-mono)' }}>
        spec: components/recovery/component-spec.md
      </p>
    </div>
  );
}

const RECOVERY_CONFIG = {
  redirect: {
    icon: '↩',
    label: 'Redirect Recovery',
    message: 'You can complete this through an alternative path without affecting your existing setup.',
    actions: [
      { label: 'Try alternative path' },
      { label: 'Explore other options' },
      { label: 'Contact support' },
    ],
  },
  retry: {
    icon: '↻',
    label: 'Retry Recovery',
    message: 'A transient issue occurred. You can try again — no data was lost.',
    actions: [
      { label: 'Retry now' },
      { label: 'Modify input and retry' },
      { label: 'Cancel' },
    ],
  },
  repair: {
    icon: '🔧',
    label: 'Repair Recovery',
    message: 'A correctable issue was found in the input data. Repairing will fix the issue and resume the workflow.',
    actions: [
      { label: 'Repair and continue' },
      { label: 'Review changes first' },
      { label: 'Cancel' },
    ],
  },
  abandon: {
    icon: '✕',
    label: 'Abandon Recovery',
    message: "This session cannot continue. Your progress has been saved — you can return and resume at any time.",
    actions: [
      { label: 'Exit and save' },
      { label: 'Escalate to supervisor' },
    ],
  },
};
