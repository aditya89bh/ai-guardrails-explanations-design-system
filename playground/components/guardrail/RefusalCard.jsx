'use client';

/**
 * RefusalCard — playground adaptation
 * Spec: components/refusal/component-spec.md
 * Full implementation: reference/react/RefusalCard.jsx
 */

export function RefusalCard({ variant = 'safe', primitives, onAuditEvent }) {
  const config = REFUSAL_CONFIG[variant] ?? REFUSAL_CONFIG.safe;

  return (
    <div
      role="alert"
      aria-atomic="true"
      style={{
        backgroundColor: 'var(--guardrail-severity-caution-surface)',
        color: 'var(--guardrail-severity-caution-text)',
        borderRadius: 'var(--guardrail-radius-md)',
        padding: 'var(--guardrail-space-md)',
        border: '1px solid var(--guardrail-severity-caution-border)',
      }}
      data-guardrail-pattern={`${variant}-refusal`}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>{config.icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>
          {config.label}
        </span>
        {variant === 'policy' && (
          <span style={{ fontSize: 9, fontWeight: 700, background: 'var(--guardrail-severity-caution-border)', borderRadius: 4, padding: '1px 5px', marginLeft: 'auto' }}>
            ARIA: role=alert
          </span>
        )}
      </div>

      {/* Refusal reason */}
      <p style={{ fontSize: 13, fontWeight: 500, margin: '0 0 8px', lineHeight: 1.5 }}>
        {config.message}
      </p>

      {/* Completed content (constrained/partial) */}
      {(variant === 'constrained' || variant === 'partial') && (
        <div style={{
          background: 'rgba(0,0,0,0.06)',
          borderRadius: 'var(--guardrail-radius-sm)',
          padding: 8,
          marginBottom: 8,
          fontSize: 11,
          color: 'var(--guardrail-severity-caution-text)',
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6, marginBottom: 4 }}>
            {variant === 'constrained' ? 'Available information' : 'Completed'}
          </div>
          {config.completedText}
        </div>
      )}

      {/* Exclusion notice */}
      {config.excludedText && (
        <div style={{ borderTop: '1px solid var(--guardrail-severity-caution-border)', paddingTop: 8, marginBottom: 8, fontSize: 11 }}>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', opacity: 0.6 }}>Not included: </span>
          {config.excludedText}
        </div>
      )}

      {/* Alternatives */}
      {config.alternatives && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Alternatives you can try:</div>
          {config.alternatives.map((alt, i) => (
            <div key={i} style={{
              padding: '6px 8px',
              background: 'rgba(0,0,0,0.06)',
              borderRadius: 'var(--guardrail-radius-sm)',
              marginBottom: 4,
              fontSize: 11,
              cursor: 'default',
            }}>
              <div style={{ fontWeight: 600 }}>{alt.label}</div>
              {alt.description && <div style={{ opacity: 0.7, marginTop: 2, fontSize: 10 }}>{alt.description}</div>}
            </div>
          ))}
          <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4 }}>
            + "None of these" — always present on alternative lists (spec requirement)
          </div>
        </div>
      )}

      {/* Clarification fields */}
      {variant === 'clarification' && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Please provide:</div>
          {['Transaction date', 'Last 4 digits of payment method', 'Amount'].map((field, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 10, marginBottom: 2, opacity: 0.7 }}>{field}</div>
              <div style={{
                height: 28,
                background: 'rgba(0,0,0,0.08)',
                borderRadius: 4,
                border: '1px solid var(--guardrail-severity-caution-border)',
                fontSize: 10,
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                color: 'rgba(0,0,0,0.4)',
              }}>
                Enter value...
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 9, color: 'inherit', opacity: 0.3, margin: '8px 0 0', fontFamily: 'var(--guardrail-font-mono)' }}>
        spec: components/refusal/component-spec.md
      </p>
    </div>
  );
}

const REFUSAL_CONFIG = {
  policy: {
    icon: '🚫',
    label: 'Policy Refusal',
    message: 'This transaction has been placed on hold. Security policy requires additional verification before international wire transfers to new beneficiaries.',
    excludedText: 'Transaction execution. Policy rule: fin-rule-01.',
    alternatives: null,
  },
  safe: {
    icon: '⛔',
    label: 'Safe Refusal',
    message: 'I cannot recommend for or against this library for key derivation. Two sources with comparable authority make incompatible claims about its timing attack resistance.',
    excludedText: null,
    alternatives: [
      { label: 'Submit to internal security advisory process', description: 'The security team can review the source directly.' },
      { label: 'Consider an alternative library', description: 'Whose security posture is consistently documented.' },
    ],
  },
  constrained: {
    icon: '📋',
    label: 'Constrained Completion',
    message: 'I can provide the available pharmacokinetic data within the scope of the current evidence — a specific dosage recommendation is excluded.',
    completedText: 'Rifampicin is a potent CYP3A4 inducer. Lorlatinib is a CYP3A4 substrate. Co-administration is expected to significantly reduce lorlatinib plasma exposure.',
    excludedText: 'Definitive dosage adjustment recommendation. Reason: insufficient post-approval PK data indexed.',
    alternatives: null,
  },
  partial: {
    icon: '📄',
    label: 'Partial Completion',
    message: 'I can process the portions of this request that have complete documentation.',
    completedText: 'Fields with complete documentation: claimant details, accident description, reported damages.',
    excludedText: 'Medical report assessment — required document missing from submission.',
    alternatives: null,
  },
  clarification: {
    icon: '❓',
    label: 'Clarification Request',
    message: "I need additional information to locate this charge in your records.",
    excludedText: null,
    alternatives: null,
  },
  alternative: {
    icon: '↩',
    label: 'Alternative Suggestion',
    message: 'The requested approach is unavailable. Here are alternatives that achieve a similar goal:',
    excludedText: null,
    alternatives: [
      { label: 'Alternative path 1', description: 'Achieves the same goal via a different route.' },
      { label: 'Alternative path 2', description: 'Partially achieves the goal with lower risk.' },
    ],
  },
  handoff: {
    icon: '🤝',
    label: 'Human Handoff',
    message: "I haven't been able to resolve this issue from the information available to me. Connecting you to a support specialist who can access your full account history.",
    excludedText: null,
    alternatives: null,
  },
};
