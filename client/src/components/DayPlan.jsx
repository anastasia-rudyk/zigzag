import { formatMinutes } from '../utils/format.js';

/**
 * План по днях. plan — [{ day, minutes, points: [id] }],
 * byId — словник локацій за id для показу назв.
 */
export default function DayPlan({ plan = [], byId = {}, days, maxPerDay = 480 }) {
  return (
    <ol className="space-y-3">
      {plan.map((d) => {
        const over = days && d.day > days;
        return (
          <li key={d.day} className={`rounded-2xl border p-3 ${over ? 'border-route bg-route/10' : 'border-white/10 bg-white/[0.05]'}`}>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <h4 className="text-sm font-bold">День {d.day}</h4>
              <span className="text-xs text-mist">
                {formatMinutes(d.minutes)} з {formatMinutes(maxPerDay)}
              </span>
            </div>
            <div className="mb-2 h-1.5 rounded-full bg-white/10" aria-hidden="true">
              <div className="h-1.5 rounded-full bg-fir-light" style={{ width: `${Math.min((d.minutes / maxPerDay) * 100, 100)}%` }} />
            </div>
            <ul className="space-y-1 text-sm">
              {d.points.map((id) => (
                <li key={id}>{byId[id]?.name || 'Локація'}</li>
              ))}
              {d.returnsToStart && <li className="text-mist">Повернення до старту</li>}
            </ul>
            {over && <p className="mt-2 text-xs font-bold text-route-light">Цей день виходить за межі запланованих днів</p>}
          </li>
        );
      })}
    </ol>
  );
}
