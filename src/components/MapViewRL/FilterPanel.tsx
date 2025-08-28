import { useFiltersStore } from '../../app/store/filters.store';
import styleConfig from '../../config/style.config.json';

export default function FilterPanel() {
  const axis = useFiltersStore((s) => s.axis);
  const setAxis = useFiltersStore((s) => s.setAxis);

  const evals = Object.entries((styleConfig as any).evaluations || {}); 
  console.log(evals);

  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span>Color by:</span>
      <select value={axis} onChange={(e) => setAxis(e.target.value)} style={{ padding: '4px 8px' }}>
        {evals.map(([k, _]) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
    </label>
  );
}
