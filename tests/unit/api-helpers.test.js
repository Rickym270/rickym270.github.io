import { describe, it, expect } from 'vitest';
import { enhanceNetworkError } from '../../html/js/lib/api-helpers.js';

describe('enhanceNetworkError', () => {
  it('should enhance TypeError errors with CORS message', () => {
    const originalError = new TypeError('Failed to fetch');
    const enhanced = enhanceNetworkError(originalError);
    
    expect(enhanced).toBeInstanceOf(Error);
    expect(enhanced.message).toContain('Network error');
    expect(enhanced.message).toContain('CORS issue');
    expect(enhanced.name).toBe('TypeError');
    expect(enhanced.originalError).toBe(originalError);
  });

  it('should enhance errors with "Failed to fetch" message', () => {
    const originalError = new Error('Failed to fetch');
    originalError.name = 'TypeError';
    const enhanced = enhanceNetworkError(originalError);
    
    expect(enhanced.message).toContain('Network error');
    expect(enhanced.message).toContain('CORS issue');
  });

  it('should enhance errors with "Load failed" message', () => {
    const originalError = new Error('Load failed');
    originalError.name = 'NetworkError';
    const enhanced = enhanceNetworkError(originalError);
    
    expect(enhanced.message).toContain('Network error');
    expect(enhanced.message).toContain('CORS issue');
  });

  it('should return original error if not a network/CORS error', () => {
    const originalError = new Error('Validation error');
    originalError.name = 'ValidationError';
    const enhanced = enhanceNetworkError(originalError);
    
    expect(enhanced).toBe(originalError);
    expect(enhanced.message).toBe('Validation error');
  });

  it('should preserve error name and original error reference', () => {
    const originalError = new TypeError('Failed to fetch');
    const enhanced = enhanceNetworkError(originalError);
    
    expect(enhanced.name).toBe('TypeError');
    expect(enhanced.originalError).toBe(originalError);
  });
});
