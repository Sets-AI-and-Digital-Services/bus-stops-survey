export type EvaluationValue = string | number | null;
export type Station = {
id: string;
name: string;
route?: string | number | null;
lat: number | null;
lon: number | null;
evaluations: Record<string, EvaluationValue>;
meta: Record<string, string | number | boolean | null>;
};