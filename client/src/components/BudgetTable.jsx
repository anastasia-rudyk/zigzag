import { formatUAH } from '../utils/format.js';

const ROWS = [
  ['transport', 'Транспорт'],
  ['lodging', 'Проживання'],
  ['tickets', 'Вхідні квитки'],
  ['food', 'Харчування'],
];

/** Кошторис подорожі за статтями витрат, формули (2.9)–(2.11) */
export default function BudgetTable({ budget }) {
  if (!budget) return null;
  const total = budget.total || 1;

  return (
    <table className="w-full text-sm">
      <caption className="sr-only">Кошторис подорожі</caption>
      <tbody>
        {ROWS.map(([key, label]) => (
          <tr key={key} className="border-b border-line">
            <th scope="row" className="py-2 text-left font-medium">
              {label}
              <span className="mt-1 block h-1 rounded-full bg-mist">
                <span
                  className="block h-1 rounded-full bg-fir"
                  style={{ width: `${((budget[key] || 0) / total) * 100}%` }}
                />
              </span>
            </th>
            <td className="py-2 text-right tabular-nums">{formatUAH(budget[key])}</td>
          </tr>
        ))}
        <tr>
          <th scope="row" className="pt-3 text-left font-display font-medium">
            Разом
          </th>
          <td className="pt-3 text-right font-display font-medium tabular-nums">{formatUAH(budget.total)}</td>
        </tr>
      </tbody>
    </table>
  );
}
