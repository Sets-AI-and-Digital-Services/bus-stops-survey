import type { Station } from '../infra/data/dataset';
import { normalizeCategory } from './styling';

export type ActiveFilters = {
  selected: Record<string, string[]>; // target -> ['Good'] or []
};

export function applyFilters(data: Station[], f: ActiveFilters): Station[] {
  return data.filter((s) => {
    for (const [axis, values] of Object.entries(f.selected)) {
      if (values.length === 0) continue; // All
      const normalized = normalizeCategory(s.evaluations?.[axis]);
      if (!values.includes(normalized)) return false;
    }
    return true;
  });
}
