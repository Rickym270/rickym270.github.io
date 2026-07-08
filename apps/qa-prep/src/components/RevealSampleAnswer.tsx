import { useState } from 'react';

type RevealSampleAnswerProps = {
  answer: string | string[];
  defaultRevealed?: boolean;
};

export function RevealSampleAnswer({
  answer,
  defaultRevealed = false,
}: RevealSampleAnswerProps) {
  const [revealed, setRevealed] = useState(defaultRevealed);

  if (!answer || (Array.isArray(answer) && answer.length === 0)) {
    return null;
  }

  return (
    <div className="reveal-sample-answer">
      <button
        type="button"
        className="reveal-sample-answer__btn"
        onClick={() => setRevealed((prev) => !prev)}
        aria-expanded={revealed}
      >
        {revealed ? 'Hide Sample Answer' : 'Reveal Sample Answer'}
      </button>
      {revealed && (
        <div className="reveal-sample-answer__content">
          {typeof answer === 'string' ? (
            <p>{answer}</p>
          ) : (
            <ul className="topic-list-styled">
              {answer.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
