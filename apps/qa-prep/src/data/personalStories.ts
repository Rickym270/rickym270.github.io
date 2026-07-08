import type { PersonalStory } from '../types/personalStory';

export const personalStories: PersonalStory[] = [
  {
    id: 'lambda-cold-start',
    title: 'Lambda Cold Start / CloudWatch Debugging',
    projectId: 'medidata',
    relatedTopicIds: ['flaky-test-debugging', 'logging-monitoring', 'pytest-prep'],
    memorizePriority: 1,
    situation:
      'At Medidata, we had an integration test that would intermittently fail because one of our backend APIs occasionally returned 400 or 500 errors. The failures were inconsistent, making it difficult to determine whether the problem was in the automation or the application.',
    task:
      'My responsibility was to determine the root cause and improve the reliability of the automation without masking real defects.',
    action:
      'I started by reviewing CloudWatch logs and correlating timestamps between the failing tests and backend services. I discovered the failures occurred while an AWS Lambda service was still cold starting. Instead of adding arbitrary sleep statements, I created a Python fixture that checked service readiness before the tests executed. I also implemented bounded retry logic with configurable timeouts so the tests waited only as long as necessary.',
    result:
      'The intermittent failures were eliminated, CI became much more reliable, and we maintained confidence that any remaining failures represented genuine application issues rather than timing problems.',
    bestQuestionFor:
      'Flaky tests, CloudWatch, APIs, debugging, Python, backend automation',
  },
  {
    id: 'test-data-management',
    title: 'Test Data Management',
    projectId: 'medidata',
    relatedTopicIds: ['test-data-strategy', 'sql-data-triage', 'eligibility-rules-engine'],
    memorizePriority: 2,
    situation:
      'Healthcare testing required realistic data while protecting patient privacy. Using production data was not an option.',
    task:
      'Create maintainable test data that supported both manual and automated testing.',
    action:
      'I worked with synthetic datasets, reusable Python fixtures, unique identifiers, and parameterized data generation. Whenever possible, I reused seeded datasets instead of constantly creating new database records, which reduced unnecessary overhead and kept test environments stable.',
    result:
      'The testing process became more consistent, test setup was faster, and the team could validate realistic healthcare scenarios without exposing sensitive information.',
    bestQuestionFor:
      'Test data, healthcare, backend testing, fixtures',
  },
  {
    id: 'hipaa-api-validation',
    title: 'HIPAA API Validation',
    projectId: 'medidata',
    relatedTopicIds: ['backend-api-testing', 'eligibility-rules-engine'],
    memorizePriority: 3,
    situation:
      'At Medidata, we worked in a highly regulated healthcare SaaS environment where backend APIs handled sensitive healthcare information.',
    task: 'Ensure APIs behaved correctly while protecting HIPAA-regulated data.',
    action:
      'I created automated backend tests covering positive and negative scenarios, authorization, schema validation, status code validation, and error handling. I also verified that APIs never exposed protected health information to unauthorized users.',
    result:
      'The automated suite increased confidence in backend services and helped ensure our APIs met both functional and security expectations before release.',
    bestQuestionFor:
      'Healthcare, APIs, backend testing, PHI, security',
  },
  {
    id: 'playwright-ci-optimization',
    title: 'Playwright CI Optimization',
    projectId: 'personal-website',
    relatedTopicIds: ['cicd-automation-architecture'],
    memorizePriority: 4,
    situation:
      'My personal Playwright automation suite had grown to nearly 200 end-to-end tests. As the suite expanded, GitHub Actions execution time increased to roughly 10–20 minutes, slowing development.',
    task:
      'Reduce CI execution time while maintaining full test coverage and reliable reporting.',
    action:
      'I analyzed the execution pipeline and implemented Playwright sharding within GitHub Actions. By distributing tests across multiple runners in parallel, I balanced the workload while keeping reporting intact.',
    result:
      'Execution time dropped from roughly 10–20 minutes to approximately 1–2 minutes. Faster feedback encouraged more frequent commits and significantly improved the development workflow.',
    bestQuestionFor:
      'CI/CD, Playwright, automation frameworks, performance',
  },
  {
    id: 'xpress-transit-requirements',
    title: 'XPress Transit — Requirements & E2E',
    projectId: 'xpress-transit',
    relatedTopicIds: ['scrum-product-collaboration', 'behavioral-leadership'],
    memorizePriority: 5,
    situation:
      'A friend of mine, Hernan, wanted to launch XPress Transit, an ambulatory transportation service. The business idea was clear, but many of the detailed requirements had not yet been defined.',
    task:
      'Design and build the platform while ensuring it accurately reflected the business operational needs.',
    action:
      'Before writing code, I met with Hernan and another stakeholder, Vega, to understand how the business would operate, who the users were, what information needed to be captured, and how rides should be requested and managed. I translated those conversations into technical requirements, designed the database schema, developed the frontend and backend, integrated the APIs, and refined the application as requirements evolved.',
    result:
      'The project delivered a working foundation for the business while demonstrating the value of clarifying requirements early. It reinforced that understanding the business process first leads to better software design and more effective testing later.',
    bestQuestionFor:
      'Product collaboration, ambiguity, stakeholder communication, full-stack thinking',
  },
  {
    id: 'mentoring-developers',
    title: 'Mentoring Developers on Testing',
    projectId: 'medidata',
    relatedTopicIds: ['behavioral-leadership', 'pytest-prep'],
    memorizePriority: 6,
    situation:
      'As one of the senior QA engineers, I supported multiple development teams simultaneously. It became difficult for a single QA engineer to write or maintain every automated test.',
    task: 'Improve testing quality without becoming a bottleneck.',
    action:
      'I worked closely with developers during pull request reviews, encouraged them to write stronger unit tests, explained testing strategies, and provided guidance on improving coverage before features reached QA.',
    result:
      'Developers became more comfortable writing tests themselves, reducing QA bottlenecks and improving overall software quality.',
    bestQuestionFor:
      'Collaboration, leadership, code reviews, unit testing',
  },
  {
    id: 'splunk-dashboard',
    title: 'Splunk Dashboard & Infrastructure Monitoring',
    projectId: 'tradeweb',
    relatedTopicIds: ['logging-monitoring'],
    situation:
      'At Tradeweb, network engineers manually investigated infrastructure issues whenever routing or networking behavior changed.',
    task: 'Reduce manual effort while improving visibility into infrastructure health.',
    action:
      'I developed automation that collected networking information, detected unexpected changes, and forwarded results into Splunk dashboards displayed on monitoring screens. Engineers could immediately identify abnormal behavior and investigate directly from the dashboard.',
    result:
      'The team reduced manual monitoring effort and improved the speed at which infrastructure issues were detected and investigated.',
    bestQuestionFor:
      'Monitoring, observability, automation, production support',
  },
  {
    id: 'tradeweb-networking-automation',
    title: 'Tradeweb Networking Automation',
    projectId: 'tradeweb',
    relatedTopicIds: ['cicd-automation-architecture'],
    situation:
      'Tradeweb networking team manually compared routing information across devices to detect unexpected network changes.',
    task: 'Automate that repetitive validation process.',
    action:
      'I developed Python automation that generated daily routing table comparisons, identified unexpected changes, and alerted network engineers when differences appeared. I also automated interactions with network-controlled PDUs to simplify operational tasks.',
    result:
      'The automation significantly reduced manual effort and allowed engineers to identify networking issues much more quickly.',
    bestQuestionFor:
      'Backend automation, infrastructure, Python, scripting',
  },
  {
    id: 'production-api-investigation',
    title: 'Production API Investigation',
    projectId: 'medidata',
    relatedTopicIds: ['logging-monitoring', 'flaky-test-debugging', 'backend-api-testing'],
    situation: 'A backend API occasionally failed during automated testing.',
    task: 'Determine whether the issue originated in the automation or the application.',
    action:
      'I investigated CloudWatch logs, reviewed API responses, correlated timestamps, and traced service dependencies. Rather than masking the issue with longer waits, I focused on identifying the underlying readiness problem.',
    result:
      'We identified the actual backend timing issue, improved the automation, and prevented future intermittent failures.',
    bestQuestionFor: 'Debugging, CloudWatch, troubleshooting',
  },
  {
    id: 'accessibility-testing-initiative',
    title: 'Accessibility Testing Initiative',
    projectId: 'personal-website',
    relatedTopicIds: ['cicd-automation-architecture'],
    situation:
      'While working on my personal portfolio website, I realized I had strong functional test coverage but limited accessibility validation.',
    task: 'Improve overall testing quality.',
    action:
      'I used AI as a brainstorming tool to identify potential accessibility gaps, then implemented additional Playwright tests covering items such as text scaling, contrast-related functionality, and responsive behavior. I manually reviewed and validated every suggestion before incorporating it into the suite.',
    result:
      'The project gained broader automated test coverage while helping me strengthen my understanding of accessibility testing.',
    bestQuestionFor: 'Initiative, continuous improvement, AI usage',
  },
  {
    id: 'sole-qa-medidata',
    title: 'Working as the Sole QA',
    projectId: 'medidata',
    relatedTopicIds: ['behavioral-leadership'],
    isBonus: true,
    situation:
      'At Medidata, I was the sole QA supporting multiple engineering teams and numerous parallel feature releases.',
    task: 'Maintain software quality without becoming a release bottleneck.',
    action:
      'I prioritized testing based on risk, focused automation efforts on repetitive and high-value scenarios, reviewed pull requests, mentored developers on unit testing, and relied heavily on backend API validation to provide fast feedback.',
    result:
      'Despite supporting several teams simultaneously, releases continued moving efficiently while maintaining strong quality standards and reducing manual testing effort.',
    bestQuestionFor:
      'Prioritization, ownership, working under pressure',
  },
  {
    id: 'sql-claims-reconciliation',
    title: 'SQL Claims Data Reconciliation',
    projectId: 'medidata',
    relatedTopicIds: ['sql-data-triage'],
    situation:
      'API integration tests reported eligible members and approved claims, but staging dashboards showed mismatched totals after a plan year configuration update.',
    task:
      'Determine whether the failure was in test seed data, the API layer, or stale database records.',
    action:
      'Captured member IDs and timestamps from failing tests, wrote targeted SQL joining members, plan_assignments, and claims with effective-date filters on synthetic personas. Compared row counts and status fields to API responses, identified orphaned eligibility rows from the rollover, and redacted query output before attaching to the ticket.',
    result:
      'Root cause was incomplete seed refresh after plan year rollover; eng fixed the seed script and added a post-seed validation query to CI.',
    bestQuestionFor:
      'How do you use SQL to validate test results or investigate data discrepancies?',
  },
  {
    id: 'formulary-sprint-coordination',
    title: 'Formulary Release / Sprint Coordination',
    projectId: 'medidata',
    relatedTopicIds: ['scrum-product-collaboration', 'behavioral-leadership'],
    situation:
      'A cross-functional squad faced a tight sprint deadline for a formulary update while regression uncovered eligibility failures on three plan types two days before the planned release.',
    task:
      'Communicate quality risk to the PM and Scrum team and keep stakeholders aligned.',
    action:
      'Prepared a one-page impact summary with affected plan types and member scenarios, presented options in sprint review—delay 48 hours vs. ship with monitored rollback. Partnered with the PM to defer lower-priority stories and documented residual risk for deferred regression scope.',
    result:
      'Team chose a short delay; fix shipped with zero production incidents.',
    bestQuestionFor:
      'How do you collaborate with PM and Scrum on sprint priorities or communicate quality risk?',
  },
];
