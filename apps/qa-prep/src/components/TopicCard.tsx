type TopicCardProps = {
  id: string;
  label: string;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function TopicCard({ id, label, selected, onSelect }: TopicCardProps) {
  return (
    <button
      type="button"
      className={`topic-card ${selected ? 'topic-card--selected' : ''}`}
      onClick={() => onSelect(id)}
      aria-current={selected ? 'true' : undefined}
    >
      {label}
    </button>
  );
}
