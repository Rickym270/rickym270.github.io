import {
  ATTEMPT_SCORE_LABELS,
  averageAttemptScore,
  type AttemptCoachResponse,
} from '../../types/attemptCoach';
import { AttemptComparisonTable } from './AttemptComparisonTable';

type AttemptFeedbackPanelProps = {
  evaluation: AttemptCoachResponse;
  solutionViewedBeforeAttempt: boolean;
  modelAnswerOpen: boolean;
};

export function AttemptFeedbackPanel({
  evaluation,
  solutionViewedBeforeAttempt,
  modelAnswerOpen,
}: AttemptFeedbackPanelProps) {
  const scores = evaluation.scores;
  if (!scores) return null;

  const avg = averageAttemptScore(scores);

  return (
    <div className="attempt-first__feedback">
      <h3 className="attempt-first__feedback-title">Your evaluation</h3>
      {solutionViewedBeforeAttempt && (
        <p className="attempt-first__badge attempt-first__badge--warning">
          Solution viewed before attempt — mastery not counted until you pass a
          similar question without revealing first.
        </p>
      )}

      <div className="attempt-first__score-grid">
        {ATTEMPT_SCORE_LABELS.map(({ key, label }) => (
          <div key={key} className="attempt-first__score-item">
            <span className="attempt-first__score-label">{label}</span>
            <span className="attempt-first__score-value">{scores[key]}/10</span>
          </div>
        ))}
        <div className="attempt-first__score-item attempt-first__score-item--avg">
          <span className="attempt-first__score-label">Average</span>
          <span className="attempt-first__score-value">{avg.toFixed(1)}/10</span>
        </div>
      </div>

      {evaluation.strengths && evaluation.strengths.length > 0 && (
        <section>
          <h4>What you did well</h4>
          <ul className="topic-list-styled">
            {evaluation.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {evaluation.missed && evaluation.missed.length > 0 && (
        <section>
          <h4>What you missed</h4>
          <ul className="topic-list-styled">
            {evaluation.missed.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {evaluation.inaccuracies && evaluation.inaccuracies.length > 0 && (
        <section>
          <h4>Technically inaccurate</h4>
          <ul className="topic-list-styled">
            {evaluation.inaccuracies.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {evaluation.structureTips && (
        <section>
          <h4>Structure &amp; delivery</h4>
          <p>{evaluation.structureTips}</p>
        </section>
      )}

      {evaluation.lengthFeedback && (
        <section>
          <h4>Answer length</h4>
          <p>{evaluation.lengthFeedback}</p>
        </section>
      )}

      <AttemptComparisonTable rows={evaluation.comparison ?? []} />

      <details
        className="attempt-first__reveal"
        open={modelAnswerOpen}
      >
        <summary>Reveal Model Answer</summary>
        {evaluation.modelAnswer && (
          <div className="attempt-first__model-answer">
            <section>
              <h4>60–90 second spoken answer</h4>
              <p>{evaluation.modelAnswer.concise60to90}</p>
            </section>
            <section>
              <h4>Detailed QA strategy</h4>
              <p>{evaluation.modelAnswer.detailedStrategy}</p>
            </section>
            {evaluation.modelAnswer.conceptChecklist.length > 0 && (
              <section>
                <h4>Major concepts checklist</h4>
                <ul className="topic-list-styled">
                  {evaluation.modelAnswer.conceptChecklist.map((item) => (
                    <li key={item.concept}>
                      <strong>{item.concept}</strong> — {item.whyItMatters}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </details>

      {evaluation.masteryEligible && (
        <p className="attempt-first__mastery-note">
          Strong attempt — pass the reinforcement question without revealing the
          solution to mark this question mastered.
        </p>
      )}
    </div>
  );
}
