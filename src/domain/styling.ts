import type { Station } from "../infra/data/dataset";
import styleConfig from '../config/style.config.json';


type EvalDef = { type: 'enum' | 'numeric'; buckets?: string[]; colors?: string[] };

// in domain/styling.ts (or wherever normalizeCategory lives)
export function normalizeCategory(v: unknown):
  'Excellent' | 'Very Good' | 'Good' | 'Average' | 'Poor' | 'Unacceptable' | 'N/A' | 'Unrated' | 'Available' | 'Not available' | 'Poor' {

  if (v == null) return 'Unrated';
  let s = String(v).trim().replace(/\s+/g, ' ').toLowerCase();

  // bilingual "X / عربي"
  if (s.includes('/')) {
    const [a, b] = s.split('/').map(t => t.trim());
    const ascii = /[a-z]/i;
    s = ascii.test(b) && !ascii.test(a) ? b : a;
  }


  // availability first
  if (/^not\s*available$/i.test(s) || s === 'غير متاح') return 'Not available';
  if (/^available$/i.test(s) || s === 'متاح') return 'Available';

  // N/A family
  if (s === 'n/a' || s === 'na' || s === 'n' || s === 'لا ينطبق') return 'N/A';

  // quality scale (return canonical, capitalized)
  if (s.includes('very good') || s === 'جيد جدًا' || s === 'جيد جدا') return 'Very Good';
  if (s.includes('excellent') || s === 'ممتاز') return 'Excellent';
  if (s.includes('optgood') || s.includes('good') || s === 'جيد') return 'Good';
  if (s.includes('average') || s.includes('acceptable') || s === 'متوسط') return 'Average';
  if (s.includes('unacceptable') || s === 'غير مقبول') return 'Unacceptable';
  if (s.includes('poor') || s === 'ضعيف') return 'Poor';

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
