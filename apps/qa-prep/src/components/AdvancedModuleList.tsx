import type { AdvancedModule } from '../types/advancedModule';
import { TopicCard } from './TopicCard';

type AdvancedModuleListProps = {
  modules: AdvancedModule[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function AdvancedModuleList({
  modules,
  selectedId,
  onSelect,
}: AdvancedModuleListProps) {
  return (
    <nav className="sidebar-section" aria-label="Advanced modules">
      <div className="topic-list">
        {modules.map((module) => (
          <TopicCard
            key={module.id}
            id={module.id}
            label={module.title}
            selected={module.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </nav>
  );
}
