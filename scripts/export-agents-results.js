#!/usr/bin/env node
// scripts/export-agents-results.js
//
// Run after: npx playwright test
// Reads:     test-results/.last-run.json + playwright-report/
// Writes:    agents-results.json  (committed to demirhan-living-project)
//
// Usage:
//   node scripts/export-agents-results.js
//   node scripts/export-agents-results.js --out /path/to/demirhan-living-project/agents-results.json

'use strict';

const fs   = require('fs');
const path = require('path');

const outArg = process.argv.indexOf('--out');
const OUT    = outArg !== -1
  ? process.argv[outArg + 1]
  : path.join(__dirname, '..', 'agents-results.json');

// ── Read Playwright JSON report ──────────────────────────────────────────────
// Playwright writes a JSON report to playwright-report/report.json
// if you add { reporter: [['json', { outputFile: 'playwright-report/report.json' }]] }
// to your playwright.config.ts. We also fall back to .last-run.json for basic status.

const reportPath = path.join(__dirname, '..', 'playwright-report', 'report.json');
const lastRunPath = path.join(__dirname, '..', 'test-results', '.last-run.json');

let report = null;

if (fs.existsSync(reportPath)) {
  try { report = JSON.parse(fs.readFileSync(reportPath, 'utf-8')); } catch {}
}

if (!report) {
  console.error('❌ playwright-report/report.json not found.');
  console.error('   Add to playwright.config.ts:');
  console.error("   reporter: [['list'], ['json', { outputFile: 'playwright-report/report.json' }]]");
  process.exit(1);
}

// ── Parse suites ─────────────────────────────────────────────────────────────
const SUITE_ICONS = {
  'homepage':     '🏠',
  'registration': '📝',
  'services':     '🛠️',
};

function statusOf(result) {
  if (!result) return 'skip';
  if (result.status === 'passed')  return 'pass';
  if (result.status === 'failed')  return 'fail';
  if (result.status === 'skipped') return 'fixme'; // test.fixme() shows as skipped
  return 'skip';
}

const suites = [];
let totalPassed = 0, totalFailed = 0, totalFixme = 0;
let totalMs = 0;

for (const suite of (report.suites || [])) {
  const fileName = path.basename(suite.file || '', '.spec.ts');
  const icon     = SUITE_ICONS[fileName] || '📄';
  const tests    = [];
  let suiteMs    = 0;

  for (const spec of (suite.specs || [])) {
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
    name:     suite.title || fileName,
    icon,
    file:     suite.file || '',
    duration: suiteMs > 0 ? `${(suiteMs / 1000).toFixed(1)}s` : '–',
    tests,
  });
}

// ── Build output ──────────────────────────────────────────────────────────────
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
    { name: 'Planner',   icon: '🗺️', model: 'claude-haiku-4-5',   ran: true, duration: '~6m' },
    { name: 'Generator', icon: '⚙️', model: 'claude-sonnet-4-6',  ran: true, duration: '~6m' },
    { name: 'Healer',    icon: '🩹', model: 'claude-sonnet-4-6',  ran: true, duration: '~3m' },
  ],
  suites,
};
console.log(`   ${totalPassed} passed · ${totalFailed} failed · ${totalFixme} fixme`);
console.log(`   ${suites.length} suites · ${result.meta.totalTests} total tests`);fs.writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf-8');

console.log(`✅ agents-results.json written to ${OUT}`);

