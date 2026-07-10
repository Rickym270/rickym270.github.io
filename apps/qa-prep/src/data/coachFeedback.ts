import type { ConfidenceLevel } from '../types/trainingProgress';
import type { CoachDimensionScores } from '../types/trainingProgress';
import type { StoryRecommendation } from './storyRecommendations';

export type CoachFeedbackInput = {
  topicId: string;
  confidence: ConfidenceLevel | null;
  coachDimensions: Partial<CoachDimensionScores>;
  rubricAvg?: number;
  storyRecommendation: StoryRecommendation | null;
  usedRealExample: boolean;
};

const DIMENSION_LABELS: Record<keyof CoachDimensionScores, string> = {
  technicalAccuracy: 'Technical accuracy',
  communication: 'Communication',
  specificity: 'Specificity',
  businessThinking: 'Business thinking',
  confidence: 'Confidence',
  realExample: 'Use of real example',
};

function lowestDimension(
  scores: Partial<CoachDimensionScores>
): keyof CoachDimensionScores | null {
  const entries = Object.entries(scores).filter(
    ([, v]) => v !== null && v !== undefined
  ) as [keyof CoachDimensionScores, number][];
  if (entries.length === 0) return null;
  entries.sort((a, b) => a[1] - b[1]);
  return entries[0]![0];
}

export function buildCoachFeedback(input: CoachFeedbackInput): string {
  const parts: string[] = [];
  const weak = lowestDimension(input.coachDimensions);

  if (!input.usedRealExample && input.storyRecommendation) {
    parts.push(
      `Lead with "${input.storyRecommendation.title}" before explaining concepts. Interviewers at Judi Health weight real projects over definitions.`
    );
  }

  if (input.confidence === 'cold' || input.confidence === 'needs-review') {
    parts.push(
      'Schedule a quick retell of this topic tomorrow—active recall works best within 24 hours of a cold answer.'
    );
  }

  if (weak === 'specificity') {
    parts.push(
      'Add one named project, one metric, and one constraint. "We improved CI" is weak; "Playwright shard cut PR feedback from 20 to 2 minutes" scores.'
    );
  } else if (weak === 'communication') {
    parts.push(
      'Try situation → your action → result in under 90 seconds. Cut tool lists; keep one thread.'
    );
  } else if (weak === 'businessThinking') {
    parts.push(
      'Tie the answer to member impact or release risk—why this mattered for the team shipping safely.'
    );
  } else if (weak === 'technicalAccuracy') {
    parts.push(
      'Name the failure mode you guard against (PHI leak, flake, wrong eligibility) before describing the tool.'
    );
  } else if (weak === 'realExample') {
    parts.push(
      'Pick Medidata, Tradeweb, or your portfolio site—interviewers repeatedly ask "what did YOU build?"'
    );
  } else if (input.rubricAvg !== undefined && input.rubricAvg >= 4) {
    parts.push(
      'Strong self-score. Practice saying this answer in one minute without reading bullets.'
    );
  } else {
    parts.push(
      'Good technical foundation. Tighten the opening: first sentence should be your direct answer, second should be your project.'
    );
  }

  return parts.join(' ');
}

export { DIMENSION_LABELS };
