import type { TopicMentorProfile } from '../../types/mentorContent';
import { getTechComparisonsForTopic } from '../../data/mentor/techComparisons';
import { StudyCollapsibleSection } from '../study/StudyCollapsibleSection';
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
  compact?: boolean;
  showMemoryAnchor?: boolean;
};

export function TopicMentorStudy({
  profile,
  onSelectTopic,
  compact = false,
  showMemoryAnchor = true,
}: TopicMentorStudyProps) {
  const comparisons = getTechComparisonsForTopic(profile.topicId);
  const prefix = `mentor-${profile.topicId}`;

  if (profile.isStub) {
    return (
      <>
        {showMemoryAnchor && <MemoryAnchorCard anchor={profile.memoryAnchor} />}
        <p className="mentor-stub-notice">Full mentor content coming soon for this topic.</p>
      </>
    );
  }

  if (!compact) {
    return (
      <>
        {showMemoryAnchor && <MemoryAnchorCard anchor={profile.memoryAnchor} />}
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
              currentTopicId={profile.topicId}
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

  return (
    <div className="topic-mentor-study--compact">
      {showMemoryAnchor && <MemoryAnchorCard anchor={profile.memoryAnchor} />}
      <StudyCollapsibleSection
        id={`${prefix}-learn`}
        title="Learn the Why"
      >
        <LearnTheWhySection content={profile.learnTheWhy} embedded />
      </StudyCollapsibleSection>
      <StudyCollapsibleSection
        id={`${prefix}-cost-benefit`}
        title="Cost / benefit"
      >
        <CostBenefitSection content={profile.costBenefit} embedded />
      </StudyCollapsibleSection>
      {profile.decisionTrees.length > 0 && (
        <StudyCollapsibleSection
          id={`${prefix}-decisions`}
          title={`Decision trees (${profile.decisionTrees.length})`}
        >
          {profile.decisionTrees.map((tree, i) => (
            <div key={i} className="study-nested-block">
              {profile.decisionTrees.length > 1 && (
                <h4 className="study-nested-block__title">Tree {i + 1}</h4>
              )}
              <DecisionTreeView tree={tree} />
            </div>
          ))}
        </StudyCollapsibleSection>
      )}
      <StudyCollapsibleSection
        id={`${prefix}-healthcare`}
        title="Healthcare context"
      >
        <HealthcareContextSection items={profile.healthcareContext} embedded />
      </StudyCollapsibleSection>
      <StudyCollapsibleSection
        id={`${prefix}-expectations`}
        title="Interview expectations"
      >
        <InterviewExpectationsSection
          content={profile.interviewExpectations}
          embedded
        />
      </StudyCollapsibleSection>
      {onSelectTopic && (
        <StudyCollapsibleSection
          id={`${prefix}-concepts`}
          title="Related concepts"
        >
          <ConceptGraphNav
            relatedConceptIds={profile.relatedConceptIds}
            currentTopicId={profile.topicId}
            onSelectTopic={onSelectTopic}
          />
        </StudyCollapsibleSection>
      )}
      {comparisons.length > 0 && (
        <StudyCollapsibleSection
          id={`${prefix}-compare`}
          title="Compare technologies"
        >
          {comparisons.map((c) => (
            <TechComparisonCard key={c.id} comparison={c} />
          ))}
        </StudyCollapsibleSection>
      )}
    </div>
  );
}
