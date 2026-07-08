import type { TopicMentorProfile, InterviewerMind, MemoryAnchor } from '../../types/mentorContent';

export function stubMentorProfile(
  topicId: string,
  title: string,
  anchor: MemoryAnchor,
  mind: InterviewerMind,
  relatedConceptIds: string[]
): TopicMentorProfile {
  return {
    topicId,
    isStub: true,
    memoryAnchor: anchor,
    interviewerMind: mind,
    relatedConceptIds,
    learnTheWhy: {
      plainEnglish: `${title} — full Learn the Why content coming soon.`,
      technical: {
        what: 'Coming soon',
        why: 'Coming soon',
        how: 'Coming soon',
        whenUse: 'Coming soon',
        whenNot: 'Coming soon',
      },
      interviewAnswer: {
        script60s: 'Coming soon',
        whatTheyEvaluate: 'Coming soon',
        whyItScores: 'Coming soon',
      },
      myExperience: { connections: [] },
    },
    costBenefit: {
      benefits: [],
      costs: [],
      tradeoffs: [],
      commonMistakes: [],
      performance: [],
      maintainability: [],
    },
    decisionTrees: [],
    healthcareContext: [],
    interviewExpectations: {
      junior: 'Coming soon',
      mid: 'Coming soon',
      analystII: 'Coming soon',
      senior: 'Coming soon',
    },
  };
}
