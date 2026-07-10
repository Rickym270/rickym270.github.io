import type { PoolQuestion } from '../data/questionPool';

const PREVIEW_LEN = 60;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

type PartnerSessionNavProps = {
  sessionPool: PoolQuestion[];
  currentIndex: number;
  onSelect: (index: number) => void;
  variant: 'rail' | 'collapsible';
};

function SessionQuestionList({
  sessionPool,
  currentIndex,
  onSelect,
}: Omit<PartnerSessionNavProps, 'variant'>) {
  return (
    <ol className="partner-session-nav__list">
      {sessionPool.map((q, i) => (
        <li key={q.id}>
          <button
            type="button"
            className={`partner-session-nav__item ${i === currentIndex ? 'partner-session-nav__item--active' : ''}`}
            onClick={() => onSelect(i)}
            aria-current={i === currentIndex ? 'true' : undefined}
          >
            <span className="partner-session-nav__num">{i + 1}</span>
            <span className="partner-session-nav__preview">
              {truncate(q.question, PREVIEW_LEN)}
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

export function PartnerSessionNav({
  sessionPool,
  currentIndex,
  onSelect,
  variant,
}: PartnerSessionNavProps) {
  if (variant === 'rail') {
    return (
      <nav
        className="partner-session-nav partner-session-nav--rail"
        aria-label="Session questions"
      >
        <h3 className="partner-session-nav__heading">
          Session ({sessionPool.length})
        </h3>
        <SessionQuestionList
          sessionPool={sessionPool}
          currentIndex={currentIndex}
          onSelect={onSelect}
        />
      </nav>
    );
  }

  return (
    <details className="partner-session-nav partner-session-nav--collapsible">
      <summary className="partner-session-nav__summary">
        Session questions ({sessionPool.length})
      </summary>
      <nav aria-label="Session questions">
        <SessionQuestionList
          sessionPool={sessionPool}
          currentIndex={currentIndex}
          onSelect={onSelect}
        />
      </nav>
    </details>
  );
}

export function truncateQuestionPreview(text: string, max = 80): string {
  return truncate(text, max);
}
