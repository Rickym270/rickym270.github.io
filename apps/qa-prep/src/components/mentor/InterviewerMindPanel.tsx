import type { InterviewerMind } from '../../types/mentorContent';
import { ExplainedBlock } from './ExplainedBlock';

type InterviewerMindPanelProps = {
  content: InterviewerMind;
  defaultOpen?: boolean;
};

export function InterviewerMindPanel({
  content,
  defaultOpen = false,
}: InterviewerMindPanelProps) {
  const text = Object.values(content).join(' ');

  return (
    <details className="interviewer-mind" open={defaultOpen}>
      <summary className="interviewer-mind__toggle">
        Interviewer's Mind
      </summary>
      <ExplainedBlock text={text} label="interviewer mind">
        <ul className="topic-list-styled">
          <li><strong>Why they're asking:</strong> {content.whyAsking}</li>
          <li><strong>What they learn about you:</strong> {content.whatTheyLearn}</li>
          <li><strong>Sounds too junior:</strong> {content.tooJunior}</li>
          <li><strong>Sounds overqualified:</strong> {content.overqualified}</li>
          <li><strong>Strong Analyst II answer:</strong> {content.strongAnalystII}</li>
        </ul>
      </ExplainedBlock>
    </details>
  );
}
