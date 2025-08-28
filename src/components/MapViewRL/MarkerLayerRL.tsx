import { Fragment, useMemo, useRef } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import type { Station } from '../../infra/data/dataset';
import { useFiltersStore } from '../../app/store/filters.store';
import { colorBy, normalizeCategory } from '../../domain/styling';
import stationSvgRaw from '../../assets/icons/on hover-cropped.svg?raw'; // RAW svg text

function toBucketForAxis(axis: string, raw: unknown): string {
  const norm = normalizeCategory(raw);
  return axis === '17._ticket_vending_machine_tvm' && norm === 'Unrated' ? 'N/A' : norm;
}

function markerKey(s: Station) {
  const id = String(s.id ?? '').trim().toLowerCase();
  const lat = s.lat != null ? s.lat.toFixed(6) : 'x';
  const lon = s.lon != null ? s.lon.toFixed(6) : 'x';
  return `${id}|${lat}|${lon}`;
}

// Normalize width/height once so we can control size via iconSize
const baseSvg = stationSvgRaw
  // remove any hard-coded width/height from the file so our iconSize rules
  .replace(/width="[^"]*"/i, '')
  .replace(/height="[^"]*"/i, '')
  // make sure the root svg is block-level (prevents weird baseline gaps)
  .replace('<svg', '<svg style="display:block"');

export default function MarkerLayerRL({ data }: { data: Station[] }) {
  const axis = useFiltersStore((s) => s.axis);
  const allowed = useFiltersStore((s) => s.activeBuckets); // null => all

  // cache of color -> DivIcon so we don’t recreate icons per marker
  const iconCacheRef = useRef(new Map<string, L.DivIcon>());

  const getIconForColor = (color: string) => {
    const cache = iconCacheRef.current;
    let icon = cache.get(color);
    if (!icon) {
      // Replace the main body color in your SVG (#f2ab04) with the dynamic color
      const tintedSvg = baseSvg.replace(/#f2ab04/gi, color);
      icon = L.divIcon({
        className: 'marker-svg', // optional class for extra CSS if needed
        html: tintedSvg,
        iconSize: [25, 25],      // tweak size as you like
        iconAnchor: [11, 11],    // center the icon
      });
      cache.set(color, icon);
    }
    return icon;
  };

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
      if (seen.has(key)) continue; // de-dupe identical station+coords
      seen.add(key);

      out.push({ s, key, color: colorBy(s, axis) });
    }
    return out;
  }, [data, axis, allowed]);

  return (
    <Fragment>
      {points.map(({ s, key, color }) => (
        <Marker
          key={key}
          position={[s.lat as number, s.lon as number]}
          icon={getIconForColor(color)}
        >
          <Tooltip>{s.name}</Tooltip>
        </Marker>
      ))}
    </Fragment>
  );
}
