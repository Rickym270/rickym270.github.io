import { describe, expect, it } from 'vitest';
import { buildStudyContext } from './studyContext';

describe('buildStudyContext', () => {
  it('includes topic title and mentor plain-English summary', () => {
    const context = buildStudyContext('backend-api-testing', 'study');

    expect(context).not.toBeNull();
    expect(context!.topicTitle).toBe('Backend API Testing');
    expect(context!.contextSummary).toContain('Backend API Testing');
    expect(context!.contextSummary).toContain('pharmacy counter workflow');
    expect(context!.contextSummary).toContain('Strong Analyst II answer');
  });
});
