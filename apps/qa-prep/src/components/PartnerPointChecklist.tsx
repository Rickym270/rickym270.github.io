import { formatPartnerScore } from '../data/partnerGrading';

type PartnerPointChecklistProps = {
  bullets: string[];
  checked: boolean[];
  onToggle: (index: number) => void;
  onClear?: () => void;
};

export function PartnerPointChecklist({
  bullets,
  checked,
  onToggle,
  onClear,
}: PartnerPointChecklistProps) {
  const covered = checked.filter(Boolean).length;
  const total = bullets.length;

  return (
    <div className="partner-point-checklist">
      <div className="partner-grade-score-row">
        <p className="partner-grade-score" aria-live="polite">
          {formatPartnerScore(covered, total)}
        </p>
        {onClear && covered > 0 && (
          <button
            type="button"
            className="partner-grade-clear practice-drill__secondary"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>
      <ul className="partner-point-checklist__list">
        {bullets.map((bullet, i) => (
          <li key={`${i}-${bullet.slice(0, 32)}`}>
            <label className="partner-point-checklist__item">
              <input
                type="checkbox"
                checked={checked[i] ?? false}
                onChange={() => onToggle(i)}
                aria-label={`Point covered: ${bullet}`}
              />
              <span className="partner-point-checklist__text">{bullet}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
