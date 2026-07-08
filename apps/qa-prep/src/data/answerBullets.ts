import type { PoolQuestion } from './questionPool';

export function assertPoolAnswerBullets(pool: PoolQuestion[]): void {
  const missing = pool.filter((q) => q.answerBullets.length === 0);
  if (missing.length > 0 && import.meta.env.DEV) {
    console.warn(
      '[answerBullets] Pool questions missing speakable bullets:',
      missing.map((q) => q.id)
    );
  }
}
