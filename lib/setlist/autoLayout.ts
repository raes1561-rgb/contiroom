/**
 * 콘티 자동 레이아웃
 *
 * 한 장의 A4 안에 곡들이 적절한 크기로 자동 배치되도록 결정합니다.
 *
 *   1곡        → 1열, feature
 *   2곡        → 1열 × 2행, feature
 *   3-4곡      → 2열 × 2행, comfortable
 *   5-6곡      → 2열 × 3행, compact
 *   7-8곡      → 2열 × 4행, ultra-compact
 *   9곡 이상   → 페이지 분할 안내
 */

export type LayoutDensity = 'feature' | 'comfortable' | 'compact' | 'ultra-compact';

export interface SetlistLayout {
  columns: number;
  rows: number;
  density: LayoutDensity;
  overflow: boolean;
  recommendedPerPage: number;
  totalPages: number;
}

export function computeSetlistLayout(songCount: number): SetlistLayout {
  if (songCount <= 0) {
    return { columns: 1, rows: 1, density: 'feature', overflow: false, recommendedPerPage: 1, totalPages: 0 };
  }
  if (songCount === 1) {
    return { columns: 1, rows: 1, density: 'feature', overflow: false, recommendedPerPage: 1, totalPages: 1 };
  }
  if (songCount === 2) {
    return { columns: 1, rows: 2, density: 'feature', overflow: false, recommendedPerPage: 2, totalPages: 1 };
  }
  if (songCount <= 4) {
    return { columns: 2, rows: 2, density: 'comfortable', overflow: false, recommendedPerPage: 4, totalPages: 1 };
  }
  if (songCount <= 6) {
    return { columns: 2, rows: 3, density: 'compact', overflow: false, recommendedPerPage: 6, totalPages: 1 };
  }
  if (songCount <= 8) {
    return { columns: 2, rows: 4, density: 'ultra-compact', overflow: false, recommendedPerPage: 8, totalPages: 1 };
  }
  const recommendedPerPage = 8;
  return {
    columns: 2,
    rows: 4,
    density: 'ultra-compact',
    overflow: true,
    recommendedPerPage,
    totalPages: Math.ceil(songCount / recommendedPerPage),
  };
}
