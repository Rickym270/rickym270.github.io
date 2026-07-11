import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { buildStudyContext, type StudyMode } from '../data/studyContext';
import {
  sendStudyChat,
  type StudyChatError,
  type StudyChatMessage,
} from '../data/studyChatApi';

const ENABLED_KEY = 'qa-prep-study-helper-enabled';
const CHAT_PREFIX = 'qa-prep-chat:';
const MAX_MESSAGES = 20;

export type StudyFocus = {
  topicId: string;
  topicTitle: string;
  mode: StudyMode;
  currentQuestion?: string;
};

type StudyHelperContextValue = {
  enabled: boolean;
  panelOpen: boolean;
  messages: StudyChatMessage[];
  sending: boolean;
  error: string | null;
  studyFocus: StudyFocus | null;
  setStudyFocus: (focus: StudyFocus | null) => void;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  enableHelper: () => void;
  disableHelper: () => void;
  clearChat: () => void;
  sendMessage: (text: string) => Promise<void>;
};

const StudyHelperContext = createContext<StudyHelperContextValue | null>(null);

function readEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = window.localStorage.getItem(ENABLED_KEY);
  if (stored === null) return true;
  return stored === 'true';
}

function readMessages(topicId: string): StudyChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(`${CHAT_PREFIX}${topicId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StudyChatMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (message) =>
          (message.role === 'user' || message.role === 'assistant') &&
          typeof message.content === 'string'
      )
      .slice(-MAX_MESSAGES);
  } catch {
    return [];
  }
}

function writeMessages(topicId: string, messages: StudyChatMessage[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    `${CHAT_PREFIX}${topicId}`,
    JSON.stringify(messages.slice(-MAX_MESSAGES))
  );
}

export function StudyHelperProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(readEnabled);
  const [panelOpen, setPanelOpen] = useState(false);
  const [studyFocus, setStudyFocusState] = useState<StudyFocus | null>(null);
  const [messages, setMessages] = useState<StudyChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topicId = studyFocus?.topicId ?? null;

  useEffect(() => {
    if (!topicId) {
      setMessages([]);
      return;
    }
    setMessages(readMessages(topicId));
  }, [topicId]);

  const persistMessages = useCallback(
    (next: StudyChatMessage[]) => {
      if (!topicId) return;
      writeMessages(topicId, next);
    },
    [topicId]
  );

  const setStudyFocus = useCallback((focus: StudyFocus | null) => {
    setStudyFocusState(focus);
    setError(null);
  }, []);

  const openPanel = useCallback(() => setPanelOpen(true), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);
  const togglePanel = useCallback(() => setPanelOpen((open) => !open), []);

  const enableHelper = useCallback(() => {
    setEnabled(true);
    window.localStorage.setItem(ENABLED_KEY, 'true');
  }, []);

  const disableHelper = useCallback(() => {
    setEnabled(false);
    setPanelOpen(false);
    window.localStorage.setItem(ENABLED_KEY, 'false');
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    if (topicId) {
      window.localStorage.removeItem(`${CHAT_PREFIX}${topicId}`);
    }
  }, [topicId]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      if (!studyFocus) {
        setError('Select a topic first so the helper knows what you are studying.');
        return;
      }

      const context = buildStudyContext(
        studyFocus.topicId,
        studyFocus.mode,
        studyFocus.currentQuestion
      );
      if (!context) {
        setError('Could not build study context for this topic.');
        return;
      }

      const userMessage: StudyChatMessage = { role: 'user', content: trimmed };
      const nextMessages = [...messages, userMessage].slice(-MAX_MESSAGES);
      setMessages(nextMessages);
      persistMessages(nextMessages);
      setSending(true);
      setError(null);

      try {
        const response = await sendStudyChat(nextMessages, context);
        const assistantMessage: StudyChatMessage = {
          role: 'assistant',
          content: response.reply,
        };
        const withReply = [...nextMessages, assistantMessage].slice(-MAX_MESSAGES);
        setMessages(withReply);
        persistMessages(withReply);
      } catch (err) {
        const chatError = err as StudyChatError;
        if (chatError.status === 429) {
          setError('Too many requests. Please wait a bit and try again.');
        } else if (chatError.status === 503) {
          setError('Study helper is unavailable right now.');
        } else {
          setError(chatError.message || 'Something went wrong. Please try again.');
        }
      } finally {
        setSending(false);
      }
    },
    [messages, persistMessages, sending, studyFocus]
  );

  const value = useMemo(
    () => ({
      enabled,
      panelOpen,
      messages,
      sending,
      error,
      studyFocus,
      setStudyFocus,
      openPanel,
      closePanel,
      togglePanel,
      enableHelper,
      disableHelper,
      clearChat,
      sendMessage,
    }),
    [
      enabled,
      panelOpen,
      messages,
      sending,
      error,
      studyFocus,
      setStudyFocus,
      openPanel,
      closePanel,
      togglePanel,
      enableHelper,
      disableHelper,
      clearChat,
      sendMessage,
    ]
  );

  return (
    <StudyHelperContext.Provider value={value}>
      {children}
    </StudyHelperContext.Provider>
  );
}

export function useStudyHelper() {
  const context = useContext(StudyHelperContext);
  if (!context) {
    throw new Error('useStudyHelper must be used within StudyHelperProvider');
  }
  return context;
}
