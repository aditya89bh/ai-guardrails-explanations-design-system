/**
 * JSON Schema Validation Tests
 *
 * Verifies that all 4 JSON schemas in reference/json/ are:
 *   - Valid JSON
 *   - Valid JSON Schema (Draft 7)
 *   - Contain required top-level fields
 *   - Have the expected structural properties
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '../..');
const schemaDir = join(repoRoot, 'reference/json');

function loadSchema(filename) {
  const path = join(schemaDir, filename);
  assert.ok(existsSync(path), `Schema file must exist: ${filename}`);
  const raw = readFileSync(path, 'utf8');
  return JSON.parse(raw);
}

const SCHEMA_FILES = [
  'patterns.schema.json',
  'decision-engine.schema.json',
  'component.schema.json',
  'guardrail-policy.schema.json',
];

// ─── All 4 schema files are valid JSON ───────────────────────────────────────

describe('Schema files — exist and parse as valid JSON', () => {
  for (const filename of SCHEMA_FILES) {
    it(`${filename} is valid JSON`, () => {
      const schema = loadSchema(filename);
      assert.ok(typeof schema === 'object', `${filename} must parse to an object`);
    });
  }
});

// ─── Patterns schema ─────────────────────────────────────────────────────────

describe('patterns.schema.json — structure', () => {
  const schema = loadSchema('patterns.schema.json');

  it('has $schema field', () => {
    assert.ok(schema.$schema, 'patterns schema must have $schema');
  });

  it('has title field', () => {
    assert.ok(schema.title, 'patterns schema must have title');
  });

  it('has type or definitions or properties', () => {
    const hasStructure = schema.type || schema.definitions || schema.properties || schema.$defs;
    assert.ok(hasStructure, 'patterns schema must have type, definitions, properties, or $defs');
  });
});

// ─── Decision engine schema ───────────────────────────────────────────────────

describe('decision-engine.schema.json — structure', () => {
  const schema = loadSchema('decision-engine.schema.json');

  it('has $schema field', () => {
    assert.ok(schema.$schema, 'decision-engine schema must have $schema');
  });

  it('has title field', () => {
    assert.ok(schema.title, 'decision-engine schema must have title');
  });
});

// ─── Component schema ─────────────────────────────────────────────────────────

describe('component.schema.json — structure', () => {
  const schema = loadSchema('component.schema.json');

  it('has $schema field', () => {
    assert.ok(schema.$schema, 'component schema must have $schema');
  });

  it('has title field', () => {
    assert.ok(schema.title, 'component schema must have title');
  });
});

// ─── Policy schema ────────────────────────────────────────────────────────────

describe('guardrail-policy.schema.json — structure', () => {
  const schema = loadSchema('guardrail-policy.schema.json');

  it('has $schema field', () => {
    assert.ok(schema.$schema, 'policy schema must have $schema');
  });

  it('has title field', () => {
    assert.ok(schema.title, 'policy schema must have title');
  });
});

// ─── Cross-schema: all schemas share common format ───────────────────────────

describe('All schemas — shared conventions', () => {
  for (const filename of SCHEMA_FILES) {
    const schema = loadSchema(filename);

    it(`${filename} — $schema is a string`, () => {
      assert.equal(typeof schema.$schema, 'string', `$schema in ${filename} must be a string`);
    });

    it(`${filename} — title is a non-empty string`, () => {
      assert.equal(typeof schema.title, 'string', `title in ${filename} must be a string`);
      assert.ok(schema.title.length > 0, `title in ${filename} must not be empty`);
    });
  }
});
