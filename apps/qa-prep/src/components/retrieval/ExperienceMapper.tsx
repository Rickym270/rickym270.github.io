import { PROJECT_LABELS, topicStoryLinks } from '../../data/contentGraph';
import { personalStories } from '../../data/personalStories';
import type { ProjectId } from '../../data/contentGraph';

type ExperienceMapperProps = {
  topicId: string;
  selectedProject: ProjectId | null;
  onSelect: (project: ProjectId) => void;
};

export function ExperienceMapper({
  topicId,
  selectedProject,
  onSelect,
}: ExperienceMapperProps) {
  const linkedIds = topicStoryLinks[topicId] ?? [];
  const linkedStories = linkedIds
    .map((id) => personalStories.find((s) => s.id === id))
    .filter(Boolean);

  const projectStories = selectedProject
    ? personalStories.filter((s) => s.projectId === selectedProject)
    : [];

  return (
    <div className="experience-mapper">
      <p className="experience-mapper__prompt">
        Which project does this remind you of?
      </p>
      <div className="experience-mapper__projects">
        {(Object.keys(PROJECT_LABELS) as ProjectId[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`experience-mapper__btn ${selectedProject === id ? 'experience-mapper__btn--active' : ''}`}
            onClick={() => onSelect(id)}
          >
            {PROJECT_LABELS[id]}
          </button>
        ))}
      </div>
      {linkedStories.length > 0 && (
        <div className="experience-mapper__suggested">
          <p className="experience-mapper__hint">Suggested for this topic:</p>
          <ul className="topic-list-styled">
            {linkedStories.map(
              (s) => s && <li key={s.id}>{s.title}</li>
            )}
          </ul>
        </div>
      )}
      {selectedProject && projectStories.length > 0 && (
        <p className="experience-mapper__retell">
          Retell the relevant STAR story together — do not read. Start with:{' '}
          <strong>{projectStories[0]?.title}</strong>
        </p>
      )}
    </div>
  );
}
