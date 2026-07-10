import type { ReactNode } from 'react';

type StudyCollapsibleSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  variant?: 'default' | 'mistake';
};

export function StudyCollapsibleSection({
  id,
  title,
  children,
  defaultOpen = false,
  variant = 'default',
}: StudyCollapsibleSectionProps) {
  return (
    <details
      id={id}
      className={`study-section study-section--${variant}`}
      open={defaultOpen}
    >
      <summary className="study-section__summary">
        <span className="study-section__title">{title}</span>
      </summary>
      <div className="study-section__body">{children}</div>
    </details>
  );
}
