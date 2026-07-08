import type { StrongAnswer } from '../types/strongAnswer';
import { ContentSection } from './ContentSection';
import { RevealSampleAnswer } from './RevealSampleAnswer';

type StrongAnswerDetailProps = {
  answer: StrongAnswer;
};

export function StrongAnswerDetail({ answer }: StrongAnswerDetailProps) {
  return (
    <article className="topic-detail">
      <h2 className="topic-detail__title">{answer.question}</h2>

      <ContentSection title="Strong Answer">
        <RevealSampleAnswer answer={answer.answer} />
      </ContentSection>
    </article>
  );
}
