import type { Topic } from '../../types/topic';

export const scrumProductCollaboration: Topic = {
  id: 'scrum-product-collaboration',
  title: 'Scrum, Product & Collaboration',
  flashcards: [
    {
      front: 'What should QA contribute during sprint planning?',
      back: 'Testability risks, acceptance criteria gaps, data/setup needs, automation effort estimates, and which scenarios are in vs. out of sprint scope.',
    },
    {
      front: 'How do you triage bug priority with engineering and product?',
      back: 'Use impact (members affected), severity (data loss, eligibility wrong), reproducibility, and workaround—present options, not ultimatums.',
    },
    {
      front: 'What is Definition of Done from a QA perspective?',
      back: 'ACs met, tests pass at agreed tier, no open critical defects, test data documented, and release notes updated for patient-facing changes.',
    },
    {
      front: 'How do you translate acceptance criteria into test cases?',
      back: 'Map each AC to at least one positive and one negative path; identify boundary dates, plan types, and edge personas; flag ambiguous ACs before development finishes.',
    },
  ],
  mockQuestions: [
    'How do you work with a Product Manager when scope is tight and testing time is limited?',
    'Describe how you prioritize bugs during a sprint when engineering capacity is full.',
    'How do you contribute to sprint planning and refinement as QA on a Scrum team?',
    'Tell me about a time you had to communicate a quality risk to non-technical stakeholders.',
  ],
  strongAnswerBullets: [
    'Partner with PM early—refinement, not just end-of-sprint testing',
    'Prioritize by patient/member impact and regulatory exposure',
    'Present trade-offs with data: what is covered, what is deferred, residual risk',
    'Clear bug reports: steps, expected vs. actual, environment, severity rationale',
    'Avoid gatekeeper mindset—collaborate on sprint goals and DoD',
    'Escalate blockers (staging down, missing test data) early in standup',
    'Document deferred test scope in writing so product accepts residual risk',
  ],
  commonPitfalls: [
    'Acting as a release gatekeeper instead of a quality partner',
    'Vague bug reports that force developers to reproduce from scratch',
    'Skipping refinement and discovering untestable ACs mid-sprint',
    'Automating before acceptance criteria are stable',
  ],
  followUpQuestions: [
    'How do you handle a PM who wants to ship without running full regression?',
    'What do you do when the Scrum Master asks you to take on work outside QA scope?',
    'How do you keep the backlog healthy when defects keep reopening?',
  ],
  sampleAnswers: [
    'I meet PM in refinement to clarify ACs and flag testability gaps early. When scope is tight, I propose a risk-based test plan—core eligibility paths full coverage, edge cases documented for fast follow-up. I get written agreement on residual risk, never a silent skip.',
    'I triage with eng lead and PM using impact × severity: wrong eligibility for a plan type is P1; cosmetic UI is P4. I provide repro steps, member persona, and logs. We slot P1/P2 into the current sprint; P3 goes to backlog with owner and target sprint.',
    'In refinement I ask "how will we know this is done?" and map ACs to test scenarios. In planning I estimate automation vs. manual effort and call out data dependencies. I update the team on coverage status in standup and block early if staging or personas are missing.',
    'Before a formulary release I showed PM a one-page summary: three plan types failing eligibility, estimated member impact, and two options—delay 48 hours or ship with monitored rollback. They chose delay; I framed it as protecting members, not blocking the sprint.',
  ],
  sampleAnswerBullets: [
    [
      'I meet PM in refinement to clarify acceptance criteria and flag testability gaps early.',
      'When scope is tight, I propose a risk-based test plan—core eligibility paths full coverage, edge cases documented for fast follow-up.',
      'I get written agreement on residual risk, never a silent skip.',
    ],
    [
      'I triage with eng lead and PM using impact times severity—wrong eligibility for a plan type is P1; cosmetic UI is P4.',
      'I provide repro steps, member persona, and logs.',
      'We slot P1 and P2 into the current sprint; P3 goes to backlog with owner and target sprint.',
    ],
    [
      'In refinement I ask how will we know this is done and map acceptance criteria to test scenarios.',
      'In planning I estimate automation vs. manual effort and call out data dependencies.',
      'I update the team on coverage status in standup and block early if staging or personas are missing.',
    ],
    [
      'Before a formulary release I showed PM a one-page summary: three plan types failing eligibility and estimated member impact.',
      'I presented two options—delay 48 hours or ship with monitored rollback.',
      'They chose delay; I framed it as protecting members, not blocking the sprint.',
    ],
  ],
  followUpSampleAnswers: [
    'I document what regression was skipped and the scenarios at risk, then propose smoke plus production monitoring. If they ship anyway, I execute the agreed plan and watch dashboards closely—no "I told you so," just fast escalation if issues appear.',
    'I clarify with the Scrum Master whether it is a one-off or recurring ask. If it helps the sprint goal and I have capacity, I may help briefly—but I redirect sustained non-QA work back to the backlog with proper sizing so QA capacity is visible.',
    'I tag reopening defects with root-cause category, require a regression test before close, and review trends in retro. Chronic areas get a tech-debt story for fixture or architecture fixes instead of repeated firefighting.',
  ],
};
