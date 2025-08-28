import type { Station } from "../infra/data/dataset";
import styleConfig from '../config/style.config.json';


type EvalDef = { type: 'enum' | 'numeric'; buckets?: string[]; colors?: string[] };

function normalizeCategory(v: unknown): 'Excellent'|'very good'|'Good'|'Average'|'Poor'|'Unrated' {
  const s = String(v ?? '').toLowerCase();
  if (!s) return 'Unrated';
  if (s.includes('very good')) return 'very good';
  if (s.includes('excellent')) return 'Excellent';
  if (s.includes('good')) return 'Good';
  if (s.includes('average') || s.includes('acceptable')) return 'Average';
  if (s.includes('poor') || s.includes('unacceptable')) return 'Poor';
  if (s.includes('n/a') || s.includes('not available')) return 'Unrated';
  return 'Unrated';
}

export function colorBy(station: Station, axis: string): string {
  const cfg: Record<string, EvalDef> = (styleConfig as any).evaluations || {};
  const def = cfg[axis];
  if (!def) return '#888';
  const v = station.evaluations[axis];
  if (def.type === 'enum') {
    const buckets = def.buckets || [];
    const normalized = normalizeCategory(v);
    const idx = buckets.findIndex(b => b.toLowerCase() === normalized.toLowerCase());
    const colors = def.colors || [];
    return colors[idx >= 0 ? idx : colors.length - 1] || '#888';
  }
  return '#888';
}
