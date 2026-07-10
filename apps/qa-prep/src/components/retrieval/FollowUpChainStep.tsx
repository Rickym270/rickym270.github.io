import type { FollowUpChain } from '../../data/followUpChains';
import { ContentSection } from '../ContentSection';

type FollowUpChainStepProps = {
  chain: FollowUpChain;
  probeIndex: number;
};

export function FollowUpChainStep({ chain, probeIndex }: FollowUpChainStepProps) {
  const probe = chain.probes[probeIndex];

  if (!probe) return null;

  return (
    <ContentSection
      title={`Follow-up ${probeIndex + 1} of ${chain.probes.length}`}
    >
      <p className="practice-drill__question">{probe.question}</p>
      <p className="follow-up-chain__evaluates">
        <strong>Interviewer is evaluating:</strong> {probe.evaluates}
      </p>
      <p className="retrieval-drill__hint">
        Answer together out loud. Use Continue when ready for the next follow-up
        or reflection.
      </p>
    </ContentSection>
  );
}
