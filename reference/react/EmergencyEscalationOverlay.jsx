/**
 * EmergencyEscalationOverlay — Reference implementation
 *
 * Implements: emergency-escalation
 * Spec: components/escalation/component-spec.md
 * Accessibility: components/escalation/accessibility.md
 * Tokens: components/design-tokens.md
 *
 * This component operates in interrupt mode:
 * - Captures ALL keyboard input — nothing below the overlay is reachable.
 * - Uses role="alertdialog" with aria-live="assertive".
 * - Entrance animation is aggressive (600ms) — this is intentional.
 * - Auto-dismiss is NEVER allowed.
 * - Acknowledgment is required before the overlay closes.
 * - The audit record is written on mount AND on acknowledgment.
 *
 * This is the INTERNAL system component (operator/team-facing).
 * The customer-facing component for the same event is WarningBanner
 * at blocking severity — see banking-fraud.md case study.
 */

import { useEffect, useRef } from 'react';

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

/**
 * @param {object} props
 * @param {string} props.incidentType          - Type of emergency (e.g., 'fraud-block', 'safety-threshold-breach')
 * @param {string} props.incidentSummary       - One-sentence summary of the emergency
 * @param {Array<{key:string,value:string}>} props.incidentContext - Key-value context fields
 * @param {string} props.escalationTarget      - Who is being notified
 * @param {string} [props.referenceId]         - Incident/case reference ID
 * @param {string} props.auditId               - Audit event ID (required)
 * @param {function} props.onAcknowledge       - Called when operator acknowledges the emergency
 * @param {function} [props.onAuditEvent]      - Receives audit event object
 */
export function EmergencyEscalationOverlay({
  incidentType,
  incidentSummary,
  incidentContext = [],
  escalationTarget,
  referenceId,
  auditId,
  onAcknowledge,
  onAuditEvent,
}) {
  const overlayRef = useRef(null);
  const acknowledgeButtonRef = useRef(null);

  // Emit audit event immediately on mount — before any user interaction
  useEffect(() => {
    onAuditEvent?.({
      eventType: 'EMERGENCY_ESCALATION_FIRED',
      auditId,
      incidentType,
      escalationTarget,
      referenceId: referenceId ?? null,
      timestamp: new Date().toISOString(),
    });
  }, []);

  // Full keyboard capture — Tab is trapped; Escape is suppressed (cannot dismiss without acknowledgment)
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Move focus to acknowledge button immediately
    acknowledgeButtonRef.current?.focus();

    function handleKeyDown(e) {
      // Suppress Escape — emergency overlay cannot be dismissed without acknowledgment
      if (e.key === 'Escape') {
        e.preventDefault();
        return;
      }

      // Tab trap
      if (e.key === 'Tab') {
        const focusable = getFocusableElements(overlay);
        if (focusable.length === 0) { e.preventDefault(); return; }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    // Capture phase — intercepts before any other handler
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  function handleAcknowledge() {
    onAuditEvent?.({
      eventType: 'EMERGENCY_ESCALATION_ACKNOWLEDGED',
      auditId,
      incidentType,
      escalationTarget,
      referenceId: referenceId ?? null,
      acknowledgedAt: new Date().toISOString(),
    });
    onAcknowledge?.();
  }

  return (
    // Full-screen scrim — nothing below is accessible
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        zIndex: 'var(--guardrail-priority-escalation)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Aggressive entrance — 600ms per motion spec for critical severity
        animation: 'emergencyOverlayEntrance 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      // Pointer events on scrim do nothing — only the dialog is interactive
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        ref={overlayRef}
        role="alertdialog"
        aria-modal="true"
        aria-live="assertive"
        aria-labelledby="emergency-title"
        aria-describedby="emergency-body"
        style={{
          backgroundColor: 'var(--guardrail-severity-critical-surface)',
          color: 'var(--guardrail-severity-critical-text)',
          borderRadius: 'var(--guardrail-radius-lg)',
          padding: 'var(--guardrail-space-xl)',
          maxWidth: '560px',
          width: '100%',
          boxShadow: 'var(--guardrail-elevation-4)',
          border: `2px solid var(--guardrail-severity-critical-border)`,
        }}
        data-guardrail-pattern="emergency-escalation"
        data-guardrail-severity="critical"
        data-audit-id={auditId}
      >
        {/* Critical severity icon + label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--guardrail-space-sm)',
            marginBottom: 'var(--guardrail-space-md)',
          }}
        >
          <span
            aria-hidden="true"
            style={{ color: 'var(--guardrail-severity-critical-icon)', fontSize: '24px' }}
            data-guardrail-icon="severity-critical"
          />
          <span
            style={{
              fontSize: 'var(--guardrail-font-size-xs)',
              fontWeight: 'var(--guardrail-font-weight-semibold)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--guardrail-severity-critical-icon)',
            }}
          >
            Emergency escalation
          </span>
        </div>

        {/* Incident summary */}
        <h2
          id="emergency-title"
          style={{
            margin: '0 0 var(--guardrail-space-sm)',
            fontSize: 'var(--guardrail-font-size-xl)',
            fontWeight: 'var(--guardrail-font-weight-bold)',
          }}
        >
          {incidentSummary}
        </h2>

        {/* Incident context fields */}
        {incidentContext.length > 0 && (
          <dl
            id="emergency-body"
            style={{
              margin: '0 0 var(--guardrail-space-lg)',
              display: 'grid',
              gridTemplateColumns: 'max-content 1fr',
              gap: 'var(--guardrail-space-xs) var(--guardrail-space-md)',
            }}
          >
            {incidentContext.map(({ key, value }) => (
              <>
                <dt
                  key={`dt-${key}`}
                  style={{
                    fontSize: 'var(--guardrail-font-size-sm)',
                    opacity: 0.7,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {key}
                </dt>
                <dd
                  key={`dd-${key}`}
                  style={{
                    margin: 0,
                    fontSize: 'var(--guardrail-font-size-sm)',
                    fontWeight: 'var(--guardrail-font-weight-medium)',
                  }}
                >
                  {value}
                </dd>
              </>
            ))}
          </dl>
        )}

        {/* Escalation target and reference */}
        <div
          style={{
            borderTop: `1px solid var(--guardrail-severity-critical-border)`,
            paddingTop: 'var(--guardrail-space-md)',
            marginBottom: 'var(--guardrail-space-lg)',
          }}
        >
          <p style={{ margin: '0 0 4px', fontSize: 'var(--guardrail-font-size-sm)' }}>
            Notified: <strong>{escalationTarget}</strong>
          </p>
          {referenceId && (
            <p style={{ margin: 0, fontSize: 'var(--guardrail-font-size-sm)', fontFamily: 'var(--guardrail-font-mono)' }}>
              Reference: {referenceId}
            </p>
          )}
        </div>

        {/* Acknowledge button — only action available */}
        <button
          ref={acknowledgeButtonRef}
          onClick={handleAcknowledge}
          style={{
            width: '100%',
            backgroundColor: 'var(--guardrail-severity-critical-icon)',
            color: 'var(--guardrail-color-on-accent)',
            border: 'none',
            borderRadius: 'var(--guardrail-radius-sm)',
            padding: 'var(--guardrail-space-md)',
            fontSize: 'var(--guardrail-font-size-md)',
            fontWeight: 'var(--guardrail-font-weight-semibold)',
            cursor: 'pointer',
            minHeight: '48px',
          }}
        >
          Acknowledge and review
        </button>

        {/* Keyboard shortcut hint */}
        <p
          aria-hidden="true"
          style={{
            margin: 'var(--guardrail-space-sm) 0 0',
            fontSize: 'var(--guardrail-font-size-xs)',
            opacity: 0.5,
            textAlign: 'center',
          }}
        >
          Press Enter to acknowledge
        </p>
      </div>

      {/* Keyframe animation — defined inline for portability */}
      <style>{`
        @keyframes emergencyOverlayEntrance {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes emergencyOverlayEntrance {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
}

// Usage example — industrial AI sensor conflict (industrial-ai.md case study)
export const IndustrialEmergencyExample = () => (
  <EmergencyEscalationOverlay
    incidentType="safety-threshold-breach"
    incidentSummary="Unresolvable sensor conflict — Stage 3 Reactor, Line 2"
    incidentContext={[
      { key: 'Sensor A', value: '318°C (within safe range)' },
      { key: 'Sensor B', value: '394°C — ABOVE CRITICAL THRESHOLD (370°C)' },
      { key: 'Divergence duration', value: '4m 12s (sustained)' },
      { key: 'AI advisory status', value: 'Suspended — manual control required for Stage 3' },
    ]}
    escalationTarget="Shift Supervisor (pager) + Facility Safety System"
    referenceId="INC-2026-0704-003"
    auditId="emergency-industrial-sensor-001"
    onAcknowledge={() => console.log('Supervisor acknowledged — moving to physical inspection')}
    onAuditEvent={console.log}
  />
);
