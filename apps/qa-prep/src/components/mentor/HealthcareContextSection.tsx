import { ContentSection } from '../ContentSection';
import { ExplainedBlock } from './ExplainedBlock';

type HealthcareContextSectionProps = {
  items: string[];
};

export function HealthcareContextSection({ items }: HealthcareContextSectionProps) {
  const text = items.join(' ');
  return (
    <ContentSection title="Healthcare Context">
      <ExplainedBlock text={text} label="healthcare context">
        <ul className="topic-list-styled">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ExplainedBlock>
    </ContentSection>
  );
}
