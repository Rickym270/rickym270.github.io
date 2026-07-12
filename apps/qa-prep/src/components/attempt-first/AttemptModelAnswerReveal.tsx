import type { AttemptModelAnswerPackage } from '../../types/attemptCoach';

type AttemptModelAnswerRevealProps = {
  modelAnswer: AttemptModelAnswerPackage | null;
  defaultOpen?: boolean;
  badge?: string;
};

function ModelAnswerBody({
  modelAnswer,
  badge,
}: {
  modelAnswer: AttemptModelAnswerPackage;
  badge?: string;
}) {
  return (
    <>
      {badge && <p className="attempt-first__badge">{badge}</p>}
      <div className="attempt-first__model-answer">
        <section>
          <h4>60–90 second spoken answer</h4>
          <p>{modelAnswer.concise60to90}</p>
        </section>
        <section>
          <h4>Detailed QA strategy</h4>
          <p>{modelAnswer.detailedStrategy}</p>
        </section>
        {modelAnswer.conceptChecklist.length > 0 && (
          <section>
            <h4>Major concepts checklist</h4>
            <ul className="topic-list-styled">
              {modelAnswer.conceptChecklist.map((item) => (
                <li key={item.concept}>
                  <strong>{item.concept}</strong> — {item.whyItMatters}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}

export function AttemptModelAnswerReveal({
  modelAnswer,
  defaultOpen = false,
  badge,
}: AttemptModelAnswerRevealProps) {
  if (!modelAnswer) {
    return (
      <p className="attempt-first__muted">
        Model answer will appear here after evaluation.
      </p>
    );
  }

  if (defaultOpen) {
    return (
      <div className="attempt-first__reveal attempt-first__reveal--expanded">
        <h4 className="attempt-first__reveal-heading">Model answer</h4>
        <ModelAnswerBody modelAnswer={modelAnswer} badge={badge} />
      </div>
    );
  }

  return (
    <details className="attempt-first__reveal">
      <summary>Reveal Model Answer</summary>
      <ModelAnswerBody modelAnswer={modelAnswer} badge={badge} />
    </details>
  );
}
