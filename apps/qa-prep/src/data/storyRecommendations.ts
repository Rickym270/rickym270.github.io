import { getStoriesForTopic } from './contentGraph';
import { personalStories } from './personalStories';

export type StoryRecommendation = {
  storyId: string;
  title: string;
  reason: string;
  leadWith: string;
};

/** Topic-level primary story + reason for interview answers. */
const TOPIC_PRIMARY: Record<string, { storyId: string; reason: string; leadWith: string }> = {
  'backend-api-testing': {
    storyId: 'hipaa-api-validation',
    reason: 'Shows API validation with healthcare constraints (PHI, auth boundaries).',
    leadWith: 'Open with your Medidata HIPAA API validation work before explaining test layers.',
  },
  'test-data-strategy': {
    storyId: 'test-data-management',
    reason: 'Demonstrates synthetic personas and fixture ownership in regulated data.',
    leadWith: 'Lead with how you built reusable Medidata personas, not abstract definitions.',
  },
  'eligibility-rules-engine': {
    storyId: 'test-data-management',
    reason: 'Covers decision-table scenarios and plan-type edge cases with real fixtures.',
    leadWith: 'Start with a specific eligibility persona and what cases it unlocked.',
  },
  'pytest-prep': {
    storyId: 'lambda-cold-start',
    reason: 'Connects fixtures and readiness checks to a real Lambda debugging win.',
    leadWith: 'Lead with the CloudWatch 400/500 cold-start story, then explain fixture strategy.',
  },
  'flaky-test-debugging': {
    storyId: 'lambda-cold-start',
    reason: 'Root-cause debugging with logs—not retries or sleeps.',
    leadWith: 'Open with what the timestamps showed before naming your fix.',
  },
  'sql-data-triage': {
    storyId: 'sql-claims-reconciliation',
    reason: 'Ground-truth SQL validation tied to claims and effective dates.',
    leadWith: 'Start with the discrepancy you found and how you proved it in the database.',
  },
  'logging-monitoring': {
    storyId: 'splunk-dashboard',
    reason: 'Monitoring and triage with dashboards interviewers can picture.',
    leadWith: 'Lead with the Splunk dashboard you built at Tradeweb, then tie to CloudWatch.',
  },
  'behavioral-leadership': {
    storyId: 'mentoring-developers',
    reason: 'Collaborative ownership—pairing, not gatekeeping.',
    leadWith: 'Open with the specific developer and module before the process lecture.',
  },
  'scrum-product-collaboration': {
    storyId: 'xpress-transit-requirements',
    reason: 'PM partnership and testable requirements under ambiguity.',
    leadWith: 'Start with the stakeholder conflict and what you documented.',
  },
  'cicd-automation-architecture': {
    storyId: 'playwright-ci-optimization',
    reason: '~190 Playwright tests, sharding, GitHub Actions—concrete metrics.',
    leadWith: 'Lead with PR duration before/after (20 min → 2 min), then explain tiers.',
  },
};

/** Question-id overrides for panel and pool items. */
const QUESTION_OVERRIDES: Record<string, string> = {
  'r1-pytest': 'lambda-cold-start',
  'r1-cicd': 'playwright-ci-optimization',
  'r1-flaky': 'lambda-cold-start',
  'r1-test-data': 'test-data-management',
  'r2-sql-triage': 'sql-claims-reconciliation',
  'r2-sql-claims': 'sql-claims-reconciliation',
  'r2-logs': 'production-api-investigation',
  'r2-observability': 'splunk-dashboard',
  'r3-release-pushback': 'formulary-sprint-coordination',
  'r3-pm-scope': 'xpress-transit-requirements',
  'r3-sprint-priority': 'formulary-sprint-coordination',
  'r3-mentoring': 'mentoring-developers',
};

function buildRecommendation(
  storyId: string,
  reason: string,
  leadWith: string
): StoryRecommendation | null {
  const story = personalStories.find((s) => s.id === storyId);
  if (!story) return null;
  return { storyId, title: story.title, reason, leadWith };
}

export function getRecommendedStory(
  questionKey: string,
  topicId: string
): StoryRecommendation | null {
  const panelId = questionKey.startsWith('panel:')
    ? questionKey.replace('panel:', '')
    : null;
  if (panelId && QUESTION_OVERRIDES[panelId]) {
    const storyId = QUESTION_OVERRIDES[panelId]!;
    const primary = Object.values(TOPIC_PRIMARY).find((p) => p.storyId === storyId);
    const topicPrimary = TOPIC_PRIMARY[topicId];
    const meta = topicPrimary?.storyId === storyId ? topicPrimary : primary;
    return buildRecommendation(
      storyId,
      meta?.reason ?? 'Best real project for this question type.',
      meta?.leadWith ?? 'Lead with your specific project before definitions.'
    );
  }

  const primary = TOPIC_PRIMARY[topicId];
  if (primary) {
    return buildRecommendation(primary.storyId, primary.reason, primary.leadWith);
  }

  const linked = getStoriesForTopic(topicId)[0];
  if (linked) {
    const story = personalStories.find((s) => s.id === linked);
    if (story) {
      return buildRecommendation(
        linked,
        `Linked to ${topicId.replace(/-/g, ' ')} practice.`,
        `Lead with "${story.title}" from your experience.`
      );
    }
  }

  return null;
}
