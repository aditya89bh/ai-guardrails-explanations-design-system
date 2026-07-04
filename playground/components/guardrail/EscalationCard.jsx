'use client';

/**
 * EscalationCard — playground adaptation
 * Spec: components/escalation/component-spec.md
 * Full implementation: reference/react/EmergencyEscalationOverlay.jsx
 *
 * Note: EscalationOverlay (emergency) is rendered contained (not full-screen) in the playground.
 */

export function EscalationCard({ variant = 'role', onAuditEvent }) {
  const config = ESCALATION_CONFIG[variant] ?? ESCALATION_CONFIG.role;

  const isEmergency = variant === 'emergency';

  return (
    <div
      role={isEmergency ? 'alertdialog' : 'alert'}
      aria-live={isEmergency ? 'assertive' : 'polite'}
      aria-atomic="true"
      style={{
        backgroundColor: isEmergency ? 'var(--guardrail-severity-critical-surface)' : 'var(--guardrail-severity-caution-surface)',
        border: `2px solid ${isEmergency ? 'var(--guardrail-severity-critical-border)' : 'var(--guardrail-severity-caution-border)'}`,
        borderRadius: 'var(--guardrail-radius-md)',
        padding: 'var(--guardrail-space-md)',
        color: isEmergency ? 'var(--guardrail-severity-critical-text)' : 'var(--guardrail-severity-caution-text)',
      }}
      data-guardrail-pattern={`${variant}-escalation`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 18 }}>{config.icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.8 }}>
          {config.label}
        </span>
        {isEmergency && (
          <span style={{
            marginLeft: 'auto', fontSize: 10, fontWeight: 700,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 4, padding: '2px 7px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            CRITICAL
          </span>
        )}
      </div>

      <p style={{ fontSize: 13, margin: '0 0 10px', lineHeight: 1.5, fontWeight: isEmergency ? 600 : 400 }}>
        {config.message}
      </p>

      {config.target && (
        <div style={{
          padding: '6px 10px',
          background: isEmergency ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          borderRadius: 'var(--guardrail-radius-sm)',
          fontSize: 11,
          marginBottom: 10,
          fontFamily: 'var(--guardrail-font-mono)',
        }}>
          {config.target}
        </div>
      )}

      {isEmergency && (
        <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 8 }}>
          Self-authorizing at Risk=4. Bypasses standard escalation SLA. Audit event generated.
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          style={{
            flex: 1, height: 34,
            borderRadius: 'var(--guardrail-radius-sm)',
            border: isEmergency ? '1px solid rgba(255,255,255,0.3)' : '1px solid var(--guardrail-severity-caution-border)',
            background: isEmergency ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: 'inherit',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}
          onClick={() => onAuditEvent?.({ eventType: 'ESCALATION_ACKNOWLEDGED', severity: isEmergency ? 'critical' : 'caution', patternId: `${variant}-escalation`, component: 'EscalationCard' })}
        >
          {isEmergency ? 'Acknowledge Emergency' : 'Escalate Now'}
        </button>
      </div>

      {!isEmergency && (
        <p style={{ fontSize: 10, marginTop: 8, opacity: 0.6 }}>
          SLA: {config.sla} · Assignee: {config.assignee}
        </p>
      )}

      <p style={{ fontSize: 9, color: 'inherit', opacity: 0.3, margin: '8px 0 0', fontFamily: 'var(--guardrail-font-mono)' }}>
        spec: components/escalation/component-spec.md
      </p>
    </div>
  );
}

const ESCALATION_CONFIG = {
  emergency: {
    icon: '🚨',
    label: 'Emergency Escalation',
    message: 'A critical condition has been detected requiring immediate intervention. All operations are halted until acknowledged.',
    target: 'Routing → Emergency Response · Incident Mgmt · Compliance',
    sla: null,
    assignee: null,
  },
  role: {
    icon: '👤',
    label: 'Role Escalation',
    message: 'This action requires a higher-authority decision. Escalating to your supervisor for review.',
    target: 'Routing → Supervisor | Senior Physician | Compliance Officer',
    sla: '30 minutes',
    assignee: 'Department supervisor on duty',
  },
  async: {
    icon: '📋',
    label: 'Async Review Escalation',
    message: 'This item has been flagged for asynchronous review. It will not proceed until a reviewer approves it.',
    target: 'Queue → Compliance Review · 4-hour SLA',
    sla: '4 hours',
    assignee: 'Compliance review queue',
  },
};
