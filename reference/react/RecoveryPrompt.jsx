/**
 * RecoveryPrompt — Reference implementation
 *
 * Implements: retry-recovery, redirect-recovery, repair-recovery,
 *             manual-override-recovery, abandon-recovery
 * Spec: components/recovery/component-spec.md
 * Accessibility: components/recovery/accessibility.md
 * Tokens: components/design-tokens.md
 *
 * Key design rules:
 * - Focus moves to the first recovery option on mount.
 * - Override variant requires explicit acknowledgment before confirm button activates.
 * - Optimistic animation signals a forward motion (not error state).
 * - Each recovery type has a clearly distinct objective — they are not interchangeable.
 */

import { useEffect, useRef, useState } from 'react';

// Recovery variant configuration
const recoveryConfig = {
  retry: {
    label: 'Try again',
    description: 'The previous attempt can be retried.',
    role: 'status',
    ariaLive: 'polite',
  },
  redirect: {
    label: 'Continue another way',
    description: 'The original goal can be achieved through a different path.',
    role: 'status',
    ariaLive: 'polite',
  },
  repair: {
    label: 'Resume with corrections',
    description: 'The workflow can continue after providing updated information.',
    role: 'status',
    ariaLive: 'polite',
  },
  override: {
    label: 'Authorize exception',
    description: 'An authorized exception will allow this action to proceed.',
    role: 'dialog',
    ariaLive: 'assertive',  // Override requires assertive — blocking level
  },
  abandon: {
    label: 'Exit and save progress',
    description: 'The current action cannot proceed. Your work has been preserved.',
    role: 'status',
    ariaLive: 'polite',
  },
};

/**
 * @param {object} props
 * @param {'retry'|'redirect'|'repair'|'override'|'abandon'} props.variant
 * @param {string} props.recoveryContext           - What the recovery is responding to
 * @param {string} [props.retryCountRemaining]     - For retry: attempts remaining
 * @param {Array<{id:string,label:string,description:string}>} [props.redirectOptions] - For redirect
 * @param {Array<{id:string,label:string,type:string}>} [props.repairFields]           - For repair
 * @param {string} [props.overrideScope]           - For override: specific scope being authorized
 * @param {string} [props.overrideAuditConsequence] - For override: audit/risk acknowledgment text
 * @param {string} [props.abandonSavedState]       - For abandon: description of what was preserved
 * @param {string} props.auditId                   - Audit event ID (required)
 * @param {function} [props.onRetry]               - Called on retry
 * @param {function} [props.onRedirect]            - Called with selected redirect option ID
 * @param {function} [props.onRepair]              - Called with repair field values
 * @param {function} [props.onOverride]            - Called when override is confirmed
 * @param {function} [props.onAbandon]             - Called when user exits
 * @param {function} [props.onAuditEvent]          - Receives audit event object
 */
export function RecoveryPrompt({
  variant = 'retry',
  recoveryContext,
  retryCountRemaining,
  redirectOptions = [],
  repairFields = [],
  overrideScope,
  overrideAuditConsequence,
  abandonSavedState,
  auditId,
  onRetry,
  onRedirect,
  onRepair,
  onOverride,
  onAbandon,
  onAuditEvent,
}) {
  const firstActionRef = useRef(null);
  const [overrideAcknowledged, setOverrideAcknowledged] = useState(false);
  const repairData = useRef({});
  const config = recoveryConfig[variant] ?? recoveryConfig.retry;

  // Focus first action on mount
  useEffect(() => {
    firstActionRef.current?.focus();
    onAuditEvent?.({
      eventType: 'RECOVERY_RENDERED',
      auditId,
      variant,
      patternId: `${variant}-recovery`,
      timestamp: new Date().toISOString(),
    });
  }, []);

  function emitAndCall(eventType, handler, payload = {}) {
    onAuditEvent?.({
      eventType,
      auditId,
      variant,
      ...payload,
      timestamp: new Date().toISOString(),
    });
    handler?.();
  }

  return (
    <div
      role={config.role}
      aria-live={config.ariaLive}
      aria-atomic="true"
      aria-label={config.label}
      // Override is dialog — needs aria-modal
      {...(variant === 'override' && {
        'aria-modal': 'true',
        'aria-labelledby': 'override-title',
        'aria-describedby': 'override-body',
      })}
      style={{
        backgroundColor: 'var(--guardrail-severity-advisory-surface)',
        color: 'var(--guardrail-severity-advisory-text)',
        borderRadius: 'var(--guardrail-radius-md)',
        padding: 'var(--guardrail-space-lg)',
        border: `1px solid var(--guardrail-severity-advisory-border)`,
      }}
      data-guardrail-pattern={`${variant}-recovery`}
      data-audit-id={auditId}
    >
      {/* Recovery header */}
      <div style={{ marginBottom: 'var(--guardrail-space-md)' }}>
        <p
          id={variant === 'override' ? 'override-title' : undefined}
          style={{ margin: 0, fontWeight: 'var(--guardrail-font-weight-medium)' }}
        >
          {config.label}
        </p>
        {recoveryContext && (
          <p
            id={variant === 'override' ? 'override-body' : undefined}
            style={{ margin: '4px 0 0', fontSize: 'var(--guardrail-font-size-sm)', opacity: 0.8 }}
          >
            {recoveryContext}
          </p>
        )}
      </div>

      {/* Retry variant */}
      {variant === 'retry' && (
        <div>
          {retryCountRemaining !== undefined && (
            <p style={{ margin: '0 0 var(--guardrail-space-sm)', fontSize: 'var(--guardrail-font-size-sm)' }}>
              {retryCountRemaining} attempt{retryCountRemaining !== 1 ? 's' : ''} remaining
            </p>
          )}
          <button
            ref={firstActionRef}
            onClick={() => emitAndCall('RETRY_INITIATED', onRetry)}
            style={{
              backgroundColor: 'var(--guardrail-severity-advisory-icon)',
              color: 'var(--guardrail-color-on-accent)',
              border: 'none',
              borderRadius: 'var(--guardrail-radius-sm)',
              padding: 'var(--guardrail-space-sm) var(--guardrail-space-md)',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Try again
          </button>
        </div>
      )}

      {/* Redirect variant */}
      {variant === 'redirect' && redirectOptions.length > 0 && (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {redirectOptions.map((opt, idx) => (
            <li key={opt.id} style={{ marginBottom: 'var(--guardrail-space-xs)' }}>
              <button
                ref={idx === 0 ? firstActionRef : undefined}
                onClick={() => {
                  onAuditEvent?.({ eventType: 'REDIRECT_SELECTED', auditId, optionId: opt.id, timestamp: new Date().toISOString() });
                  onRedirect?.(opt.id);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  backgroundColor: 'transparent',
                  border: `1px solid var(--guardrail-severity-advisory-border)`,
                  borderRadius: 'var(--guardrail-radius-sm)',
                  padding: 'var(--guardrail-space-sm) var(--guardrail-space-md)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  minHeight: '44px',
                }}
              >
                <span style={{ fontWeight: 'var(--guardrail-font-weight-medium)', fontSize: 'var(--guardrail-font-size-sm)' }}>
                  {opt.label}
                </span>
                {opt.description && (
                  <span style={{ fontSize: 'var(--guardrail-font-size-xs)', opacity: 0.75 }}>{opt.description}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Repair variant */}
      {variant === 'repair' && (
        <div>
          {repairFields.map((field, idx) => (
            <div key={field.id} style={{ marginBottom: 'var(--guardrail-space-sm)' }}>
              <label htmlFor={`repair-${field.id}`} style={{ display: 'block', fontSize: 'var(--guardrail-font-size-sm)', marginBottom: '4px' }}>
                {field.label}
              </label>
              <input
                ref={idx === 0 ? firstActionRef : undefined}
                id={`repair-${field.id}`}
                type={field.type ?? 'text'}
                onChange={(e) => { repairData.current[field.id] = e.target.value; }}
                style={{
                  width: '100%',
                  padding: 'var(--guardrail-space-sm)',
                  borderRadius: 'var(--guardrail-radius-sm)',
                  border: `1px solid var(--guardrail-severity-advisory-border)`,
                  fontSize: 'var(--guardrail-font-size-sm)',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
          <button
            onClick={() => {
              onAuditEvent?.({ eventType: 'REPAIR_SUBMITTED', auditId, fields: Object.keys(repairData.current), timestamp: new Date().toISOString() });
              onRepair?.(repairData.current);
            }}
            style={{
              backgroundColor: 'var(--guardrail-severity-advisory-icon)',
              color: 'var(--guardrail-color-on-accent)',
              border: 'none',
              borderRadius: 'var(--guardrail-radius-sm)',
              padding: 'var(--guardrail-space-sm) var(--guardrail-space-md)',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Validate and resume
          </button>
        </div>
      )}

      {/* Override variant — requires explicit acknowledgment checkbox */}
      {variant === 'override' && (
        <div>
          {overrideScope && (
            <p style={{ margin: '0 0 var(--guardrail-space-sm)', fontSize: 'var(--guardrail-font-size-sm)', fontWeight: 'var(--guardrail-font-weight-medium)' }}>
              Exception scope: {overrideScope}
            </p>
          )}
          {overrideAuditConsequence && (
            <div
              style={{
                backgroundColor: 'var(--guardrail-severity-caution-surface)',
                borderRadius: 'var(--guardrail-radius-sm)',
                padding: 'var(--guardrail-space-sm)',
                marginBottom: 'var(--guardrail-space-md)',
                fontSize: 'var(--guardrail-font-size-sm)',
              }}
            >
              {overrideAuditConsequence}
            </div>
          )}
          {/* Acknowledgment checkbox — confirm button disabled until checked */}
          <label
            ref={firstActionRef}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--guardrail-space-sm)', cursor: 'pointer', marginBottom: 'var(--guardrail-space-md)' }}
          >
            <input
              type="checkbox"
              checked={overrideAcknowledged}
              onChange={(e) => setOverrideAcknowledged(e.target.checked)}
              style={{ marginTop: '2px', minWidth: '18px', minHeight: '18px' }}
            />
            <span style={{ fontSize: 'var(--guardrail-font-size-sm)' }}>
              I confirm I am authorizing this exception. This action will be recorded in the audit log.
            </span>
          </label>
          <button
            onClick={() => {
              if (!overrideAcknowledged) return;
              onAuditEvent?.({ eventType: 'OVERRIDE_CONFIRMED', auditId, overrideScope, acknowledgedAt: new Date().toISOString() });
              onOverride?.();
            }}
            disabled={!overrideAcknowledged}
            aria-disabled={!overrideAcknowledged}
            style={{
              backgroundColor: overrideAcknowledged ? 'var(--guardrail-severity-caution-icon)' : 'var(--guardrail-disabled-surface)',
              color: overrideAcknowledged ? 'var(--guardrail-color-on-accent)' : 'var(--guardrail-disabled-text)',
              border: 'none',
              borderRadius: 'var(--guardrail-radius-sm)',
              padding: 'var(--guardrail-space-sm) var(--guardrail-space-md)',
              cursor: overrideAcknowledged ? 'pointer' : 'not-allowed',
              minHeight: '44px',
            }}
          >
            Confirm exception
          </button>
        </div>
      )}

      {/* Abandon variant */}
      {variant === 'abandon' && (
        <div>
          {abandonSavedState && (
            <p style={{ margin: '0 0 var(--guardrail-space-sm)', fontSize: 'var(--guardrail-font-size-sm)' }}>
              Preserved: {abandonSavedState}
            </p>
          )}
          <button
            ref={firstActionRef}
            onClick={() => emitAndCall('ABANDON_CONFIRMED', onAbandon)}
            style={{
              backgroundColor: 'transparent',
              border: `1px solid var(--guardrail-severity-advisory-border)`,
              borderRadius: 'var(--guardrail-radius-sm)',
              padding: 'var(--guardrail-space-sm) var(--guardrail-space-md)',
              cursor: 'pointer',
              minHeight: '44px',
              color: 'var(--guardrail-severity-advisory-text)',
            }}
          >
            Exit and save
          </button>
        </div>
      )}
    </div>
  );
}

// Usage example — procurement override (autonomous-procurement.md case study)
export const OverrideExample = () => (
  <RecoveryPrompt
    variant="override"
    recoveryContext="Purchase order #PO-2026-0741 — 340 units at $104.67 (spot pricing, 40% above contract rate). Total: $67,400."
    overrideScope="Single purchase order — $67,400 spot-price exception. Expires on use."
    overrideAuditConsequence="This exception will be recorded in your name, with the pricing anomaly flagged for the next financial controls review."
    auditId="recovery-override-procurement-001"
    onOverride={() => console.log('Override confirmed — agent resuming')}
    onAuditEvent={console.log}
  />
);
