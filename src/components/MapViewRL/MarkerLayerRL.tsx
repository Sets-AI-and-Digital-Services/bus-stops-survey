import { Fragment, useMemo } from 'react';
import { CircleMarker, Tooltip } from 'react-leaflet';
import type { Station } from '../../infra/data/dataset';
import { useFiltersStore } from '../../app/store/filters.store';
import { colorBy, normalizeCategory } from '../../domain/styling';

interface Props {
  data: Station[];
}

function toBucketForAxis(axis: string, raw: unknown): string {
  const norm = normalizeCategory(raw);
  return axis === '17._ticket_vending_machine_tvm' && norm === 'Unrated' ? 'N/A' : norm;
}

// stable unique key builder for React
function markerKey(s: Station) {
  // trim+lower id to collapse minor differences; include rounded coords to separate distinct points
  const id = String(s.id ?? '').trim().toLowerCase();
  const lat = s.lat != null ? s.lat.toFixed(6) : 'x';
  const lon = s.lon != null ? s.lon.toFixed(6) : 'x';
  return `${id}|${lat}|${lon}`;
}

export default function MarkerLayerRL({ data }: Props) {
  const axis = useFiltersStore((s) => s.axis);
  const allowed = useFiltersStore((s) => s.activeBuckets); // null => all

  const points = useMemo(() => {
    const seen = new Set<string>();
    const out: { s: Station; key: string; color: string }[] = [];

    for (const s of data) {
      if (s.lat == null || s.lon == null) continue;

      // legend filter
      if (allowed !== null) {
        const bucket = toBucketForAxis(axis, s.evaluations?.[axis]);
        if (!allowed.includes(bucket)) continue;
      }

      const key = markerKey(s);
      if (seen.has(key)) continue;  // de-dupe identical station+coords
      seen.add(key);

      out.push({ s, key, color: colorBy(s, axis) });
    }
    return out;
  }, [data, axis, allowed]);

  return (
    <Fragment>
      {points.map(({ s, key, color }) => (
        <CircleMarker
          key={key}
          center={[s.lat as number, s.lon as number]}
          pathOptions={{ color, fillColor: color, fillOpacity: 0.9, weight: 1 }}
          radius={6}
        >
          <Tooltip>{s.name}</Tooltip>
        </CircleMarker>
      ))}
    </Fragment>
  );
}
