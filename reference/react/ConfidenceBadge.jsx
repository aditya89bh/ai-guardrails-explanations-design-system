/**
 * ConfidenceBadge — Reference implementation
 *
 * Implements: confidence-disclosure, stale-context-state, source-citation (surface depth)
 * Spec: components/explanation/component-spec.md
 * Accessibility: components/explanation/accessibility.md
 * Tokens: components/design-tokens.md
 *
 * Renders at three disclosure depths:
 *   surface  — badge only (informational, for MC state)
 *   standard — badge + brief expansion (advisory, for LC state)
 *   detailed — badge + full explanation + source list (for LC + stale, or Risk >= 3)
 */

import { useRef, useState } from 'react';

// Confidence state configuration
// Maps P2 confidence state to display properties
const confidenceConfig = {
  high: {
    label: 'High confidence',
    shortLabel: 'High',
    severity: 'informational',
    surface: 'var(--guardrail-severity-informational-surface)',
    text: 'var(--guardrail-severity-informational-text)',
    icon: 'var(--guardrail-severity-informational-icon)',
    ariaDescription: 'Output has high confidence. Sources are well-established.',
  },
  moderate: {
    label: 'Moderate confidence',
    shortLabel: 'Moderate',
    severity: 'advisory',
    surface: 'var(--guardrail-severity-advisory-surface)',
    text: 'var(--guardrail-severity-advisory-text)',
    icon: 'var(--guardrail-severity-advisory-icon)',
    ariaDescription: 'Output has moderate confidence. Some limitations may apply.',
  },
  low: {
    label: 'Low confidence',
    shortLabel: 'Low',
    severity: 'caution',
    surface: 'var(--guardrail-severity-caution-surface)',
    text: 'var(--guardrail-severity-caution-text)',
    icon: 'var(--guardrail-severity-caution-icon)',
    ariaDescription: 'Output has low confidence. Review sources and limitations before acting.',
  },
  conflicting: {
    label: 'Conflicting evidence',
    shortLabel: 'Conflict',
    severity: 'caution',
    surface: 'var(--guardrail-severity-caution-surface)',
    text: 'var(--guardrail-severity-caution-text)',
    icon: 'var(--guardrail-severity-caution-icon)',
    ariaDescription: 'Sources provide conflicting information. No recommendation is available.',
  },
  insufficient: {
    label: 'Insufficient information',
    shortLabel: 'Incomplete',
    severity: 'caution',
    surface: 'var(--guardrail-severity-caution-surface)',
    text: 'var(--guardrail-severity-caution-text)',
    icon: 'var(--guardrail-severity-caution-icon)',
    ariaDescription: 'Required information is missing. Clarification is needed to proceed.',
  },
  stale: {
    label: 'Stale context',
    shortLabel: 'Outdated',
    severity: 'advisory',
    surface: 'var(--guardrail-severity-advisory-surface)',
    text: 'var(--guardrail-severity-advisory-text)',
    icon: 'var(--guardrail-severity-advisory-icon)',
    ariaDescription: 'Source data may be outdated. Verify current information before acting.',
  },
};

/**
 * @param {object} props
 * @param {'high'|'moderate'|'low'|'conflicting'|'insufficient'|'stale'} props.confidenceState  - P2 state
 * @param {'surface'|'standard'|'detailed'} props.depth   - Disclosure depth
 * @param {string} [props.explanation]                     - Explanation text for standard/detailed depth
 * @param {string} [props.limitationText]                  - Limitation text for detailed depth
 * @param {Array<{id:string, text:string, date:string, type:string}>} [props.sources] - Sources for detailed depth
 * @param {boolean} [props.compoundStale]                  - Whether stale context is compounding another state
 * @param {string} [props.staleDataAge]                    - Description of how old the data is
 * @param {string} props.auditId                           - Audit event ID
 * @param {function} [props.onExpand]                      - Called when badge is expanded
 * @param {function} [props.onAuditEvent]                  - Receives audit event object
 */
export function ConfidenceBadge({
  confidenceState = 'moderate',
  depth = 'surface',
  explanation,
  limitationText,
  sources = [],
  compoundStale = false,
  staleDataAge,
  auditId,
  onExpand,
  onAuditEvent,
}) {
  const [expanded, setExpanded] = useState(false);
  const expandRef = useRef(null);

  const config = confidenceConfig[confidenceState] ?? confidenceConfig.moderate;

  function handleToggle() {
    const next = !expanded;
    setExpanded(next);
    if (next) {
      onAuditEvent?.({
        eventType: 'CONFIDENCE_DISCLOSURE_EXPANDED',
        auditId,
        confidenceState,
        depth,
        timestamp: new Date().toISOString(),
      });
      onExpand?.();
    }
  }

  const canExpand = depth !== 'surface' && (explanation || limitationText || sources.length > 0);

  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--guardrail-space-xs)' }}
      data-guardrail-pattern="confidence-disclosure"
      data-guardrail-state={confidenceState}
      data-guardrail-depth={depth}
      data-audit-id={auditId}
    >
      {/* Surface badge — always visible */}
      <span
        role="img"
        aria-label={config.ariaDescription}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: config.surface,
          color: config.text,
          borderRadius: 'var(--guardrail-radius-full)',
          padding: '2px var(--guardrail-space-sm)',
          fontSize: 'var(--guardrail-font-size-sm)',
          fontWeight: 'var(--guardrail-font-weight-medium)',
        }}
      >
        <span aria-hidden="true" style={{ color: config.icon }} data-guardrail-icon={`confidence-${confidenceState}`} />
        {config.shortLabel}
        {/* Stale compound indicator */}
        {compoundStale && (
          <span
            aria-label={`Data as of ${staleDataAge}`}
            title={`Data as of ${staleDataAge}`}
            style={{
              fontSize: '10px',
              opacity: 0.75,
              marginLeft: '2px',
            }}
          >
            ⏱
          </span>
        )}
      </span>

      {/* Expand toggle for standard/detailed depth */}
      {canExpand && (
        <button
          ref={expandRef}
          onClick={handleToggle}
          aria-expanded={expanded}
          aria-controls="confidence-detail-panel"
          aria-label={expanded ? 'Collapse confidence details' : 'Expand confidence details'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            color: config.text,
            fontSize: 'var(--guardrail-font-size-sm)',
          }}
        >
          {expanded ? '▲' : '▼'}
        </button>
      )}

      {/* Expanded detail panel */}
      {expanded && (
        <div
          id="confidence-detail-panel"
          role="region"
          aria-label="Confidence details"
          aria-live="polite"
          style={{
            position: 'absolute',
            backgroundColor: config.surface,
            color: config.text,
            borderRadius: 'var(--guardrail-radius-md)',
            padding: 'var(--guardrail-space-md)',
            boxShadow: 'var(--guardrail-elevation-2)',
            maxWidth: '360px',
            zIndex: 'var(--guardrail-priority-ambient)',
            marginTop: 'var(--guardrail-space-xs)',
          }}
        >
          {explanation && (
            <p style={{ margin: '0 0 var(--guardrail-space-sm)', fontSize: 'var(--guardrail-font-size-sm)' }}>
              {explanation}
            </p>
          )}

          {/* Limitation disclosure — rendered at detailed depth */}
          {depth === 'detailed' && limitationText && (
            <div
              style={{
                borderTop: `1px solid var(--guardrail-severity-${config.severity}-border)`,
                paddingTop: 'var(--guardrail-space-sm)',
                marginTop: 'var(--guardrail-space-sm)',
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
                Limitations
              </p>
              <p style={{ margin: 0, fontSize: 'var(--guardrail-font-size-sm)' }}>{limitationText}</p>
            </div>
          )}

          {/* Stale context detail */}
          {compoundStale && staleDataAge && (
            <p
              style={{
                margin: 'var(--guardrail-space-sm) 0 0',
                fontSize: 'var(--guardrail-font-size-sm)',
                opacity: 0.8,
              }}
            >
              Data as of: {staleDataAge}
            </p>
          )}

          {/* Source list — claim-level, detailed depth */}
          {depth === 'detailed' && sources.length > 0 && (
            <div
              style={{
                borderTop: `1px solid var(--guardrail-severity-${config.severity}-border)`,
                paddingTop: 'var(--guardrail-space-sm)',
                marginTop: 'var(--guardrail-space-sm)',
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
                Sources
              </p>
              <ul style={{ margin: 0, padding: '0 0 0 var(--guardrail-space-md)' }}>
                {sources.map((source) => (
                  <li key={source.id} style={{ fontSize: 'var(--guardrail-font-size-sm)', marginBottom: '4px' }}>
                    {source.text}
                    {source.date && (
                      <span style={{ opacity: 0.65, marginLeft: '4px' }}>({source.date})</span>
                    )}
                    {source.type === 'stale' && (
                      <span
                        aria-label="Stale source"
                        style={{ color: config.icon, marginLeft: '4px' }}
                      >
                        ⏱
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </span>
  );
}

// --- Usage examples ---

// Example 1: LC state with detailed disclosure (healthcare drug interaction case study)
export const LowConfidenceDetailedExample = () => (
  <ConfidenceBadge
    confidenceState="low"
    depth="detailed"
    explanation="Limited published data is available for this specific drug combination. The available evidence is from a Phase 1 study with a small participant cohort."
    limitationText="Post-approval surveillance data for lorlatinib, if available, is not reflected in the current knowledge index (last indexed: 7 months ago)."
    compoundStale={true}
    staleDataAge="Knowledge base indexed 7 months ago"
    sources={[
      { id: 'src-1', text: 'Rifampicin CYP3A4 induction — primary pharmacology references', date: 'Current', type: 'current' },
      { id: 'src-2', text: 'Lorlatinib metabolic data — manufacturer prescribing information', date: 'Original approval', type: 'stale' },
      { id: 'src-3', text: 'Lorlatinib PK study — Phase 1, N=12', date: '2023', type: 'stale' },
    ]}
    auditId="badge-lc-drug-001"
    onAuditEvent={console.log}
  />
);

// Example 2: CE state (developer copilot CVE conflict case study)
export const ConflictingEvidenceExample = () => (
  <ConfidenceBadge
    confidenceState="conflicting"
    depth="detailed"
    explanation="Two sources with comparable authority make directly contradictory claims about the timing attack resistance of this library's PBKDF2 implementation."
    limitationText="The AI cannot determine which source is correct. Resolving this conflict requires a direct code review of the v2.4.1 PBKDF2 implementation."
    sources={[
      { id: 'src-1', text: 'Internal Security Advisory: PBKDF2 vulnerable to timing attack (non-constant-time comparison branch). Avoid production use.', date: '3 weeks ago', type: 'current' },
      { id: 'src-2', text: 'CryptoLibX Documentation: PBKDF2 uses constant-time comparison. Confirmed resistant per third-party audit.', date: '18-month-old audit', type: 'stale' },
    ]}
    auditId="badge-ce-cve-001"
    onAuditEvent={console.log}
  />
);
