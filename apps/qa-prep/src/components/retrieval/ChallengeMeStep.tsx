import { useMemo } from 'react';
import { challengeProbes } from '../../data/challengeProbes';

type ChallengeMeStepProps = {
  stretchQuestion?: string;
  stretchAnswer?: string;
};

export function ChallengeMeStep({
  stretchQuestion,
  stretchAnswer,
}: ChallengeMeStepProps) {
  const probe = useMemo(
    () =>
      stretchQuestion ??
      challengeProbes[Math.floor(Math.random() * challengeProbes.length)],
    [stretchQuestion]
  );

  return (
    <div className="challenge-me">
      <p className="challenge-me__prompt">
        Senior interviewer probe — answer together:
      </p>
      <p className="practice-drill__question">{probe}</p>
      {stretchAnswer && (
        <details className="challenge-me__reveal">
          <summary>Reveal stretch answer</summary>
          <p>{stretchAnswer}</p>
        </details>
      )}
    </div>
  );
}
