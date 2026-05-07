/**
 * 한국어 검색 유틸리티
 *
 *  - 부분 문자열 매칭
 *  - 초성 매칭: "ㅇㅎ" → "은혜의 빛"
 *  - 영어 케이스 무시
 *
 * 검색 결과는 점수 기반으로 정렬되어 prefix > 부분일치 > 초성 순으로 우선됩니다.
 */

import type { Song } from '@/types/song';

const CHOSUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ',
                 'ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

const HANGUL_BASE = 0xAC00;
const HANGUL_END  = 0xD7A3;

/** 한글 음절을 초성으로 변환. 한글이 아니면 원문자 반환. */
function toChosung(char: string): string {
  const code = char.charCodeAt(0);
  if (code < HANGUL_BASE || code > HANGUL_END) return char;
  const offset = code - HANGUL_BASE;
  const choIdx = Math.floor(offset / (21 * 28));
  return CHOSUNG[choIdx];
}

/** 문자열 전체를 초성으로 변환 (한글만, 다른 문자는 그대로 유지). */
export function stringToChosung(str: string): string {
  return Array.from(str).map(toChosung).join('');
}

/** 검색어가 모두 초성 문자(자음)로만 이루어졌는지 검사. */
function isAllChosung(query: string): boolean {
  if (!query) return false;
  return Array.from(query).every((c) => CHOSUNG.includes(c));
}

export interface SearchHit<T> {
  item: T;
  score: number;
}

/**
 * 곡 목록에서 검색어와 일치하는 곡들을 점수 순으로 반환.
 *
 *  점수:
 *    100 = title 이 검색어로 시작
 *     80 = title 이 검색어를 포함
 *     60 = title 의 초성이 검색어로 시작 (검색어가 자음일 때)
 *     40 = title 의 초성이 검색어를 포함
 *     20 = author / tag 일치
 */
export function searchSongs(songs: Song[], rawQuery: string): SearchHit<Song>[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const queryIsChosung = isAllChosung(rawQuery.trim());
  const hits: SearchHit<Song>[] = [];

  for (const song of songs) {
    const title = song.title.toLowerCase();
    const titleChosung = stringToChosung(song.title);
    const author = (song.author ?? '').toLowerCase();
    const tags = (song.tags ?? []).map((t) => t.toLowerCase());

    let score = 0;

    if (title.startsWith(query)) {
      score = Math.max(score, 100);
    } else if (title.includes(query)) {
      score = Math.max(score, 80);
    }

    if (queryIsChosung) {
      if (titleChosung.startsWith(rawQuery.trim())) {
        score = Math.max(score, 60);
      } else if (titleChosung.includes(rawQuery.trim())) {
        score = Math.max(score, 40);
      }
    }

    if (author && author.includes(query)) {
      score = Math.max(score, 20);
    }

    for (const tag of tags) {
      if (tag.includes(query)) {
        score = Math.max(score, 20);
        break;
      }
    }

    if (score > 0) {
      hits.push({ item: song, score });
    }
  }

  hits.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'ko'));
  return hits;
}

/** Highlight 매칭 위치를 위해 검색어가 title 안의 어디에 있는지 반환. */
export function findMatchRange(title: string, query: string): [number, number] | null {
  const t = title.toLowerCase();
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const idx = t.indexOf(q);
  if (idx >= 0) return [idx, idx + q.length];
  return null;
}
