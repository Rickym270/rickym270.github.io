import type { AttemptComparisonRow } from '../../types/attemptCoach';

type AttemptComparisonTableProps = {
  rows: AttemptComparisonRow[];
};

export function AttemptComparisonTable({ rows }: AttemptComparisonTableProps) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="attempt-first__comparison-wrap">
      <h4 className="attempt-first__comparison-title">Answer comparison</h4>
      <table className="attempt-first__comparison">
        <thead>
          <tr>
            <th scope="col">Area</th>
            <th scope="col">My answer</th>
            <th scope="col">Model answer</th>
            <th scope="col">Gap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.area}-${row.gap}`}>
              <td data-label="Area">{row.area}</td>
              <td data-label="My answer">{row.myAnswer}</td>
              <td data-label="Model answer">{row.modelAnswer}</td>
              <td data-label="Gap">{row.gap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
