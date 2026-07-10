type StudyNavItem = {
  id: string;
  label: string;
};

type StudySectionNavProps = {
  sections: StudyNavItem[];
};

export function StudySectionNav({ sections }: StudySectionNavProps) {
  function jumpTo(id: string) {
    const el = document.getElementById(id);
    if (!el || !(el instanceof HTMLDetailsElement)) return;
    el.open = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav className="study-section-nav" aria-label="Study sections">
      <span className="study-section-nav__label">Jump to</span>
      <div className="study-section-nav__links">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className="study-section-nav__link"
            onClick={() => jumpTo(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
