import { useFiltersStore } from '../../app/store/filters.store';
import styleConfig from '../../config/style.config.json';

export default function FilterPanel() {
  const axis = useFiltersStore((s) => s.axis);
  const setAxis = useFiltersStore((s) => s.setAxis);
  const evals = Object.entries((styleConfig as any).evaluations || {});

  return (
    <label className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-xl shadow-md backdrop-blur">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Color by:</span>
      <select
        value={axis}
        onChange={(e) => setAxis(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-medium text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {evals.map(([k]) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
    </label>
  );
}
