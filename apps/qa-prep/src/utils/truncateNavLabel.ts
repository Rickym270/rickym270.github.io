export function truncateNavLabel(text: string, max = 52): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}
