import { conceptGraphNodes, conceptGraphEdges } from '../../data/mentor/conceptGraph';
import { topics } from '../../data/topics';

type ConceptGraphNavProps = {
  relatedConceptIds: string[];
  currentTopicId?: string;
  onSelectTopic: (topicId: string) => void;
};

export function ConceptGraphNav({
  relatedConceptIds,
  currentTopicId,
  onSelectTopic,
}: ConceptGraphNavProps) {
  const nodes = conceptGraphNodes.filter(
    (n) => relatedConceptIds.includes(n.id) || relatedConceptIds.includes(n.topicId ?? '')
  );

  const edges = conceptGraphEdges.filter(
    (e) =>
      relatedConceptIds.includes(e.from) || relatedConceptIds.includes(e.to)
  );

  if (nodes.length === 0) return null;

  return (
    <div className="concept-graph concept-graph-nav">
      <ul className="concept-graph__nodes concept-graph-nav__list">
        {nodes.map((node) => (
          <li key={node.id}>
            {node.topicId ? (
              <button
                type="button"
                className={`concept-graph__link concept-graph-nav__btn ${
                  node.topicId === currentTopicId
                    ? 'concept-graph-nav__btn--current'
                    : ''
                }`}
                onClick={() => onSelectTopic(node.topicId!)}
              >
                {node.label}
              </button>
            ) : (
              <span>{node.label}</span>
            )}
          </li>
        ))}
      </ul>
      {edges.length > 0 && (
        <p className="concept-graph__hint">
          Related chain:{' '}
          {edges
            .map((e) => {
              const from = conceptGraphNodes.find((n) => n.id === e.from)?.label;
              const to = conceptGraphNodes.find((n) => n.id === e.to)?.label;
              return `${from} → ${to}`;
            })
            .join(' · ')}
        </p>
      )}
      <p className="concept-graph__topics">
        Jump to topic:{' '}
        {relatedConceptIds
          .map((id) => topics.find((t) => t.id === id)?.title ?? id)
          .join(', ')}
      </p>
    </div>
  );
}
