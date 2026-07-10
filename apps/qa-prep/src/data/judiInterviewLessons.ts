export type JudiInterviewLesson = {
  id: string;
  text: string;
};

/** Insights from actual Judi Health / Capital Rx interview loops. */
export const judiInterviewLessons: JudiInterviewLesson[] = [
  {
    id: 'test-data-pain',
    text: 'Biggest pain point: test data — synthetic personas and fixture ownership matter more than tool names.',
  },
  {
    id: 'backend-focus',
    text: 'Heavy backend and API focus — contract tests, auth boundaries, and negative paths.',
  },
  {
    id: 'python-pytest',
    text: 'Python and PyTest emphasis — fixtures, markers, and parametrize show up repeatedly.',
  },
  {
    id: 'cloudwatch-debug',
    text: 'CloudWatch and debugging — correlate timestamps, don’t mask flakes with retries.',
  },
  {
    id: 'sql',
    text: 'SQL likely important — ground-truth validation and effective dates in healthcare data.',
  },
  {
    id: 'phi',
    text: 'Healthcare and PHI awareness — never log sensitive fields; use synthetic data only.',
  },
  {
    id: 'real-projects',
    text: 'Practical examples beat definitions — lead every answer with something you built.',
  },
  {
    id: 'follow-ups',
    text: 'Interviewers ask follow-up after follow-up — practice chained probes, not one-shot answers.',
  },
  {
    id: 'reasoning',
    text: 'They value reasoning over memorized terminology — explain why, not just what.',
  },
];
