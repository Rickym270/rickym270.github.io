export function computePartnerScore(covered: number, total: number) {
  const pct = total === 0 ? 0 : Math.round((covered / total) * 100);
  return { covered, total, pct };
}

export function formatPartnerScore(covered: number, total: number): string {
  const { pct } = computePartnerScore(covered, total);
  return `${covered} / ${total} points · ${pct}%`;
}
