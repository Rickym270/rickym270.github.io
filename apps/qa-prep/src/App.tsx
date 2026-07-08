import { useState } from 'react';
import { topics } from './data/topics';
import { strongAnswers } from './data/strongAnswers';
import { answerComparisons } from './data/answerComparisons';
import { personalStories } from './data/personalStories';
import { scoringRubrics } from './data/scoringRubrics';
import { stretchConcepts } from './data/stretchConcepts';
import { advancedModules } from './data/advancedModules';
import {
  PREP_LEVELS,
  CORE_STRONG_ANSWER_IDS,
  ADVANCED_STRONG_ANSWER_IDS,
  CORE_STORY_IDS,
  ADVANCED_STORY_IDS,
  DEFAULT_CORE_TOPIC_ID,
} from './data/prepCatalog';
import { AnswerComparisonDetail } from './components/AnswerComparisonDetail';
import { AnswerComparisonList } from './components/AnswerComparisonList';
import { StoryBankDetail } from './components/StoryBankDetail';
import { StoryBankList } from './components/StoryBankList';
import { StrongAnswerDetail } from './components/StrongAnswerDetail';
import { StrongAnswerList } from './components/StrongAnswerList';
import { TopicDetail } from './components/TopicDetail';
import { TopicList } from './components/TopicList';
import { MockPanelMode } from './components/MockPanelMode';
import { PrepLevelSection } from './components/PrepLevelSection';
import { StretchConceptList } from './components/StretchConceptList';
import { StretchConceptDetail } from './components/StretchConceptDetail';
import { AdvancedModuleList } from './components/AdvancedModuleList';
import { AdvancedModuleDetail } from './components/AdvancedModuleDetail';
import { WeakSpotReview } from './components/WeakSpotReview';
import { StoryNavigator } from './components/StoryNavigator';
import { RandomInterviewMode } from './components/RandomInterviewMode';
import { PartnerMode } from './components/PartnerMode';
import { useTrainingProgress } from './hooks/useTrainingProgress';

type TrainingMode =
  | null
  | 'partner'
  | 'panel'
  | 'random'
  | 'weakSpots'
  | 'storyNav';

type Selection =
  | { kind: 'topic'; id: string }
  | { kind: 'strongAnswer'; id: string }
  | { kind: 'comparison'; id: string }
  | { kind: 'story'; id: string }
  | { kind: 'stretch'; id: string }
  | { kind: 'advanced'; id: string };

function filterByIds<T extends { id: string }>(items: T[], ids: readonly string[]) {
  const idSet = new Set(ids);
  return ids
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is T => item !== undefined && idSet.has(item.id));
}

function formatDaysAgo(timestamp: number): string {
  const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function App() {
  const [trainingMode, setTrainingMode] = useState<TrainingMode>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selection, setSelection] = useState<Selection>({
    kind: 'topic',
    id: DEFAULT_CORE_TOPIC_ID,
  });
  const { getWeakTopics, getLastPracticed } = useTrainingProgress();

  const coreStrongAnswers = filterByIds(strongAnswers, CORE_STRONG_ANSWER_IDS);
  const advancedStrongAnswers = filterByIds(
    strongAnswers,
    ADVANCED_STRONG_ANSWER_IDS
  );
  const coreStories = filterByIds(personalStories, CORE_STORY_IDS);
  const advancedStories = filterByIds(personalStories, ADVANCED_STORY_IDS);

  const weakTopics = getWeakTopics(3);
  const staleHint = topics
    .map((t) => ({ topic: t, last: getLastPracticed(t.id) }))
    .filter((x) => x.last !== null)
    .sort((a, b) => (a.last ?? 0) - (b.last ?? 0))[0];

  const selectedTopic =
    selection.kind === 'topic'
      ? (topics.find((t) => t.id === selection.id) ?? null)
      : null;

  const selectedAnswer =
    selection.kind === 'strongAnswer'
      ? (strongAnswers.find((a) => a.id === selection.id) ?? null)
      : null;

  const selectedComparison =
    selection.kind === 'comparison'
      ? (answerComparisons.find((c) => c.id === selection.id) ?? null)
      : null;

  const selectedStory =
    selection.kind === 'story'
      ? (personalStories.find((s) => s.id === selection.id) ?? null)
      : null;

  const selectedStretch =
    selection.kind === 'stretch'
      ? (stretchConcepts.find((c) => c.id === selection.id) ?? null)
      : null;

  const selectedAdvanced =
    selection.kind === 'advanced'
      ? (advancedModules.find((m) => m.id === selection.id) ?? null)
      : null;

  function selectAndClose(setter: () => void) {
    setter();
    setMobileNavOpen(false);
  }

  function setMode(mode: TrainingMode) {
    setTrainingMode(mode);
    setMobileNavOpen(false);
  }

  const trainingModes: { id: TrainingMode; label: string }[] = [
    { id: 'partner', label: 'Partner' },
    { id: 'panel', label: 'Mock Panel' },
    { id: 'random', label: 'Random Interview' },
    { id: 'weakSpots', label: 'Weak Spots' },
    { id: 'storyNav', label: 'Stories' },
  ];

  const browseMode = trainingMode === null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__top">
          <div className="app-header__brand">
            {browseMode && (
              <button
                type="button"
                className="mobile-menu-btn mobile-only"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open menu"
              >
                Menu
              </button>
            )}
            <div>
              <p className="app-header__eyebrow">Hiring Team Loop</p>
              <h1 className="app-header__title">QA Loop Prep</h1>
            </div>
          </div>
          <div className="training-mode-toggles">
            {trainingModes.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`training-mode-toggle ${trainingMode === m.id ? 'training-mode-toggle--active' : ''}`}
                onClick={() =>
                  setMode(trainingMode === m.id ? null : m.id)
                }
              >
                {trainingMode === m.id && m.id === 'panel'
                  ? 'Exit Panel'
                  : m.label}
              </button>
            ))}
          </div>
        </div>
        {staleHint && browseMode && (
          <p className="app-header__hint">
            Last practiced {staleHint.topic.title}{' '}
            {formatDaysAgo(staleHint.last!)} — consider a quick Train session.
          </p>
        )}
      </header>

      {browseMode && mobileNavOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <main
        className={`app-main ${trainingMode === 'panel' ? 'app-main--panel' : ''}`}
      >
        {browseMode && (
          <aside
            className={`app-sidebar ${mobileNavOpen ? 'app-sidebar--open' : ''}`}
          >
            <div className="app-sidebar__header mobile-only">
              <span className="app-sidebar__title">Navigation</span>
              <button
                type="button"
                className="mobile-menu-btn mobile-menu-btn--close"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
              >
                Close
              </button>
            </div>

            {weakTopics.length > 0 && (
              <nav className="sidebar-section sidebar-review-next" aria-label="Review next">
                <h3 className="sidebar-section__subheading">Review next</h3>
                <ul className="sidebar-review-list">
                  {weakTopics.map((id) => {
                    const topic = topics.find((t) => t.id === id);
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          className="sidebar-review-list__btn"
                          onClick={() =>
                            selectAndClose(() =>
                              setSelection({ kind: 'topic', id })
                            )
                          }
                        >
                          {topic?.title ?? id}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}

            <PrepLevelSection
              label={PREP_LEVELS.core.label}
              description={PREP_LEVELS.core.description}
              variant="core"
            >
              <TopicList
                topics={topics}
                selectedId={selection.kind === 'topic' ? selection.id : null}
                onSelect={(id) =>
                  selectAndClose(() => setSelection({ kind: 'topic', id }))
                }
              />
              <StrongAnswerList
                answers={coreStrongAnswers}
                selectedId={
                  selection.kind === 'strongAnswer' ? selection.id : null
                }
                onSelect={(id) =>
                  selectAndClose(() =>
                    setSelection({ kind: 'strongAnswer', id })
                  )
                }
              />
              <AnswerComparisonList
                comparisons={answerComparisons}
                selectedId={
                  selection.kind === 'comparison' ? selection.id : null
                }
                onSelect={(id) =>
                  selectAndClose(() =>
                    setSelection({ kind: 'comparison', id })
                  )
                }
              />
              <StoryBankList
                stories={coreStories}
                selectedId={selection.kind === 'story' ? selection.id : null}
                onSelect={(id) =>
                  selectAndClose(() => setSelection({ kind: 'story', id }))
                }
              />
            </PrepLevelSection>

            <PrepLevelSection
              label={PREP_LEVELS.stretch.label}
              description={PREP_LEVELS.stretch.description}
              variant="stretch"
            >
              <StretchConceptList
                concepts={stretchConcepts}
                selectedId={
                  selection.kind === 'stretch' ? selection.id : null
                }
                onSelect={(id) =>
                  selectAndClose(() => setSelection({ kind: 'stretch', id }))
                }
              />
            </PrepLevelSection>

            <PrepLevelSection
              label={PREP_LEVELS.advanced.label}
              description={PREP_LEVELS.advanced.description}
              variant="advanced"
              defaultCollapsed
            >
              <AdvancedModuleList
                modules={advancedModules}
                selectedId={
                  selection.kind === 'advanced' ? selection.id : null
                }
                onSelect={(id) =>
                  selectAndClose(() => setSelection({ kind: 'advanced', id }))
                }
              />
              {advancedStrongAnswers.length > 0 && (
                <StrongAnswerList
                  answers={advancedStrongAnswers}
                  heading="Optional Strong Answers"
                  selectedId={
                    selection.kind === 'strongAnswer' ? selection.id : null
                  }
                  onSelect={(id) =>
                    selectAndClose(() =>
                      setSelection({ kind: 'strongAnswer', id })
                    )
                  }
                />
              )}
              {advancedStories.length > 0 && (
                <StoryBankList
                  stories={advancedStories}
                  heading="Optional Stories"
                  selectedId={
                    selection.kind === 'story' ? selection.id : null
                  }
                  onSelect={(id) =>
                    selectAndClose(() => setSelection({ kind: 'story', id }))
                  }
                />
              )}
            </PrepLevelSection>
          </aside>
        )}

        {trainingMode === 'partner' ? (
          <PartnerMode onExit={() => setMode(null)} />
        ) : trainingMode === 'panel' ? (
          <MockPanelMode onExit={() => setMode(null)} />
        ) : trainingMode === 'random' ? (
          <RandomInterviewMode onExit={() => setMode(null)} />
        ) : trainingMode === 'weakSpots' ? (
          <WeakSpotReview
            onSelectTopic={(id) => {
              setSelection({ kind: 'topic', id });
              setMode(null);
            }}
            onSelectStory={() => setMode('storyNav')}
          />
        ) : trainingMode === 'storyNav' ? (
          <StoryNavigator onExit={() => setMode(null)} />
        ) : selectedTopic ? (
          <TopicDetail
            topic={selectedTopic}
            rubric={scoringRubrics.find(
              (r) => r.topicId === selectedTopic.id
            )}
            onSelectTopic={(id) => {
              setSelection({ kind: 'topic', id });
            }}
          />
        ) : selectedAnswer ? (
          <StrongAnswerDetail answer={selectedAnswer} />
        ) : selectedComparison ? (
          <AnswerComparisonDetail comparison={selectedComparison} />
        ) : selectedStory ? (
          <StoryBankDetail story={selectedStory} />
        ) : selectedStretch ? (
          <StretchConceptDetail concept={selectedStretch} />
        ) : selectedAdvanced ? (
          <AdvancedModuleDetail module={selectedAdvanced} />
        ) : (
          <p className="app-placeholder">Select a topic to begin.</p>
        )}
      </main>
    </div>
  );
}

export default App;
