import { useState } from 'react';

type FlashcardProps = {
  front: string;
  back: string;
};

export function Flashcard({ front, back }: FlashcardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <button
      type="button"
      className={`flashcard ${revealed ? 'flashcard--revealed' : ''}`}
      onClick={() => setRevealed((prev) => !prev)}
      aria-pressed={revealed}
    >
      <p className="flashcard__label">{revealed ? 'Answer' : 'Question'}</p>
      <p className="flashcard__text">{revealed ? back : front}</p>
      <span className="flashcard__hint">
        {revealed ? 'Click to show question' : 'Click to reveal answer'}
      </span>
    </button>
  );
}
