import type { Topic } from '../../types/topic';

export const loggingMonitoring: Topic = {
  id: 'logging-monitoring',
  title: 'Logging / Monitoring',
  flashcards: [
    {
      front: 'What should a good test failure log include for API debugging?',
      back: 'Redacted request/response, correlation/trace ID, timestamp, environment, and the assertion that failed.',
    },
    {
      front: 'What is a correlation ID in distributed testing?',
      back: 'A unique ID returned by the API that links a test request to server-side logs in CloudWatch or Splunk.',
    },
    {
      front: 'Why redact PHI from test logs?',
      back: 'CI logs may be stored long-term and accessible to many engineers—HIPAA requires minimizing PHI exposure.',
    },
    {
      front: 'What is mean time to detect (MTTD)?',
      back: 'How quickly the team discovers an issue—good observability and alerts reduce MTTD for production and CI failures.',
    },
  ],
  mockQuestions: [
    'How do you use logging and monitoring to improve test reliability and speed up debugging?',
    'A test fails in CI for our claims API. Walk me through your log investigation.',
    'How would you set up alerts for CI failure rate spikes or flaky test increases?',
    'How do you connect automated test failures to production observability tools?',
  ],
  strongAnswerBullets: [
    'Capture correlation/trace IDs from API responses in test assertions and CI output',
    'Search CloudWatch or Splunk by ID, service, environment, and request window',
    'Redact PHI from all logged payloads—use synthetic member IDs only',
    'Publish enough context in CI artifacts to debug asynchronously without re-running',
    'Dashboards for error rates, test duration trends, and flaky-test counts',
    'Alert on CI failure spikes; correlate test failures with deployment markers',
  ],
  commonPitfalls: [
    'Logging full response bodies with member PII',
    'Logging so little that reproducing failures requires multiple CI re-runs',
    'No correlation between test output and server-side log search',
    'Ignoring test duration trends until the suite becomes unusably slow',
  ],
  followUpQuestions: [
    'How would you correlate a failed automated test with production observability tools like Datadog or Splunk?',
    'What log fields would you ask developers to add to make QA debugging easier?',
    'How do you balance verbose logging for debug vs. HIPAA compliance?',
  ],
  sampleAnswers: [
    'I capture correlation IDs from API responses in test output and search CloudWatch or Splunk for that request window. I redact PHI from logged payloads, set alerts on CI failure spikes, and track test duration trends so slowdowns are caught early.',
    'I grab the trace ID from the failed test assertion, search logs for that ID within the CI job timestamp window, and compare expected vs. actual server behavior. I redact member fields before sharing logs in Slack or tickets.',
    'I dashboard CI failure rate, flaky-test count, and p95 test duration. Alerts fire when failure rate doubles over a rolling window or flaky count exceeds a threshold. That catches infrastructure issues before the team stops trusting CI.',
    'I use the same correlation ID field in test and production logs. When a test fails in CI, I search Splunk with that ID. If I see similar errors in production dashboards, I escalate as a potential real defect, not just a test issue.',
  ],
  sampleAnswerBullets: [
    [
      'I capture correlation IDs from API responses in test output.',
      'I search CloudWatch or Splunk for that request window.',
      'I redact PHI from logged payloads and set alerts on CI failure spikes.',
      'I track test duration trends so slowdowns are caught early.',
    ],
    [
      'I grab the trace ID from the failed test assertion.',
      'I search logs for that ID within the CI job timestamp window.',
      'I compare expected vs. actual server behavior.',
      'I redact member fields before sharing logs in Slack or tickets.',
    ],
    [
      'I dashboard CI failure rate, flaky-test count, and p95 test duration.',
      'Alerts fire when failure rate doubles over a rolling window or flaky count exceeds a threshold.',
      'That catches infrastructure issues before the team stops trusting CI.',
    ],
    [
      'I use the same correlation ID field in test and production logs.',
      'When a test fails in CI, I search Splunk with that ID.',
      'If I see similar errors in production dashboards, I escalate as a potential real defect, not just a test issue.',
    ],
  ],
  followUpSampleAnswers: [
    'Same workflow—correlation ID, service name, environment, timestamp. Datadog traces link test requests to spans. I compare staging failures to production error patterns to see if we are catching real issues.',
    'I ask for correlation/trace ID, member ID hash—not raw PHI—request path, rule version, and decision outcome on eligibility errors. That lets me debug without reading production dumps.',
    'Log structure and IDs at INFO; full payloads only at DEBUG in lower environments with redaction hooks. Production and CI never log raw PHI. I use synthetic IDs in tests so debug logs are safe to share.',
  ],
};
