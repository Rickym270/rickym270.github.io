import { useEffect, useMemo, useState } from 'react';
import type { Topic } from '../types/topic';
import type { ScoringRubric as RubricData } from '../types/scoringRubric';
import { getMentorProfile } from '../data/mentor/topicMentorProfiles';
import { useStudyHelper } from '../context/StudyHelperContext';
import { Flashcard } from './Flashcard';
import { ScoringRubric } from './ScoringRubric';
import { TopicPracticeDrill } from './TopicPracticeDrill';
import { TopicMentorStudy } from './mentor/TopicMentorStudy';
import { InterviewerMindPanel } from './mentor/InterviewerMindPanel';
import { WhyButton } from './mentor/WhyButton';
import { MemoryAnchorCard } from './mentor/MemoryAnchorCard';
import { StudyCollapsibleSection } from './study/StudyCollapsibleSection';
import { StudySectionNav } from './study/StudySectionNav';
import { AttemptFirstQuestionCard } from './attempt-first/AttemptFirstQuestionCard';

type TopicDetailProps = {
  topic: Topic;
  rubric?: RubricData;
  onSelectTopic?: (topicId: string) => void;
};

type ViewMode = 'practice' | 'study';

export function TopicDetail({ topic, rubric, onSelectTopic }: TopicDetailProps) {
  const [mode, setMode] = useState<ViewMode>('practice');
  const profile = getMentorProfile(topic.id);
  const { setStudyFocus } = useStudyHelper();

  useEffect(() => {
    setStudyFocus({
      topicId: topic.id,
      topicTitle: topic.title,
      mode: mode === 'study' ? 'study' : 'practice',
    });
  }, [topic.id, topic.title, mode, setStudyFocus]);

  const studySections = useMemo(() => {
    const sections = [
      { id: 'study-questions', label: 'Questions' },
      { id: 'study-cheatsheet', label: 'Cheat sheet' },
    ];
    if (profile && !profile.isStub) {
      sections.push({ id: 'study-mentor', label: 'Mentor guide' });
    }
    sections.push({ id: 'study-flashcards', label: 'Flashcards' });
    if (rubric) {
      sections.push({ id: 'study-rubric', label: 'Rubric' });
    }
    sections.push({ id: 'study-followups', label: 'Follow-ups' });
    return sections;
  }, [profile, rubric]);

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


      {mode === 'practice' && (
        <TopicPracticeDrill topic={topic} rubric={rubric} />
      )}

      {mode === 'study' && (
        <div className="topic-detail__study">
          <StudySectionNav sections={studySections} />

          {profile && !profile.isStub && (
            <MemoryAnchorCard anchor={profile.memoryAnchor} />
          )}

          <StudyCollapsibleSection
            id="study-questions"
            title={`Mock interview questions (${topic.mockQuestions.length})`}
            defaultOpen
          >
            <ol className="topic-list-styled attempt-first-card-list">
              {topic.mockQuestions.map((q, i) => (
                <li key={q}>
                  <AttemptFirstQuestionCard
                    questionKey={`topic:${topic.id}:q${i}`}
                    topicId={topic.id}
                    topicTitle={topic.title}
                    question={q}
                    referenceAnswer={topic.sampleAnswers[i] ?? ''}
                    compareBullets={
                      topic.sampleAnswerBullets[i] ?? topic.strongAnswerBullets
                    }
                    pitfalls={topic.commonPitfalls}
                    label={`Question ${i + 1}`}
                  />
                </li>
              ))}
            </ol>
          </StudyCollapsibleSection>

          <StudyCollapsibleSection
            id="study-cheatsheet"
            title="Answer cheat sheet"
            defaultOpen
          >
            <div className="study-cheatsheet">
              <div className="study-cheatsheet__col">
                <h4 className="study-cheatsheet__heading">Strong answer bullets</h4>
                <ul className="topic-list-styled">
                  {topic.strongAnswerBullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
              <div className="study-cheatsheet__col study-cheatsheet__col--pitfalls">
                <h4 className="study-cheatsheet__heading">Common pitfalls</h4>
                <ul className="topic-list-styled">
                  {topic.commonPitfalls.map((pitfall) => (
                    <li key={pitfall}>{pitfall}</li>
                  ))}
                </ul>
              </div>
            </div>
          </StudyCollapsibleSection>

          {profile && !profile.isStub && (
            <StudyCollapsibleSection id="study-mentor" title="Mentor deep dive">
              <div className="topic-detail__interviewer-mind">
                <InterviewerMindPanel content={profile.interviewerMind} />
                <WhyButton topicId={topic.id} />
              </div>
              <TopicMentorStudy
                profile={profile}
                onSelectTopic={onSelectTopic}
                compact
                showMemoryAnchor={false}
              />
            </StudyCollapsibleSection>
          )}

          <StudyCollapsibleSection
            id="study-flashcards"
            title={`Flashcards (${topic.flashcards.length})`}
          >
            <div className="flashcard-stack">
              {topic.flashcards.map((card, i) => (
                <Flashcard key={i} front={card.front} back={card.back} />
              ))}
            </div>
          </StudyCollapsibleSection>

          {rubric && (
            <StudyCollapsibleSection id="study-rubric" title="Scoring rubric">
              <ScoringRubric rubric={rubric} />
            </StudyCollapsibleSection>
          )}

          <StudyCollapsibleSection
            id="study-followups"
            title={`Follow-up questions (${topic.followUpQuestions.length})`}
          >
            <ol className="topic-list-styled attempt-first-card-list">
              {topic.followUpQuestions.map((q, i) => (
                <li key={q}>
                  <AttemptFirstQuestionCard
                    questionKey={`topic:${topic.id}:followup${i}`}
                    topicId={topic.id}
                    topicTitle={topic.title}
                    question={q}
                    referenceAnswer={topic.followUpSampleAnswers[i] ?? ''}
                    compareBullets={topic.strongAnswerBullets}
                    pitfalls={topic.commonPitfalls}
                    label={`Follow-up ${i + 1}`}
                  />
                </li>
              ))}
            </ol>
          </StudyCollapsibleSection>
        </div>
      )}
    </article>
  );
}
