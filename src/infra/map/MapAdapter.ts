export type MarkerStyle = { color?: string; size?: number; className?: string };
export type Marker = { id: string; lat: number; lon: number; title?: string; style: MarkerStyle };


export interface MapAdapter {
init: (el: HTMLElement, opts?: { center?: [number, number]; zoom?: number }) => void;
setMarkers: (features: Marker[]) => void;
fitTo: (bbox: [[number, number], [number, number]]) => void;
destroy: () => void;
}