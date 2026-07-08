import type { StrongAnswer } from '../types/strongAnswer';
import { TopicCard } from './TopicCard';

type StrongAnswerListProps = {
  answers: StrongAnswer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  heading?: string;
};

export function StrongAnswerList({
  answers,
  selectedId,
  onSelect,
  heading = 'Strong Answer Library',
}: StrongAnswerListProps) {
  return (
    <nav className="sidebar-section" aria-label={heading}>
      <h3 className="sidebar-section__subheading">{heading}</h3>
      <div className="topic-list">
        {answers.map((answer) => (
          <TopicCard
            key={answer.id}
            id={answer.id}
            label={answer.question}
            selected={answer.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </nav>
  );
}
