import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..', '..');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Load schemas
const projectSchema = JSON.parse(
  readFileSync(join(rootDir, 'contracts', 'project.schema.json'), 'utf-8')
);
const healthSchema = JSON.parse(
  readFileSync(join(rootDir, 'contracts', 'health-response.schema.json'), 'utf-8')
);
const metaSchema = JSON.parse(
  readFileSync(join(rootDir, 'contracts', 'meta-response.schema.json'), 'utf-8')
);
const statsSchema = JSON.parse(
  readFileSync(join(rootDir, 'contracts', 'stats-response.schema.json'), 'utf-8')
);

const validateProject = ajv.compile(projectSchema);
const validateHealth = ajv.compile(healthSchema);
const validateMeta = ajv.compile(metaSchema);
const validateStats = ajv.compile(statsSchema);

describe('API Contract Validation - Project Schema', () => {
  it('should validate a valid project with all required fields', () => {
    const validProject = {
      slug: 'personal-website',
      name: 'rickym270.github.io',
      summary: 'Personal site to host notes, tutorials, and projects',
      repo: 'https://github.com/Rickym270/rickym270.github.io',
      tech: ['Python', 'JavaScript', 'Java'],
      featured: true
    };

    const isValid = validateProject(validProject);
    expect(isValid).toBe(true);
    if (!isValid) {
      console.error('Validation errors:', validateProject.errors);
    }
  });

  it('should validate a minimal project with only required fields', () => {
    const minimalProject = {
      slug: 'test-project',
      name: 'Test Project',
      repo: 'https://github.com/user/repo'
    };

    const isValid = validateProject(minimalProject);
    expect(isValid).toBe(true);
  });

  it('should reject project missing required field "slug"', () => {
    const invalidProject = {
      name: 'Test Project',
      repo: 'https://github.com/user/repo'
    };

    const isValid = validateProject(invalidProject);
    expect(isValid).toBe(false);
    expect(validateProject.errors).toBeDefined();
    expect(validateProject.errors.some(e => e.instancePath === '' && e.params.missingProperty === 'slug')).toBe(true);
  });

  it('should reject project missing required field "name"', () => {
    const invalidProject = {
      slug: 'test-project',
      repo: 'https://github.com/user/repo'
    };

    const isValid = validateProject(invalidProject);
    expect(isValid).toBe(false);
    expect(validateProject.errors.some(e => e.params.missingProperty === 'name')).toBe(true);
  });

  it('should reject project missing required field "repo"', () => {
    const invalidProject = {
      slug: 'test-project',
      name: 'Test Project'
    };

    const isValid = validateProject(invalidProject);
    expect(isValid).toBe(false);
    expect(validateProject.errors.some(e => e.params.missingProperty === 'repo')).toBe(true);
  });

  it('should accept project with optional fields', () => {
    const projectWithOptionals = {
      slug: 'test-project',
      name: 'Test Project',
      repo: 'https://github.com/user/repo',
      summary: 'A test project',
      tech: ['Java', 'Python'],
      featured: false,
      status: 'complete'
    };

    const isValid = validateProject(projectWithOptionals);
    expect(isValid).toBe(true);
  });
});

describe('API Contract Validation - Health Response Schema', () => {
  it('should validate a valid health response', () => {
    const validHealth = {
      status: 'UP',
      version: '1.0.0',
      time: '2025-01-30T12:00:00Z'
    };

    const isValid = validateHealth(validHealth);
    expect(isValid).toBe(true);
  });

  it('should reject health response missing "status"', () => {
    const invalidHealth = {
      version: '1.0.0',
      time: '2025-01-30T12:00:00Z'
    };

    const isValid = validateHealth(invalidHealth);
    expect(isValid).toBe(false);
    expect(validateHealth.errors.some(e => e.params.missingProperty === 'status')).toBe(true);
  });
});

describe('API Contract Validation - Meta Response Schema', () => {
  it('should validate a valid meta response', () => {
    const validMeta = {
      name: 'Ricky Martinez',
      title: 'Senior SDET / Developer in Test',
      location: 'New York, USA',
      languages: ['English', 'Spanish', 'German'],
      github: 'https://github.com/rickym270',
      portfolio: 'https://rickym270.github.io'
    };

    const isValid = validateMeta(validMeta);
    expect(isValid).toBe(true);
  });

  it('should reject meta response missing required field', () => {
    const invalidMeta = {
      name: 'Ricky Martinez',
      title: 'Senior SDET / Developer in Test'
      // Missing location, languages, github, portfolio
    };

    const isValid = validateMeta(invalidMeta);
    expect(isValid).toBe(false);
  });
});

describe('API Contract Validation - Stats Response Schema', () => {
  it('should validate a valid stats response', () => {
    const validStats = {
      projects: 15,
      languages: ['Java', 'Python', 'JavaScript'],
      lastUpdated: '2025-01-30T12:00:00Z'
    };

    const isValid = validateStats(validStats);
    expect(isValid).toBe(true);
  });

  it('should reject stats response with wrong type for "projects"', () => {
    const invalidStats = {
      projects: '15', // Should be integer, not string
      languages: ['Java'],
      lastUpdated: '2025-01-30T12:00:00Z'
    };

    const isValid = validateStats(invalidStats);
    expect(isValid).toBe(false);
    expect(validateStats.errors.some(e => e.instancePath === '/projects' && e.keyword === 'type')).toBe(true);
  });

  it('should reject stats response missing "lastUpdated"', () => {
    const invalidStats = {
      projects: 15,
      languages: ['Java']
    };

    const isValid = validateStats(invalidStats);
    expect(isValid).toBe(false);
    expect(validateStats.errors.some(e => e.params.missingProperty === 'lastUpdated')).toBe(true);
  });
});
