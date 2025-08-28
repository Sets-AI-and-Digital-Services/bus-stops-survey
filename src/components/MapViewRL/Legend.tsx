import { useFiltersStore } from '../../app/store/filters.store';
import styleConfig from '../../config/style.config.json';



export default function Legend() {
  const axis = useFiltersStore(s => s.axis);
  const def = (styleConfig as any).evaluations[axis];
  if (!def || def.type !== 'enum') return null;
  return (
    <div>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Legend: {axis}</div>
      <div className="legend">
        {def.buckets.map((b: string, i: number) => (
          <span key={b} className="item">
            <span className="swatch" style={{ background: def.colors[i] }} />
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
