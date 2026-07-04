'use client';

/**
 * WarningBanner — playground adaptation
 * Spec: components/warning/component-spec.md
 * Full implementation: reference/react/WarningBanner.jsx
 */

const SEVERITY_CONFIG = {
  informational: { surface: 'var(--guardrail-severity-informational-surface)', text: 'var(--guardrail-severity-informational-text)', border: 'var(--guardrail-severity-informational-border)', role: 'status', live: 'polite', label: 'Info' },
  advisory: { surface: 'var(--guardrail-severity-advisory-surface)', text: 'var(--guardrail-severity-advisory-text)', border: 'var(--guardrail-severity-advisory-border)', role: 'status', live: 'polite', label: 'Advisory' },
  caution: { surface: 'var(--guardrail-severity-caution-surface)', text: 'var(--guardrail-severity-caution-text)', border: 'var(--guardrail-severity-caution-border)', role: 'alert', live: 'polite', label: 'Caution' },
  blocking: { surface: 'var(--guardrail-severity-blocking-surface)', text: 'var(--guardrail-severity-blocking-text)', border: 'var(--guardrail-severity-blocking-border)', role: 'alertdialog', live: 'assertive', label: 'Blocking' },
  critical: { surface: 'var(--guardrail-severity-critical-surface)', text: 'var(--guardrail-severity-critical-text)', border: 'var(--guardrail-severity-critical-border)', role: 'alertdialog', live: 'assertive', label: 'Critical' },
};

export function WarningBanner({ variant, severity = 'advisory', message, policyRef, onAuditEvent, auditId }) {
  const cfg = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.advisory;
  const resolvedMsg = message ?? DEMO_MESSAGES[variant] ?? DEMO_MESSAGES.inline;

  return (
    <div
      role={cfg.role}
      aria-live={cfg.live}
      aria-atomic="true"
      style={{
        backgroundColor: cfg.surface,
        color: cfg.text,
        borderLeft: `3px solid ${cfg.border}`,
        borderRadius: 'var(--guardrail-radius-md)',
        padding: 'var(--guardrail-space-md)',
      }}
      data-guardrail-pattern={policyRef ? 'policy-warning' : 'warning-banner'}
      data-guardrail-severity={severity}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>
          {SEVERITY_ICONS[severity]}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>
              {cfg.label} Warning
            </span>
            {severity === 'blocking' && (
              <span style={{ fontSize: 9, fontWeight: 700, background: cfg.border, borderRadius: 4, padding: '1px 5px', opacity: 0.8 }}>
                ARIA: role=alertdialog · aria-live=assertive
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
            {resolvedMsg}
          </p>
          {policyRef && (
            <p style={{ fontSize: 11, margin: '4px 0 0', fontFamily: 'var(--guardrail-font-mono)', opacity: 0.7 }}>
              Policy: {policyRef}
            </p>
          )}
        </div>
      </div>
      <SpecRef path="components/warning/component-spec.md" />
    </div>
  );
}

const SEVERITY_ICONS = {
  informational: 'ℹ',
  advisory: '⚠',
  caution: '⚠',
  blocking: '🚫',
  critical: '🚨',
};

const DEMO_MESSAGES = {
  inline: 'This action has known limitations in the current context.',
  ambient: 'Running with stale context data — some information may be outdated.',
  blocking: 'You do not have authorization to perform this action.',
  policy: 'This transaction has been placed on hold under security policy.',
};

function SpecRef({ path }) {
  return (
    <p style={{ fontSize: 9, color: 'inherit', opacity: 0.4, margin: '8px 0 0', fontFamily: 'var(--guardrail-font-mono)' }}>
      spec: {path}
    </p>
  );
}
