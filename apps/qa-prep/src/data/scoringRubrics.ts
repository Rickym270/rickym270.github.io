import type { ScoringRubric } from '../types/scoringRubric';

const CATEGORIES = [
  'Technical accuracy',
  'Structure',
  'Specificity',
  'Relevance to Judi Health role',
  'Communication clarity',
] as const;

function rubric(
  topicId: string,
  criteria: [string, string, string][]
): ScoringRubric {
  return {
    topicId,
    categories: CATEGORIES.map((category, i) => ({
      category,
      score1: criteria[i][0],
      score3: criteria[i][1],
      score5: criteria[i][2],
    })),
  };
}

export const scoringRubrics: ScoringRubric[] = [
  rubric('backend-api-testing', [
    [
      "Says 'test the endpoints' with no mention of contracts, auth, or error codes.",
      'Names integration testing and status codes but omits healthcare-specific checks.',
      'Covers contract, integration, and E2E layers; cites OpenAPI, synthetic member IDs, PHI handling.',
    ],
    [
      'Random list of testing buzzwords with no logical flow.',
      'Mentions layers but jumps between ideas without clear progression.',
      'Clear flow: contract → integration → E2E, with rationale for each layer.',
    ],
    [
      'No concrete tools, fixtures, or API examples mentioned.',
      'Generic references to Postman or REST without eligibility-specific scenarios.',
      'Names specific tools, edge cases (inactive member, missing NDC), and idempotency checks.',
    ],
    [
      'Could apply to any API job; no PBM or pharmacy benefit context.',
      'Mentions healthcare vaguely but not eligibility or claims workflows.',
      'Directly ties testing to member eligibility, formulary lookup, and PHI compliance at a PBM.',
    ],
    [
      'Hesitant, filler words, cannot summarize approach in under two minutes.',
      'Understandable but rambles; listener must extract the strategy.',
      'Concise, confident delivery; easy for panel to follow and probe deeper.',
    ],
  ]),
  rubric('test-data-strategy', [
    [
      "Says 'use test data' without explaining creation, isolation, or PHI rules.",
      'Mentions fixtures but not versioning, personas, or refresh strategy.',
      'Defines reusable personas, fixture factories, PHI-safe synthetic data, and staging refresh cadence.',
    ],
    [
      'No framework for how data is organized or maintained over time.',
      'Lists data types but lacks setup/teardown or ownership model.',
      'Structured approach: personas → fixtures → isolation → documentation → refresh.',
    ],
    [
      'No example personas, IDs, or scenarios described.',
      'One generic example without naming plan types or member states.',
      'Specific personas (COB, high-deductible, terminated coverage) with deterministic IDs.',
    ],
    [
      'Generic test data advice with no pharmacy or member eligibility angle.',
      'Mentions healthcare compliance briefly without PBM-specific data needs.',
      'Ties data strategy to plan tiers, NDC codes, copay scenarios, and HIPAA boundaries.',
    ],
    [
      'Unclear why their approach is better than ad-hoc data creation.',
      'Explains approach but not the team benefit or risk reduction.',
      'Articulates how the strategy prevents duplicate setup and production-data misuse.',
    ],
  ]),
  rubric('eligibility-rules-engine', [
    [
      "Says 'test the rules' without decision tables, boundaries, or version tracking.",
      'Mentions edge cases but not combinatorial inputs or rule versioning.',
      'Uses decision tables, parameterized tests, rule version IDs, and date-boundary coverage.',
    ],
    [
      'No systematic method for mapping rules to test cases.',
      'Describes some cases but no input → outcome mapping framework.',
      'Clear input conditions → expected outcome structure with regression tied to config changes.',
    ],
    [
      'No example rule, member state, or expected eligibility outcome.',
      'One vague scenario without plan tier, effective date, or drug attribute.',
      'Concrete examples: PA required, not covered, plan year rollover, COB overlap.',
    ],
    [
      'Generic rules testing with no connection to pharmacy benefit adjudication.',
      'Mentions eligibility but not formulary or plan configuration churn.',
      'Directly addresses PBM rule changes, plan updates, and eligibility flag validation.',
    ],
    [
      'Cannot explain why rules engine testing differs from API shape testing.',
      'Partially distinguishes logic testing from contract testing.',
      'Clearly articulates combinatorial decision logic vs. request/response validation.',
    ],
  ]),
  rubric('pytest-prep', [
    [
      "Says 'PyTest is like other frameworks' with no features named.",
      'Mentions fixtures vaguely without scoping, parametrize, or markers.',
      'Names fixtures, conftest.py, @pytest.mark.parametrize, markers, and domain-based organization.',
    ],
    [
      'No project layout or suite organization described.',
      'Basic file structure mentioned without CI integration or fixture hierarchy.',
      'Domain folders, root conftest, session vs. function scope, marker-based CI tiers.',
    ],
    [
      'No code-level examples or concrete PyTest patterns.',
      'Generic fixture mention without auth token or API base URL example.',
      'Specific patterns: session-scoped auth fixture, parametrize for NDC edge cases, slow-test markers.',
    ],
    [
      'PyTest knowledge not connected to API or rules testing at a PBM.',
      'Mentions API tests but not eligibility or pharmacy benefit domain organization.',
      'Maps PyTest structure to eligibility, claims, and formulary test domains.',
    ],
    [
      'Sounds like theoretical knowledge, not hands-on experience.',
      'Conveys familiarity but lacks confidence from real project use.',
      'Speaks from experience—clear about what they built and why those patterns helped.',
    ],
  ]),
  rubric('flaky-test-debugging', [
    [
      "Says 're-run until it passes' or 'flakiness happens sometimes.'",
      'Acknowledges flakiness but offers only retries or longer timeouts.',
      'Systematic approach: log analysis, isolation vs. suite, root-cause fix, quarantine policy.',
    ],
    [
      'No debugging steps or decision tree presented.',
      'Lists some causes but no ordered investigation process.',
      'Clear sequence: pattern detection → reproduce → isolate cause → fix → verify.',
    ],
    [
      'No example of a flaky test or specific fix applied.',
      'Generic timing or data issue without concrete scenario.',
      'Concrete example: shared member ID collision, race condition, or order dependency with fix.',
    ],
    [
      'Generic flakiness advice not tied to CI or healthcare API context.',
      'Mentions CI but not eligibility test stability or compliance-sensitive suites.',
      'Connects flakiness to CI trust, PBM regression gates, and release confidence.',
    ],
    [
      'Defensive or dismissive about flaky tests being unavoidable.',
      'Accepts some flakiness as normal without advocating for reliability.',
      'Confident that flakiness is solvable; communicates impact on team velocity and trust.',
    ],
  ]),
  rubric('cicd-automation-architecture', [
    [
      "Says 'automate everything' or 'run all tests on every commit.'",
      'Describes CI vaguely without stages, gates, or parallelization.',
      'Defines test tiers, parallel shards, PR vs. nightly splits, and deploy-blocking criteria.',
    ],
    [
      'No pipeline stages or feedback-time goals mentioned.',
      'Some stages listed but no timing targets or fail-fast strategy.',
      'Clear pipeline: unit → integration → smoke E2E → nightly regression with time goals.',
    ],
    [
      'No tools (GitHub Actions, markers, shards) or metrics cited.',
      'Mentions CI tool without runtime improvement or parallelization example.',
      'Specific: GitHub Actions matrix, 15-min PR target, artifact publishing, domain sharding.',
    ],
    [
      'Generic CI design with no healthcare deploy gate or compliance consideration.',
      'Mentions staging but not synthetic data or HIPAA-safe CI credentials.',
      'Addresses credential handling, staging with synthetic PBM data, and release gates.',
    ],
    [
      'Overly dogmatic or unrealistic about full automation.',
      'Balanced but cannot articulate trade-offs or ROI of each tier.',
      'Pragmatic tone; explains why each tier exists and what it protects.',
    ],
  ]),
  rubric('logging-monitoring', [
    [
      "Says 'check the logs' without correlation IDs, tools, or redaction.",
      'Mentions CloudWatch or Splunk but not traceability or PHI redaction.',
      'Uses correlation IDs, CloudWatch/Splunk queries, redacted payloads, and failure artifacts.',
    ],
    [
      'No connection between test failure and server-side investigation steps.',
      'Describes logging tools separately from test debugging workflow.',
      'Clear workflow: test failure → correlation ID → log search → root cause → fix.',
    ],
    [
      'No example log field, query, or dashboard mentioned.',
      'Generic log review without request window, service filter, or assertion context.',
      'Specific: trace ID from API response, log group, timestamp window, redacted payload diff.',
    ],
    [
      'Generic observability advice with no healthcare or AWS context.',
      'Mentions AWS but not PHI-safe logging or PBM service patterns.',
      'Ties observability to HIPAA-safe logging, AWS stack, and eligibility API debugging.',
    ],
    [
      'Cannot explain what a good failure log should contain.',
      'Lists log fields but not how they speed up cross-team debugging.',
      'Articulates how good logs reduce CI re-runs and enable dev/QA collaboration.',
    ],
  ]),
  rubric('behavioral-leadership', [
    [
      "Says 'I care about quality' with no specific story or outcome.",
      'Has a story but no measurable result or personal role clarified.',
      'STAR story with concrete stakes, personal actions, and quantified outcome.',
    ],
    [
      'Story lacks Situation-Task-Action-Result structure.',
      'Partial STAR—strong action but weak situation or missing result.',
      'Full STAR: clear context, your task, specific actions, measurable result.',
    ],
    [
      'Vague team or project; no dates, numbers, or decisions described.',
      'Some detail but no impact metrics or named collaborators.',
      'Specific release, delay decision, incident prevented, or metric improved.',
    ],
    [
      'Story from unrelated domain with no bridge to healthcare or QA leadership.',
      'Relevant QA story but not connected to cross-functional influence at a PBM.',
      'Story demonstrates quality advocacy, dev collaboration, and risk communication relevant to Judi Health.',
    ],
    [
      'Sounds rehearsed, defensive, or takes full credit without team context.',
      'Clear delivery but lacks warmth or collaboration emphasis.',
      'Confident, collaborative tone; acknowledges partners while owning your contribution.',
    ],
  ]),
  rubric('sql-data-triage', [
    [
      "Says 'run a query' with no tables, filters, or link to the test failure.",
      'Mentions SQL but not effective dates, JOINs, or synthetic test IDs.',
      'Targeted query from test context: member ID, effective date, JOINs, rule version, DB vs API diff.',
    ],
    [
      'Random SQL keywords with no triage workflow.',
      'Describes querying but not step-by-step from failure to root cause.',
      'Clear flow: test context → targeted query → compare DB to API → document findings.',
    ],
    [
      'No concrete table, column, or PBM scenario mentioned.',
      'Generic database talk without eligibility, claims, or plan year examples.',
      'Specific: eligibility/plan tables, synthetic personas, rollover duplicates, claim reconciliation.',
    ],
    [
      'Ignores PHI safety or runs unbounded queries on large tables.',
      'Mentions staging but not read-only access or redacted exports.',
      'Synthetic IDs only, filtered WHERE clauses, redacted ticket attachments, read-only staging.',
    ],
    [
      'Cannot explain when SQL complements vs. replaces API testing.',
      'Uses SQL but unclear on validating seed data or handoff to engineering.',
      'Articulates SQL as validation layer for test data and discrepancy triage alongside API tests.',
    ],
  ]),
  rubric('scrum-product-collaboration', [
    [
      "Says 'QA approves stories' or acts as sole release gatekeeper.",
      'Mentions sprints but not refinement, risk trade-offs, or PM partnership.',
      'Refinement input, risk-based coverage, documented residual risk, collaborative triage.',
    ],
    [
      'No structure for prioritization or sprint contribution.',
      'Lists Scrum ceremonies without explaining QA role in each.',
      'Clear role: refinement AC review, planning estimates, standup blockers, retro trends.',
    ],
    [
      'Vague bug priority ("high" or "low") with no impact rationale.',
      'Uses severity but not member impact or PBM-specific examples.',
      'Impact × severity with eligibility/formulary examples and clear repro steps.',
    ],
    [
      'Generic agile advice unrelated to healthcare delivery pressure.',
      'Relevant Scrum story but not tied to regulated release decisions.',
      'Connects collaboration to PBM releases, member risk, and cross-functional trust at Judi Health.',
    ],
    [
      'Adversarial tone toward PM or engineering under deadline pressure.',
      'Professional but passive—waits until end of sprint to raise issues.',
      'Proactive, collaborative communication; escalates early with options, not ultimatums.',
    ],
  ]),
];
