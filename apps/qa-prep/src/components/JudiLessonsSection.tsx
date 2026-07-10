import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { judiInterviewLessons } from '../data/judiInterviewLessons';

export function JudiLessonsSection() {
  const { progress } = useTrainingProgress();
  const hasAttempts = progress.attempts.length > 0;

  return (
    <details className="sidebar-section sidebar-section--lessons">
      <summary className="sidebar-section__summary">
        Judi interview lessons
        <span className="sidebar-section__count" aria-hidden="true">
          {judiInterviewLessons.length}
        </span>
      </summary>
      <nav aria-label="Judi Health interview lessons">
        <ul className="judi-lessons-list">
          {judiInterviewLessons.map((lesson) => (
            <li key={lesson.id}>{lesson.text}</li>
          ))}
        </ul>
        {hasAttempts && (
          <p className="judi-lessons__hint">
            Practice data is saved locally — use Weak Spots for targeted review.
          </p>
        )}
      </nav>
    </details>
  );
}
