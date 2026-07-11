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
              <td>{row.area}</td>
              <td>{row.myAnswer}</td>
              <td>{row.modelAnswer}</td>
              <td>{row.gap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
