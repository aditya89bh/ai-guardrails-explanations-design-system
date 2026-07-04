'use client';

import { useState } from 'react';
import { CATEGORY_COLORS, SEVERITY_COLORS } from '../data/patterns.js';

/**
 * EnginePanel — visualizes the decision engine output in three tabs:
 *   Rules    — each selection rule with its evaluation result and reason
 *   Patterns — activated patterns grouped by category
 *   Composition — composition constraints applied
 */
export function EnginePanel({ result, activeTab }) {
  if (activeTab === 'rules') return <RulesTab result={result} />;
  if (activeTab === 'patterns') return <PatternsTab result={result} />;
  if (activeTab === 'compose') return <CompositionTab result={result} />;
  return null;
}

// ── Rules Tab ─────────────────────────────────────────────────────────────
function RulesTab({ result }) {
  const [expandedRules, setExpandedRules] = useState(new Set(
    result.rules.filter(r => r.result === 'ACTIVATED').map(r => r.ruleId)
  ));

  function toggleRule(ruleId) {
    setExpandedRules(prev => {
      const next = new Set(prev);
      next.has(ruleId) ? next.delete(ruleId) : next.add(ruleId);
      return next;
    });
  }

  const activated = result.rules.filter(r => r.result === 'ACTIVATED');
  const skipped = result.rules.filter(r => r.result === 'SKIPPED');
  const notEval = result.rules.filter(r => r.result === 'NOT_EVALUATED');

  return (
    <div>
      {/* Summary row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Pill color="var(--pg-green)" label={`${activated.length} activated`} />
        <Pill color="var(--pg-text-dim)" label={`${skipped.length} skipped`} />
        {notEval.length > 0 && <Pill color="var(--pg-border)" label={`${notEval.length} not evaluated`} />}
        {result.meta.terminatedEarly && (
          <Pill color="var(--pg-yellow)" label="early termination" />
        )}
      </div>

      {/* Pipeline source label */}
      <p style={{ fontSize: 10, color: 'var(--pg-text-dim)', marginBottom: 10, lineHeight: 1.4 }}>
        Rules follow{' '}
        <code style={{ fontFamily: 'var(--guardrail-font-mono)', color: 'var(--pg-text-muted)' }}>
          docs/decision-flows/pattern-selection-engine.md
        </code>
      </p>

      {/* Activated rules first */}
      {activated.length > 0 && (
        <>
          <div className="pg-section-title">Activated</div>
          {activated.map(rule => (
            <RuleCard
              key={rule.ruleId}
              rule={rule}
              expanded={expandedRules.has(rule.ruleId)}
              onToggle={() => toggleRule(rule.ruleId)}
            />
          ))}
        </>
      )}

      {/* Skipped rules */}
      {skipped.length > 0 && (
        <>
          <div className="pg-section-title">Skipped</div>
          {skipped.map(rule => (
            <RuleCard
              key={rule.ruleId}
              rule={rule}
              expanded={expandedRules.has(rule.ruleId)}
              onToggle={() => toggleRule(rule.ruleId)}
            />
          ))}
        </>
      )}

      {/* Not evaluated */}
      {notEval.length > 0 && (
        <>
          <div className="pg-section-title">Not evaluated (early termination)</div>
          {notEval.map(rule => (
            <RuleCard
              key={rule.ruleId}
              rule={rule}
              expanded={expandedRules.has(rule.ruleId)}
              onToggle={() => toggleRule(rule.ruleId)}
            />
          ))}
        </>
      )}
    </div>
  );
}

function RuleCard({ rule, expanded, onToggle }) {
  const statusClass = rule.result === 'ACTIVATED' ? 'activated' : rule.result === 'SKIPPED' ? 'skipped' : 'not-eval';
  const statusIcon = rule.result === 'ACTIVATED' ? '✓' : rule.result === 'SKIPPED' ? '–' : '·';

  return (
    <div className={`pg-rule ${statusClass}`}>
      <button
        className="pg-rule-header"
        onClick={onToggle}
        aria-expanded={expanded}
        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
      >
        <span className={`pg-rule-status ${statusClass}`} aria-label={rule.result}>
          {statusIcon}
        </span>
        <span className="pg-rule-id">{rule.ruleId}</span>
        <span className="pg-rule-label">{rule.label}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--pg-text-dim)', flexShrink: 0 }}>
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div className="pg-rule-body">
          <p className="pg-rule-reason">{rule.reason}</p>

          {rule.activatedPatterns.length > 0 && (
            <div>
              <div style={{ fontSize: 10, color: 'var(--pg-text-dim)', marginBottom: 4, fontWeight: 600 }}>
                ACTIVATED:
              </div>
              <div className="pg-rule-patterns">
                {rule.activatedPatterns.map(p => (
                  <span key={p} className="pg-chip activated">{p}</span>
                ))}
              </div>
            </div>
          )}

          {rule.skippedPatterns.length > 0 && (
            <div style={{ marginTop: 6 }}>
              <div style={{ fontSize: 10, color: 'var(--pg-text-dim)', marginBottom: 4, fontWeight: 600 }}>
                SUPPRESSED:
              </div>
              <div className="pg-rule-patterns">
                {rule.skippedPatterns.map(p => (
                  <span key={p} className="pg-chip skipped">{p}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 8, fontSize: 10, color: 'var(--pg-text-dim)', fontFamily: 'var(--guardrail-font-mono)' }}>
            {rule.docRef}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Patterns Tab ──────────────────────────────────────────────────────────
function PatternsTab({ result }) {
  if (result.patterns.length === 0) {
    return (
      <div className="pg-empty-state">
        <span className="pg-empty-state-icon">✓</span>
        <strong>High Confidence — No Guardrails</strong>
        <p>No guardrail patterns activated for these primitive values. AI proceeds normally.</p>
      </div>
    );
  }

  // Group by category
  const byCategory = {};
  for (const pattern of result.patterns) {
    if (!byCategory[pattern.category]) byCategory[pattern.category] = [];
    byCategory[pattern.category].push(pattern);
  }

  return (
    <div>
      {/* Primary selections summary */}
      <div className="pg-section-title">Primary selections</div>
      <div style={{ marginBottom: 12 }}>
        {Object.entries(result.selections).map(([role, patternId]) => (
          <div key={role} className="pg-meta-row">
            <span className="pg-meta-key" style={{ textTransform: 'capitalize' }}>{role}</span>
            <span className="pg-meta-value" style={{ color: patternId ? 'var(--pg-text)' : 'var(--pg-text-dim)' }}>
              {patternId ?? '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Pattern list by category */}
      <div className="pg-section-title">All activated patterns ({result.patterns.length})</div>
      {Object.entries(byCategory).map(([category, patterns]) => (
        <div key={category} style={{ marginBottom: 12 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 6,
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: CATEGORY_COLORS[category] ?? 'var(--pg-text-muted)',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[category], display: 'inline-block' }} />
            {category}
          </div>
          {patterns.map(p => (
            <div key={p.id} className="pg-pattern-card">
              <div
                className="pg-pattern-dot"
                style={{ background: SEVERITY_COLORS[p.severity] ?? '#6b7280' }}
              />
              <div>
                <div className="pg-pattern-name">{p.name}</div>
                <div className="pg-pattern-meta">
                  <span style={{ color: SEVERITY_COLORS[p.severity] }}>{p.severity}</span>
                  <span style={{ fontFamily: 'var(--guardrail-font-mono)', fontSize: 9, color: 'var(--pg-text-dim)' }}>
                    {p.specRef}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Component sequence */}
      {result.components.length > 0 && (
        <>
          <div className="pg-section-title">Component sequence</div>
          {result.components.map((c, i) => (
            <div key={`${c.component}-${i}`} className="pg-pattern-card" style={{ alignItems: 'center' }}>
              <span style={{
                width: 20, height: 20, borderRadius: 4,
                background: 'var(--pg-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: 'var(--pg-text-muted)',
                flexShrink: 0,
              }}>
                {i + 1}
              </span>
              <div>
                <div className="pg-pattern-name">{c.component}</div>
                <div className="pg-pattern-meta">
                  <span style={{ color: SEVERITY_COLORS[c.severity] }}>{c.variant}</span>
                  <span style={{ color: 'var(--pg-text-dim)', fontFamily: 'var(--guardrail-font-mono)', fontSize: 9 }}>
                    ← {c.patternId}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ── Composition Tab ───────────────────────────────────────────────────────
function CompositionTab({ result }) {
  return (
    <div>
      <div className="pg-section-title">Applied constraints</div>
      {result.composition.appliedConstraints.length === 0 ? (
        <p style={{ fontSize: 12, color: 'var(--pg-text-dim)', padding: '12px 0' }}>
          No composition constraints applied — all activated patterns are compatible.
        </p>
      ) : (
        result.composition.appliedConstraints.map((c, i) => (
          <div key={i} style={{
            padding: '8px 10px',
            borderRadius: 'var(--guardrail-radius-md)',
            background: 'var(--pg-surface)',
            border: '1px solid var(--pg-border-subtle)',
            marginBottom: 6,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--pg-yellow)', marginBottom: 4 }}>
              {c.rule}
            </div>
            {c.trigger && (
              <div style={{ fontSize: 11, color: 'var(--pg-text-muted)' }}>
                Trigger: <code style={{ fontFamily: 'var(--guardrail-font-mono)', fontSize: 10 }}>{c.trigger}</code>
              </div>
            )}
            {c.removed?.length > 0 && (
              <div style={{ fontSize: 11, color: 'var(--pg-text-muted)', marginTop: 4 }}>
                Suppressed:{' '}
                {c.removed.map(p => (
                  <code key={p} style={{ fontFamily: 'var(--guardrail-font-mono)', fontSize: 10, color: 'var(--pg-red)', marginRight: 4 }}>
                    {p}
                  </code>
                ))}
              </div>
            )}
            {c.kept && (
              <div style={{ fontSize: 11, color: 'var(--pg-text-muted)', marginTop: 4 }}>
                Kept: <code style={{ fontFamily: 'var(--guardrail-font-mono)', fontSize: 10, color: 'var(--pg-green)' }}>{c.kept}</code>
              </div>
            )}
          </div>
        ))
      )}

      {result.composition.violations.length > 0 && (
        <>
          <div className="pg-section-title" style={{ marginTop: 16 }}>Violations resolved</div>
          {result.composition.violations.map((v, i) => (
            <div key={i} style={{
              padding: '8px 10px',
              borderRadius: 'var(--guardrail-radius-md)',
              background: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.2)',
              marginBottom: 6,
              fontSize: 11,
            }}>
              <span style={{ color: 'var(--pg-red)', fontWeight: 600 }}>{v.rule}</span>
              <br />
              Kept: <code style={{ fontFamily: 'var(--guardrail-font-mono)', fontSize: 10 }}>{v.kept}</code>{' '}
              · Removed: {v.removed.map(p => <code key={p} style={{ fontFamily: 'var(--guardrail-font-mono)', fontSize: 10, color: 'var(--pg-red)' }}>{p} </code>)}
            </div>
          ))}
        </>
      )}

      {/* Global invariants */}
      <div className="pg-section-title" style={{ marginTop: 16 }}>Global invariants (always enforced)</div>
      {[
        'Only one warning pattern may render simultaneously.',
        'Only one refusal pattern may render simultaneously.',
        'emergency-escalation supersedes all other escalation patterns.',
        'policy-refusal supersedes safe-refusal and blocking-warning.',
        'Passive dismissal of a permission gate always equals denial.',
        'Auto-grant is never permitted — all grants require explicit user action.',
        'Recovery patterns are suppressed while a blocking or critical component is active.',
      ].map((rule, i) => (
        <div key={i} style={{
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
          padding: '5px 0',
          borderBottom: '1px solid var(--pg-border-subtle)',
          fontSize: 11,
          color: 'var(--pg-text-muted)',
        }}>
          <span style={{ color: 'var(--pg-text-dim)', flexShrink: 0, marginTop: 1 }}>·</span>
          {rule}
        </div>
      ))}
      <p style={{ fontSize: 10, color: 'var(--pg-text-dim)', marginTop: 10, lineHeight: 1.5 }}>
        Source:{' '}
        <code style={{ fontFamily: 'var(--guardrail-font-mono)', color: 'var(--pg-text-muted)' }}>
          docs/decision-flows/pattern-composition-engine.md
        </code>
      </p>
    </div>
  );
}

// ── Shared helpers ────────────────────────────────────────────────────────
function Pill({ color, label }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: 18,
      padding: '0 7px',
      borderRadius: 9,
      fontSize: 10,
      fontWeight: 700,
      background: `${color}18`,
      color,
      border: `1px solid ${color}44`,
    }}>
      {label}
    </span>
  );
}
