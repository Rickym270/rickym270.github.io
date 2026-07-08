type AnswerCoachFrameworkProps = {
  modelAnswer?: string;
};

const SECTIONS = [
  { key: 'direct', label: 'Direct Answer' },
  { key: 'why', label: 'Why' },
  { key: 'example', label: 'Real Example' },
  { key: 'result', label: 'Result' },
  { key: 'lessons', label: 'Lessons Learned' },
] as const;

export function AnswerCoachFramework({ modelAnswer }: AnswerCoachFrameworkProps) {
  return (
    <div className="answer-coach">
      <p className="answer-coach__intro">
        Mentally map your answer to this framework. Fill each section from memory
        before peeking at the model answer.
      </p>
      <ol className="answer-coach__list">
        {SECTIONS.map(({ key, label }) => (
          <li key={key} className="answer-coach__item">
            <strong>{label}</strong>
            <span className="answer-coach__blank">— recall together</span>
          </li>
        ))}
      </ol>
      {modelAnswer && (
        <details className="answer-coach__reveal">
          <summary>Map model answer to framework</summary>
          <p>{modelAnswer}</p>
        </details>
      )}
    </div>
  );
}
