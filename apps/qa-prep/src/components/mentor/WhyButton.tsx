import { useEffect, useState } from 'react';
import type { TopicMentorProfile } from '../../types/mentorContent';
import { getMentorProfile } from '../../data/mentor/topicMentorProfiles';
import { stretchConcepts } from '../../data/stretchConcepts';
import { LearnTheWhySection } from './LearnTheWhySection';
import { ContentSection } from '../ContentSection';

type WhyButtonProps = {
  topicId: string;
  stretchConceptId?: string;
};

export function WhyButton({ topicId, stretchConceptId }: WhyButtonProps) {
  const [open, setOpen] = useState(false);
  const profile: TopicMentorProfile | undefined = getMentorProfile(topicId);
  const stretch = stretchConceptId
    ? stretchConcepts.find((c) => c.id === stretchConceptId)
    : undefined;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!profile?.learnTheWhy && !stretch) return null;

  return (
    <>
      <div className="why-button-row">
        <button
          type="button"
          className="practice-drill__secondary"
          onClick={() => setOpen(true)}
        >
          Why?
        </button>
      </div>
      {open && (
        <div
          className="why-modal-backdrop"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className="why-modal"
            role="dialog"
            aria-labelledby="why-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="why-modal__header">
              <h3 id="why-modal-title" className="why-modal__title">
                Why does this exist?
              </h3>
              <button
                type="button"
                className="panel-mode__exit"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            {profile?.learnTheWhy && (
              <LearnTheWhySection content={profile.learnTheWhy} />
            )}
            {stretch && (
              <ContentSection title={stretch.title}>
                <p>{stretch.whyItMatters}</p>
                <p>
                  <strong>Practical takeaway:</strong> {stretch.practicalTakeaway}
                </p>
              </ContentSection>
            )}
          </div>
        </div>
      )}
    </>
  );
}
