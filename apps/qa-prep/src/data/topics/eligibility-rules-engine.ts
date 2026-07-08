import type { Topic } from '../../types/topic';

export const eligibilityRulesEngine: Topic = {
  id: 'eligibility-rules-engine',
  title: 'Eligibility / Rules Engine Testing',
  flashcards: [
    {
      front: 'What makes rules engine testing different from typical API testing?',
      back: 'You validate decision logic across combinatorial inputs—plan rules, dates, member status, drug attributes—not just request/response shape.',
    },
    {
      front: 'What is a decision table in rules testing?',
      back: 'A matrix of input conditions (member status, plan tier, effective date) mapped to expected outcomes (eligible, PA required, not covered).',
    },
    {
      front: 'Why tie tests to rule version IDs?',
      back: 'So when plan config changes, you know which tests to update and can diff rule versions before regression.',
    },
    {
      front: 'What boundary dates matter most for eligibility rules?',
      back: 'Coverage effective/termination dates, plan year rollovers, and mid-year formulary update effective dates.',
    },
    {
      front: 'What is combinatorial explosion in rules testing?',
      back: 'Too many input combinations to test exhaustively—prioritize by business impact and change frequency.',
    },
  ],
  mockQuestions: [
    'How would you test an eligibility rules engine when plan configurations change frequently?',
    'How do you prioritize test coverage when the rule set has thousands of combinations?',
    'Describe how you would regression-test a formulary update that affects eligibility flags.',
    'What is your approach to testing COB (coordination of benefits) scenarios?',
  ],
  strongAnswerBullets: [
    'Build decision tables: inputs → expected outcome, automated with @pytest.mark.parametrize',
    'Tie parameterized tests to rule version IDs for traceability',
    'Test boundary dates: coverage start/end, plan year rollover, mid-year updates',
    'Prioritize by business impact and change frequency when full coverage is impractical',
    'Diff rule config on plan changes; run targeted suite before full regression',
    'Include COB, PA-required, and not-covered paths with concrete NDC/plan examples',
  ],
  commonPitfalls: [
    'Hard-coding expected results without linking to rule versions',
    'Testing only happy-path eligibility with no boundary dates',
    'Ignoring silent rule config changes that break production without failing CI',
    'Treating rules testing like API shape testing only',
  ],
  followUpQuestions: [
    'How would you test a rule that depends on external data, like a dynamic formulary update mid-plan-year?',
    'How do you know when a rule change requires full regression vs. targeted tests?',
    'What do you do when business cannot provide expected outcomes for edge cases?',
  ],
  sampleAnswers: [
    'I build decision tables mapping inputs—member status, effective date, plan tier—to expected outcomes and automate them with parameterized tests tied to rule version IDs. When plans change, I diff the rule config and run targeted regression before the full suite. Boundary tests cover effective dates, terminations, and plan year rollovers.',
    'I prioritize by business impact and change frequency using a risk matrix. High-impact rules—core eligibility, COB, PA triggers—get full combinatorial coverage. Lower-impact edge cases get spot checks. I document what each test row covers so gaps are visible.',
    'When a formulary update changes eligibility flags, I diff the formulary version, identify affected NDC and plan combinations, and run parameterized tests for each changed row. I include before-and-after cases around the effective date of the update.',
    'For COB I test primary vs. secondary payer ordering, overlapping coverage dates, and scenarios where one plan terminates mid-year. Each case maps to a decision table row with member ID, plan sequence, and expected copay or rejection outcome.',
  ],
  followUpSampleAnswers: [
    'I version the external formulary feed in test fixtures and run cases immediately before and after the effective date. Integration tests hit staging with the updated feed; unit tests use frozen snapshots so CI stays fast and deterministic.',
    'A config diff touching shared rule modules triggers targeted regression for affected plan types. A plan year rollover or new rule engine version triggers full regression. I document these triggers in the test plan so the team knows which suite to run.',
    'I work with business analysts to define expected outcomes for the highest-risk edge cases first. For unclear cases I log assumptions, test the most likely interpretation, and flag ambiguous rules for review rather than skipping them entirely.',
  ],
};
