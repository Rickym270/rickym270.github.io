import { getStudyChatApiBaseUrl } from './studyChatApi';
import type {
  AttemptCoachError,
  AttemptCoachRequest,
  AttemptCoachResponse,
} from '../types/attemptCoach';

export async function callAttemptCoach(
  request: AttemptCoachRequest
): Promise<AttemptCoachResponse> {
  const baseUrl = getStudyChatApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/qa-prep/attempt-coach`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof payload.message === 'string'
        ? payload.message
        : 'Attempt coach is unavailable right now.';
    throw { status: response.status, message } satisfies AttemptCoachError;
  }

  return payload as AttemptCoachResponse;
}
