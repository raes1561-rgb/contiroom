/**
 * 코드 전조(Transpose) 유틸리티
 *
 *  - 코드 심볼 파싱: C, Em7, Dm7/G, F#, Bb, Cadd9, Csus4, D/F# 등
 *  - 타겟 키에 맞춰 # / ♭ 표기 자동 선택
 */

const SHARP_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_SCALE  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const SHARP_KEYS = new Set(['G', 'D', 'A', 'E', 'B', 'F#', 'C#',
                            'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m']);
const FLAT_KEYS  = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb',
                            'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm', 'Abm']);

const NOTE_TO_SEMITONE: Record<string, number> = {
  'C':  0, 'B#': 0,
  'C#': 1, 'Db': 1,
  'D':  2,
  'D#': 3, 'Eb': 3,
  'E':  4, 'Fb': 4,
  'F':  5, 'E#': 5,
  'F#': 6, 'Gb': 6,
  'G':  7,
  'G#': 8, 'Ab': 8,
  'A':  9,
  'A#':10, 'Bb':10,
  'B': 11, 'Cb':11,
};

export function parseChord(symbol: string): {
  root: string;
  quality: string;
  bass?: string;
} | null {
  const trimmed = symbol.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^([A-G][#b]?)([^/]*)(?:\/([A-G][#b]?))?$/);
  if (!match) return null;
  const [, root, quality, bass] = match;
  if (NOTE_TO_SEMITONE[root] === undefined) return null;
  if (bass !== undefined && NOTE_TO_SEMITONE[bass] === undefined) return null;
  return { root, quality: quality ?? '', bass };
}

function spellNoteForKey(semitone: number, targetKey: string): string {
  const idx = ((semitone % 12) + 12) % 12;
  if (FLAT_KEYS.has(targetKey)) return FLAT_SCALE[idx];
  if (SHARP_KEYS.has(targetKey)) return SHARP_SCALE[idx];
  return SHARP_SCALE[idx];
}

function stripMinor(key: string): string {
  return key.endsWith('m') ? key.slice(0, -1) : key;
}

export function semitoneDistance(fromKey: string, toKey: string): number {
  const fromRoot = stripMinor(fromKey);
  const toRoot   = stripMinor(toKey);
  const from = NOTE_TO_SEMITONE[fromRoot];
  const to   = NOTE_TO_SEMITONE[toRoot];
  if (from === undefined || to === undefined) return 0;
  return ((to - from) % 12 + 12) % 12;
}

export function transposeChord(symbol: string, semitones: number, targetKey: string): string {
  const parsed = parseChord(symbol);
  if (!parsed) return symbol;
  const rootSemi = NOTE_TO_SEMITONE[parsed.root];
  const newRoot  = spellNoteForKey(rootSemi + semitones, targetKey);
  let result = newRoot + parsed.quality;
  if (parsed.bass) {
    const bassSemi = NOTE_TO_SEMITONE[parsed.bass];
    result += '/' + spellNoteForKey(bassSemi + semitones, targetKey);
  }
  return result;
}

export function transposeChordByKey(symbol: string, fromKey: string, toKey: string): string {
  const semitones = semitoneDistance(fromKey, toKey);
  return transposeChord(symbol, semitones, toKey);
}
