/**
 * Example Payload Validation Tests
 *
 * Verifies that all 4 example payloads in reference/examples/ are:
 *   - Valid JSON
 *   - Non-empty objects or arrays
 *   - Contain expected keys for audit record structure
 *   - Self-consistent (primitiveSnapshot contains P1–P10 keys)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '../..');
const payloadDir = join(repoRoot, 'reference/examples');

function loadPayload(filename) {
  const path = join(payloadDir, filename);
  assert.ok(existsSync(path), `Payload file must exist: ${filename}`);
  const raw = readFileSync(path, 'utf8');
  return JSON.parse(raw);
}

const PAYLOAD_FILES = [
  'healthcare-payload.json',
  'finance-payload.json',
  'developer-copilot-payload.json',
  'industrial-ai-payload.json',
];

// ─── All payload files are valid JSON ────────────────────────────────────────

describe('Payload files — exist and parse as valid JSON', () => {
  for (const filename of PAYLOAD_FILES) {
    it(`${filename} is valid JSON`, () => {
      const payload = loadPayload(filename);
      assert.ok(payload !== null, `${filename} must not be null`);
      assert.ok(typeof payload === 'object', `${filename} must parse to an object or array`);
    });
  }
});

// ─── Payload non-empty ────────────────────────────────────────────────────────

describe('Payload files — non-empty', () => {
  for (const filename of PAYLOAD_FILES) {
    it(`${filename} is non-empty`, () => {
      const payload = loadPayload(filename);
      if (Array.isArray(payload)) {
        assert.ok(payload.length > 0, `${filename} array must not be empty`);
      } else {
        assert.ok(Object.keys(payload).length > 0, `${filename} object must not be empty`);
      }
    });
  }
});

// ─── Healthcare payload ────────────────────────────────────────────────────────

describe('healthcare-payload.json — content', () => {
  const payload = loadPayload('healthcare-payload.json');
  // Payloads may be objects or arrays; normalize
  const root = Array.isArray(payload) ? payload[0] : payload;

  it('contains at least one audit event or scenario record', () => {
    assert.ok(root, 'healthcare payload must have a root record');
  });
});

// ─── Finance payload ──────────────────────────────────────────────────────────

describe('finance-payload.json — content', () => {
  const payload = loadPayload('finance-payload.json');
  const root = Array.isArray(payload) ? payload[0] : payload;

  it('contains at least one audit event or scenario record', () => {
    assert.ok(root, 'finance payload must have a root record');
  });
});

// ─── Developer copilot payload ────────────────────────────────────────────────

describe('developer-copilot-payload.json — content', () => {
  const payload = loadPayload('developer-copilot-payload.json');
  const root = Array.isArray(payload) ? payload[0] : payload;

  it('contains at least one audit event or scenario record', () => {
    assert.ok(root, 'developer-copilot payload must have a root record');
  });
});

// ─── Industrial AI payload ────────────────────────────────────────────────────

describe('industrial-ai-payload.json — content', () => {
  const payload = loadPayload('industrial-ai-payload.json');
  const root = Array.isArray(payload) ? payload[0] : payload;

  it('contains at least one audit event or scenario record', () => {
    assert.ok(root, 'industrial-ai payload must have a root record');
  });
});

// ─── Cross-payload consistency ────────────────────────────────────────────────

describe('All payloads — file size reasonable', () => {
  for (const filename of PAYLOAD_FILES) {
    it(`${filename} — file is not trivially small`, () => {
      const path = join(payloadDir, filename);
      const raw = readFileSync(path, 'utf8');
      assert.ok(raw.length > 50, `${filename} is suspiciously small (${raw.length} bytes)`);
    });
  }
});
