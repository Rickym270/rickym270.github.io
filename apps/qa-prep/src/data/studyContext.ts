import type { Topic } from '../types/topic';
import { getMentorProfile } from './mentor/topicMentorProfiles';
import { topics } from './topics';

export type StudyMode = 'study' | 'practice' | 'partner';

export type StudyContextPayload = {
  topicId: string;
  topicTitle: string;
  mode: StudyMode;
  currentQuestion?: string;
  contextSummary: string;
};

const MAX_SUMMARY_CHARS = 4000;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}...`;
}

export function buildStudyContext(
  topicId: string,
  mode: StudyMode,
  currentQuestion?: string
): StudyContextPayload | null {
  const topic = topics.find((t) => t.id === topicId);
  if (!topic) return null;

  const profile = getMentorProfile(topicId);
  const lines: string[] = [];

  lines.push(`Topic: ${topic.title} (${topic.id})`);
  lines.push(`Mode: ${mode}`);
  if (currentQuestion) {
    lines.push(`Current question: ${currentQuestion}`);
  }

  lines.push('\n## Mock questions');
  topic.mockQuestions.forEach((question, index) => {
    lines.push(`${index + 1}. ${question}`);
  });

  lines.push('\n## Strong answer bullets');
  topic.strongAnswerBullets.forEach((bullet) => {
    lines.push(`- ${bullet}`);
  });

  lines.push('\n## Common pitfalls');
  topic.commonPitfalls.forEach((pitfall) => {
    lines.push(`- ${pitfall}`);
  });

  if (topic.sampleAnswers[0]) {
    lines.push('\n## Sample answer (first question)');
    lines.push(truncate(topic.sampleAnswers[0], 600));
  }

  if (profile && !profile.isStub) {
    lines.push('\n## Plain English');
    lines.push(truncate(profile.learnTheWhy.plainEnglish, 800));

    lines.push('\n## 60-second interview script');
    lines.push(truncate(profile.learnTheWhy.interviewAnswer.script60s, 800));

    lines.push('\n## Strong Analyst II answer');
    lines.push(truncate(profile.interviewerMind.strongAnalystII, 800));

    lines.push('\n## Healthcare context');
    profile.healthcareContext.slice(0, 3).forEach((item) => {
      lines.push(`- ${item}`);
    });
  }

  let contextSummary = lines.join('\n');
  if (contextSummary.length > MAX_SUMMARY_CHARS) {
    contextSummary = truncate(contextSummary, MAX_SUMMARY_CHARS);
  }

  return {
    topicId: topic.id,
    topicTitle: topic.title,
    mode,
    currentQuestion,
    contextSummary,
  };
}

export function getTopicById(topicId: string): Topic | undefined {
  return topics.find((topic) => topic.id === topicId);
}
