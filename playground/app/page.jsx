'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { evaluate } from '../engine/evaluator.js';
import { DEFAULT_PRIMITIVES } from '../engine/primitives.js';
import { SCENARIOS } from '../data/scenarios.js';
import { PrimitiveControls } from '../components/PrimitiveControls.jsx';
import { EnginePanel } from '../components/EnginePanel.jsx';
import { ResultPanel } from '../components/ResultPanel.jsx';
import { AuditPanel } from '../components/AuditPanel.jsx';

export default function PlaygroundPage() {
  const [primitives, setPrimitives] = useState(DEFAULT_PRIMITIVES);
  const [activeScenario, setActiveScenario] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [activeEngineTab, setActiveEngineTab] = useState('rules');

  const engineResult = useMemo(() => evaluate(primitives), [primitives]);

  // Seed audit log from engine result whenever primitives change
  useEffect(() => {
    const seed = {
      id: `engine-eval-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType: 'ENGINE_EVALUATED',
      patternsCount: engineResult.meta.patternsCount,
      rulesActivated: engineResult.meta.rulesActivated,
      severity: engineResult.patterns[0]?.severity ?? 'informational',
      patternId: engineResult.patterns[0]?.id ?? null,
      component: engineResult.components[0]?.component ?? null,
    };
    setAuditLog(prev => [seed, ...prev].slice(0, 100));
  }, [engineResult]);

  const handlePrimitiveChange = useCallback((key, value) => {
    setPrimitives(prev => ({ ...prev, [key]: value }));
    setActiveScenario(null);
  }, []);

  const handleScenarioSelect = useCallback((scenarioId) => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;
    setPrimitives(scenario.primitives);
    setActiveScenario(scenarioId);
    setAuditLog([{
      id: `scenario-load-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType: 'SCENARIO_LOADED',
      scenario: scenario.label,
      severity: 'informational',
      patternId: null,
      component: null,
    }]);
  }, []);

  const handleAuditEvent = useCallback((event) => {
    setAuditLog(prev => [{
      id: `${event.eventType}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...event,
    }, ...prev].slice(0, 100));
  }, []);

  return (
    <div className="pg-root">
      {/* Header */}
      <header className="pg-header">
        <div className="pg-header-brand">
          <span className="pg-header-title">Guardrail Decision Engine</span>
          <span className="pg-header-subtitle">Playground</span>
        </div>
        <span
          style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--pg-text-dim)', fontFamily: 'var(--guardrail-font-mono)' }}
          aria-label={`${engineResult.meta.patternsCount} patterns active, ${engineResult.meta.rulesActivated} rules activated`}
        >
          {engineResult.meta.patternsCount} patterns · {engineResult.meta.rulesActivated} rules activated
        </span>
        <span className="pg-header-badge" role="status">
          docs/decision-flows/
        </span>
      </header>

      {/* Scenarios bar */}
      <nav className="pg-scenarios-bar" aria-label="Example scenarios">
        <span className="pg-scenarios-label">Scenarios</span>
        {SCENARIOS.map(scenario => (
          <button
            key={scenario.id}
            className={`pg-scenario-btn${activeScenario === scenario.id ? ' active' : ''}`}
            onClick={() => handleScenarioSelect(scenario.id)}
            title={scenario.description}
            aria-pressed={activeScenario === scenario.id}
          >
            <span className="pg-scenario-dot" style={{ backgroundColor: scenario.color }} aria-hidden="true" />
            {scenario.label}
          </button>
        ))}
        <button
          className="pg-scenario-btn"
          onClick={() => { setPrimitives(DEFAULT_PRIMITIVES); setActiveScenario(null); setAuditLog([]); }}
          style={{ marginLeft: 'auto' }}
        >
          Reset
        </button>
      </nav>

      {/* Main 3-panel grid */}
      <main className="pg-main">
        {/* Left: Primitive controls */}
        <section className="pg-panel" aria-label="Decision primitives">
          <div className="pg-panel-header">
            <span className="pg-panel-title">Decision Primitives</span>
            <span className="pg-panel-badge" aria-label="10 primitives">P1–P10</span>
          </div>
          <div className="pg-panel-body">
            <PrimitiveControls
              primitives={primitives}
              onChange={handlePrimitiveChange}
            />
          </div>
        </section>

        {/* Center: Decision engine visualization */}
        <section className="pg-panel" aria-label="Decision engine">
          <div className="pg-panel-header">
            <span className="pg-panel-title">Decision Engine</span>
            <span className="pg-panel-badge">
              {engineResult.meta.rulesActivated}A / {engineResult.meta.rulesSkipped}S / {engineResult.meta.rulesNotEvaluated}N
            </span>
          </div>
          <div className="pg-tabs" role="tablist">
            {[
              { id: 'rules',    label: 'Rules', count: engineResult.rules.length },
              { id: 'patterns', label: 'Patterns', count: engineResult.patterns.length },
              { id: 'compose',  label: 'Composition', count: engineResult.composition.appliedConstraints.length },
            ].map(tab => (
              <button
                key={tab.id}
                className={`pg-tab${activeEngineTab === tab.id ? ' active' : ''}`}
                role="tab"
                aria-selected={activeEngineTab === tab.id}
                aria-controls={`engine-tab-${tab.id}`}
                onClick={() => setActiveEngineTab(tab.id)}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span style={{ fontSize: 9, background: 'var(--pg-border)', borderRadius: 9, padding: '1px 5px' }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="pg-panel-body" id={`engine-tab-${activeEngineTab}`} role="tabpanel">
            <EnginePanel result={engineResult} activeTab={activeEngineTab} />
          </div>
        </section>

        {/* Right: Rendered components */}
        <section className="pg-panel" aria-label="Rendered guardrail components">
          <div className="pg-panel-header">
            <span className="pg-panel-title">Result</span>
            <span className="pg-panel-badge">{engineResult.components.length} components</span>
          </div>
          <div className="pg-panel-body">
            <ResultPanel
              result={engineResult}
              primitives={primitives}
              onAuditEvent={handleAuditEvent}
            />
          </div>
        </section>
      </main>

      {/* Bottom: Audit trail */}
      <section className="pg-audit" aria-label="Audit trail" aria-live="polite">
        <div className="pg-audit-header">
          <span className="pg-panel-title">Audit Trail</span>
          <span className="pg-panel-badge" style={{ marginLeft: 8 }}>{auditLog.length} events</span>
          <button
            onClick={() => setAuditLog([])}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: 'var(--pg-text-dim)',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        </div>
        <div className="pg-audit-body">
          <AuditPanel events={auditLog} />
        </div>
      </section>
    </div>
  );
}
