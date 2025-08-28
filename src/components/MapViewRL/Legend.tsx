import { useEffect } from 'react';
import { useFiltersStore } from '../../app/store/filters.store';
import styleConfig from '../../config/style.config.json';

export default function Legend() {
  const axis = useFiltersStore((s) => s.axis);
  const active = useFiltersStore((s) => s.activeBuckets);
  const toggle = useFiltersStore((s) => s.toggleBucket);
  const reset = useFiltersStore((s) => s.resetBuckets);

  // reset selection whenever the axis changes
  useEffect(() => {
    reset();
  }, [axis, reset]);

  const def = (styleConfig as any).evaluations?.[axis];
  if (!def || def.type !== 'enum') return null;

  const buckets: string[] = def.buckets || [];
  const colors: string[] = def.colors || [];

  const isSelected = (b: string) => active == null || active.includes(b);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow-md backdrop-blur">
      <div className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-3">
        Legend: {axis}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => reset()}
          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
            active == null
              ? 'bg-blue-100 text-blue-800 border-blue-300'
              : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'
          }`}
        >
          All
        </button>

        {buckets.map((b, i) => (
          <button
            key={b}
            onClick={() => toggle(b, buckets)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
              isSelected(b)
                ? 'bg-gray-100 dark:bg-gray-700 border-2'
                : 'bg-white dark:bg-gray-800 border'
            }`}
            style={isSelected(b) ? { borderColor: colors[i] } : {}}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: colors[i] }} />
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}
