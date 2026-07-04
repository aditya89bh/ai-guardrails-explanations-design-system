/**
 * RefusalCard — Reference implementation
 *
 * Implements: safe-refusal, partial-completion, constrained-completion,
 *             alternative-suggestion, clarification-request, human-handoff, policy-refusal
 * Spec: components/refusal/component-spec.md
 * Accessibility: components/refusal/accessibility.md
 * Tokens: components/design-tokens.md
 *
 * Key design rules:
 * - Focus moves to the first path-forward action on mount (not the refusal message).
 * - "None of these" is always available on alternative lists.
 * - The exclusion notice (what the AI cannot do) is never collapsed by default.
 * - Refusal copy never uses the word "sorry."
 */

import { useEffect, useRef } from 'react';

/**
 * @param {object} props
 * @param {'safe'|'partial'|'constrained'|'alternative'|'clarification'|'handoff'|'policy'} props.variant
 * @param {string} props.refusalReason              - Why the AI declined (concise, specific)
 * @param {string} [props.completedContent]          - Content the AI CAN provide (partial/constrained)
 * @param {string} [props.excludedContent]           - What is excluded and why
 * @param {Array<{id:string,label:string,description:string}>} [props.alternatives] - Alternative options
 * @param {Array<{id:string,label:string,placeholder:string}>} [props.clarificationFields] - Fields for clarification
 * @param {string} [props.handoffTarget]             - Human/team the user is being handed to
 * @param {string} [props.handoffEta]                - Estimated wait time for handoff
 * @param {string} [props.policyRef]                 - Policy rule ID for policy-refusal variant
 * @param {string} props.auditId                     - Audit event ID (required)
 * @param {function} [props.onAlternativeSelect]     - Called when user selects an alternative
 * @param {function} [props.onClarificationSubmit]   - Called with clarification data
 * @param {function} [props.onHandoffConfirm]        - Called when user confirms handoff
 * @param {function} [props.onNoneOfThese]           - Called when user selects "None of these"
 * @param {function} [props.onAuditEvent]            - Receives audit event object
 */
export function RefusalCard({
  variant = 'safe',
  refusalReason,
  completedContent,
  excludedContent,
  alternatives = [],
  clarificationFields = [],
  handoffTarget,
  handoffEta,
  policyRef,
  auditId,
  onAlternativeSelect,
  onClarificationSubmit,
  onHandoffConfirm,
  onNoneOfThese,
  onAuditEvent,
}) {
  const firstActionRef = useRef(null);
  const clarificationData = useRef({});

  // Focus moves to first path-forward action on mount
  useEffect(() => {
    firstActionRef.current?.focus();
    onAuditEvent?.({
      eventType: 'REFUSAL_RENDERED',
      auditId,
      variant,
      patternId: `${variant}-refusal`,
      timestamp: new Date().toISOString(),
    });
  }, []);

  function handleAlternativeSelect(altId) {
    onAuditEvent?.({
      eventType: 'ALTERNATIVE_SELECTED',
      auditId,
      selectedAlternativeId: altId,
      timestamp: new Date().toISOString(),
    });
    onAlternativeSelect?.(altId);
  }

  function handleNoneOfThese() {
    onAuditEvent?.({
      eventType: 'NONE_OF_ALTERNATIVES_SELECTED',
      auditId,
      timestamp: new Date().toISOString(),
    });
    onNoneOfThese?.();
  }

  function handleClarificationSubmit() {
    onAuditEvent?.({
      eventType: 'CLARIFICATION_SUBMITTED',
      auditId,
      fields: Object.keys(clarificationData.current),
      timestamp: new Date().toISOString(),
    });
    onClarificationSubmit?.(clarificationData.current);
  }

  return (
    <div
      role="alert"
      aria-atomic="true"
      style={{
        backgroundColor: 'var(--guardrail-severity-caution-surface)',
        color: 'var(--guardrail-severity-caution-text)',
        borderRadius: 'var(--guardrail-radius-md)',
        padding: 'var(--guardrail-space-lg)',
        border: `1px solid var(--guardrail-severity-caution-border)`,
      }}
      data-guardrail-pattern={`${variant}-refusal`}
      data-audit-id={auditId}
    >
      {/* Refusal reason — the "what" and "why" */}
      <div style={{ marginBottom: 'var(--guardrail-space-md)' }}>
        <p
          style={{
            margin: 0,
            fontWeight: 'var(--guardrail-font-weight-medium)',
            fontSize: 'var(--guardrail-font-size-md)',
          }}
        >
          {refusalReason}
        </p>
        {/* Policy attribution for policy-refusal */}
        {variant === 'policy' && policyRef && (
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 'var(--guardrail-font-size-sm)',
              fontFamily: 'var(--guardrail-font-mono)',
              opacity: 0.75,
            }}
          >
            Policy: {policyRef}
          </p>
        )}
      </div>

      {/* Completed content — partial/constrained variants */}
      {(variant === 'partial' || variant === 'constrained') && completedContent && (
        <div
          style={{
            backgroundColor: 'var(--guardrail-severity-advisory-surface)',
            borderRadius: 'var(--guardrail-radius-sm)',
            padding: 'var(--guardrail-space-md)',
            marginBottom: 'var(--guardrail-space-md)',
          }}
        >
          <p
            style={{
              margin: '0 0 var(--guardrail-space-xs)',
              fontSize: 'var(--guardrail-font-size-xs)',
              fontWeight: 'var(--guardrail-font-weight-medium)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              opacity: 0.7,
            }}
          >
            {variant === 'constrained' ? 'Available information' : 'Completed'}
          </p>
          <p style={{ margin: 0, fontSize: 'var(--guardrail-font-size-sm)' }}>{completedContent}</p>
        </div>
      )}

      {/* Exclusion notice — never collapsed by default */}
      {excludedContent && (
        <div
          style={{
            borderTop: `1px solid var(--guardrail-severity-caution-border)`,
            paddingTop: 'var(--guardrail-space-sm)',
            marginTop: 'var(--guardrail-space-sm)',
            marginBottom: 'var(--guardrail-space-md)',
          }}
        >
          <p
            style={{
              margin: '0 0 var(--guardrail-space-xs)',
              fontSize: 'var(--guardrail-font-size-xs)',
              fontWeight: 'var(--guardrail-font-weight-medium)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              opacity: 0.7,
            }}
          >
            Not included
          </p>
          <p style={{ margin: 0, fontSize: 'var(--guardrail-font-size-sm)' }}>{excludedContent}</p>
        </div>
      )}

      {/* Alternative options */}
      {alternatives.length > 0 && (
        <div style={{ marginBottom: 'var(--guardrail-space-md)' }}>
          <p
            style={{
              margin: '0 0 var(--guardrail-space-sm)',
              fontWeight: 'var(--guardrail-font-weight-medium)',
              fontSize: 'var(--guardrail-font-size-sm)',
            }}
          >
            Alternatives you can try:
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {alternatives.map((alt, index) => (
              <li key={alt.id} style={{ marginBottom: 'var(--guardrail-space-xs)' }}>
                <button
                  ref={index === 0 ? firstActionRef : undefined}
                  onClick={() => handleAlternativeSelect(alt.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    width: '100%',
                    backgroundColor: 'var(--guardrail-severity-advisory-surface)',
                    border: `1px solid var(--guardrail-severity-caution-border)`,
                    borderRadius: 'var(--guardrail-radius-sm)',
                    padding: 'var(--guardrail-space-sm) var(--guardrail-space-md)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    minHeight: '44px',
                  }}
                >
                  <span style={{ fontWeight: 'var(--guardrail-font-weight-medium)', fontSize: 'var(--guardrail-font-size-sm)' }}>
                    {alt.label}
                  </span>
                  {alt.description && (
                    <span style={{ fontSize: 'var(--guardrail-font-size-xs)', opacity: 0.75, marginTop: '2px' }}>
                      {alt.description}
                    </span>
                  )}
                </button>
              </li>
            ))}
            {/* "None of these" — always present on alternative lists */}
            <li>
              <button
                onClick={handleNoneOfThese}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--guardrail-font-size-sm)',
                  textDecoration: 'underline',
                  padding: 'var(--guardrail-space-xs) 0',
                  minHeight: '44px',
                  color: 'var(--guardrail-severity-caution-text)',
                }}
              >
                None of these
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Clarification form */}
      {variant === 'clarification' && clarificationFields.length > 0 && (
        <div style={{ marginBottom: 'var(--guardrail-space-md)' }}>
          <p style={{ margin: '0 0 var(--guardrail-space-sm)', fontWeight: 'var(--guardrail-font-weight-medium)', fontSize: 'var(--guardrail-font-size-sm)' }}>
            Please provide the following:
          </p>
          {clarificationFields.map((field, index) => (
            <div key={field.id} style={{ marginBottom: 'var(--guardrail-space-sm)' }}>
              <label
                htmlFor={`clarification-${field.id}`}
                style={{ display: 'block', fontSize: 'var(--guardrail-font-size-sm)', marginBottom: '4px' }}
              >
                {field.label}
              </label>
              <input
                ref={index === 0 ? firstActionRef : undefined}
                id={`clarification-${field.id}`}
                type="text"
                placeholder={field.placeholder}
                onChange={(e) => { clarificationData.current[field.id] = e.target.value; }}
                style={{
                  width: '100%',
                  padding: 'var(--guardrail-space-sm)',
                  borderRadius: 'var(--guardrail-radius-sm)',
                  border: `1px solid var(--guardrail-severity-caution-border)`,
                  fontSize: 'var(--guardrail-font-size-sm)',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
          <button
            onClick={handleClarificationSubmit}
            style={{
              backgroundColor: 'var(--guardrail-severity-caution-icon)',
              color: 'var(--guardrail-color-on-accent)',
              border: 'none',
              borderRadius: 'var(--guardrail-radius-sm)',
              padding: 'var(--guardrail-space-sm) var(--guardrail-space-md)',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Submit
          </button>
        </div>
      )}

      {/* Human handoff */}
      {variant === 'handoff' && (
        <div>
          {handoffTarget && (
            <p style={{ margin: '0 0 var(--guardrail-space-sm)', fontSize: 'var(--guardrail-font-size-sm)' }}>
              Connecting you to: <strong>{handoffTarget}</strong>
            </p>
          )}
          {handoffEta && (
            <p style={{ margin: '0 0 var(--guardrail-space-sm)', fontSize: 'var(--guardrail-font-size-sm)' }}>
              Estimated wait: {handoffEta}
            </p>
          )}
          <button
            ref={firstActionRef}
            onClick={() => {
              onAuditEvent?.({ eventType: 'HANDOFF_CONFIRMED', auditId, handoffTarget, timestamp: new Date().toISOString() });
              onHandoffConfirm?.();
            }}
            style={{
              backgroundColor: 'var(--guardrail-severity-caution-icon)',
              color: 'var(--guardrail-color-on-accent)',
              border: 'none',
              borderRadius: 'var(--guardrail-radius-sm)',
              padding: 'var(--guardrail-space-sm) var(--guardrail-space-md)',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Connect me now
          </button>
        </div>
      )}
    </div>
  );
}

// --- Usage example ---
// CE state safe-refusal (developer copilot case study)
export const SafeRefusalCEExample = () => (
  <RefusalCard
    variant="safe"
    refusalReason="I cannot recommend for or against CryptoLibX v2.4.1 for key derivation. Two sources with comparable authority make incompatible claims about its timing attack resistance."
    alternatives={[
      {
        id: 'alt-security-team',
        label: 'Submit to internal security advisory process',
        description: 'The security team can review the v2.4.1 source code directly to resolve this conflict.',
      },
      {
        id: 'alt-library',
        label: 'Consider AlternativeLibX for PBKDF2',
        description: 'Its timing attack resistance is consistently documented across three independent sources.',
      },
    ]}
    auditId="refusal-ce-cve-001"
    onAlternativeSelect={(id) => console.log('Selected:', id)}
    onNoneOfThese={() => console.log('None of these selected')}
    onAuditEvent={console.log}
  />
);
