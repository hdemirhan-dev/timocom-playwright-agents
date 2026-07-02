// tests/seed.spec.js
//
// Seed test for Playwright Agents (Planner/Generator/Healer).
// Kept intentionally empty — no fixtures, no auth, no site-specific setup.
// The Planner will run this once to establish baseline context (browser,
// project config, hooks) before exploring the target page itself.

'use strict';

const { test, expect } = require('@playwright/test');

test.describe('Seed', () => {
  test('seed', async ({ page }) => {
    // Intentionally empty — Planner/Generator fill this in per scenario.
  });
});