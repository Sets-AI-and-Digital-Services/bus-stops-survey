import type { Station } from "../infra/data/dataset";
import styleConfig from '../config/style.config.json';


type EvalDef = { type: 'enum' | 'numeric'; buckets?: string[]; colors?: string[] };

export function normalizeCategory(
  v: unknown
): 'Excellent' | 'very good' | 'Good' | 'Average' | 'Poor' | 'Unrated' | 'Available' | 'Not available' {
  if (v == null) return 'Unrated';

  // 1) Stringify + trim + collapse spaces
  let s = String(v).trim().replace(/\s+/g, ' ').toLowerCase();

  // 2) If bilingual like "Available / متاح" or "متاح / Available", pick the side with ASCII letters, else left side
  if (s.includes('/')) {
    const [a, b] = s.split('/').map(x => x.trim());
    const ascii = /[a-z]/i;
    s = ascii.test(b) && !ascii.test(a) ? b : a;
  }

  // 3) Normalize obvious variants (slashes, dashes, backslashes)
  s = s.replace(/[\\\-]/g, '').trim(); // "n/a" -> "na", "not-available" -> "not available" (handled below)

  // 4) Exact/regex checks with precedence to avoid substring traps
  // Availability (check NOT first!)
  if (/^not\s*available$/i.test(s) || s === 'غير متاح') return 'Not available';
  if (/^available$/i.test(s) || s === 'متاح') return 'Available';

  // N/A family -> Unrated bucket (or return 'N/A' if your buckets contain it)
  if (s === 'n/a' || s === 'na' || s === 'لا ينطبق') return 'Unrated';

  // Quality scale (canonicalize common typos/synonyms first)
  // Map raw -> canonical
  const map: Record<string, 'Excellent' | 'very good' | 'Good' | 'Average' | 'Poor' | 'Unrated'> = {
    'excellent': 'Excellent',
    'ممتاز': 'Excellent',

    'very good': 'very good',
    'verygood': 'very good',
    'جيد جدًا': 'very good',
    'جيد جدا': 'very good',

    'good': 'Good',
    'optgood': 'Good',   // seen in your data
    'جيد': 'Good',

    'average': 'Average',
    'acceptable': 'Average',
    'متوسط': 'Average',

    'poor': 'Poor',
    'ضعيف': 'Poor',

    'unacceptable': 'Poor', // map to worst color on your 5-step scale
    'غير مقبول': 'Poor',
  };

  // Try direct map first
  if (map[s]) return map[s];

  // Fallbacks by containment (safe order)
  if (s.includes('very good')) return 'very good';
  if (s.includes('excellent')) return 'Excellent';
  if (s.includes('optgood') || s.includes('good')) return 'Good';
  if (s.includes('average') || s.includes('acceptable')) return 'Average';
  if (s.includes('unacceptable') || s.includes('poor')) return 'Poor';

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
