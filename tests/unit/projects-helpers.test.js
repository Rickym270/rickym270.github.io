import { describe, it, expect } from 'vitest';
import { normalizeProjectName, matchesClassification, getProjectImage } from '../../html/js/lib/projects-helpers.js';

describe('normalizeProjectName', () => {
  it('should remove spaces and convert to lowercase', () => {
    expect(normalizeProjectName('Hello World')).toBe('helloworld');
    expect(normalizeProjectName('My Project Name')).toBe('myprojectname');
  });

  it('should handle empty strings and null/undefined', () => {
    expect(normalizeProjectName('')).toBe('');
    expect(normalizeProjectName(null)).toBe('');
    expect(normalizeProjectName(undefined)).toBe('');
  });

  it('should handle special characters', () => {
    expect(normalizeProjectName('Project-Name')).toBe('project-name');
    expect(normalizeProjectName('Project_Name')).toBe('project_name');
  });

  it('should handle already lowercase strings', () => {
    expect(normalizeProjectName('hello')).toBe('hello');
  });
});

describe('matchesClassification', () => {
  it('should match project names with variations', () => {
    const classification = ['Hello World', 'My Project', 'Test Project'];
    expect(matchesClassification('Hello World', classification)).toBe(true);
    expect(matchesClassification('hello world', classification)).toBe(true);
    expect(matchesClassification('HelloWorld', classification)).toBe(true);
    expect(matchesClassification('HELLO WORLD', classification)).toBe(true);
  });

  it('should return false for non-matching names', () => {
    const classification = ['Hello World', 'My Project'];
    expect(matchesClassification('Other Project', classification)).toBe(false);
    expect(matchesClassification('Test', classification)).toBe(false);
  });

  it('should handle null/undefined inputs', () => {
    expect(matchesClassification(null, ['Project'])).toBe(false);
    expect(matchesClassification('Project', null)).toBe(false);
    expect(matchesClassification(undefined, ['Project'])).toBe(false);
    expect(matchesClassification('Project', undefined)).toBe(false);
  });

  it('should handle empty arrays', () => {
    expect(matchesClassification('Project', [])).toBe(false);
  });
});

describe('getProjectImage', () => {
  it('should return mapped image paths for known projects', () => {
    expect(getProjectImage('Blue Manager')).toBe('/html/imgs/Blue_Manager.png');
    expect(getProjectImage('BlueManager')).toBe('/html/imgs/Blue_Manager.png');
    expect(getProjectImage('Xpress Transit')).toBe('/html/imgs/Xpress_Transit.jpg');
    expect(getProjectImage('XpressTransit')).toBe('/html/imgs/Xpress_Transit.jpg');
    expect(getProjectImage('xpress transit')).toBe('/html/imgs/Xpress_Transit.jpg');
    expect(getProjectImage('KappaSigmaHC')).toBe('/html/imgs/KappaSigmaHC.png');
  });

  it('should generate underscore-based path for regular projects', () => {
    const result = getProjectImage('My Project');
    expect(result).toBe('/html/imgs/My_Project.png');
    expect(result).toMatch(/^\/html\/imgs\/.+/);
  });

  it('should handle projects with spaces', () => {
    const result = getProjectImage('Hello World Project');
    expect(result).toBe('/html/imgs/Hello_World_Project.png');
  });

  it('should handle single-word project names', () => {
    const result = getProjectImage('TestProject');
    expect(result).toBe('/html/imgs/TestProject.png');
  });
});
