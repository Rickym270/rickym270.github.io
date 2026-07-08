import type { AdvancedModule } from '../types/advancedModule';

export const advancedModules: AdvancedModule[] = [
  {
    id: 'qa-strategy-scale',
    title: 'QA strategy at scale',
    summary:
      'Optional senior depth: how QA function scales across multiple squads and releases—not day-one Analyst II expectations.',
    keyPoints: [
      'Risk-based test strategy aligned to product roadmap and regulatory exposure',
      'Balancing manual exploration, automation ROI, and release cadence',
      'When to centralize vs. embed QA in feature teams',
      'Communicating quality posture to leadership without owning the entire company roadmap',
    ],
    whenToUse:
      'If an interviewer asks how you would shape QA across several teams or a major platform migration.',
    relatedTopicIds: ['behavioral-leadership', 'scrum-product-collaboration'],
  },
  {
    id: 'org-automation-architecture',
    title: 'Organization-wide automation architecture',
    summary:
      'How large orgs structure shared frameworks, runner infrastructure, and test ownership—useful for Staff/Lead conversations.',
    keyPoints: [
      'Shared libraries vs. team-owned test repos',
      'Standard patterns for API clients, fixtures, and reporting',
      'Runner cost, parallelism budgets, and environment provisioning at scale',
      'Governance without becoming a bottleneck',
    ],
    whenToUse:
      'If discussion moves from "your squad\'s CI" to "how would you standardize automation across eng?"',
    relatedTopicIds: ['cicd-automation-architecture', 'pytest-prep'],
  },
  {
    id: 'test-maturity-models',
    title: 'Test maturity models',
    summary:
      'Frameworks (e.g., team capability stages) for assessing and improving test practice over time.',
    keyPoints: [
      'Levels from ad-hoc testing to measured, continuous quality feedback',
      'Using maturity assessments to prioritize investments—not as bureaucracy',
      'Pairing maturity gaps with concrete next steps (fixtures, tiers, observability)',
    ],
    whenToUse:
      'When asked how you would assess a team\'s testing practice or plan a multi-quarter improvement path.',
    relatedTopicIds: ['cicd-automation-architecture', 'behavioral-leadership'],
  },
  {
    id: 'kpis-quality-metrics',
    title: 'KPIs and quality metrics',
    summary:
      'Defect escape rate, flaky-test ratio, MTTD, coverage trends—how to use metrics without gaming them.',
    keyPoints: [
      'Leading vs. lagging indicators for quality',
      'Dashboards that drive action, not vanity metrics',
      'Avoiding "100% automation" as a goal',
      'Tying metrics to member impact in healthcare contexts',
    ],
    whenToUse:
      'If interviewer asks how you measure QA effectiveness at team or org level.',
    relatedTopicIds: ['logging-monitoring', 'flaky-test-debugging'],
  },
  {
    id: 'automation-roadmap',
    title: 'Large-scale automation roadmap',
    summary:
      'Multi-quarter planning for automation coverage, tooling, and team skill growth.',
    keyPoints: [
      'Phased rollout: critical paths first, then expand by risk and change frequency',
      'Dependencies on test data, environments, and CI capacity',
      'Stakeholder alignment with PM and eng leadership',
      'Clear milestones and what "done" means per phase',
    ],
    whenToUse:
      'Future Senior SDET roles or deep "how would you grow automation here?" questions.',
    relatedTopicIds: ['cicd-automation-architecture', 'backend-api-testing'],
  },
  {
    id: 'mentoring-programs',
    title: 'Mentoring programs',
    summary:
      'Structured approaches to raising test quality across developers—not just ad-hoc pairing.',
    keyPoints: [
      'Guidelines, office hours, and PR checklist patterns',
      'Scaling review beyond one senior QA',
      'Measuring improvement in defect escape on new code',
      'Building trust so devs seek feedback early',
    ],
    whenToUse:
      'When asked about leading quality culture or mentoring at scale; pair with the Mentoring Unit Tests story.',
    relatedTopicIds: ['behavioral-leadership', 'pytest-prep'],
  },
  {
    id: 'cross-team-standards',
    title: 'Cross-team testing standards',
    summary:
      'Shared conventions for test naming, markers, data handling, and definition of done across squads.',
    keyPoints: [
      'Lightweight standards that reduce friction in shared repos',
      'RFC or guild model for evolving conventions',
      'PHI-safe logging and data rules as non-negotiable standards',
      'Balancing consistency with team autonomy',
    ],
    whenToUse:
      'If conversation shifts to multi-squad coordination or platform engineering partnership.',
    relatedTopicIds: ['test-data-strategy', 'scrum-product-collaboration'],
  },
  {
    id: 'test-data-platform',
    title: 'Long-term test data platform strategy',
    summary:
      'Beyond fixtures: data provisioning APIs, persona catalogs, refresh pipelines, and self-service for squads.',
    keyPoints: [
      'Test data as a product for internal consumers',
      'Versioned personas, factories, and environment refresh schedules',
      'Isolation for destructive tests and parallel CI',
      'Compliance constraints for synthetic vs. masked production subsets',
    ],
    whenToUse:
      'Deep dive on test data at org scale; Core prep stays at squad-level persona libraries.',
    relatedTopicIds: ['test-data-strategy', 'sql-data-triage'],
  },
];
