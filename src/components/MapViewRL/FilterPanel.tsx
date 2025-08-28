import { useFiltersStore } from '../../app/store/filters.store';
import styleConfig from '../../config/style.config.json';

export default function FilterPanel() {
  const axis = useFiltersStore((s) => s.axis);
  const setAxis = useFiltersStore((s) => s.setAxis);
  const evals = Object.keys((styleConfig as any).evaluations || {});
  return (
    <label>
      Color by:&nbsp;
      <select value={axis} onChange={(e) => setAxis(e.target.value)}>
        {evals.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
    </label>
  );
}
