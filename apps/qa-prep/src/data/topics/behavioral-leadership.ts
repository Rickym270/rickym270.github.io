import type { Topic } from '../../types/topic';

export const behavioralLeadership: Topic = {
  id: 'behavioral-leadership',
  title: 'Behavioral / Leadership',
  flashcards: [
    {
      front: 'What framework helps structure a strong behavioral interview answer?',
      back: 'STAR: Situation, Task, Action, Result—specific, quantified, tied to quality or team outcomes.',
    },
    {
      front: 'What makes a behavioral answer weak?',
      back: 'Vague claims ("I care about quality"), no story, no numbers, unclear personal role.',
    },
    {
      front: 'How do you advocate for quality without being adversarial?',
      back: 'Present data-driven risk, collaborate on trade-offs, focus on user impact—not blame.',
    },
    {
      front: 'What is a good way to build trust with developers as QA?',
      back: 'Pair early, give constructive feedback via questions, celebrate catches before production, share ownership of quality.',
    },
  ],
  mockQuestions: [
    'Tell me about a time you pushed back on a release because of quality concerns.',
    'Describe a situation where you had to influence a team without direct authority.',
    'Tell me about a time you mentored a developer to improve their testing practices.',
    'How do you handle disagreement with an engineer who wants to skip testing to meet a deadline?',
    'Tell me about a mistake you made in testing and what you learned from it.',
  ],
  strongAnswerBullets: [
    'Use STAR: specific situation, your task, actions you personally took, measurable result',
    'Quantify impact: incidents prevented, scenarios covered, time saved, defect escape rate',
    'Show collaboration: partnered with PM, eng lead, presented risk—not ultimatums',
    'Demonstrate learning: what you changed in process after a miss or near-miss',
    'Connect story to Judi Health context: PBM, eligibility, regulated healthcare when possible',
    'Keep answer under 2–3 minutes; leave room for follow-ups',
  ],
  commonPitfalls: [
    'Vague answers with no specific story or measurable outcome',
    'Taking full credit without acknowledging the team',
    'Sounding adversarial toward developers or product',
    'Rambling past 3 minutes without hitting Result',
  ],
  followUpQuestions: [
    'How do you build trust with developers when your job is to find problems in their code?',
    'What would you do if leadership overruled your recommendation to delay a release?',
    'How do you prioritize quality advocacy when the team is under heavy delivery pressure?',
  ],
  sampleAnswers: [
    'Before a formulary release, regression showed eligibility failures for three plan types. I documented affected scenarios, presented risk to the PM and eng lead, and we delayed 48 hours to fix rule config. Release went clean with zero production incidents—I framed it as protecting members, not blocking the team.',
    'When staging was down and QA could not verify, I escalated with a clear risk summary and proposed a phased rollout with extra monitoring. The eng lead backed a 24-hour delay; we shipped safely and I followed up with a retro on environment reliability.',
    'I paired with a developer on a high-risk module, shared before/after test examples, and added PR checklist items for negative paths. Within a month their test quality improved and they started asking for review before opening PRs.',
    'I acknowledge the deadline, document what testing we can skip vs. what is non-negotiable, and offer a focused smoke suite plus fast follow-up. I never say "skip all testing"—I negotiate scope and get agreement in writing on residual risk.',
    'I owned a missed edge case on COB that reached staging. I wrote the regression test, shared learnings in team retro, and updated our persona library. The fix prevented a production incident and I was transparent about my role in the miss.',
  ],
  sampleAnswerBullets: [
    [
      'Before a formulary release, regression showed eligibility failures for three plan types.',
      'I documented affected scenarios and presented risk to the PM and eng lead.',
      'We delayed 48 hours to fix rule config and the release went clean with zero production incidents.',
      'I framed it as protecting members, not blocking the team.',
    ],
    [
      'When staging was down and QA could not verify, I escalated with a clear risk summary.',
      'I proposed a phased rollout with extra monitoring.',
      'The eng lead backed a 24-hour delay; we shipped safely and I followed up with a retro on environment reliability.',
    ],
    [
      'I paired with a developer on a high-risk module and shared before/after test examples.',
      'I added PR checklist items for negative paths.',
      'Within a month their test quality improved and they started asking for review before opening PRs.',
    ],
    [
      'I acknowledge the deadline and document what testing we can skip vs. what is non-negotiable.',
      'I offer a focused smoke suite plus fast follow-up.',
      'I never say skip all testing—I negotiate scope and get agreement in writing on residual risk.',
    ],
    [
      'I owned a missed edge case on COB that reached staging.',
      'I wrote the regression test and shared learnings in team retro.',
      'I updated our persona library—the fix prevented a production incident and I was transparent about my role in the miss.',
    ],
  ],
  followUpSampleAnswers: [
    'I pair early, give feedback as questions not lectures, and celebrate catches before production. Developers see me as someone who helps ship safely, not someone who only says no.',
    'I document my recommendation and residual risk, execute the agreed test plan, and monitor closely post-release. If issues appear, I avoid "I told you so"—focus on fixing and improving the process for next time.',
    'I prioritize by patient impact and regulatory exposure. High-risk paths get full coverage; lower-risk items may defer with documented acceptance. I communicate trade-offs clearly so product can make informed decisions.',
  ],
};
