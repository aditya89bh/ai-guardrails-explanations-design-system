/**
 * GuardrailDemo — Next.js reference page
 *
 * Demonstrates the complete pipeline:
 *   Input → Primitive evaluation → Decision engine → Pattern selection → Component rendering
 *
 * This page shows how to wire a UI form to the guardrail decision engine
 * and render the appropriate components based on the engine's output.
 *
 * Use this as a starting point for an internal guardrail testing tool or
 * an onboarding demo for your team.
 *
 * Imports reference components from reference/react/.
 * Does not introduce new guardrail logic — all decisions follow
 * docs/decision-flows/pattern-selection-engine.md.
 */

'use client'; // Next.js App Router client component

import { useState } from 'react';
import { WarningBanner } from '../react/WarningBanner';
import { PermissionGate } from '../react/PermissionGate';
import { ConfidenceBadge } from '../react/ConfidenceBadge';
import { RefusalCard } from '../react/RefusalCard';
import { RecoveryPrompt } from '../react/RecoveryPrompt';
import { EmergencyEscalationOverlay } from '../react/EmergencyEscalationOverlay';

// ─────────────────────────────────────────────────
// Decision engine — pattern selection logic
// Implements: docs/decision-flows/pattern-selection-engine.md
// ─────────────────────────────────────────────────

/**
 * Evaluates ten decision primitives and returns the activated pattern set.
 * This is a simplified reference implementation of the selection engine.
 * A production engine would load rules from the policy YAML configuration.
 *
 * @param {object} primitives - P1 through P10 values
 * @returns {object} - { patterns: string[], primaryWarning, primaryRefusal, primaryRecovery, requiresEscalation }
 */
function evaluatePrimitives(primitives) {
  const { P1, P2, P3, P4, P5, P6, P7 } = primitives;
  const activated = [];
  let primaryWarning = null;
  let primaryRefusal = null;
  let primaryRecovery = null;
  let requiresEscalation = false;
  let escalationType = null;

  // ── Step 1: Policy check (P5) — highest priority
  if (P5 === 'tenant' || P5 === 'deployment') {
    activated.push('policy-refusal');
    primaryRefusal = 'policy';
    if (P1 >= 4) {
      requiresEscalation = true;
      escalationType = 'emergency';
      activated.push('emergency-escalation');
    }
    primaryRecovery = 'redirect';
    activated.push('redirect-recovery');
    // Policy-refusal supersedes all other refusal and warning patterns
    return { patterns: activated, primaryWarning, primaryRefusal, primaryRecovery, requiresEscalation, escalationType };
  }

  // ── Step 2: Permission check (P4)
  if (P4 === 'unauthorized') {
    activated.push('blocking-warning');
    primaryWarning = 'blocking';
    if (P1 >= 3) {
      activated.push('role-escalation');
      requiresEscalation = true;
      escalationType = 'role';
    }
  } else if (P4 === 'partial') {
    activated.push('scoped-permission');
    primaryWarning = 'blocking'; // Scoped permission gate is blocking severity
  }

  // ── Step 3: Confidence state (P2)
  switch (P2) {
    case 'unresolvable':
      activated.push('unresolvable-state');
      if (P1 >= 4) {
        requiresEscalation = true;
        escalationType = 'emergency';
        activated.push('emergency-escalation');
        primaryRecovery = 'abandon';
        activated.push('abandon-recovery');
      } else {
        primaryRefusal = 'safe';
        activated.push('safe-refusal');
      }
      break;

    case 'conflicting':
      activated.push('conflicting-evidence-state');
      if (P1 >= 3) {
        primaryRefusal = 'safe';
        activated.push('safe-refusal');
        activated.push('reasoning-trace');
        activated.push('source-citation');
        primaryRecovery = 'redirect';
        activated.push('redirect-recovery');
      }
      break;

    case 'insufficient':
      activated.push('insufficient-information-state');
      primaryRefusal = 'clarification';
      activated.push('clarification-request');
      activated.push('partial-completion');
      activated.push('limitation-disclosure');
      break;

    case 'low':
      activated.push('low-confidence-state');
      activated.push('confidence-disclosure');
      if (P3 === 'partial' && P6 === 'decision-support') {
        // Decision-support intent with partial capability → constrained, not safe refusal
        primaryRefusal = 'constrained';
        activated.push('constrained-completion');
        activated.push('limitation-disclosure');
      } else {
        primaryRefusal = 'safe';
        activated.push('safe-refusal');
      }
      if (P1 >= 3) {
        requiresEscalation = true;
        escalationType = 'role';
        activated.push('role-escalation');
      }
      break;

    case 'stale':
      activated.push('stale-context-state');
      activated.push('confidence-disclosure');
      activated.push('limitation-disclosure');
      break;

    case 'moderate':
      activated.push('moderate-confidence-state');
      if (P1 >= 3) activated.push('confidence-disclosure');
      break;

    case 'high':
    default:
      activated.push('high-confidence-state');
      // No disclosure needed for HC state
      break;
  }

  // ── Step 4: Warning calibration (if no blocking condition)
  if (!primaryWarning && P4 !== 'unauthorized' && P4 !== 'partial') {
    if (P1 >= 3 && (P2 === 'low' || P2 === 'stale')) {
      primaryWarning = 'caution';
      if (!activated.includes('inline-warning')) activated.push('inline-warning');
    } else if (P1 >= 1 && P2 !== 'high') {
      primaryWarning = 'advisory';
      if (!activated.includes('inline-warning')) activated.push('inline-warning');
    }
  }

  // ── Step 5: Business impact amplification (P7)
  if (P7 === 'high' && P1 >= 2 && !activated.includes('limitation-disclosure')) {
    activated.push('limitation-disclosure');
  }

  return {
    patterns: [...new Set(activated)], // Deduplicate
    primaryWarning,
    primaryRefusal,
    primaryRecovery,
    requiresEscalation,
    escalationType,
  };
}

// ─────────────────────────────────────────────────
// Primitive input form component
// ─────────────────────────────────────────────────
function PrimitiveForm({ primitives, onChange }) {
  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '12px',
  };
  const labelStyle = { fontSize: '12px', fontWeight: '600', opacity: 0.7 };
  const selectStyle = {
    padding: '6px 8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  };

  return (
    <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
      <div style={fieldStyle}>
        <label style={labelStyle}>P1 — Risk (0–4)</label>
        <select style={selectStyle} value={primitives.P1} onChange={(e) => onChange('P1', Number(e.target.value))}>
          {[0,1,2,3,4].map(v => <option key={v} value={v}>{v} — {['None','Low','Moderate','High','Critical'][v]}</option>)}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>P2 — Confidence</label>
        <select style={selectStyle} value={primitives.P2} onChange={(e) => onChange('P2', e.target.value)}>
          {['high','moderate','low','conflicting','insufficient','stale','unresolvable'].map(v =>
            <option key={v} value={v}>{v}</option>
          )}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>P3 — Capability</label>
        <select style={selectStyle} value={primitives.P3} onChange={(e) => onChange('P3', e.target.value)}>
          {['capable','incapable','partial'].map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>P4 — Permission</label>
        <select style={selectStyle} value={primitives.P4} onChange={(e) => onChange('P4', e.target.value)}>
          {['authorized','unauthorized','partial'].map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>P5 — Policy match</label>
        <select style={selectStyle} value={primitives.P5} onChange={(e) => onChange('P5', e.target.value)}>
          {['none','tenant','deployment'].map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>P6 — Intent</label>
        <select style={selectStyle} value={primitives.P6} onChange={(e) => onChange('P6', e.target.value)}>
          {['decision-support','action-execution','content-generation','workflow-automation'].map(v =>
            <option key={v} value={v}>{v}</option>
          )}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>P7 — Business impact</label>
        <select style={selectStyle} value={primitives.P7} onChange={(e) => onChange('P7', e.target.value)}>
          {['low','medium','high'].map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────
// Audit log component
// ─────────────────────────────────────────────────
function AuditLog({ events }) {
  if (events.length === 0) return null;
  return (
    <div style={{ marginTop: '24px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Audit log</h3>
      <pre style={{
        backgroundColor: '#1e1e2e',
        color: '#cdd6f4',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '12px',
        overflowX: 'auto',
        maxHeight: '240px',
        overflowY: 'auto',
      }}>
        {events.map((e, i) => (
          <div key={i} style={{ marginBottom: '4px' }}>
            [{e.timestamp?.slice(11, 19) ?? '--'}] {e.eventType} — auditId: {e.auditId}
          </div>
        ))}
      </pre>
    </div>
  );
}

// ─────────────────────────────────────────────────
// Main demo page
// ─────────────────────────────────────────────────
export default function GuardrailDemo() {
  const [primitives, setPrimitives] = useState({
    P1: 2,
    P2: 'moderate',
    P3: 'capable',
    P4: 'authorized',
    P5: 'none',
    P6: 'decision-support',
    P7: 'medium',
  });

  const [auditLog, setAuditLog] = useState([]);
  const [showComponents, setShowComponents] = useState(false);

  const engineResult = evaluatePrimitives(primitives);

  function handlePrimitiveChange(key, value) {
    setPrimitives((prev) => ({ ...prev, [key]: value }));
    setShowComponents(false); // Reset on primitive change
  }

  function handleAuditEvent(event) {
    setAuditLog((prev) => [...prev, event]);
  }

  const DEMO_AUDIT_ID = `demo-${Date.now()}`;

  // Preset scenarios from case studies
  const presets = {
    healthcare: { P1: 3, P2: 'low', P3: 'partial', P4: 'authorized', P5: 'none', P6: 'decision-support', P7: 'high' },
    banking: { P1: 4, P2: 'high', P3: 'capable', P4: 'unauthorized', P5: 'tenant', P6: 'action-execution', P7: 'high' },
    insurance: { P1: 2, P2: 'insufficient', P3: 'partial', P4: 'authorized', P5: 'none', P6: 'workflow-automation', P7: 'medium' },
    'developer-copilot': { P1: 3, P2: 'conflicting', P3: 'capable', P4: 'authorized', P5: 'none', P6: 'decision-support', P7: 'high' },
    industrial: { P1: 4, P2: 'unresolvable', P3: 'capable', P4: 'authorized', P5: 'none', P6: 'action-execution', P7: 'high' },
  };

  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 24px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const sectionStyle = {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
  };

  return (
    <main style={containerStyle}>
      <h1 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: '700' }}>
        Guardrail Decision Engine — Reference Demo
      </h1>
      <p style={{ margin: '0 0 32px', color: '#666', fontSize: '14px' }}>
        Set primitive values → evaluate → see which patterns activate and which components render.
        All decisions follow <code>docs/decision-flows/pattern-selection-engine.md</code>.
      </p>

      {/* Preset scenarios */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', opacity: 0.7, marginBottom: '8px' }}>
          LOAD FROM CASE STUDY
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(presets).map(([key, values]) => (
            <button
              key={key}
              onClick={() => { setPrimitives(values); setShowComponents(false); }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                background: 'white',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              {key.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Primitive input */}
      <section style={sectionStyle}>
        <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>
          Step 1 — Decision primitive evaluation
        </h2>
        <PrimitiveForm primitives={primitives} onChange={handlePrimitiveChange} />
      </section>

      {/* Step 2: Engine output */}
      <section style={sectionStyle}>
        <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>
          Step 2 — Decision engine output
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '600', opacity: 0.7 }}>
              ACTIVATED PATTERNS
            </p>
            {engineResult.patterns.length > 0 ? (
              <ul style={{ margin: 0, padding: '0 0 0 20px' }}>
                {engineResult.patterns.map((p) => (
                  <li key={p} style={{ fontSize: '13px', marginBottom: '4px', fontFamily: 'monospace' }}>{p}</li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: '13px', opacity: 0.6 }}>No patterns activated.</p>
            )}
          </div>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: '600', opacity: 0.7 }}>
              PRIMARY SELECTIONS
            </p>
            <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '4px 12px', fontSize: '13px' }}>
              <dt style={{ opacity: 0.6 }}>Warning</dt>
              <dd style={{ margin: 0, fontFamily: 'monospace' }}>{engineResult.primaryWarning ?? '—'}</dd>
              <dt style={{ opacity: 0.6 }}>Refusal</dt>
              <dd style={{ margin: 0, fontFamily: 'monospace' }}>{engineResult.primaryRefusal ?? '—'}</dd>
              <dt style={{ opacity: 0.6 }}>Recovery</dt>
              <dd style={{ margin: 0, fontFamily: 'monospace' }}>{engineResult.primaryRecovery ?? '—'}</dd>
              <dt style={{ opacity: 0.6 }}>Escalation</dt>
              <dd style={{ margin: 0, fontFamily: 'monospace' }}>{engineResult.escalationType ?? '—'}</dd>
            </dl>
          </div>
        </div>

        <button
          onClick={() => setShowComponents(true)}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          Render components →
        </button>
      </section>

      {/* Step 3: Rendered components */}
      {showComponents && (
        <section style={sectionStyle}>
          <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>
            Step 3 — Rendered components
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Emergency escalation overlay — rendered first (interrupt mode) */}
            {engineResult.escalationType === 'emergency' && (
              <EmergencyEscalationOverlay
                incidentType="demo-incident"
                incidentSummary="Demo: Emergency escalation activated"
                incidentContext={[
                  { key: 'P1 Risk', value: String(primitives.P1) },
                  { key: 'P2 Confidence', value: primitives.P2 },
                  { key: 'P5 Policy', value: primitives.P5 },
                ]}
                escalationTarget="Demo escalation target"
                referenceId="DEMO-001"
                auditId={`${DEMO_AUDIT_ID}-emergency`}
                onAcknowledge={() => console.log('Demo acknowledged')}
                onAuditEvent={handleAuditEvent}
              />
            )}

            {/* Confidence badge */}
            {primitives.P2 !== 'high' && (
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '12px', opacity: 0.6 }}>ConfidenceBadge</p>
                <ConfidenceBadge
                  confidenceState={primitives.P2}
                  depth={primitives.P1 >= 3 ? 'detailed' : 'standard'}
                  explanation={`P2 = ${primitives.P2}. This explanation would be populated by the AI system's epistemic assessment.`}
                  limitationText={primitives.P1 >= 3 ? 'Detailed limitation disclosure shown at Risk ≥ 3.' : undefined}
                  auditId={`${DEMO_AUDIT_ID}-confidence`}
                  onAuditEvent={handleAuditEvent}
                />
              </div>
            )}

            {/* Permission gate */}
            {primitives.P4 === 'unauthorized' && engineResult.primaryWarning === 'blocking' && !engineResult.patterns.includes('policy-refusal') && (
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '12px', opacity: 0.6 }}>PermissionGate</p>
                <PermissionGate
                  variant="scoped"
                  requestingEntity="Demo AI Agent"
                  requestedAction="Perform the requested action (demo)"
                  scope="Single action — this demonstration session"
                  auditId={`${DEMO_AUDIT_ID}-permission`}
                  onGrant={() => console.log('Demo permission granted')}
                  onDeny={() => console.log('Demo permission denied')}
                  onAuditEvent={handleAuditEvent}
                />
              </div>
            )}

            {/* Warning banner */}
            {engineResult.primaryWarning && !engineResult.patterns.includes('policy-refusal') && (
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '12px', opacity: 0.6 }}>WarningBanner</p>
                <WarningBanner
                  severity={engineResult.primaryWarning}
                  variant="inline"
                  message={`${engineResult.primaryWarning.charAt(0).toUpperCase() + engineResult.primaryWarning.slice(1)} warning — demo output for P1=${primitives.P1}, P2=${primitives.P2}`}
                  auditId={`${DEMO_AUDIT_ID}-warning`}
                  onAuditEvent={handleAuditEvent}
                />
              </div>
            )}

            {/* Refusal card */}
            {engineResult.primaryRefusal && (
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '12px', opacity: 0.6 }}>RefusalCard ({engineResult.primaryRefusal})</p>
                <RefusalCard
                  variant={engineResult.primaryRefusal}
                  refusalReason={`Demo: ${engineResult.primaryRefusal} refusal activated for P1=${primitives.P1}, P2=${primitives.P2}, P5=${primitives.P5}.`}
                  completedContent={['constrained','partial'].includes(engineResult.primaryRefusal) ? 'Available information would appear here.' : undefined}
                  excludedContent={['constrained','partial'].includes(engineResult.primaryRefusal) ? 'Excluded content description would appear here.' : undefined}
                  alternatives={engineResult.primaryRefusal === 'safe' ? [
                    { id: 'alt-1', label: 'Alternative path 1', description: 'Description of this alternative' },
                    { id: 'alt-2', label: 'Alternative path 2', description: 'Description of this alternative' },
                  ] : []}
                  clarificationFields={engineResult.primaryRefusal === 'clarification' ? [
                    { id: 'field-1', label: 'Required field', placeholder: 'Enter value...' },
                  ] : []}
                  auditId={`${DEMO_AUDIT_ID}-refusal`}
                  onAlternativeSelect={(id) => console.log('Selected:', id)}
                  onNoneOfThese={() => console.log('None of these')}
                  onAuditEvent={handleAuditEvent}
                />
              </div>
            )}

            {/* Recovery prompt */}
            {engineResult.primaryRecovery && (
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '12px', opacity: 0.6 }}>RecoveryPrompt ({engineResult.primaryRecovery})</p>
                <RecoveryPrompt
                  variant={engineResult.primaryRecovery}
                  recoveryContext={`Demo recovery for P1=${primitives.P1}, P2=${primitives.P2}.`}
                  redirectOptions={engineResult.primaryRecovery === 'redirect' ? [
                    { id: 'redir-1', label: 'Alternative path', description: 'This path achieves a similar goal.' },
                  ] : []}
                  abandonSavedState={engineResult.primaryRecovery === 'abandon' ? 'Session state and input data preserved.' : undefined}
                  auditId={`${DEMO_AUDIT_ID}-recovery`}
                  onRetry={() => console.log('Retry initiated')}
                  onRedirect={(id) => console.log('Redirected to:', id)}
                  onAbandon={() => console.log('Abandoned')}
                  onAuditEvent={handleAuditEvent}
                />
              </div>
            )}

            {engineResult.patterns.length === 0 && (
              <p style={{ color: '#666', fontSize: '14px' }}>
                No guardrail components activated for these primitive values.
                The AI proceeds normally (HC state, authorized, no policy match).
              </p>
            )}
          </div>
        </section>
      )}

      {/* Audit log */}
      <AuditLog events={auditLog} />
    </main>
  );
}
