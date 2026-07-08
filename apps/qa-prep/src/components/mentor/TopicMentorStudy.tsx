import type { TopicMentorProfile } from '../../types/mentorContent';
import { getTechComparisonsForTopic } from '../../data/mentor/techComparisons';
import { MemoryAnchorCard } from './MemoryAnchorCard';
import { LearnTheWhySection } from './LearnTheWhySection';
import { CostBenefitSection } from './CostBenefitSection';
import { DecisionTreeView } from './DecisionTreeView';
import { HealthcareContextSection } from './HealthcareContextSection';
import { InterviewExpectationsSection } from './InterviewExpectationsSection';
import { ConceptGraphNav } from './ConceptGraphNav';
import { TechComparisonCard } from './TechComparisonCard';
import { ContentSection } from '../ContentSection';

type TopicMentorStudyProps = {
  profile: TopicMentorProfile;
  onSelectTopic?: (topicId: string) => void;
};

export function TopicMentorStudy({ profile, onSelectTopic }: TopicMentorStudyProps) {
  const comparisons = getTechComparisonsForTopic(profile.topicId);

  if (profile.isStub) {
    return (
      <>
        <MemoryAnchorCard anchor={profile.memoryAnchor} />
        <p className="mentor-stub-notice">Full mentor content coming soon for this topic.</p>
      </>
    );
  }

  return (
    <>
      <MemoryAnchorCard anchor={profile.memoryAnchor} />
      <LearnTheWhySection content={profile.learnTheWhy} />
      <CostBenefitSection content={profile.costBenefit} />
      {profile.decisionTrees.map((tree, i) => (
        <ContentSection key={i} title={`Decision Tree ${i + 1}`}>
          <DecisionTreeView tree={tree} />
        </ContentSection>
      ))}
      <HealthcareContextSection items={profile.healthcareContext} />
      <InterviewExpectationsSection content={profile.interviewExpectations} />
      {onSelectTopic && (
        <ContentSection title="Related Concepts">
          <ConceptGraphNav
            relatedConceptIds={profile.relatedConceptIds}
            onSelectTopic={onSelectTopic}
          />
        </ContentSection>
      )}
      {comparisons.length > 0 && (
        <ContentSection title="Compare Technologies">
          {comparisons.map((c) => (
            <TechComparisonCard key={c.id} comparison={c} />
          ))}
        </ContentSection>
      )}
    </>
  );
}
