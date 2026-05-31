#!/usr/bin/env node
/**
 * Publishes every built @qavo/* package to npm.
 *
 * Build order matters at compile time (a downstream library imports an upstream
 * one), but publish order doesn't — npm is content-addressed. We iterate the
 * `dist/` folder produced by `npm run build:libs` and run `npm publish` per
 * package, marking each with the dist-tag the workflow derived from the git tag
 * (`latest` for stable, `next` for pre-releases). Provenance is enabled when
 * the workflow has the required OIDC permission.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const distRoot = resolve(process.cwd(), 'dist');
const npmTag = process.env.NPM_DIST_TAG || 'latest';
const dryRun = process.env.DRY_RUN === 'true';

if (!process.env.NODE_AUTH_TOKEN && !dryRun) {
  console.error('NODE_AUTH_TOKEN is not set; refusing to publish.');
  process.exit(1);
}

let published = 0;
for (const entry of readdirSync(distRoot)) {
  const dir = join(distRoot, entry);
  if (!statSync(dir).isDirectory()) continue;
  const pkgPath = join(dir, 'package.json');
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  } catch {
    continue;
  }
  if (!pkg.name?.startsWith('@qavo/')) {
    continue;
  }
  console.log(`Publishing ${pkg.name}@${pkg.version} (tag: ${npmTag})...`);
  const args = ['publish', '--access', 'public', '--tag', npmTag, '--provenance'];
  if (dryRun) args.push('--dry-run');
  execFileSync('npm', args, { cwd: dir, stdio: 'inherit' });
  published += 1;
}

console.log(`Published ${published} package(s).`);
