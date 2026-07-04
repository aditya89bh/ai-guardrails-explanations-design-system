'use client';

import { WarningBanner } from './guardrail/WarningBanner.jsx';
import { ConfidenceBadge } from './guardrail/ConfidenceBadge.jsx';
import { RefusalCard } from './guardrail/RefusalCard.jsx';
import { RecoveryPrompt } from './guardrail/RecoveryPrompt.jsx';
import { PermissionGate } from './guardrail/PermissionGate.jsx';
import { EscalationCard } from './guardrail/EscalationCard.jsx';

/**
 * ResultPanel — renders the actual guardrail UI components in component-sequence order.
 * Each component corresponds to an activated pattern from the engine result.
 * Source: reference/react/ for full implementations.
 */
export function ResultPanel({ result, primitives, onAuditEvent }) {
  const { components } = result;

  if (components.length === 0) {
    return (
      <div className="pg-empty-state">
        <span className="pg-empty-state-icon">✓</span>
        <strong style={{ fontSize: 13, color: 'var(--pg-text-muted)' }}>No guardrails active</strong>
        <p style={{ fontSize: 12, color: 'var(--pg-text-dim)', maxWidth: 200 }}>
          High-confidence state with authorized user, no policy match, and fresh context produces clean output.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Pipeline flow label */}
      <div style={{ fontSize: 10, color: 'var(--pg-text-dim)', marginBottom: 2, lineHeight: 1.5 }}>
        Rendering {components.length} component{components.length !== 1 ? 's' : ''} in activation order
      </div>

      {components.map((comp, index) => (
        <ComponentRenderer
          key={`${comp.component}-${comp.variant}-${index}`}
          componentDef={comp}
          primitives={primitives}
          confidenceState={primitives.P2}
          authority={primitives.P8}
          onAuditEvent={onAuditEvent}
          index={index}
        />
      ))}

      {/* Accessibility metadata */}
      <div style={{
        fontSize: 10,
        color: 'var(--pg-text-dim)',
        borderTop: '1px solid var(--pg-border-subtle)',
        paddingTop: 10,
        marginTop: 4,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 9 }}>
          A11y summary
        </div>
        {components.map((c, i) => (
          <div key={i} style={{ fontFamily: 'var(--guardrail-font-mono)', fontSize: 9, marginBottom: 2, color: 'var(--pg-text-dim)' }}>
            {c.component} · {A11Y_ROLES[c.component] ?? 'role=region'}
          </div>
        ))}
        <div style={{ fontSize: 9, color: 'var(--pg-text-dim)', marginTop: 4, fontFamily: 'var(--guardrail-font-mono)' }}>
          WCAG 2.1 AA · prefers-reduced-motion supported
        </div>
      </div>
    </div>
  );
}

const A11Y_ROLES = {
  EscalationOverlay: 'role=alertdialog · aria-live=assertive · focus-trap',
  EscalationCard:    'role=alert · aria-live=polite',
  WarningBanner:     'role=alert · aria-live=assertive (blocking) / polite (advisory)',
  PermissionGate:    'role=alertdialog · deny-first tab order · passive-dismiss=deny',
  RefusalCard:       'role=alert · aria-atomic=true',
  ConfidenceBadge:   'role=status · aria-live=polite · expand/collapse',
  RecoveryPrompt:    'role=status · aria-live=polite',
};

function ComponentRenderer({ componentDef, primitives, confidenceState, authority, onAuditEvent, index }) {
  const { component, variant, severity, patternId } = componentDef;

  const sharedProps = {
    variant,
    severity,
    onAuditEvent: (event) => onAuditEvent?.({ ...event, patternId: event.patternId ?? patternId }),
  };

  const rendered = (() => {
    switch (component) {
      case 'WarningBanner':
        return (
          <WarningBanner
            {...sharedProps}
            policyRef={variant === 'policy' ? 'policy-rule-01' : undefined}
          />
        );
      case 'PermissionGate':
        return <PermissionGate {...sharedProps} authority={authority} />;
      case 'ConfidenceBadge':
        return <ConfidenceBadge {...sharedProps} confidenceState={confidenceState} />;
      case 'RefusalCard':
        return <RefusalCard {...sharedProps} primitives={primitives} />;
      case 'RecoveryPrompt':
        return <RecoveryPrompt {...sharedProps} />;
      case 'EscalationCard':
      case 'EscalationOverlay':
        return <EscalationCard {...sharedProps} />;
      default:
        return (
          <div style={{
            padding: 10,
            background: 'var(--pg-surface)',
            border: '1px solid var(--pg-border)',
            borderRadius: 'var(--guardrail-radius-md)',
            fontSize: 11,
            color: 'var(--pg-text-dim)',
          }}>
            {component} / {variant}
          </div>
        );
    }
  })();

  return (
    <div>
      {/* Component header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
        fontSize: 10,
        color: 'var(--pg-text-dim)',
      }}>
        <span style={{ fontFamily: 'var(--guardrail-font-mono)', color: 'var(--pg-border)' }}>{index + 1}.</span>
        <span style={{ fontFamily: 'var(--guardrail-font-mono)', color: 'var(--pg-accent)' }}>{component}</span>
        <span style={{ color: 'var(--pg-border)' }}>·</span>
        <span style={{ fontFamily: 'var(--guardrail-font-mono)', color: 'var(--pg-text-dim)' }}>{variant}</span>
        <span style={{ marginLeft: 'auto', fontSize: 9, color: SEVERITY_COLORS[severity], fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {severity}
        </span>
      </div>
      {rendered}
    </div>
  );
}

const SEVERITY_COLORS = {
  informational: '#3b82f6',
  advisory:      '#f59e0b',
  caution:       '#f97316',
  blocking:      '#ec4899',
  critical:      '#ef4444',
};
