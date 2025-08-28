import { useEffect } from 'react';
import { useFiltersStore } from '../../app/store/filters.store';
import styleConfig from '../../config/style.config.json';

export default function Legend() {
  const axis = useFiltersStore(s => s.axis);
  const active = useFiltersStore(s => s.activeBuckets);
  const toggle = useFiltersStore(s => s.toggleBucket);
  const reset = useFiltersStore(s => s.resetBuckets);

  // reset selection whenever the axis changes
  useEffect(() => { reset(); }, [axis, reset]);

  const def = (styleConfig as any).evaluations?.[axis];
  if (!def || def.type !== 'enum') return null;

  const buckets: string[] = def.buckets || [];
  const colors: string[] = def.colors || [];

  const isSelected = (b: string) => active == null || active.includes(b);

  return (
    <div>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        Legend: {def.label ?? axis}
      </div>

      <div className="legend" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {/* All */}
        <button
          type="button"
          onClick={() => reset()}
          style={{
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 6,
            border: '1px solid #ccc',
            background: active == null ? '#eee' : '#fff',
            fontWeight: active == null ? 600 : 400,
          }}
          title="Show all buckets"
        >
          All
        </button>

        {buckets.map((b: string, i: number) => (
          <button
            type="button"
            key={b}
            onClick={() => toggle(b, buckets)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 6,
              border: isSelected(b) ? `2px solid ${colors[i]}` : '1px solid #ccc',
              background: isSelected(b) ? '#f7f7f7' : '#fff',
              fontWeight: isSelected(b) ? 600 : 400,
            }}
            title={`Toggle: ${b}`}
          >
            <span
              style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 12, background: colors[i] }}
            />
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}
