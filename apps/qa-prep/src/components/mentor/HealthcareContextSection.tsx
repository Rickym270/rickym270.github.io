import { ContentSection } from '../ContentSection';
import { ExplainedBlock } from './ExplainedBlock';

type HealthcareContextSectionProps = {
  items: string[];
  embedded?: boolean;
};

export function HealthcareContextSection({
  items,
  embedded = false,
}: HealthcareContextSectionProps) {
  const text = items.join(' ');
  const body = (
    <ExplainedBlock text={text} label="healthcare context">
      <ul className="topic-list-styled">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </ExplainedBlock>
  );

  if (embedded) {
    return body;
  }

  return <ContentSection title="Healthcare Context">{body}</ContentSection>;
}
