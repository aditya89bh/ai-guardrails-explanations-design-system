'use client';

const SEVERITY_COLORS = {
  informational: { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa' },
  advisory:      { bg: 'rgba(245,158,11,0.1)', text: '#fbbf24' },
  caution:       { bg: 'rgba(249,115,22,0.1)', text: '#fb923c' },
  blocking:      { bg: 'rgba(236,72,153,0.1)', text: '#f472b6' },
  critical:      { bg: 'rgba(239,68,68,0.1)',  text: '#f87171' },
};

const EVENT_TYPE_ICONS = {
  ENGINE_EVALUATED:     '⚙',
  SCENARIO_LOADED:      '📂',
  PERMISSION_GRANTED:   '✓',
  PERMISSION_DENIED:    '✕',
  ESCALATION_ACKNOWLEDGED: '📢',
  RECOVERY_ACTION:      '↩',
};

/**
 * AuditPanel — chronological list of audit events with severity, pattern, and component.
 * Events follow: docs/decision-flows/audit-schema.md
 */
export function AuditPanel({ events }) {
  if (events.length === 0) {
    return (
      <div style={{ color: 'var(--pg-text-dim)', fontSize: 11, padding: '8px 0', fontStyle: 'italic' }}>
        No events yet — adjust primitives or load a scenario to generate audit entries.
      </div>
    );
  }

  return (
    <>
      {events.map(event => (
        <AuditEvent key={event.id} event={event} />
      ))}
    </>
  );
}

function AuditEvent({ event }) {
  const time = formatTime(event.timestamp);
  const sev = SEVERITY_COLORS[event.severity] ?? SEVERITY_COLORS.informational;
  const icon = EVENT_TYPE_ICONS[event.eventType] ?? '·';

  return (
    <div className="pg-audit-event">
      <span className="pg-audit-time">{time}</span>
      <span className="pg-audit-event-type">
        <span style={{ marginRight: 5, opacity: 0.5 }}>{icon}</span>
        <strong>{event.eventType}</strong>
        {event.scenario && <span style={{ color: 'var(--pg-text-dim)' }}> — {event.scenario}</span>}
        {event.patternId && <span style={{ color: 'var(--pg-text-dim)', fontFamily: 'var(--guardrail-font-mono)', fontSize: 10 }}> · {event.patternId}</span>}
        {event.component && <span style={{ color: 'var(--pg-text-dim)', fontFamily: 'var(--guardrail-font-mono)', fontSize: 10 }}> → {event.component}</span>}
        {event.patternsCount !== undefined && (
          <span style={{ color: 'var(--pg-text-dim)' }}> · {event.patternsCount} patterns, {event.rulesActivated} rules</span>
        )}
      </span>
      <span
        className="pg-audit-severity"
        style={{ background: sev.bg, color: sev.text }}
      >
        {event.severity}
      </span>
    </div>
  );
}

function formatTime(iso) {
  if (!iso) return '--:--:--';
  try {
    const d = new Date(iso);
    return d.toTimeString().slice(0, 8);
  } catch {
    return '--:--:--';
  }
}
