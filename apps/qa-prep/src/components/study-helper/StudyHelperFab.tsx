import { useStudyHelper } from '../../context/StudyHelperContext';
import { StudyHelperPanel } from './StudyHelperPanel';

export function StudyHelperFab() {
  const { enabled, panelOpen, togglePanel } = useStudyHelper();

  if (!enabled) return null;

  return (
    <div
      className={`study-helper-root ${panelOpen ? 'study-helper-root--open' : ''}`}
    >
      {panelOpen && <StudyHelperPanel />}
      <button
        type="button"
        className="study-helper-fab"
        onClick={togglePanel}
        aria-expanded={panelOpen}
        aria-controls="study-helper-panel"
        aria-label={panelOpen ? 'Close study helper' : 'Ask study helper'}
      >
        {panelOpen ? 'Close' : 'Ask'}
      </button>
    </div>
  );
}
