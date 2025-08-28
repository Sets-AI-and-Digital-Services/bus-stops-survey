// src/infra/data/dataset.ts
import { z } from 'zod';

export const StationSchema = z.object({
  id: z.string(), name: z.string(),
  route: z.union([z.string(), z.number()]).nullable().optional(),
  lat: z.number().nullable(), lon: z.number().nullable(),
  evaluations: z.record(z.string(), z.union([z.string(), z.number(), z.null()])),
  meta: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
});
export const StationsSchema = z.array(StationSchema);
export type Station = z.infer<typeof StationSchema>;

export async function loadStations() {
  const url = `${import.meta.env.BASE_URL}data/stations.json`;  // <-- base-safe
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Failed to fetch ${url}:`, res.status, res.statusText);
    return [];
  }
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    const parsed = StationsSchema.safeParse(json);
    if (!parsed.success) {
      console.error('Invalid stations.json', parsed.error.flatten());
      return [];
    }
    return parsed.data;
  } catch {
    console.error('stations.json is not valid JSON. Response was:', text.slice(0, 200));
    return [];
  }
}
