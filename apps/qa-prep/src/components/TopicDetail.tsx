import { useState } from 'react';
import type { Topic } from '../types/topic';
import type { ScoringRubric as RubricData } from '../types/scoringRubric';
import { getMentorProfile } from '../data/mentor/topicMentorProfiles';
import { ContentSection } from './ContentSection';
import { Flashcard } from './Flashcard';
import { ScoringRubric } from './ScoringRubric';
import { TopicPracticeDrill } from './TopicPracticeDrill';
import { RevealSampleAnswer } from './RevealSampleAnswer';
import { TopicMentorStudy } from './mentor/TopicMentorStudy';
import { InterviewerMindPanel } from './mentor/InterviewerMindPanel';

type TopicDetailProps = {
  topic: Topic;
  rubric?: RubricData;
  onSelectTopic?: (topicId: string) => void;
};

type ViewMode = 'practice' | 'study';

export function TopicDetail({ topic, rubric, onSelectTopic }: TopicDetailProps) {
  const [mode, setMode] = useState<ViewMode>('practice');
  const profile = getMentorProfile(topic.id);

  return (
    <article className="topic-detail">
      <div className="topic-detail__header">
        <h2 className="topic-detail__title">{topic.title}</h2>
        <div className="topic-mode-toggle">
          <button
            type="button"
            className={`topic-mode-toggle__btn ${mode === 'practice' ? 'topic-mode-toggle__btn--active' : ''}`}
            onClick={() => setMode('practice')}
          >
            Train
          </button>
          <button
            type="button"
            className={`topic-mode-toggle__btn ${mode === 'study' ? 'topic-mode-toggle__btn--active' : ''}`}
            onClick={() => setMode('study')}
          >
            Study
          </button>
        </div>
      </div>

      {profile && mode === 'study' && (
        <div className="topic-detail__interviewer-mind">
          <InterviewerMindPanel content={profile.interviewerMind} />
        </div>
      )}

      {mode === 'practice' && (
        <TopicPracticeDrill topic={topic} rubric={rubric} />
      )}

      {mode === 'study' && (
        <>
          {profile && (
            <TopicMentorStudy profile={profile} onSelectTopic={onSelectTopic} />
          )}

          <ContentSection title={`Flashcards (${topic.flashcards.length})`}>
            <div className="flashcard-stack">
              {topic.flashcards.map((card, i) => (
                <Flashcard key={i} front={card.front} back={card.back} />
              ))}
            </div>
          </ContentSection>

          <ContentSection
            title={`Mock Interview Questions (${topic.mockQuestions.length})`}
          >
            <ol className="topic-list-styled topic-list-styled--with-reveal">
              {topic.mockQuestions.map((q, i) => (
                <li key={q}>
                  {q}
                  <RevealSampleAnswer
                    key={`study-mock-${i}`}
                    answer={topic.sampleAnswers[i] ?? ''}
                  />
                </li>
              ))}
            </ol>
          </ContentSection>

          {rubric && <ScoringRubric rubric={rubric} />}

          <ContentSection title="Strong Answer Bullets">
            <ul className="topic-list-styled">
              {topic.strongAnswerBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </ContentSection>

          <ContentSection title="Common Pitfalls" variant="mistake">
            <ul className="topic-list-styled">
              {topic.commonPitfalls.map((pitfall) => (
                <li key={pitfall}>{pitfall}</li>
              ))}
            </ul>
          </ContentSection>

          <ContentSection
            title={`Follow-up Questions (${topic.followUpQuestions.length})`}
          >
            <ol className="topic-list-styled topic-list-styled--with-reveal">
              {topic.followUpQuestions.map((q, i) => (
                <li key={q}>
                  {q}
                  <RevealSampleAnswer
                    key={`study-followup-${i}`}
                    answer={topic.followUpSampleAnswers[i] ?? ''}
                  />
                </li>
              ))}
            </ol>
          </ContentSection>
        </>
      )}
    </article>
  );
}
