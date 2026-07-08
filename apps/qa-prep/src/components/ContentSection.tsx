import type { ReactNode } from 'react';

type ContentSectionProps = {
  title: string;
  children: ReactNode;
  variant?: 'default' | 'mistake';
};

export function ContentSection({
  title,
  children,
  variant = 'default',
}: ContentSectionProps) {
  return (
    <section className={`content-section content-section--${variant}`}>
      <h3 className="content-section__title">{title}</h3>
      <div className="content-section__body">{children}</div>
    </section>
  );
}
