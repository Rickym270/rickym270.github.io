import { useStudyHelper } from '../../context/StudyHelperContext';

export function StudyHelperHeaderLink() {
  const { enabled, enableHelper, openPanel } = useStudyHelper();

  if (enabled) return null;

  return (
    <button
      type="button"
      className="study-helper-header-link"
      onClick={() => {
        enableHelper();
        openPanel();
      }}
    >
      Study helper
    </button>
  );
}
