'use client';

/**
 * ConfidenceBadge / Explanation components — playground adaptation
 * Spec: components/explanation/component-spec.md
 * Full implementation: reference/react/ConfidenceBadge.jsx
 *
 * Handles multiple explanation pattern variants in one component:
 *   detailed   — confidence disclosure with expansion
 *   limitation — limitation-disclosure
 *   sources    — source-citation panel
 *   reasoning  — reasoning-trace panel
 */

export function ConfidenceBadge({ variant, confidenceState, depth = 'detailed', onAuditEvent }) {
  const config = CONFIDENCE_CONFIG[confidenceState] ?? CONFIDENCE_CONFIG.moderate;

  if (variant === 'limitation') {
    return (
      <ExplanationCard
        icon="⚠"
        label="Limitation Disclosure"
        color={config.color}
        surface={config.surface}
        spec="patterns/explanation/limitation-disclosure.md"
      >
        <p style={{ fontSize: 12, margin: 0, lineHeight: 1.5 }}>
          {DEMO_LIMITATIONS[confidenceState] ?? 'Specific capability, knowledge, or scope limitations apply to this output. Review before acting.'}
        </p>
      </ExplanationCard>
    );
  }

  if (variant === 'sources') {
    return (
      <ExplanationCard
        icon="📄"
        label="Source Citation"
        color="#6366f1"
        surface="rgba(99,102,241,0.06)"
        spec="patterns/explanation/source-citation.md"
      >
        <p style={{ fontSize: 11, color: 'rgba(99,102,241,0.8)', marginBottom: 8 }}>
          Claim-level attribution (P10 low or Risk ≥ 2 detected)
        </p>
        {DEMO_SOURCES.map((s, i) => (
          <div key={i} style={{ fontSize: 11, padding: '4px 0', borderBottom: '1px solid rgba(99,102,241,0.1)', color: '#6366f1' }}>
            [{i + 1}] {s.text} <span style={{ opacity: 0.6 }}>({s.date})</span>
            {s.stale && <span style={{ marginLeft: 6, color: '#a855f7' }}>⏱ stale</span>}
          </div>
        ))}
      </ExplanationCard>
    );
  }

  if (variant === 'reasoning') {
    return (
      <ExplanationCard
        icon="🧠"
        label="Reasoning Trace"
        color="#06b6d4"
        surface="rgba(6,182,212,0.06)"
        spec="patterns/explanation/reasoning-trace.md"
      >
        <p style={{ fontSize: 11, color: '#06b6d4', marginBottom: 6 }}>Conflicting evidence — step-by-step reasoning:</p>
        {DEMO_REASONING_STEPS.map((step, i) => (
          <div key={i} style={{ fontSize: 11, display: 'flex', gap: 8, marginBottom: 6 }}>
            <span style={{ color: 'rgba(6,182,212,0.5)', flexShrink: 0 }}>{i + 1}.</span>
            <span style={{ color: '#94a3b8', lineHeight: 1.4 }}>{step}</span>
          </div>
        ))}
      </ExplanationCard>
    );
  }

  // Default: confidence-disclosure
  return (
    <ExplanationCard
      icon="📊"
      label={`Confidence Disclosure — ${config.label}`}
      color={config.color}
      surface={config.surface}
      spec="patterns/explanation/confidence-disclosure.md"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          height: 22, padding: '0 10px',
          borderRadius: 'var(--guardrail-radius-full)',
          fontSize: 11, fontWeight: 700,
          background: `${config.color}18`, color: config.color,
          border: `1px solid ${config.color}33`,
        }}>
          {config.label}
        </span>
        <span style={{ fontSize: 10, color: '#64748b' }}>
          depth: {depth}
        </span>
      </div>
      <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
        {config.description}
      </p>
      {depth === 'detailed' && confidenceState !== 'high' && (
        <div style={{
          marginTop: 8, padding: 8,
          background: 'rgba(0,0,0,0.1)',
          borderRadius: 'var(--guardrail-radius-sm)',
          fontSize: 10,
          color: '#64748b',
          fontFamily: 'var(--guardrail-font-mono)',
        }}>
          ARIA: role=status · aria-live=polite · expand/collapse toggle supported
        </div>
      )}
    </ExplanationCard>
  );
}

function ExplanationCard({ icon, label, color, surface, children, spec }) {
  return (
    <div style={{
      backgroundColor: surface,
      border: `1px solid ${color}22`,
      borderRadius: 'var(--guardrail-radius-md)',
      padding: 12,
      color: '#e2e8f0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color }}>
          {label}
        </span>
      </div>
      {children}
      <p style={{ fontSize: 9, color: '#334155', margin: '8px 0 0', fontFamily: 'var(--guardrail-font-mono)' }}>
        spec: {spec}
      </p>
    </div>
  );
}

const CONFIDENCE_CONFIG = {
  high:         { label: 'High Confidence',         color: '#22c55e', surface: 'rgba(34,197,94,0.05)',  description: 'No confidence disclosure required. HC state.' },
  moderate:     { label: 'Moderate Confidence',     color: '#86efac', surface: 'rgba(134,239,172,0.05)', description: 'Some limitations may apply. Surface badge optional at Risk<3.' },
  low:          { label: 'Low Confidence',          color: '#f59e0b', surface: 'rgba(245,158,11,0.05)', description: 'Significant uncertainty. Detailed disclosure required. See limitation-disclosure for specifics.' },
  conflicting:  { label: 'Conflicting Evidence',    color: '#f97316', surface: 'rgba(249,115,22,0.05)', description: 'Source conflict detected. CE ≠ LC. No recommendation can be issued until resolved.' },
  insufficient: { label: 'Insufficient Information',color: '#fb923c', surface: 'rgba(251,146,60,0.05)', description: 'Required inputs absent. Clarification-request is the correct pattern (not constrained-completion).' },
  stale:        { label: 'Stale Context',           color: '#a855f7', surface: 'rgba(168,85,247,0.05)', description: 'Data age exceeds freshness threshold. Each affected claim must be individually labeled.' },
  unresolvable: { label: 'Unresolvable',            color: '#ef4444', surface: 'rgba(239,68,68,0.05)', description: 'CE state sustained beyond window. No output possible. Emergency or abandon-recovery activates.' },
};

const DEMO_LIMITATIONS = {
  low: 'Available evidence is limited. No post-approval surveillance data is indexed for this query.',
  stale: 'Knowledge base last indexed 7 months ago. Current clinical guidelines may differ.',
  conflicting: 'Conflicting sources cannot be reconciled without physical inspection or additional evidence.',
  insufficient: 'Required fields are absent. The AI cannot evaluate without: [missing fields listed].',
};

const DEMO_SOURCES = [
  { text: 'Primary pharmacology reference — well-established CYP3A4 induction mechanism', date: 'Current', stale: false },
  { text: 'Manufacturer prescribing information (original approval)', date: '2022', stale: true },
  { text: 'Phase 1 PK study (N=12)', date: '2023', stale: true },
];

const DEMO_REASONING_STEPS = [
  'Source A (Internal Security Advisory): PBKDF2 vulnerable — non-constant-time comparison branch in v2.4.1.',
  'Source B (Vendor documentation): PBKDF2 uses constant-time comparison — confirmed by 2024 third-party audit.',
  'These claims are directly contradictory about the same function in the same version.',
  'Possible explanations: (1) v2.4 regression after audit, (2) build artifact differs from upstream, (3) audit scope excluded this code path.',
  'None of these possibilities can be resolved by the AI without direct source code access.',
];
