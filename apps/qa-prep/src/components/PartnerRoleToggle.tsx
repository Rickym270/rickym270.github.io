export type PartnerRole = 'interviewee' | 'interviewer';

type PartnerRoleToggleProps = {
  role: PartnerRole;
  onChange: (role: PartnerRole) => void;
};

export function PartnerRoleToggle({ role, onChange }: PartnerRoleToggleProps) {
  return (
    <div
      className="partner-role-toggle topic-mode-toggle"
      role="group"
      aria-label="Study role"
    >
      <button
        type="button"
        className={`topic-mode-toggle__btn ${role === 'interviewee' ? 'topic-mode-toggle__btn--active' : ''}`}
        aria-pressed={role === 'interviewee'}
        onClick={() => onChange('interviewee')}
      >
        Interviewee
      </button>
      <button
        type="button"
        className={`topic-mode-toggle__btn ${role === 'interviewer' ? 'topic-mode-toggle__btn--active' : ''}`}
        aria-pressed={role === 'interviewer'}
        onClick={() => onChange('interviewer')}
      >
        Interviewer
      </button>
    </div>
  );
}
