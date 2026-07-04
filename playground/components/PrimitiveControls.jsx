'use client';

import { PRIMITIVE_DEFINITIONS, getPrimitiveLabel, getPrimitiveColor } from '../engine/primitives.js';

const RISK_COLORS = ['#6b7280', '#22c55e', '#f59e0b', '#f97316', '#ef4444'];

/**
 * PrimitiveControls — renders editable controls for all 10 decision primitives.
 * Each control updates the parent state immediately via onChange.
 */
export function PrimitiveControls({ primitives, onChange }) {
  return (
    <div>
      {Object.entries(PRIMITIVE_DEFINITIONS).map(([id, def]) => (
        <PrimitiveControl
          key={id}
          id={id}
          def={def}
          value={primitives[id]}
          onChange={onChange}
        />
      ))}

      {/* Quick reference */}
      <div className="pg-divider" />
      <div className="pg-section-title">Source</div>
      <p style={{ fontSize: 10, color: 'var(--pg-text-dim)', lineHeight: 1.5 }}>
        Primitive definitions follow{' '}
        <code style={{ fontFamily: 'var(--guardrail-font-mono)', fontSize: 10, color: 'var(--pg-text-muted)' }}>
          docs/decision-flows/<br />decision-primitives.md
        </code>
      </p>
    </div>
  );
}

function PrimitiveControl({ id, def, value, onChange }) {
  const valueLabel = getPrimitiveLabel(id, value);
  const valueColor = getPrimitiveColor(id, value);

  return (
    <div className="pg-primitive">
      <div className="pg-primitive-header">
        <label htmlFor={`primitive-${id}`} className="pg-primitive-label">
          {id} — {def.label}
        </label>
        <span
          className="pg-primitive-value"
          style={{ backgroundColor: `${valueColor}22`, color: valueColor, borderColor: `${valueColor}44` }}
        >
          {valueLabel}
        </span>
      </div>

      {/* Integer range control */}
      {def.type === 'integer' && (
        <>
          <input
            id={`primitive-${id}`}
            type="range"
            className="pg-range"
            min={def.min}
            max={def.max}
            value={value}
            onChange={e => onChange(id, Number(e.target.value))}
            aria-valuetext={`${valueLabel} — ${def.levels?.[value]?.description ?? ''}`}
          />
          {/* Risk pip visualization */}
          {id === 'P1' && (
            <div className="pg-risk-pips" aria-hidden="true">
              {RISK_COLORS.map((color, i) => (
                <div
                  key={i}
                  className="pg-risk-pip"
                  style={{ background: i <= value ? color : 'var(--pg-border)' }}
                />
              ))}
            </div>
          )}
          {/* Authority tier pips */}
          {id === 'P8' && (
            <div className="pg-risk-pips" aria-hidden="true">
              {[1,2,3].map(tier => (
                <div
                  key={tier}
                  className="pg-risk-pip"
                  style={{ background: tier <= value ? (tier === 1 ? '#6b7280' : tier === 2 ? '#f59e0b' : '#22c55e') : 'var(--pg-border)' }}
                />
              ))}
            </div>
          )}
          {/* Source reliability pips */}
          {id === 'P10' && (
            <div className="pg-risk-pips" aria-hidden="true">
              {[0,1,2,3].map(level => (
                <div
                  key={level}
                  className="pg-risk-pip"
                  style={{ background: level <= value ? RISK_COLORS[Math.min(level, 4)] : 'var(--pg-border)' }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Enum select control */}
      {def.type === 'enum' && (
        <select
          id={`primitive-${id}`}
          className="pg-select"
          value={value}
          onChange={e => onChange(id, e.target.value)}
          style={{ borderColor: `${valueColor}55` }}
        >
          {def.values.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* Value description */}
      <div className="pg-primitive-desc">
        {def.type === 'integer'
          ? def.levels?.[value]?.description
          : def.values?.find(v => v.value === value)?.description}
      </div>
    </div>
  );
}
