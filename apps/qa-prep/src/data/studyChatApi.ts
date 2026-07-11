import type { StudyContextPayload } from './studyContext';

export type StudyChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type StudyChatResponse = {
  reply: string;
  model: string;
};

export type StudyChatError = {
  status: number;
  message: string;
};

export function getStudyChatApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost:8080';
  }

  const host = window.location.hostname;
  const isLocal =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.startsWith('192.168.') ||
    host.startsWith('10.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host);

  return isLocal
    ? 'http://localhost:8080'
    : 'https://rickym270-github-io.onrender.com';
}

export async function sendStudyChat(
  messages: StudyChatMessage[],
  context: StudyContextPayload
): Promise<StudyChatResponse> {
  const baseUrl = getStudyChatApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/qa-prep/study-chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, context }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof payload.message === 'string'
        ? payload.message
        : 'Study helper is unavailable right now.';
    throw { status: response.status, message } satisfies StudyChatError;
  }

  return payload as StudyChatResponse;
}
