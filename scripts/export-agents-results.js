#!/usr/bin/env node
// scripts/export-agents-results.js
'use strict';

const fs   = require('fs');
const path = require('path');

const outArg = process.argv.indexOf('--out');
const OUT    = outArg !== -1
  ? process.argv[outArg + 1]
  : path.join(__dirname, '..', 'agents-results.json');

const reportPath = path.join(__dirname, '..', 'playwright-report', 'report.json');

if (!fs.existsSync(reportPath)) {
  console.error('❌ playwright-report/report.json not found.');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

// ── Recursively collect all specs from nested suites ─────────────────────────
function collectSpecs(suiteNode) {
  const specs = [];
  for (const spec of (suiteNode.specs || [])) {
    specs.push(spec);
  }
  for (const child of (suiteNode.suites || [])) {
    specs.push(...collectSpecs(child));
  }
  return specs;
}

// ── Suite config ──────────────────────────────────────────────────────────────
const SUITE_CONFIG = {
  'homepage':     { icon: '🏠', name: 'Homepage' },
  'registration': { icon: '📝', name: 'Registration' },
  'services':     { icon: '🛠️', name: 'Services' },
};

// ── Parse ─────────────────────────────────────────────────────────────────────
function statusOf(result) {
  if (!result) return 'skip';
  if (result.status === 'passed')  return 'pass';
  if (result.status === 'failed')  return 'fail';
  if (result.status === 'skipped') return 'fixme';
  return 'skip';
}

const suites = [];
let totalPassed = 0, totalFailed = 0, totalFixme = 0, totalMs = 0;

for (const topSuite of (report.suites || [])) {
  // topSuite.title is the file name e.g. "homepage.spec.ts"
  const fileName = path.basename(topSuite.title || '', '.spec.ts');

  // Skip seed.spec.ts
  if (fileName === 'seed') continue;

  const config = SUITE_CONFIG[fileName];
  if (!config) continue;

  const specs = collectSpecs(topSuite);
  const tests = [];
  let suiteMs = 0;

  for (const spec of specs) {
    const result = spec.tests?.[0]?.results?.[0];
    const status = statusOf(result);
    const ms     = result?.duration || 0;
    suiteMs += ms;

    if (status === 'pass')  totalPassed++;
    if (status === 'fail')  totalFailed++;
    if (status === 'fixme') totalFixme++;

    tests.push({
      name:   spec.title,
      status,
      ms,
      error:  result?.error?.message?.slice(0, 300) || null,
    });
  }

  totalMs += suiteMs;

  suites.push({
    name:     config.name,
    icon:     config.icon,
    file:     topSuite.title || '',
    duration: suiteMs > 0 ? `${(suiteMs / 1000).toFixed(1)}s` : '–',
    tests,
  });
}

// ── Write output ──────────────────────────────────────────────────────────────
const result = {
  meta: {
    runAt:      new Date().toISOString(),
    duration:   totalMs > 0 ? `${(totalMs / 1000).toFixed(1)}s` : '–',
    totalTests: totalPassed + totalFailed + totalFixme,
    passed:     totalPassed,
    failed:     totalFailed,
    fixme:      totalFixme,
    source:     'https://github.com/hdemirhan-dev/timocom-playwright-agents',
    browser:    'Chromium',
  },
  pipeline: [
    { name: 'Planner',   icon: '🗺️', model: 'claude-haiku-4-5',  ran: true, duration: '~6m' },
    { name: 'Generator', icon: '⚙️', model: 'claude-sonnet-4-6', ran: true, duration: '~6m' },
    { name: 'Healer',    icon: '🩹', model: 'claude-sonnet-4-6', ran: true, duration: '~3m' },
  ],
  suites,
};

fs.writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf-8');

console.log(`✅ agents-results.json written to ${OUT}`);
console.log(`   ${totalPassed} passed · ${totalFailed} failed · ${totalFixme} fixme`);
console.log(`   ${suites.length} suites · ${result.meta.totalTests} total tests`);