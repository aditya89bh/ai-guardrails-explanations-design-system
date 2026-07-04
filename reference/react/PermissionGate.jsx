/**
 * PermissionGate — Reference implementation
 *
 * Implements: scoped-permission, delegated-permission, one-time-permission, session-permission
 * Spec: components/permission/component-spec.md
 * Accessibility: components/permission/accessibility.md
 * Tokens: components/design-tokens.md
 *
 * Key invariants enforced by this component (components/permission/component-spec.md):
 * 1. Passive dismissal (closing without clicking Grant) = denial.
 * 2. Deny action is always the FIRST Tab stop.
 * 3. Focus is trapped inside the gate while it is open.
 * 4. Focus returns to the trigger element on close.
 * 5. No auto-grant under any circumstances.
 */

import { useEffect, useRef, useState } from 'react';

// Focus trap helper — returns all focusable elements inside a container
function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

/**
 * @param {object} props
 * @param {'scoped'|'delegated'|'one-time'|'session'|'persistent'} props.variant
 * @param {string} props.requestingEntity   - Who is requesting permission
 * @param {string} props.requestedAction    - What action is being requested
 * @param {string} props.scope              - Scope of the permission request
 * @param {string} [props.purpose]          - Purpose (required for delegated variant)
 * @param {number} [props.expiryHours]      - Permission expiry in hours
 * @param {string} props.auditId            - Audit event ID (required)
 * @param {function} props.onGrant          - Called when user explicitly grants permission
 * @param {function} props.onDeny           - Called when user denies OR passively dismisses
 * @param {function} props.onAuditEvent     - Receives audit event on any state change
 * @param {HTMLElement} [props.triggerRef]  - Ref to return focus to after close
 */
export function PermissionGate({
  variant = 'one-time',
  requestingEntity,
  requestedAction,
  scope,
  purpose,
  expiryHours,
  auditId,
  onGrant,
  onDeny,
  onAuditEvent,
  triggerRef,
}) {
  const [state, setState] = useState('idle'); // 'idle' | 'granted' | 'denied'
  const gateRef = useRef(null);

  // Emit audit event on mount
  useEffect(() => {
    onAuditEvent?.({
      eventType: 'PERMISSION_GATE_RENDERED',
      auditId,
      variant,
      requestingEntity,
      requestedAction,
      scope,
      timestamp: new Date().toISOString(),
    });
  }, []);

  // Focus trap: keep keyboard focus inside the gate
  useEffect(() => {
    const gate = gateRef.current;
    if (!gate) return;

    // Move focus to deny button (first Tab stop — invariant)
    const denyButton = gate.querySelector('[data-guardrail-action="deny"]');
    denyButton?.focus();

    function handleKeyDown(e) {
      if (e.key !== 'Tab') return;
      const focusable = getFocusableElements(gate);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    gate.addEventListener('keydown', handleKeyDown);
    return () => gate.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Return focus to trigger element after gate closes
  useEffect(() => {
    if (state !== 'idle' && triggerRef?.current) {
      triggerRef.current.focus();
    }
  }, [state]);

  // Passive dismissal = denial (Escape key)
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape' && state === 'idle') {
        handleDeny('passive-dismissal');
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [state]);

  function handleGrant() {
    setState('granted');
    onAuditEvent?.({
      eventType: 'PERMISSION_GRANTED',
      auditId,
      variant,
      requestingEntity,
      requestedAction,
      scope,
      purpose: purpose ?? null,
      expiryHours: expiryHours ?? null,
      grantTimestamp: new Date().toISOString(),
    });
    onGrant?.({ scope, purpose, expiryHours });
  }

  function handleDeny(reason = 'explicit-denial') {
    setState('denied');
    onAuditEvent?.({
      eventType: 'PERMISSION_DENIED',
      auditId,
      variant,
      requestingEntity,
      requestedAction,
      scope,
      reason,                        // 'explicit-denial' or 'passive-dismissal'
      denyTimestamp: new Date().toISOString(),
    });
    onDeny?.({ reason });
  }

  if (state !== 'idle') return null;

  return (
    // Overlay backdrop — blocks underlying UI while gate is active (blocking severity)
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--guardrail-overlay-backdrop)',
        zIndex: 'var(--guardrail-priority-blocking)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      // Clicking backdrop = passive dismissal = denial
      onClick={() => handleDeny('passive-dismissal')}
      aria-hidden="true"
    >
      {/* Gate dialog */}
      <div
        ref={gateRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="permission-gate-title"
        aria-describedby="permission-gate-body"
        style={{
          backgroundColor: 'var(--guardrail-severity-blocking-surface)',
          color: 'var(--guardrail-severity-blocking-text)',
          borderRadius: 'var(--guardrail-radius-lg)',
          padding: 'var(--guardrail-space-xl)',
          maxWidth: '480px',
          width: '100%',
          boxShadow: 'var(--guardrail-elevation-3)',
        }}
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click from bubbling
        data-guardrail-pattern="permission-gate"
        data-guardrail-variant={variant}
        data-audit-id={auditId}
      >
        <h2
          id="permission-gate-title"
          style={{ margin: '0 0 var(--guardrail-space-sm)', fontSize: 'var(--guardrail-font-size-lg)' }}
        >
          Permission required
        </h2>

        <div id="permission-gate-body">
          <p style={{ margin: '0 0 var(--guardrail-space-xs)' }}>
            <strong>{requestingEntity}</strong> is requesting permission to:
          </p>
          <p style={{ margin: '0 0 var(--guardrail-space-sm)' }}>{requestedAction}</p>

          <dl style={{ margin: '0 0 var(--guardrail-space-md)' }}>
            <dt style={{ fontSize: 'var(--guardrail-font-size-sm)', opacity: 0.75 }}>Scope</dt>
            <dd style={{ margin: '2px 0 8px' }}>{scope}</dd>

            {purpose && (
              <>
                <dt style={{ fontSize: 'var(--guardrail-font-size-sm)', opacity: 0.75 }}>Purpose</dt>
                <dd style={{ margin: '2px 0 8px' }}>{purpose}</dd>
              </>
            )}

            {expiryHours && (
              <>
                <dt style={{ fontSize: 'var(--guardrail-font-size-sm)', opacity: 0.75 }}>Expires</dt>
                <dd style={{ margin: '2px 0 8px' }}>
                  {expiryHours} hours from grant
                </dd>
              </>
            )}
          </dl>

          {variant === 'delegated' && (
            <p style={{
              fontSize: 'var(--guardrail-font-size-sm)',
              backgroundColor: 'var(--guardrail-severity-advisory-surface)',
              borderRadius: 'var(--guardrail-radius-sm)',
              padding: 'var(--guardrail-space-sm)',
              margin: '0 0 var(--guardrail-space-md)',
            }}>
              This grant will be logged with your identity, the purpose, and the expiry.
            </p>
          )}
        </div>

        {/* Action buttons — deny-first Tab order (invariant) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--guardrail-space-sm)',
          }}
        >
          {/* DENY is tabIndex=0 and rendered first — always the first Tab stop */}
          <button
            data-guardrail-action="deny"
            onClick={() => handleDeny('explicit-denial')}
            style={{
              backgroundColor: 'transparent',
              border: `1px solid var(--guardrail-severity-blocking-border)`,
              borderRadius: 'var(--guardrail-radius-sm)',
              padding: 'var(--guardrail-space-sm) var(--guardrail-space-md)',
              minHeight: '44px',
              cursor: 'pointer',
              color: 'var(--guardrail-severity-blocking-text)',
            }}
          >
            Deny
          </button>

          <button
            data-guardrail-action="grant"
            onClick={handleGrant}
            style={{
              backgroundColor: 'var(--guardrail-severity-blocking-icon)',
              color: 'var(--guardrail-color-on-accent)',
              border: 'none',
              borderRadius: 'var(--guardrail-radius-sm)',
              padding: 'var(--guardrail-space-sm) var(--guardrail-space-md)',
              minHeight: '44px',
              cursor: 'pointer',
            }}
          >
            Grant permission
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Usage example ---
// Mirrors the enterprise-hr.md case study: scoped permission gate for cross-BU employee access
export const ScopedPermissionExample = () => {
  const [showGate, setShowGate] = useState(true);
  const triggerRef = useRef(null);

  return showGate ? (
    <PermissionGate
      variant="scoped"
      requestingEntity="HRBP — Business Unit A"
      requestedAction="Access employee records for [Employee Name] to generate a performance improvement plan"
      scope="Single employee — [Employee Name], PIP purpose only"
      purpose="Performance improvement plan initiation"
      expiryHours={48}
      auditId="perm-scoped-hr-001"
      triggerRef={triggerRef}
      onGrant={(details) => {
        console.log('Permission granted', details);
        setShowGate(false);
      }}
      onDeny={({ reason }) => {
        console.log('Permission denied:', reason);
        setShowGate(false);
      }}
      onAuditEvent={console.log}
    />
  ) : null;
};
