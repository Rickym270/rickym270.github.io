import type { Topic } from '../../types/topic';

export const flakyTestDebugging: Topic = {
  id: 'flaky-test-debugging',
  title: 'Flaky Test Debugging',
  flashcards: [
    {
      front: 'What is the first step when a test passes locally but fails intermittently in CI?',
      back: 'Reproduce with the same environment and seed—check timing, shared state, or dependency ordering before adding retries.',
    },
    {
      front: 'What is test order dependency?',
      back: 'A test that passes alone but fails in the full suite because a prior test left shared state (data, mocks, env vars).',
    },
    {
      front: 'Why are retry decorators a last resort?',
      back: 'They mask non-determinism, erode CI trust, and slow pipelines—fix root cause instead.',
    },
    {
      front: 'What is test quarantine?',
      back: 'Temporarily excluding a flaky test from CI with a tracked ticket—prevents blocking the team while you fix it.',
    },
  ],
  mockQuestions: [
    'Walk me through how you would diagnose and fix a flaky eligibility API test.',
    'How do you distinguish a flaky test from an environment-specific failure?',
    'What is your policy on @pytest.mark.flaky or retry plugins in CI?',
    'How do you prevent flaky tests from eroding team trust in the automation suite?',
  ],
  strongAnswerBullets: [
    'Collect CI failure logs and timestamps to spot patterns (shard, time of day, parallel vs. isolated)',
    'Run test in isolation vs. full suite to detect order dependency',
    'Check race conditions, hard-coded sleeps, shared test data collisions',
    'Fix root cause: explicit waits on conditions, unique IDs per test, proper fixture scoping',
    'Quarantine with tracked ticket if fix cannot ship same day—never silently ignore',
    'Measure flaky-test rate over time; alert on spikes',
  ],
  commonPitfalls: [
    'Adding retry decorators or longer timeouts without root-cause analysis',
    'Re-running CI until green and calling it done',
    'Shared member IDs or mutable staging data across parallel jobs',
    'Hard-coded sleep(5) instead of waiting on a condition',
  ],
  followUpQuestions: [
    'At what point would you quarantine a flaky test instead of fixing it immediately?',
    'How do you prove your fix worked and did not hide a real bug?',
    'How would you investigate flakiness that only appears in one CI shard?',
  ],
  sampleAnswers: [
    'I collect CI failure logs and timestamps to spot patterns—shard, time of day, parallel vs. isolated. I run the test alone vs. in the full suite to detect order dependency. I fix root cause with unique member IDs, explicit waits, or proper fixture scoping—not retry decorators.',
    'Environment failures are consistent—a specific staging outage or bad deploy. Flaky tests pass and fail without code or environment changes. I reproduce flakiness by running the test 50–100 times locally or in CI to confirm non-determinism before debugging.',
    'Retries are a last resort with a tracked ticket to fix root cause. I allow @pytest.mark.flaky only temporarily with an owner and deadline. Policy: no new flaky markers without a written root-cause hypothesis.',
    'I measure flaky-test rate over time, quarantine blockers with tickets, and celebrate fixes in team standups. When CI is unreliable, developers skip it—I treat flakiness as a production incident for the test suite.',
  ],
  sampleAnswerBullets: [
    [
      'I collect CI failure logs and timestamps to spot patterns—shard, time of day, parallel vs. isolated.',
      'I run the test alone vs. in the full suite to detect order dependency.',
      'I fix root cause with unique member IDs, explicit waits, or proper fixture scoping—not retry decorators.',
    ],
    [
      'Environment failures are consistent—a specific staging outage or bad deploy.',
      'Flaky tests pass and fail without code or environment changes.',
      'I reproduce flakiness by running the test 50–100 times locally or in CI to confirm non-determinism before debugging.',
    ],
    [
      'Retries are a last resort with a tracked ticket to fix root cause.',
      'I allow @pytest.mark.flaky only temporarily with an owner and deadline.',
      'Policy: no new flaky markers without a written root-cause hypothesis.',
    ],
    [
      'I measure flaky-test rate over time and quarantine blockers with tickets.',
      'I celebrate fixes in team standups.',
      'When CI is unreliable, developers skip it—I treat flakiness as a production incident for the test suite.',
    ],
  ],
  followUpSampleAnswers: [
    'I quarantine when the fix needs more than one day and the test blocks the pipeline. I create a ticket with failure logs, link it in the test skip reason, and set a fix-by date. Never silently delete or ignore.',
    'After the fix I run the test 100+ times in CI and locally, then run the full suite multiple times. I verify the failure mode is gone, not just masked. If it was a timing issue, I document what condition we now wait on.',
    'I compare which tests run on that shard vs. others, look for shared fixtures or data collisions, and run only that shard locally with the same parallelization settings. Often one test on the shard leaves state that breaks another.',
  ],
};
