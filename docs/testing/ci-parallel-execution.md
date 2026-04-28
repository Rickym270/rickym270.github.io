# CI Parallel Execution (Playwright)

This guide explains where CI parallelism is configured for Playwright in this repository and how to tune it safely.

## Where Parallelism Is Configured

CI parallel execution comes from two layers:

1. **Workflow-level sharding** in `.github/workflows/playwright.yml` (multiple jobs run at once).
2. **Playwright runner settings** in `playwright.config.ts` (how each job runs tests internally).

If you only change `playwright.config.ts`, you are not changing the number of parallel CI jobs. That fan-out is controlled by the workflow matrix.

## Layer 1: Workflow Sharding (Main CI Fan-Out)

In `.github/workflows/playwright.yml`, the `full-suite` job uses a matrix:

- `shardIndex: [1, 2, 3, 4, 5]`
- `shardTotal: [5]`

Each matrix job runs:

```bash
npx playwright test ... --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
```

This is what creates 5 parallel CI executions for the full suite.

## Layer 2: Playwright Runner Parallelism (Inside Each Shard)

In `playwright.config.ts`, key settings are:

- `workers: process.env.CI ? 1 : undefined`
- `fullyParallel: true`
- `projects` list (`chromium`, `chromium-iphone`, `firefox`, `api`)

What this means in CI today:

- Each shard is a separate CI job (from workflow matrix).
- Inside each shard, worker count is intentionally limited to `1` for stability.
- Tests are still distributed by shard and project selection, so CI remains parallel overall.

## Current Repository Setup

- Full-suite runs as **5 shards in parallel** on PRs (and on `master` runs).
- CI uses **1 worker per shard** (`workers: 1`) to reduce resource contention.
- `fullyParallel: true` remains enabled for local and non-CI behavior and for compatibility with current suite structure.

## How To Change Parallel CI Safely

### Increase or decrease number of CI shards

Edit `.github/workflows/playwright.yml`:

- Change `matrix.shardIndex` values.
- Keep `shardTotal` aligned with shard count.
- Keep `--shard=i/n` using the same total.

Example: move from 5 to 3 shards

- `shardIndex: [1, 2, 3]`
- `shardTotal: [3]`

### Change per-shard worker concurrency

Edit `playwright.config.ts`:

- Update `workers: process.env.CI ? 1 : undefined` to desired CI value.

Only raise CI workers if runners have enough CPU/RAM and test stability remains good.

### Optional: tune browser/project spread

The workflow assembles project flags (for UI/API) before running Playwright. If needed, tune project selection in `.github/workflows/playwright.yml` (`steps.skip-check.outputs.projects`) to reduce load.

## Verification Checklist

After changing parallel settings:

1. Open a PR and confirm the number of `Full suite (shard i/n)` jobs matches your matrix.
2. Confirm each shard command uses the expected `--shard=i/n`.
3. Compare total runtime and flaky failures across at least 2-3 PR runs.
4. Review uploaded artifacts (`playwright-report-shard-*`, `test-results-shard-*`) for failed shards.

## Common Misconceptions

- **"Parallel CI is set only in Playwright config."**  
  Not in this repo. Most CI parallel fan-out comes from workflow matrix sharding.
- **"`workers: 1` means CI is not parallel."**  
  CI can still be highly parallel because multiple shard jobs run simultaneously.
- **"More workers always means faster."**  
  On constrained CI runners, higher workers can increase flakiness and total retries.

## Quick Decision Guide

- Want **more/fewer CI jobs**? Change workflow matrix shard count.
- Want **more/fewer tests at once inside each job**? Change Playwright `workers`.
- Seeing flaky timeouts or resource contention? Keep/increase sharding, but keep CI `workers` conservative.
