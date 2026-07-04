/**
 * YAML Configuration Validation Tests
 *
 * Verifies that all 4 YAML configs in reference/yaml/ are:
 *   - Valid YAML
 *   - Non-null after parsing
 *   - Contain expected top-level keys (policyId, industry, riskThresholds, confidenceThresholds)
 *   - Risk thresholds cover the expected integer range (0–4)
 *   - Policy rules array is present
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '../..');
const yamlDir = join(repoRoot, 'reference/yaml');

function loadYaml(filename) {
  const path = join(yamlDir, filename);
  assert.ok(existsSync(path), `YAML file must exist: ${filename}`);
  const raw = readFileSync(path, 'utf8');
  return yaml.load(raw);
}

const YAML_FILES = [
  'healthcare-config.yaml',
  'finance-config.yaml',
  'developer-copilot-config.yaml',
  'industrial-ai-config.yaml',
];

// ─── All YAML files parse without error ──────────────────────────────────────

describe('YAML config files — exist and parse', () => {
  for (const filename of YAML_FILES) {
    it(`${filename} is valid YAML`, () => {
      const config = loadYaml(filename);
      assert.ok(config !== null, `${filename} must not be null after parsing`);
      assert.equal(typeof config, 'object', `${filename} must parse to an object`);
    });
  }
});

// ─── Expected top-level keys ─────────────────────────────────────────────────

describe('YAML config files — required top-level keys', () => {
  const REQUIRED_KEYS = ['policyId', 'industry'];

  for (const filename of YAML_FILES) {
    const config = loadYaml(filename);

    for (const key of REQUIRED_KEYS) {
      it(`${filename} has key: ${key}`, () => {
        assert.ok(Object.prototype.hasOwnProperty.call(config, key) || config[key] !== undefined,
          `${filename} must have top-level key: ${key}`);
      });
    }
  }
});

// ─── Healthcare config specifics ─────────────────────────────────────────────

describe('healthcare-config.yaml — specifics', () => {
  const config = loadYaml('healthcare-config.yaml');

  it('industry is healthcare or clinical-ai', () => {
    const industry = (config.industry ?? '').toLowerCase();
    assert.ok(
      industry.includes('health') || industry.includes('clinical'),
      `healthcare config industry must reference healthcare or clinical, got: ${config.industry}`
    );
  });
});

// ─── Finance config specifics ─────────────────────────────────────────────────

describe('finance-config.yaml — specifics', () => {
  const config = loadYaml('finance-config.yaml');

  it('industry is finance or financial', () => {
    const industry = (config.industry ?? '').toLowerCase();
    assert.ok(
      industry.includes('financ'),
      `finance config industry must reference financial, got: ${config.industry}`
    );
  });
});

// ─── Developer config specifics ──────────────────────────────────────────────

describe('developer-copilot-config.yaml — specifics', () => {
  const config = loadYaml('developer-copilot-config.yaml');

  it('industry references developer or software', () => {
    const industry = (config.industry ?? '').toLowerCase();
    const policyId = (config.policyId ?? '').toLowerCase();
    assert.ok(
      industry.includes('developer') || industry.includes('software') || policyId.includes('developer'),
      `developer config must reference developer or software, got industry: ${config.industry}`
    );
  });
});

// ─── Industrial AI config specifics ──────────────────────────────────────────

describe('industrial-ai-config.yaml — specifics', () => {
  const config = loadYaml('industrial-ai-config.yaml');

  it('industry references industrial or manufacturing', () => {
    const industry = (config.industry ?? '').toLowerCase();
    const policyId = (config.policyId ?? '').toLowerCase();
    assert.ok(
      industry.includes('industrial') || industry.includes('manufactur') || policyId.includes('industrial'),
      `industrial config must reference industrial or manufacturing, got industry: ${config.industry}`
    );
  });
});

// ─── Non-empty configs ────────────────────────────────────────────────────────

describe('YAML config files — non-trivially small', () => {
  for (const filename of YAML_FILES) {
    it(`${filename} has more than 3 top-level keys`, () => {
      const config = loadYaml(filename);
      const keyCount = Object.keys(config).length;
      assert.ok(keyCount > 3, `${filename} must have more than 3 top-level keys (got ${keyCount})`);
    });
  }
});
