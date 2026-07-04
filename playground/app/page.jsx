'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { evaluate } from '../engine/evaluator.js';
import { DEFAULT_PRIMITIVES } from '../engine/primitives.js';
import { SCENARIOS } from '../data/scenarios.js';
import { PrimitiveControls } from '../components/PrimitiveControls.jsx';
import { EnginePanel } from '../components/EnginePanel.jsx';
import { ResultPanel } from '../components/ResultPanel.jsx';
import { AuditPanel } from '../components/AuditPanel.jsx';
import { PipelineFlow } from '../components/PipelineFlow.jsx';
import { StateTransitionViz } from '../components/StateTransitionViz.jsx';
import { CompositionViz } from '../components/CompositionViz.jsx';
import { ErrorBoundary } from '../components/ErrorBoundary.jsx';

const ENGINE_TABS = [
  { id: 'rules',           label: 'Rules',       countKey: 'rules' },
  { id: 'patterns',        label: 'Patterns',    countKey: 'patterns' },
  { id: 'compose',         label: 'Composition', countKey: 'composition' },
  { id: 'state-machine',   label: 'States',      countKey: null },
  { id: 'composition-viz', label: 'Flow',        countKey: null },
];

export default function PlaygroundPage() {
  const [primitives, setPrimitives] = useState(DEFAULT_PRIMITIVES);
  const [activeScenario, setActiveScenario] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [activeEngineTab, setActiveEngineTab] = useState('rules');
  const [darkMode, setDarkMode] = useState(true);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const mainRef = useRef(null);
  const engineTabRefs = useRef({});

  const engineResult = useMemo(() => {
    try {
      return evaluate(primitives);
    } catch (err) {
      return null;
    }
  }, [primitives]);

  useEffect(() => {
    if (!engineResult) return;
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

  // Apply dark mode class to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Skip when focused in an input or select
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      // ? — toggle keyboard help
      if (e.key === '?') {
        setShowKeyboardHelp(v => !v);
        return;
      }
      // Escape — close help or reset scenario
      if (e.key === 'Escape') {
        if (showKeyboardHelp) {
          setShowKeyboardHelp(false);
          return;
        }
      }
      // D — toggle dark mode
      if (e.key === 'd' && !e.metaKey && !e.ctrlKey) {
        setDarkMode(v => !v);
        return;
      }
      // R — reset to defaults
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
        handleReset();
        return;
      }
      // 1–5 — load scenario by index
      if (e.key >= '1' && e.key <= '5') {
        const idx = parseInt(e.key) - 1;
        if (SCENARIOS[idx]) handleScenarioSelect(SCENARIOS[idx].id);
        return;
      }
      // Tab navigation: [ and ] cycle engine tabs
      if (e.key === '[') {
        setActiveEngineTab(prev => {
          const i = ENGINE_TABS.findIndex(t => t.id === prev);
          return ENGINE_TABS[(i - 1 + ENGINE_TABS.length) % ENGINE_TABS.length].id;
        });
        return;
      }
      if (e.key === ']') {
        setActiveEngineTab(prev => {
          const i = ENGINE_TABS.findIndex(t => t.id === prev);
          return ENGINE_TABS[(i + 1) % ENGINE_TABS.length].id;
        });
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showKeyboardHelp]);

  const handlePrimitiveChange = useCallback((key, value) => {
    setPrimitives(prev => ({ ...prev, [key]: value }));
    setActiveScenario(null);
    setShowWelcome(false);
  }, []);

  const handleScenarioSelect = useCallback((scenarioId) => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;
    setIsLoading(true);
    setShowWelcome(false);
    setTimeout(() => {
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
      setIsLoading(false);
    }, 50);
  }, []);

  const handleReset = useCallback(() => {
    setPrimitives(DEFAULT_PRIMITIVES);
    setActiveScenario(null);
    setAuditLog([]);
    setShowWelcome(true);
  }, []);

  const handleAuditEvent = useCallback((event) => {
    setAuditLog(prev => [{
      id: `${event.eventType}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...event,
    }, ...prev].slice(0, 100));
  }, []);

  const getTabCount = useCallback((tab) => {
    if (!engineResult || !tab.countKey) return null;
    if (tab.countKey === 'rules') return engineResult.rules.length;
    if (tab.countKey === 'patterns') return engineResult.patterns.length;
    if (tab.countKey === 'composition') return engineResult.composition.appliedConstraints.length;
    return null;
  }, [engineResult]);

  if (!engineResult) {
    return (
      <div className="pg-root" role="alert" aria-live="assertive">
        <div className="pg-error-state">
          <h1>Engine error</h1>
          <p>The decision engine encountered an unexpected error. Please reload the page.</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pg-root" data-loading={isLoading ? 'true' : undefined}>
      {/* Keyboard shortcut help overlay */}
      {showKeyboardHelp && (
        <div
          className="pg-kbd-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
          onClick={(e) => { if (e.target === e.currentTarget) setShowKeyboardHelp(false); }}
        >
          <div className="pg-kbd-panel">
            <div className="pg-kbd-header">
              <span>Keyboard Shortcuts</span>
              <button
                className="pg-kbd-close"
                onClick={() => setShowKeyboardHelp(false)}
                aria-label="Close keyboard shortcut help"
                autoFocus
              >
                ✕
              </button>
            </div>
            <dl className="pg-kbd-list">
              <dt><kbd>1</kbd>–<kbd>5</kbd></dt><dd>Load scenario 1–5</dd>
              <dt><kbd>[</kbd> <kbd>]</kbd></dt><dd>Cycle engine tabs</dd>
              <dt><kbd>D</kbd></dt><dd>Toggle dark/light mode</dd>
              <dt><kbd>R</kbd></dt><dd>Reset to defaults</dd>
              <dt><kbd>?</kbd></dt><dd>Show/hide this panel</dd>
              <dt><kbd>Esc</kbd></dt><dd>Close this panel</dd>
            </dl>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="pg-header">
        <a href="#pg-main-content" className="skip-link">Skip to main content</a>
        <div className="pg-header-brand">
          <span className="pg-header-title">Guardrail Decision Engine</span>
          <span className="pg-header-subtitle">Playground</span>
        </div>
        <span
          className="pg-header-stat"
          aria-label={`${engineResult.meta.patternsCount} patterns active, ${engineResult.meta.rulesActivated} rules activated`}
          aria-live="polite"
          aria-atomic="true"
        >
          {engineResult.meta.patternsCount}P · {engineResult.meta.rulesActivated}A / {engineResult.meta.rulesSkipped}S
        </span>
        <button
          className="pg-icon-btn"
          onClick={() => setDarkMode(v => !v)}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={`Toggle theme (D)`}
        >
          {darkMode ? '☀' : '●'}
        </button>
        <button
          className="pg-icon-btn"
          onClick={() => setShowKeyboardHelp(v => !v)}
          aria-label="Keyboard shortcuts"
          aria-expanded={showKeyboardHelp}
          title="Keyboard shortcuts (?)"
        >
          ?
        </button>
        <a
          href="https://github.com/your-org/ai-guardrails-explanations-design-system"
          className="pg-header-badge"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View documentation on GitHub"
        >
          docs ↗
        </a>
      </header>

      {/* Scenarios bar */}
      <nav className="pg-scenarios-bar" aria-label="Example scenarios">
        <span className="pg-scenarios-label" id="scenarios-label">Scenarios</span>
        <div className="pg-scenarios-list" role="group" aria-labelledby="scenarios-label">
          {SCENARIOS.map((scenario, idx) => (
            <button
              key={scenario.id}
              className={`pg-scenario-btn${activeScenario === scenario.id ? ' active' : ''}`}
              onClick={() => handleScenarioSelect(scenario.id)}
              title={`${scenario.description} (press ${idx + 1})`}
              aria-pressed={activeScenario === scenario.id}
              aria-label={`${scenario.label}: ${scenario.description}`}
            >
              <span className="pg-scenario-dot" style={{ backgroundColor: scenario.color }} aria-hidden="true" />
              <span className="pg-scenario-key" aria-hidden="true">{idx + 1}</span>
              {scenario.label}
            </button>
          ))}
        </div>
        <button
          className="pg-scenario-btn pg-scenario-reset"
          onClick={handleReset}
          aria-label="Reset all primitives to default values (R)"
          title="Reset to defaults (R)"
        >
          Reset
        </button>
      </nav>

      {/* Loading overlay */}
      {isLoading && (
        <div className="pg-loading-bar" role="status" aria-label="Loading scenario">
          <div className="pg-loading-bar-inner" />
        </div>
      )}

      {/* Main 3-panel grid */}
      <main className="pg-main" id="pg-main-content" ref={mainRef}>
        {/* Left: Primitive controls */}
        <section className="pg-panel" aria-label="Decision primitives P1 through P10">
          <div className="pg-panel-header">
            <span className="pg-panel-title">Decision Primitives</span>
            <span className="pg-panel-badge" aria-label="10 primitives P1 through P10">P1–P10</span>
          </div>
          <div className="pg-panel-body">
            <ErrorBoundary panelName="Primitive Controls">
              <PrimitiveControls
                primitives={primitives}
                onChange={handlePrimitiveChange}
              />
            </ErrorBoundary>
          </div>
        </section>

        {/* Center: Decision engine visualization */}
        <section className="pg-panel" aria-label="Decision engine visualization">
          <div className="pg-panel-header">
            <span className="pg-panel-title">Decision Engine</span>
            <span className="pg-panel-badge" aria-label={`${engineResult.meta.rulesActivated} activated, ${engineResult.meta.rulesSkipped} skipped, ${engineResult.meta.rulesNotEvaluated} not evaluated`}>
              {engineResult.meta.rulesActivated}A / {engineResult.meta.rulesSkipped}S / {engineResult.meta.rulesNotEvaluated}N
            </span>
          </div>
          <div className="pg-tabs" role="tablist" aria-label="Engine visualization tabs">
            {ENGINE_TABS.map(tab => {
              const count = getTabCount(tab);
              return (
                <button
                  key={tab.id}
                  ref={el => { engineTabRefs.current[tab.id] = el; }}
                  className={`pg-tab${activeEngineTab === tab.id ? ' active' : ''}`}
                  role="tab"
                  aria-selected={activeEngineTab === tab.id}
                  aria-controls={`engine-tab-panel-${tab.id}`}
                  id={`engine-tab-${tab.id}`}
                  onClick={() => setActiveEngineTab(tab.id)}
                >
                  {tab.label}
                  {count != null && count > 0 && (
                    <span className="pg-tab-count" aria-label={`${count} items`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div
            className="pg-panel-body"
            id={`engine-tab-panel-${activeEngineTab}`}
            role="tabpanel"
            aria-labelledby={`engine-tab-${activeEngineTab}`}
            tabIndex={0}
          >
            <ErrorBoundary panelName="Engine Panel">
              {(activeEngineTab === 'rules' || activeEngineTab === 'patterns' || activeEngineTab === 'compose') && (
                <EnginePanel result={engineResult} activeTab={activeEngineTab} />
              )}
              {activeEngineTab === 'state-machine' && (
                <StateTransitionViz currentState={primitives.P2} />
              )}
              {activeEngineTab === 'composition-viz' && (
                <>
                  <PipelineFlow result={engineResult} />
                  <div className="pg-divider" />
                  <CompositionViz result={engineResult} />
                </>
              )}
            </ErrorBoundary>
          </div>
        </section>

        {/* Right: Rendered components */}
        <section className="pg-panel" aria-label="Rendered guardrail components">
          <div className="pg-panel-header">
            <span className="pg-panel-title">Result</span>
            <span className="pg-panel-badge" aria-live="polite" aria-atomic="true">
              {engineResult.components.length} {engineResult.components.length === 1 ? 'component' : 'components'}
            </span>
          </div>
          <div className="pg-panel-body">
            {showWelcome ? (
              <div className="pg-welcome" role="region" aria-label="Getting started">
                <div className="pg-welcome-icon" aria-hidden="true">⬡</div>
                <div className="pg-welcome-title">Guardrail Decision Engine</div>
                <div className="pg-welcome-body">
                  Load a scenario to see the engine in action, or adjust the P1–P10 primitives on the left.
                </div>
                <div className="pg-welcome-scenarios">
                  {SCENARIOS.map((s, idx) => (
                    <button
                      key={s.id}
                      className="pg-welcome-scenario-btn"
                      onClick={() => handleScenarioSelect(s.id)}
                      aria-label={`Load ${s.label} scenario: ${s.description}`}
                    >
                      <span style={{ color: s.color }} aria-hidden="true">◆</span>
                      <span className="pg-welcome-scenario-label">{s.label}</span>
                      <span className="pg-welcome-scenario-key" aria-hidden="true">{idx + 1}</span>
                    </button>
                  ))}
                </div>
                <div className="pg-welcome-hint">
                  Press <kbd>?</kbd> for keyboard shortcuts
                </div>
              </div>
            ) : (
              <ErrorBoundary panelName="Result Panel">
                <ResultPanel
                  result={engineResult}
                  primitives={primitives}
                  onAuditEvent={handleAuditEvent}
                />
              </ErrorBoundary>
            )}
          </div>
        </section>
      </main>

      {/* Bottom: Audit trail */}
      <section className="pg-audit" aria-label="Audit trail — most recent events first" aria-live="polite" aria-atomic="false">
        <div className="pg-audit-header">
          <span className="pg-panel-title">Audit Trail</span>
          <span className="pg-panel-badge" aria-live="polite">{auditLog.length} events</span>
          <button
            className="pg-audit-clear"
            onClick={() => setAuditLog([])}
            aria-label="Clear all audit events"
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
