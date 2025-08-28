import { z } from 'zod';


export const StationSchema = z.object({
id: z.string().min(1),
name: z.string().min(1),
route: z.union([z.string(), z.number()]).nullable().optional(),
lat: z.number().nullable(),
lon: z.number().nullable(),
evaluations: z.record(z.string(), z.union([z.string(), z.number(), z.null()])),
meta: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
});


export const StationsSchema = z.array(StationSchema);
export type Stations = z.infer<typeof StationsSchema>;