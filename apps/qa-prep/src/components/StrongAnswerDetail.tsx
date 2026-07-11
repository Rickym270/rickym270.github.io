import type { StrongAnswer } from '../types/strongAnswer';
import { AttemptFirstDrill } from './attempt-first/AttemptFirstDrill';

type StrongAnswerDetailProps = {
  answer: StrongAnswer;
};

export function StrongAnswerDetail({ answer }: StrongAnswerDetailProps) {
  return (
    <article className="topic-detail">
      <AttemptFirstDrill
        questionKey={`strong:${answer.id}`}
        topicId="strong-answers"
        topicTitle="Interview question"
        question={answer.question}
        referenceAnswer={answer.answer}
        compareBullets={answer.answerBullets}
        isLast
        completeMessage="Question complete."
      />
    </article>
  );
}
