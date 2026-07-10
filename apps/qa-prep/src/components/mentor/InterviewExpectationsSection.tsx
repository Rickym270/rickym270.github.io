import type { InterviewExpectations } from '../../types/mentorContent';
import { ContentSection } from '../ContentSection';
import { ExplainedBlock } from './ExplainedBlock';

type InterviewExpectationsSectionProps = {
  content: InterviewExpectations;
  embedded?: boolean;
};

export function InterviewExpectationsSection({
  content,
  embedded = false,
}: InterviewExpectationsSectionProps) {
  const text = Object.values(content).join(' ');
  const body = (
    <>
      <p className="mentor-section-intro">
        Calibrate depth for Technical QA Analyst II — not Principal-level.
      </p>
      <ExplainedBlock text={text} label="interview expectations">
        <ul className="topic-list-styled interview-expectations">
          <li><strong>Junior:</strong> {content.junior}</li>
          <li><strong>Mid-level:</strong> {content.mid}</li>
          <li><strong>Strong Analyst II:</strong> {content.analystII}</li>
          <li><strong>Senior (do not over-answer):</strong> {content.senior}</li>
        </ul>
      </ExplainedBlock>
    </>
  );

  if (embedded) {
    return body;
  }

  return (
    <ContentSection title="Real Interview Expectations (Judi Health / Capital Rx)">
      {body}
    </ContentSection>
  );
}
