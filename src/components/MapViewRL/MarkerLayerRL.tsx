import { Fragment, useMemo } from 'react';
import { CircleMarker, Tooltip } from 'react-leaflet';
import type { Station } from '../../infra/data/dataset';
import { useFiltersStore } from '../../app/store/filters.store';
import { colorBy } from '../../domain/styling';

interface Props {
  data: Station[];
}

export default function MarkerLayerRL({ data }: Props) {
  const axis = useFiltersStore((s) => s.axis);
  const points = useMemo(() => data.filter((s) => s.lat != null && s.lon != null), [data]);

  return (
    <Fragment>
      {points.map((s) => {
        const col = colorBy(s, axis);
        return (
          <CircleMarker
            key={s.id}
            center={[s.lat as number, s.lon as number]}
            pathOptions={{ color: col, fillColor: col, fillOpacity: 0.9, weight: 1 }}
            radius={6}
          >
            <Tooltip>{s.name}</Tooltip>
          </CircleMarker>
        );
      })}
    </Fragment>
  );
}
