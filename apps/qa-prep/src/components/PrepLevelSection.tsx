import type { ReactNode } from 'react';

type PrepLevelSectionProps = {
  label: string;
  description: string;
  variant?: 'core' | 'stretch' | 'advanced';
  defaultCollapsed?: boolean;
  children: ReactNode;
};

export function PrepLevelSection({
  label,
  description,
  variant = 'core',
  defaultCollapsed = false,
  children,
}: PrepLevelSectionProps) {
  const className = `prep-level-section prep-level-section--${variant}`;

  if (defaultCollapsed) {
    return (
      <details className={className}>
        <summary className="prep-level-section__summary">
          <span className="prep-level-section__label">{label}</span>
          <span className="prep-level-section__description">{description}</span>
        </summary>
        <div className="prep-level-section__body">{children}</div>
      </details>
    );
  }

  return (
    <section className={className} aria-label={label}>
      <div className="prep-level-section__header">
        <h2 className="prep-level-section__label">{label}</h2>
        <p className="prep-level-section__description">{description}</p>
      </div>
      <div className="prep-level-section__body">{children}</div>
    </section>
  );
}
