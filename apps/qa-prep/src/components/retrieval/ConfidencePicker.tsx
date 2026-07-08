import type {
  ConfidenceLevel,
  CommunicationClarity,
} from '../../hooks/useTrainingProgress';

const OPTIONS: { id: ConfidenceLevel; label: string }[] = [
  { id: 'cold', label: 'I know this cold.' },
  { id: 'with-hints', label: 'I know it with hints.' },
  { id: 'reasoned-through', label: 'I could reason through it.' },
  { id: 'needs-review', label: 'I need to study this again.' },
];

type ConfidencePickerProps = {
  value: ConfidenceLevel | null;
  onChange: (level: ConfidenceLevel) => void;
};

export function ConfidencePicker({ value, onChange }: ConfidencePickerProps) {
  return (
    <div className="confidence-picker">
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`confidence-picker__btn ${value === opt.id ? 'confidence-picker__btn--active' : ''}`}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const ANSWER_OPTIONS: { id: 'yes' | 'partially' | 'no'; label: string }[] = [
  { id: 'yes', label: 'YES' },
  { id: 'partially', label: 'PARTIALLY' },
  { id: 'no', label: 'NO' },
];

const CLARITY_OPTIONS: { id: CommunicationClarity; label: string }[] = [
  { id: 'clear', label: 'Clear' },
  { id: 'too-technical', label: 'Too technical' },
  { id: 'too-vague', label: 'Too vague' },
  { id: 'too-long', label: 'Too long' },
  { id: 'too-short', label: 'Too short' },
  { id: 'rambling', label: 'Rambling' },
];

type CommunicationCoachProps = {
  answeredQuestion: 'yes' | 'partially' | 'no' | null;
  clarity: CommunicationClarity | null;
  onAnsweredChange: (v: 'yes' | 'partially' | 'no') => void;
  onClarityChange: (v: CommunicationClarity) => void;
};

export function CommunicationCoach({
  answeredQuestion,
  clarity,
  onAnsweredChange,
  onClarityChange,
}: CommunicationCoachProps) {
  return (
    <div className="communication-coach">
      <p className="communication-coach__prompt">
        Did the candidate answer the question?
      </p>
      <div className="communication-coach__row">
        {ANSWER_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`communication-coach__btn ${answeredQuestion === opt.id ? 'communication-coach__btn--active' : ''}`}
            onClick={() => onAnsweredChange(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="communication-coach__prompt">Was the explanation:</p>
      <div className="communication-coach__row communication-coach__row--wrap">
        {CLARITY_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`communication-coach__btn ${clarity === opt.id ? 'communication-coach__btn--active' : ''}`}
            onClick={() => onClarityChange(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
