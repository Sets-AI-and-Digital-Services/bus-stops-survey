import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import MarkerLayerRL from './MarkerLayerRL';
import FilterPanel from './FilterPanel';
import Legend from './Legend';

import { loadStations, type Station } from '../../infra/data/dataset';



function FitBounds({ data }: { data: Station[] }) {
  const map = useMap();
  const bounds = useMemo(() => {
    const lats = data.map(d => d.lat).filter((v): v is number => v != null);
    const lons = data.map(d => d.lon).filter((v): v is number => v != null);
    if (!lats.length || !lons.length) return null;
    return L.latLngBounds(
      [Math.min(...lats), Math.min(...lons)],
      [Math.max(...lats), Math.max(...lons)]
    );
  }, [data]);

  useEffect(() => { if (bounds) map.fitBounds(bounds.pad(0.1)); }, [bounds, map]);
  return null;
}

export default function MapViewRL() {
  const [data, setData] = useState<Station[]>([]);
  useEffect(() => { void loadStations().then(setData); }, []);

  return (
    <div className="map-shell">
      <MapContainer center={[21.4225, 39.8262]} zoom={11} className="map-full" preferCanvas>
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!!data.length && <>
          <MarkerLayerRL data={data} />
          <FitBounds data={data} />
        </>}
      </MapContainer>
      <div className="panel top"><FilterPanel /></div>
      <div className="panel bottom"><Legend /></div>
    </div>
  );
}
