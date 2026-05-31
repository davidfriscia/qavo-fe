#!/usr/bin/env node
/**
 * Prints the CHANGELOG.md section for a given version to stdout.
 *
 * The release workflow pipes the output into the GitHub Release body so the
 * changelog stays the single source of truth — no separate "release notes"
 * artifact to maintain.
 *
 * Format expected: top-level `## [X.Y.Z] - YYYY-MM-DD` headings, KeepAChangelog
 * style, with content extending until the next `## ` heading or EOF.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const version = process.argv[2];
if (!version) {
  console.error('usage: extract-changelog.mjs <version>');
  process.exit(2);
}

const changelogPath = resolve(process.cwd(), 'CHANGELOG.md');
if (!existsSync(changelogPath)) {
  // Falling back to a stub keeps the release workflow green when the
  // changelog has not been updated yet (so the publish itself is not blocked).
  console.log(`Release ${version}.`);
  process.exit(0);
}

const text = readFileSync(changelogPath, 'utf8');
const lines = text.split(/\r?\n/);
const headingRegex = new RegExp(`^##\\s+\\[?${escape(version)}\\]?`);
let inSection = false;
const out = [];
for (const line of lines) {
  if (headingRegex.test(line)) {
    inSection = true;
    continue;
  }
  if (inSection && /^##\s+/.test(line)) {
    break;
  }
  if (inSection) {
    out.push(line);
  }
}

const body = out.join('\n').trim();
console.log(body || `Release ${version}.`);

function escape(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
