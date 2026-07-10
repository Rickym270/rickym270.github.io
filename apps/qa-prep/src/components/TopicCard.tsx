type TopicCardProps = {
  id: string;
  label: string;
  selected: boolean;
  onSelect: (id: string) => void;
  compact?: boolean;
  titleAttr?: string;
};

export function TopicCard({
  id,
  label,
  selected,
  onSelect,
  compact = false,
  titleAttr,
}: TopicCardProps) {
  return (
    <button
      type="button"
      className={`topic-card ${compact ? 'topic-card--compact' : ''} ${selected ? 'topic-card--selected' : ''}`}
      onClick={() => onSelect(id)}
      aria-current={selected ? 'true' : undefined}
      title={titleAttr}
    >
      {label}
    </button>
  );
}
