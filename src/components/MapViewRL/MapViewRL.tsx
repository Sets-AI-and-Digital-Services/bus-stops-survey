import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import MarkerLayerRL from './MarkerLayerRL';
import FilterPanel from './FilterPanel';
import Legend from './Legend';
import { normalizeCategory } from '../../domain/styling';
import { loadStations, type Station } from '../../infra/data/dataset';
import { useFiltersStore } from '../../app/store/filters.store';

// axis-specific mapping so TVM uses "N/A" instead of "Unrated"
function toBucketForAxis(axis: string, raw: unknown): string {
  const norm = normalizeCategory(raw);
  return axis === '17._ticket_vending_machine_tvm' && norm === 'Unrated' ? 'N/A' : norm;
}

function FitBounds({ data }: { data: Station[] }) {
  const map = useMap();

  const bounds = useMemo(() => {
    const lats = data.map((d) => d.lat).filter((v): v is number => v != null);
    const lons = data.map((d) => d.lon).filter((v): v is number => v != null);
    if (!lats.length || !lons.length) return null;
    return L.latLngBounds(
      [Math.min(...lats), Math.min(...lons)],
      [Math.max(...lats), Math.max(...lons)],
    );
  }, [data]);

  useEffect(() => {
    if (bounds) map.fitBounds(bounds.pad(0.1));
  }, [bounds, map]);
  return null;
}

export default function MapViewRL() {
  const [data, setData] = useState<Station[]>([]);
  const axis = useFiltersStore((s) => s.axis);
  const allowed = useFiltersStore((s) => s.activeBuckets); // null => all

  useEffect(() => {
    void loadStations().then(setData);
  }, []);

  // Compute the *visible* subset here so FitBounds tracks the same selection as the markers
  const visible = useMemo(() => {
    if (allowed == null) return data;
    return data.filter((s) => {
      if (s.lat == null || s.lon == null) return false;
      const b = toBucketForAxis(axis, s.evaluations?.[axis]);
      return allowed.includes(b);
    });
  }, [data, axis, allowed]);

  return (
    <div className="relative w-full h-screen">
      <MapContainer className="w-full h-full" center={[21.4225, 39.8262]} zoom={11} preferCanvas>
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!!data.length && (
          <>
            <MarkerLayerRL data={data} />
            <FitBounds data={visible} />
          </>
        )}
      </MapContainer>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[999]">
        <FilterPanel />
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[999]">
        <Legend />
      </div>
    </div>
  );
}
