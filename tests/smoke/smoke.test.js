/**
 * Smoke Tests — Structural and Accessibility
 *
 * Verifies repository structure, file presence, and accessibility markers
 * without requiring a running server or browser.
 *
 * Covers:
 *   - Playground file presence (engine, data, components, app)
 *   - CI workflow file presence
 *   - Root health file presence
 *   - Docs file presence (new Phase 8 docs)
 *   - Accessibility markers in playground source files
 *   - Error boundary presence
 *   - Skip link presence
 *   - ARIA annotations in component source files
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

function exists(relPath) {
  return existsSync(join(root, relPath));
}

function read(relPath) {
  return readFileSync(join(root, relPath), 'utf8');
}

// ─── Root health files ────────────────────────────────────────────────────────

describe('Root health files', () => {
  const files = [
    'README.md',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    'SECURITY.md',
    'SUPPORT.md',
    'CODE_OF_CONDUCT.md',
    'ROADMAP.md',
    'RELEASE.md',
    'VERSIONING.md',
    'RELEASE_CHECKLIST.md',
    'LICENSE',
  ];

  for (const f of files) {
    it(`${f} exists`, () => {
      assert.ok(exists(f), `${f} must exist at repository root`);
    });
  }
});

// ─── Documentation files ─────────────────────────────────────────────────────

describe('Documentation files — Phase 8 additions', () => {
  const files = [
    'docs/getting-started.md',
    'docs/architecture.md',
    'docs/glossary.md',
    'docs/faq.md',
    'docs/troubleshooting.md',
    'docs/navigation.md',
    'docs/project-structure.md',
    'docs/diagrams/architecture.md',
    'docs/diagrams/decision-engine.md',
    'docs/diagrams/state-transitions.md',
    'docs/diagrams/pattern-lifecycle.md',
  ];

  for (const f of files) {
    it(`${f} exists`, () => {
      assert.ok(exists(f), `${f} must exist`);
    });
  }
});

// ─── Reference artifacts ──────────────────────────────────────────────────────

describe('Reference artifacts — schemas and configs', () => {
  const schemas = [
    'reference/json/patterns.schema.json',
    'reference/json/decision-engine.schema.json',
    'reference/json/component.schema.json',
    'reference/json/guardrail-policy.schema.json',
  ];

  const yamls = [
    'reference/yaml/healthcare-config.yaml',
    'reference/yaml/finance-config.yaml',
    'reference/yaml/developer-copilot-config.yaml',
    'reference/yaml/industrial-ai-config.yaml',
  ];

  const examples = [
    'reference/examples/healthcare-payload.json',
    'reference/examples/finance-payload.json',
    'reference/examples/developer-copilot-payload.json',
    'reference/examples/industrial-ai-payload.json',
  ];

  for (const f of [...schemas, ...yamls, ...examples]) {
    it(`${f} exists`, () => {
      assert.ok(exists(f), `${f} must exist`);
    });
  }
});

// ─── Playground engine files ──────────────────────────────────────────────────

describe('Playground engine files', () => {
  const files = [
    'playground/engine/primitives.js',
    'playground/engine/rules.js',
    'playground/engine/evaluator.js',
    'playground/engine/schema-bridge.js',
    'playground/engine/config-bridge.js',
  ];

  for (const f of files) {
    it(`${f} exists`, () => {
      assert.ok(exists(f), `${f} must exist`);
    });
  }
});

// ─── Playground data files ────────────────────────────────────────────────────

describe('Playground data files', () => {
  const files = [
    'playground/data/patterns.js',
    'playground/data/scenarios.js',
  ];

  for (const f of files) {
    it(`${f} exists`, () => {
      assert.ok(exists(f), `${f} must exist`);
    });
  }
});

// ─── Playground components ────────────────────────────────────────────────────

describe('Playground components', () => {
  const files = [
    'playground/components/PrimitiveControls.jsx',
    'playground/components/EnginePanel.jsx',
    'playground/components/ResultPanel.jsx',
    'playground/components/AuditPanel.jsx',
    'playground/components/PipelineFlow.jsx',
    'playground/components/StateTransitionViz.jsx',
    'playground/components/CompositionViz.jsx',
    'playground/components/ErrorBoundary.jsx',
    'playground/components/guardrail/WarningBanner.jsx',
    'playground/components/guardrail/ConfidenceBadge.jsx',
    'playground/components/guardrail/RefusalCard.jsx',
    'playground/components/guardrail/RecoveryPrompt.jsx',
    'playground/components/guardrail/PermissionGate.jsx',
    'playground/components/guardrail/EscalationCard.jsx',
  ];

  for (const f of files) {
    it(`${f} exists`, () => {
      assert.ok(exists(f), `${f} must exist`);
    });
  }
});

// ─── CI workflow files ────────────────────────────────────────────────────────

describe('CI workflow files', () => {
  const files = [
    '.github/workflows/markdown-lint.yml',
    '.github/workflows/link-check.yml',
    '.github/workflows/playground-build.yml',
    '.github/workflows/schema-validation.yml',
  ];

  for (const f of files) {
    it(`${f} exists`, () => {
      assert.ok(exists(f), `${f} must exist`);
    });
  }
});

// ─── GitHub templates ─────────────────────────────────────────────────────────

describe('GitHub templates', () => {
  const files = [
    '.github/ISSUE_TEMPLATE/bug_report.md',
    '.github/ISSUE_TEMPLATE/feature_request.md',
    '.github/PULL_REQUEST_TEMPLATE.md',
  ];

  for (const f of files) {
    it(`${f} exists`, () => {
      assert.ok(exists(f), `${f} must exist`);
    });
  }
});

// ─── Accessibility smoke tests ────────────────────────────────────────────────

describe('Playground accessibility markers — page.jsx', () => {
  const pageSource = read('playground/app/page.jsx');

  it('has skip-link', () => {
    assert.ok(
      pageSource.includes('skip-link') || pageSource.includes('Skip to'),
      'page.jsx must include a skip link for keyboard navigation'
    );
  });

  it('has aria-label on main sections', () => {
    assert.ok(
      pageSource.includes('aria-label'),
      'page.jsx must have aria-label attributes on sections'
    );
  });

  it('has aria-live region', () => {
    assert.ok(
      pageSource.includes('aria-live'),
      'page.jsx must have aria-live regions for dynamic content'
    );
  });

  it('has role=tablist on engine tabs', () => {
    assert.ok(
      pageSource.includes('role="tablist"') || pageSource.includes("role='tablist'"),
      'page.jsx must have role=tablist for engine tab navigation'
    );
  });

  it('has role=tab on tab buttons', () => {
    assert.ok(
      pageSource.includes('role="tab"') || pageSource.includes("role='tab'"),
      'page.jsx must have role=tab on individual tab buttons'
    );
  });

  it('has aria-selected on tabs', () => {
    assert.ok(
      pageSource.includes('aria-selected'),
      'page.jsx must have aria-selected on tab buttons'
    );
  });
});

describe('Playground accessibility markers — ErrorBoundary', () => {
  const source = read('playground/components/ErrorBoundary.jsx');

  it('has role=alert', () => {
    assert.ok(
      source.includes('role="alert"') || source.includes("role='alert'"),
      'ErrorBoundary must use role=alert for the error state'
    );
  });

  it('has aria-live=assertive', () => {
    assert.ok(
      source.includes('aria-live="assertive"') || source.includes("aria-live='assertive'"),
      'ErrorBoundary must use aria-live=assertive'
    );
  });
});

describe('Playground accessibility markers — PermissionGate', () => {
  const source = read('playground/components/guardrail/PermissionGate.jsx');

  it('has aria-modal', () => {
    assert.ok(
      source.includes('aria-modal'),
      'PermissionGate must include aria-modal'
    );
  });
});

// ─── No AI attribution in root files ────────────────────────────────────────

describe('No AI attribution — root files', () => {
  const files = ['README.md', 'CONTRIBUTING.md', 'CHANGELOG.md'];
  const forbidden = ['co-authored-by', 'generated by cursor', 'generated by claude', 'generated by chatgpt'];

  for (const f of files) {
    it(`${f} contains no AI attribution`, () => {
      const content = read(f).toLowerCase();
      for (const term of forbidden) {
        assert.equal(
          content.includes(term),
          false,
          `${f} must not contain attribution: "${term}"`
        );
      }
    });
  }
});
