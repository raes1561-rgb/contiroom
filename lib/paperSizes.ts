/**
 * Paper sizes and view mode definitions for contiroom
 */

export type PaperSize =
  | 'a4-portrait'
  | 'a4-landscape'
  | 'a3-portrait'
  | 'a3-landscape'
  | 'ppt-full'       // 16:9 PPT — 전체 악보
  | 'ppt-lyrics';    // 16:9 PPT — 가사 슬라이드

export type ViewMode = 'sheet' | 'slideshow-full' | 'slideshow-lyrics';

export interface PaperDef {
  label: string;
  sublabel: string;
  /** CSS width × height in mm for print-like rendering. We scale to fit screen. */
  widthMm: number;
  heightMm: number;
  /** Aspect ratio = width / height */
  aspect: number;
  icon: string;
}

export const PAPER_SIZES: Record<PaperSize, PaperDef> = {
  'a4-portrait': {
    label: 'A4',
    sublabel: '세로',
    widthMm: 210,
    heightMm: 297,
    aspect: 210 / 297,
    icon: '▯',
  },
  'a4-landscape': {
    label: 'A4',
    sublabel: '가로',
    widthMm: 297,
    heightMm: 210,
    aspect: 297 / 210,
    icon: '▭',
  },
  'a3-portrait': {
    label: 'A3',
    sublabel: '세로',
    widthMm: 297,
    heightMm: 420,
    aspect: 297 / 420,
    icon: '▯',
  },
  'a3-landscape': {
    label: 'A3',
    sublabel: '가로',
    widthMm: 420,
    heightMm: 297,
    aspect: 420 / 297,
    icon: '▭',
  },
  'ppt-full': {
    label: 'PPT',
    sublabel: '악보전체',
    widthMm: 338,   // 16:9 at equivalent dpi
    heightMm: 190,
    aspect: 16 / 9,
    icon: '⬛',
  },
  'ppt-lyrics': {
    label: 'PPT',
    sublabel: '가사',
    widthMm: 338,
    heightMm: 190,
    aspect: 16 / 9,
    icon: '🎵',
  },
};

/** Section types excluded from lyrics PPT mode */
export const LYRICS_PPT_EXCLUDE: Set<string> = new Set([
  'intro', 'interlude', 'outro', 'ending',
]);
