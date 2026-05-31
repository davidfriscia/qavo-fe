#!/usr/bin/env node
/**
 * Verifies that every publishable @qavo/* package.json declares the version
 * passed as argv[2] (typically the git tag, with the leading `v` stripped).
 *
 * The release workflow runs this before npm publish so a drifted version in a
 * source package.json can never reach the registry under the wrong tag.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const expected = process.argv[2];
if (!expected) {
  console.error('usage: verify-package-versions.mjs <version>');
  process.exit(2);
}

const projectsDir = resolve(process.cwd(), 'projects');
const failures = [];

for (const entry of readdirSync(projectsDir)) {
  const pkgPath = join(projectsDir, entry, 'package.json');
  try {
    statSync(pkgPath);
  } catch {
    continue;
  }
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (!pkg.name || !pkg.name.startsWith('@qavo/')) {
    continue;
  }
  if (pkg.version !== expected) {
    failures.push(`${pkg.name}: ${pkg.version} (expected ${expected})`);
  }
}

if (failures.length) {
  console.error('Package version mismatch — aborting release:');
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

console.log(`All @qavo/* packages declare version ${expected}.`);
