import type { AdvancedModule } from '../types/advancedModule';
import { TopicCard } from './TopicCard';

type AdvancedModuleListProps = {
  modules: AdvancedModule[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  compact?: boolean;
};

export function AdvancedModuleList({
  modules,
  selectedId,
  onSelect,
  compact = false,
}: AdvancedModuleListProps) {
  return (
    <nav
      className={`sidebar-section ${compact ? 'sidebar-section--compact' : ''}`}
      aria-label="Advanced modules"
    >
      <div className={`topic-list ${compact ? 'topic-list--compact' : ''}`}>
        {modules.map((module) => (
          <TopicCard
            key={module.id}
            id={module.id}
            label={module.title}
            selected={module.id === selectedId}
            onSelect={onSelect}
            compact={compact}
          />
        ))}
      </div>
    </nav>
  );
}
