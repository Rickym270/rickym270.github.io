import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useStudyHelper } from '../../context/StudyHelperContext';

export function StudyHelperPanel() {
  const panelId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState('');

  const {
    messages,
    sending,
    error,
    studyFocus,
    closePanel,
    disableHelper,
    clearChat,
    sendMessage,
  } = useStudyHelper();

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ block: 'nearest' });
  }, [messages, sending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        closePanel();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closePanel]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim() || sending) return;
    const text = draft;
    setDraft('');
    await sendMessage(text);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit(event);
    }
  }

  const focusLabel = studyFocus
    ? `${studyFocus.topicTitle} · ${studyFocus.mode}`
    : 'Browse a topic to add context';

  return (
    <section
      id="study-helper-panel"
      className="study-helper-panel"
      role="dialog"
      aria-labelledby={`${panelId}-title`}
      aria-modal="false"
    >
      <header className="study-helper-panel__header">
        <div>
          <h2 id={`${panelId}-title`} className="study-helper-panel__title">
            Study helper
          </h2>
          <p className="study-helper-panel__focus">{focusLabel}</p>
        </div>
        <div className="study-helper-panel__header-actions">
          <button
            type="button"
            className="study-helper-panel__text-btn"
            onClick={clearChat}
            disabled={messages.length === 0}
          >
            Clear
          </button>
          <button
            type="button"
            className="study-helper-panel__text-btn"
            onClick={closePanel}
          >
            Minimize
          </button>
        </div>
      </header>

      <ul ref={listRef} className="socratic-mentor__chat study-helper-panel__messages">
        {messages.length === 0 && (
          <li className="study-helper-panel__empty">
            Ask about mock questions, pitfalls, or how to phrase a strong answer.
          </li>
        )}
        {messages.map((message, index) => (
          <li
            key={`${message.role}-${index}`}
            className={`socratic-mentor__msg ${
              message.role === 'assistant'
                ? 'socratic-mentor__msg--mentor'
                : 'socratic-mentor__msg--user'
            }`}
          >
            {message.content}
          </li>
        ))}
        {sending && (
          <li className="socratic-mentor__msg socratic-mentor__msg--mentor study-helper-panel__typing">
            Thinking…
          </li>
        )}
      </ul>

      {error && <p className="study-helper-panel__error">{error}</p>}

      <form className="study-helper-panel__form" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor={`${panelId}-input`}>
          Ask a study question
        </label>
        <textarea
          id={`${panelId}-input`}
          ref={inputRef}
          className="study-helper-panel__input"
          rows={2}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Ask about this topic…"
          disabled={sending}
        />
        <div className="study-helper-panel__form-actions">
          <button
            type="button"
            className="study-helper-panel__text-btn study-helper-panel__text-btn--muted"
            onClick={disableHelper}
          >
            Disable helper
          </button>
          <button
            type="submit"
            className="study-helper-panel__send"
            disabled={sending || !draft.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}
