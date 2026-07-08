import { useState, useEffect, useRef } from 'react';

const DEFAULT_SECONDS = 120;

type PracticeTimerProps = {
  seconds?: number;
};

export function PracticeTimer({ seconds = DEFAULT_SECONDS }: PracticeTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setRemaining((r) => r - 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining]);

  useEffect(() => {
    if (remaining === 0) setRunning(false);
  }, [remaining]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const display = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="practice-timer">
      <span className="practice-timer__display">{display}</span>
      <div className="practice-timer__actions">
        {!running ? (
          <button
            type="button"
            className="practice-timer__btn"
            onClick={() => setRunning(true)}
          >
            Start timer
          </button>
        ) : (
          <button
            type="button"
            className="practice-timer__btn"
            onClick={() => setRunning(false)}
          >
            Pause
          </button>
        )}
        <button
          type="button"
          className="practice-timer__btn practice-timer__btn--secondary"
          onClick={() => {
            setRunning(false);
            setRemaining(seconds);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
