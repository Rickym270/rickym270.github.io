import type { LearnTheWhy } from '../../types/mentorContent';
import { personalStories } from '../../data/personalStories';
import { useIsMobile } from '../../hooks/useIsMobile';
import { ContentSection } from '../ContentSection';
import { ExplainedBlock } from './ExplainedBlock';

type LearnTheWhySectionProps = {
  content: LearnTheWhy;
};

function levelText(level: LearnTheWhy): Record<string, string> {
  const t = level.technical;
  return {
    '1-plain': level.plainEnglish,
    '2-technical': [t.what, t.why, t.how, t.whenUse, t.whenNot].join(' '),
    '3-interview': [
      level.interviewAnswer.script60s,
      level.interviewAnswer.whatTheyEvaluate,
      level.interviewAnswer.whyItScores,
    ].join(' '),
    '4-experience': level.myExperience.connections.join(' '),
  };
}

export function LearnTheWhySection({ content }: LearnTheWhySectionProps) {
  const isMobile = useIsMobile();
  const texts = levelText(content);
  const { technical, interviewAnswer, myExperience } = content;

  return (
    <ContentSection title="Learn the Why">
      <details className="mentor-accordion" open={!isMobile}>
        <summary>Level 1 — Plain English</summary>
        <ExplainedBlock text={texts['1-plain']!} label="plain english">
          <p>{content.plainEnglish}</p>
        </ExplainedBlock>
      </details>

      <details className="mentor-accordion">
        <summary>Level 2 — Technical Explanation</summary>
        <ExplainedBlock text={texts['2-technical']!} label="technical">
          <ul className="topic-list-styled">
            <li><strong>What:</strong> {technical.what}</li>
            <li><strong>Why:</strong> {technical.why}</li>
            <li><strong>How:</strong> {technical.how}</li>
            <li><strong>When to use:</strong> {technical.whenUse}</li>
            <li><strong>When NOT:</strong> {technical.whenNot}</li>
          </ul>
          {technical.asciiDiagram && (
            <pre className="mentor-diagram">{technical.asciiDiagram}</pre>
          )}
        </ExplainedBlock>
      </details>

      <details className="mentor-accordion">
        <summary>Level 3 — Interview Answer</summary>
        <ExplainedBlock text={texts['3-interview']!} label="interview answer">
          <p><strong>60-second answer:</strong></p>
          <p>{interviewAnswer.script60s}</p>
          <p><strong>What interviewers evaluate:</strong> {interviewAnswer.whatTheyEvaluate}</p>
          <p><strong>Why this scores well:</strong> {interviewAnswer.whyItScores}</p>
        </ExplainedBlock>
      </details>

      <details className="mentor-accordion">
        <summary>Level 4 — My Experience</summary>
        <ExplainedBlock text={texts['4-experience']!} label="my experience">
          <ul className="topic-list-styled">
            {myExperience.connections.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          {myExperience.storyIds && myExperience.storyIds.length > 0 && (
            <ul className="topic-list-styled">
              {myExperience.storyIds.map((id) => {
                const s = personalStories.find((x) => x.id === id);
                return s ? <li key={id}>{s.title}</li> : null;
              })}
            </ul>
          )}
        </ExplainedBlock>
      </details>
    </ContentSection>
  );
}
