import type { Section, SectionType } from '@/types/song';
import type { LayoutDensity } from './autoLayout';

const PRIORITY: Record<SectionType, number> = {
  'chorus':     1,
  'verse':      2,
  'bridge':     3,
  'pre-chorus': 4,
  'intro':      5,
  'interlude':  6,
  'outro':      7,
  'ending':     8,
};

function dedupeByLabel(sections: Section[]): Section[] {
  const seen = new Set<string>();
  const out: Section[] = [];
  for (const s of sections) {
    if (seen.has(s.label)) continue;
    seen.add(s.label);
    out.push(s);
  }
  return out;
}

export function selectSectionsForDensity(sections: Section[], density: LayoutDensity): Section[] {
  const unique = dedupeByLabel(sections);
  if (density === 'feature') return unique;

  if (density === 'comfortable') {
    return unique.filter((s) =>
      s.type === 'verse' || s.type === 'chorus' ||
      s.type === 'pre-chorus' || s.type === 'bridge' ||
      s.type === 'intro' || s.type === 'outro'
    );
  }
  if (density === 'compact') {
    return unique.filter((s) =>
      s.type === 'verse' || s.type === 'chorus' ||
      s.type === 'pre-chorus' || s.type === 'bridge'
    );
  }
  // ultra-compact
  const filtered = unique.filter((s) => s.type === 'verse' || s.type === 'chorus');
  filtered.sort((a, b) => PRIORITY[a.type] - PRIORITY[b.type]);
  return filtered.slice(0, 2);
}
