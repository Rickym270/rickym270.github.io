import { useState } from 'react';
import type { InterviewRound, PanelQuestion } from '../types/panelPersona';
import { panelRounds } from '../data/panelRounds';
import { topics } from '../data/topics';
import { AttemptFirstDrill } from './attempt-first/AttemptFirstDrill';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { getMemorizeFirstStoryIds, topicStoryLinks } from '../data/contentGraph';
import { personalStories } from '../data/personalStories';
import { InterviewerMindPanel } from './mentor/InterviewerMindPanel';
import type { InterviewerMind } from '../types/mentorContent';

const PANEL_INTERVIEWER_MIND: InterviewerMind = {
  whyAsking: 'Panel questions test whether you can explain tradeoffs, collaborate under ambiguity, and own quality in healthcare-adjacent systems.',
  whatTheyLearn: 'How you structure answers, whether you ground claims in real experience, and if you calibrate depth for an Analyst II role.',
  tooJunior: 'Buzzwords without examples, blaming others, or waiting to be told what to test.',
  overqualified: 'Architecture lectures without tying decisions to team constraints, timelines, or patient/member impact.',
  strongAnalystII: 'Clear situation → action → result, explicit tradeoffs, collaboration with dev/product, and healthcare-aware data handling.',
};

type MockPanelModeProps = {
  onExit: () => void;
};

type SimulationPhase = 'picker' | 'interview' | 'debrief';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function MockPanelMode({ onExit }: MockPanelModeProps) {
  const [phase, setPhase] = useState<SimulationPhase>('picker');
  const [roundId, setRoundId] = useState<InterviewRound['id'] | null>(null);
  const [simulationRounds, setSimulationRounds] = useState<InterviewRound[]>([]);
  const [simRoundIndex, setSimRoundIndex] = useState(0);
  const [roundQuestions, setRoundQuestions] = useState<PanelQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [drillKey, setDrillKey] = useState(0);
  const { progress, getWeakTopics } = useTrainingProgress();

  const isSimulation = phase === 'interview' && simulationRounds.length > 0;
  const round = isSimulation
    ? (simulationRounds[simRoundIndex] ?? null)
    : (panelRounds.find((r) => r.id === roundId) ?? null);

  const questions = roundQuestions.length > 0 ? roundQuestions : (round?.questions ?? []);
  const question = questions[questionIndex] ?? null;
  const linkedTopic = question
    ? topics.find((t) => t.id === question.topicId)
    : undefined;

  function loadRoundQuestions(r: InterviewRound, shuffleQuestions: boolean) {
    setRoundQuestions(shuffleQuestions ? shuffle([...r.questions]) : [...r.questions]);
  }

  function startSimulation() {
    const shuffledRounds = shuffle([...panelRounds]);
    setSimulationRounds(shuffledRounds);
    setSimRoundIndex(0);
    setQuestionIndex(0);
    loadRoundQuestions(shuffledRounds[0]!, true);
    setPhase('interview');
    setDrillKey((k) => k + 1);
  }

  function selectRound(id: InterviewRound['id']) {
    const r = panelRounds.find((x) => x.id === id);
    if (!r) return;
    setRoundId(id);
    setSimulationRounds([]);
    setQuestionIndex(0);
    loadRoundQuestions(r, false);
    setPhase('interview');
    setDrillKey((k) => k + 1);
  }

  function goToQuestion(index: number) {
    setQuestionIndex(index);
    setDrillKey((k) => k + 1);
  }

  function handleQuestionComplete() {
    if (!round) return;
    const total = questions.length;
    if (questionIndex < total - 1) {
      goToQuestion(questionIndex + 1);
      return;
    }
    if (isSimulation && simRoundIndex < simulationRounds.length - 1) {
      const nextIndex = simRoundIndex + 1;
      const nextRound = simulationRounds[nextIndex]!;
      setSimRoundIndex(nextIndex);
      setQuestionIndex(0);
      loadRoundQuestions(nextRound, true);
      setDrillKey((k) => k + 1);
      return;
    }
    if (isSimulation) {
      setPhase('debrief');
      return;
    }
  }

  if (phase === 'debrief') {
    const recent = progress.attempts.slice(-20);
    const weakTopics = getWeakTopics(3);
    const memorizeIds = getMemorizeFirstStoryIds();
    const recommendedStories = weakTopics.flatMap((tid) =>
      (topicStoryLinks[tid] ?? []).filter((id) => memorizeIds.includes(id))
    );
    const uniqueStories = [...new Set(recommendedStories)]
      .map((id) => personalStories.find((s) => s.id === id))
      .filter(Boolean);

    return (
      <div className="panel-mode">
        <div className="panel-mode__header">
          <h2 className="panel-mode__title">Simulation Debrief</h2>
          <button type="button" className="panel-mode__exit" onClick={onExit}>
            Exit
          </button>
        </div>
        <div className="debrief">
          <p>
            You completed three back-to-back interview rounds. Review below and
            prioritize weak areas.
          </p>
          {weakTopics.length > 0 && (
            <section className="debrief__section">
              <h3>Topics needing review</h3>
              <ul className="topic-list-styled">
                {weakTopics.map((id) => (
                  <li key={id}>{id.replace(/-/g, ' ')}</li>
                ))}
              </ul>
            </section>
          )}
          {uniqueStories.length > 0 && (
            <section className="debrief__section">
              <h3>Stories to strengthen answers</h3>
              <ul className="topic-list-styled">
                {uniqueStories.map((s) => s && <li key={s.id}>{s.title}</li>)}
              </ul>
            </section>
          )}
          {recent.length > 0 && (
            <section className="debrief__section">
              <h3>Recent confidence</h3>
              <ul className="topic-list-styled">
                {recent.slice(-5).map((a, i) => (
                  <li key={i}>
                    {a.topicId.replace(/-/g, ' ')} — {a.confidence}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <button
          type="button"
          className="practice-cta"
          onClick={() => {
            setPhase('picker');
            setSimulationRounds([]);
            setSimRoundIndex(0);
            setRoundQuestions([]);
          }}
        >
          Back to rounds
        </button>
      </div>
    );
  }

  if (!round || phase === 'picker') {
    return (
      <div className="panel-mode">
        <div className="panel-mode__header">
          <h2 className="panel-mode__title">Hiring Loop</h2>
          <button type="button" className="panel-mode__exit" onClick={onExit}>
            Exit
          </button>
        </div>
        <p className="panel-mode__intro">
          Three-round Judi Health hiring loop. Answer together first — story
          recommendations and follow-ups before any model answer.
        </p>
        <InterviewerMindPanel content={PANEL_INTERVIEWER_MIND} />
        <ul className="panel-mode__interviewer-list">
          {panelRounds.map((r) => (
            <li key={r.id}>
              <strong>{r.interviewer.name}</strong> — {r.interviewer.focusSummary}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="practice-cta panel-mode__sim-cta"
          onClick={startSimulation}
        >
          Run full hiring loop (3 rounds)
        </button>
        <div className="panel-persona-grid">
          {panelRounds.map((r) => (
            <RoundCard key={r.id} round={r} onSelect={selectRound} />
          ))}
        </div>
      </div>
    );
  }

  if (!question) return null;

  const total = questions.length;
  const isLastInRound = questionIndex >= total - 1;
  const isLastOverall =
    isSimulation &&
    simRoundIndex >= simulationRounds.length - 1 &&
    isLastInRound;

  return (
    <div className="panel-mode">
      <div className="panel-mode__header">
        <div>
          <h2 className="panel-mode__title">
            {isSimulation
              ? `Simulation — ${round.interviewer.name} (${simRoundIndex + 1}/3)`
              : `${round.interviewer.name} — ${round.title}`}
          </h2>
          <p className="panel-interviewer__summary">
            {round.interviewer.focusSummary}
          </p>
          <ul className="panel-mode__focus">
            {round.focusAreas.map((area) => (
              <li key={area} className="panel-mode__focus-tag">
                {area}
              </li>
            ))}
          </ul>
        </div>
        <div className="panel-mode__header-actions">
          <button
            type="button"
            className="panel-mode__back"
            onClick={() => {
              setPhase('picker');
              setRoundId(null);
              setSimulationRounds([]);
              setQuestionIndex(0);
              setRoundQuestions([]);
            }}
          >
            Change round
          </button>
          <button type="button" className="panel-mode__exit" onClick={onExit}>
            Exit
          </button>
        </div>
      </div>

      <AttemptFirstDrill
        key={drillKey}
        questionKey={`panel:${question.id}`}
        topicId={question.topicId}
        topicTitle={linkedTopic?.title ?? round.title}
        question={question.question}
        referenceAnswer={question.sampleAnswer}
        compareBullets={question.strongAnswerIncludes}
        pitfalls={linkedTopic?.commonPitfalls ?? []}
        questionNum={questionIndex + 1}
        totalQuestions={total}
        onNext={handleQuestionComplete}
        onPrev={() => goToQuestion(questionIndex - 1)}
        canPrev={questionIndex > 0}
        isLast={isLastOverall || (!isSimulation && isLastInRound)}
        completeMessage={
          isSimulation && !isLastOverall
            ? 'Round complete — moving to next interview.'
            : 'You finished this round. Change round or exit panel mode.'
        }
      />
    </div>
  );
}

function RoundCard({
  round,
  onSelect,
}: {
  round: InterviewRound;
  onSelect: (id: InterviewRound['id']) => void;
}) {
  return (
    <button
      type="button"
      className="panel-persona-card"
      onClick={() => onSelect(round.id)}
    >
      <div className="panel-round-card__header">
        <h3 className="panel-persona-card__title">
          {round.roundTheme ?? round.title} — {round.interviewer.name}
        </h3>
        <span className="panel-round-card__duration">{round.duration}</span>
      </div>
      {round.roundIntro && (
        <p className="panel-interviewer__summary">{round.roundIntro}</p>
      )}
      {round.feelsLike && (
        <p className="panel-round-card__feels-like">
          <strong>Feels like:</strong> {round.feelsLike}
        </p>
      )}
      <ul className="panel-interviewer__watch">
        {round.interviewer.watchFor.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <ul className="panel-persona-card__focus">
        {round.focusAreas.map((area) => (
          <li key={area}>{area}</li>
        ))}
      </ul>
      <span className="panel-persona-card__count">
        {round.questions.length} questions
      </span>
    </button>
  );
}
