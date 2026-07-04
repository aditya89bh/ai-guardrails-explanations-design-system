/**
 * WarningBanner — Reference implementation
 *
 * Implements: inline-warning, ambient-warning, modal-warning, progressive-warning
 * Spec: components/warning/component-spec.md
 * Accessibility: components/warning/accessibility.md
 * Tokens: components/design-tokens.md
 *
 * This is a reference implementation, not a production component.
 * It demonstrates props, states, variants, accessibility attributes,
 * and design token usage. Adapt to your framework conventions.
 */

import { useEffect, useRef, useState } from 'react';

// --- Design token references (components/design-tokens.md) ---
// These map to CSS custom properties defined in your token stylesheet.
const tokens = {
  informational: {
    surface: 'var(--guardrail-severity-informational-surface)',
    text: 'var(--guardrail-severity-informational-text)',
    icon: 'var(--guardrail-severity-informational-icon)',
    border: 'var(--guardrail-severity-informational-border)',
  },
  advisory: {
    surface: 'var(--guardrail-severity-advisory-surface)',
    text: 'var(--guardrail-severity-advisory-text)',
    icon: 'var(--guardrail-severity-advisory-icon)',
    border: 'var(--guardrail-severity-advisory-border)',
  },
  caution: {
    surface: 'var(--guardrail-severity-caution-surface)',
    text: 'var(--guardrail-severity-caution-text)',
    icon: 'var(--guardrail-severity-caution-icon)',
    border: 'var(--guardrail-severity-caution-border)',
  },
  blocking: {
    surface: 'var(--guardrail-severity-blocking-surface)',
    text: 'var(--guardrail-severity-blocking-text)',
    icon: 'var(--guardrail-severity-blocking-icon)',
    border: 'var(--guardrail-severity-blocking-border)',
  },
  critical: {
    surface: 'var(--guardrail-severity-critical-surface)',
    text: 'var(--guardrail-severity-critical-text)',
    icon: 'var(--guardrail-severity-critical-icon)',
    border: 'var(--guardrail-severity-critical-border)',
  },
};

// ARIA live region politeness by severity (components/warning/accessibility.md)
const ariaLiveMap = {
  informational: 'polite',
  advisory: 'polite',
  caution: 'polite',
  blocking: 'assertive',
  critical: 'assertive',
};

// ARIA role by severity
const ariaRoleMap = {
  informational: 'status',
  advisory: 'status',
  caution: 'alert',
  blocking: 'alertdialog',
  critical: 'alertdialog',
};

/**
 * @param {object} props
 * @param {'informational'|'advisory'|'caution'|'blocking'|'critical'} props.severity
 * @param {'inline'|'session'|'modal'|'policy'} props.variant
 * @param {string} props.message        - Primary warning message
 * @param {string} [props.detail]       - Optional secondary detail text
 * @param {string} [props.policyRef]    - Policy rule ID for policy variant
 * @param {string} props.auditId        - Audit event ID (required)
 * @param {boolean} [props.autoDismiss] - Auto-dismiss after dismissTimeMs (advisory only)
 * @param {number} [props.dismissTimeMs] - Auto-dismiss delay in ms (default: 5000)
 * @param {function} [props.onAcknowledge] - Called when user acknowledges the warning
 * @param {function} [props.onDismiss]  - Called when user dismisses the warning
 * @param {function} props.onAuditEvent - Receives audit event object on render/dismiss/acknowledge
 */
export function WarningBanner({
  severity = 'advisory',
  variant = 'inline',
  message,
  detail,
  policyRef,
  auditId,
  autoDismiss = false,
  dismissTimeMs = 5000,
  onAcknowledge,
  onDismiss,
  onAuditEvent,
}) {
  const [dismissed, setDismissed] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const bannerRef = useRef(null);
  const isModal = variant === 'modal' || severity === 'blocking' || severity === 'critical';

  // Emit audit event on mount (components/warning/accessibility.md — audit on render)
  useEffect(() => {
    onAuditEvent?.({
      eventType: 'WARNING_RENDERED',
      auditId,
      severity,
      variant,
      patternId: variant === 'policy' ? 'policy-warning' : 'inline-warning',
      timestamp: new Date().toISOString(),
    });
  }, []);

  // Auto-dismiss for advisory/informational (not blocking/critical)
  useEffect(() => {
    if (!autoDismiss || severity === 'blocking' || severity === 'critical') return;
    const timer = setTimeout(() => handleDismiss(), dismissTimeMs);
    return () => clearTimeout(timer);
  }, [autoDismiss, dismissTimeMs, severity]);

  // Focus management: modal variants receive focus on mount
  useEffect(() => {
    if (isModal && bannerRef.current) {
      bannerRef.current.focus();
    }
  }, [isModal]);

  function handleAcknowledge() {
    setAcknowledged(true);
    onAuditEvent?.({
      eventType: 'WARNING_ACKNOWLEDGED',
      auditId,
      severity,
      timestamp: new Date().toISOString(),
    });
    onAcknowledge?.();
  }

  function handleDismiss() {
    setDismissed(true);
    onAuditEvent?.({
      eventType: 'WARNING_DISMISSED',
      auditId,
      severity,
      timestamp: new Date().toISOString(),
    });
    onDismiss?.();
  }

  if (dismissed || acknowledged) return null;

  const colorTokens = tokens[severity] ?? tokens.advisory;
  const ariaLive = ariaLiveMap[severity] ?? 'polite';
  const ariaRole = ariaRoleMap[severity] ?? 'alert';

  const style = {
    backgroundColor: colorTokens.surface,
    color: colorTokens.text,
    borderLeft: `4px solid ${colorTokens.border}`,
    borderRadius: 'var(--guardrail-radius-md)',
    padding: 'var(--guardrail-space-md)',
    // Modal variants use overlay positioning
    ...(isModal && {
      position: 'fixed',
      inset: 0,
      zIndex: 'var(--guardrail-priority-blocking)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }),
  };

  return (
    <div
      ref={bannerRef}
      role={ariaRole}
      aria-live={ariaLive}
      aria-atomic="true"
      aria-label={`${severity} warning`}
      // Focus support: modal variants must be focusable
      tabIndex={isModal ? -1 : undefined}
      style={style}
      data-guardrail-pattern={variant === 'policy' ? 'policy-warning' : 'warning-banner'}
      data-guardrail-severity={severity}
      data-audit-id={auditId}
    >
      {/* Warning icon — semantic icon name from design-tokens.md */}
      <span
        aria-hidden="true"
        style={{ color: colorTokens.icon }}
        data-guardrail-icon={`severity-${severity}`}
      />

      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 'var(--guardrail-font-weight-medium)' }}>
          {message}
        </p>
        {detail && (
          <p style={{ margin: '4px 0 0', fontSize: 'var(--guardrail-font-size-sm)' }}>
            {detail}
          </p>
        )}
        {/* Policy reference — shown only for policy-warning variant */}
        {variant === 'policy' && policyRef && (
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 'var(--guardrail-font-size-sm)',
              fontFamily: 'var(--guardrail-font-mono)',
            }}
          >
            Policy: {policyRef}
          </p>
        )}
      </div>

      {/* Action buttons — blocking/critical require explicit user action */}
      {(severity === 'blocking' || severity === 'critical') && (
        <div style={{ display: 'flex', gap: 'var(--guardrail-space-sm)', marginTop: 'var(--guardrail-space-md)' }}>
          <button
            onClick={handleAcknowledge}
            style={{
              backgroundColor: colorTokens.icon,
              color: 'var(--guardrail-color-on-accent)',
              border: 'none',
              borderRadius: 'var(--guardrail-radius-sm)',
              padding: 'var(--guardrail-space-sm) var(--guardrail-space-md)',
              minHeight: '44px', // Touch target minimum
              cursor: 'pointer',
            }}
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Dismiss control — advisory/caution only */}
      {(severity === 'advisory' || severity === 'caution') && !autoDismiss && (
        <button
          onClick={handleDismiss}
          aria-label="Dismiss warning"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--guardrail-space-xs)',
            minWidth: '44px',
            minHeight: '44px',
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

// --- Usage examples ---
// These mirror the pattern sequences from docs/case-studies/

// Example 1: Advisory inline warning (Turn 2 of customer-support case study)
export const AdvisoryInlineExample = () => (
  <WarningBanner
    severity="advisory"
    variant="inline"
    message="I'm having trouble locating this charge in available records."
    detail="Could you confirm the transaction date and the last 4 digits of your payment method?"
    auditId="warn-session-cs-turn2"
    onAuditEvent={console.log}
  />
);

// Example 2: Blocking policy warning (banking fraud case study)
export const PolicyBlockingExample = () => (
  <WarningBanner
    severity="blocking"
    variant="policy"
    message="Your transfer has been placed on hold for security review."
    detail="This is required under our transaction monitoring policy — it is not a judgment that your transaction is fraudulent."
    policyRef="fin-rule-01"
    auditId="warn-fraud-block-001"
    onAcknowledge={() => console.log('Customer acknowledged fraud hold')}
    onAuditEvent={console.log}
  />
);

// Example 3: Modal warning — session escalation (Turn 3 of customer-support case study)
export const ModalEscalationExample = () => (
  <WarningBanner
    severity="blocking"
    variant="modal"
    message="I haven't been able to resolve this billing issue from the information available."
    detail="I'm connecting you to a support specialist who can access your full payment history."
    auditId="warn-session-modal-cs-turn3"
    onAcknowledge={() => console.log('Customer confirmed handoff')}
    onDismiss={() => console.log('Customer chose retry')}
    onAuditEvent={console.log}
  />
);
