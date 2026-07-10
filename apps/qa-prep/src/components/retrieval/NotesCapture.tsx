import { useEffect, useState } from 'react';

const STORAGE_PREFIX = 'qa-prep-notes:';

type NotesCaptureProps = {
  questionKey: string;
};

export function NotesCapture({ questionKey }: NotesCaptureProps) {
  const storageKey = `${STORAGE_PREFIX}${questionKey}`;
  const [notes, setNotes] = useState('');

  useEffect(() => {
    try {
      setNotes(sessionStorage.getItem(storageKey) ?? '');
    } catch {
      setNotes('');
    }
  }, [storageKey]);

  function handleChange(value: string) {
    setNotes(value);
    try {
      sessionStorage.setItem(storageKey, value);
    } catch {
      /* session-only; ignore quota errors */
    }
  }

  return (
    <div className="notes-capture">
      <label className="notes-capture__label" htmlFor={`notes-${questionKey}`}>
        Your notes (active recall — not graded)
      </label>
      <textarea
        id={`notes-${questionKey}`}
        className="notes-capture__input"
        rows={4}
        value={notes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Bullet your answer, example, and result before continuing…"
      />
    </div>
  );
}
