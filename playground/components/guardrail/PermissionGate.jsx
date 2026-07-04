'use client';

/**
 * PermissionGate — playground adaptation (contained, no focus trap)
 * Spec: components/permission/component-spec.md
 * Full implementation: reference/react/PermissionGate.jsx
 *
 * Invariants demonstrated:
 * - passive dismissal = denial (closing without granting = deny)
 * - deny-first tab order (deny button is first in tab sequence)
 */

export function PermissionGate({ variant = 'scoped', authority = 1, onAuditEvent }) {
  const config = GATE_CONFIG[variant] ?? GATE_CONFIG.scoped;

  function handleGrant() {
    onAuditEvent?.({ eventType: 'PERMISSION_GRANTED', severity: 'informational', patternId: `${variant}-permission`, component: 'PermissionGate' });
  }

  function handleDeny() {
    onAuditEvent?.({ eventType: 'PERMISSION_DENIED', severity: 'advisory', patternId: `${variant}-permission`, component: 'PermissionGate' });
  }

  return (
    <div
      role="alertdialog"
      aria-labelledby="pg-perm-title"
      aria-describedby="pg-perm-desc"
      style={{
        backgroundColor: 'var(--guardrail-severity-blocking-surface)',
        border: '1px solid var(--guardrail-severity-blocking-border)',
        borderRadius: 'var(--guardrail-radius-md)',
        padding: 'var(--guardrail-space-md)',
        color: 'var(--guardrail-severity-blocking-text)',
      }}
      data-guardrail-pattern={`${variant}-permission`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>🔐</span>
        <h4 id="pg-perm-title" style={{ fontSize: 12, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.8 }}>
          {config.label} — {variant}
        </h4>
        <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, opacity: 0.5 }}>
          A{authority}
        </span>
      </div>

      {/* Permission scope */}
      <div style={{
        background: 'rgba(0,0,0,0.07)',
        borderRadius: 'var(--guardrail-radius-sm)',
        padding: '8px 10px',
        marginBottom: 10,
        fontSize: 12,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', opacity: 0.6, marginBottom: 4 }}>
          {config.scopeLabel}
        </div>
        <div style={{ fontFamily: 'var(--guardrail-font-mono)', fontSize: 11 }}>
          {config.scopeValue}
        </div>
      </div>

      <p id="pg-perm-desc" style={{ fontSize: 12, margin: '0 0 12px', lineHeight: 1.5, opacity: 0.85 }}>
        {config.description}
      </p>

      {/* Deny-first tab order — DENY is focused first (spec requirement) */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          autoFocus
          onClick={handleDeny}
          style={{
            flex: 1,
            height: 36,
            borderRadius: 'var(--guardrail-radius-sm)',
            border: '1px solid var(--guardrail-severity-blocking-border)',
            background: 'rgba(0,0,0,0.07)',
            color: 'var(--guardrail-severity-blocking-text)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Deny
        </button>
        <button
          onClick={handleGrant}
          style={{
            flex: 1,
            height: 36,
            borderRadius: 'var(--guardrail-radius-sm)',
            border: '1px solid var(--guardrail-severity-blocking-border)',
            background: 'var(--guardrail-severity-blocking-border)',
            color: 'var(--guardrail-severity-blocking-text)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {config.grantLabel}
        </button>
      </div>

      <div style={{ fontSize: 10, opacity: 0.5, marginTop: 8 }}>
        Passive dismiss (ESC / backdrop) = Deny · Deny-first tab order enforced · Auto-grant not permitted
      </div>

      <p style={{ fontSize: 9, color: 'inherit', opacity: 0.3, margin: '6px 0 0', fontFamily: 'var(--guardrail-font-mono)' }}>
        spec: components/permission/component-spec.md
      </p>
    </div>
  );
}

const GATE_CONFIG = {
  'scoped': {
    label: 'Scoped Permission Gate',
    scopeLabel: 'Authorized scope',
    scopeValue: 'Read access to Orders (this session only)',
    description: 'You are requesting access to read order data. This authorization is limited to this session and the specified resources only.',
    grantLabel: 'Authorize (this session)',
  },
  'one-time': {
    label: 'One-Time Permission Gate',
    scopeLabel: 'Action',
    scopeValue: 'Execute: WIRE_TRANSFER_$250K → Beneficiary ID 4821',
    description: 'This is a one-time authorization for a single action. It will be consumed on use and cannot be reused.',
    grantLabel: 'Authorize once',
  },
};
