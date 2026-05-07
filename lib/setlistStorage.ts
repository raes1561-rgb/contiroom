/**
 * 나의 콘티 — localStorage 기반 저장소
 * 서버 없이 브라우저에서 콘티를 저장/불러오기/삭제합니다.
 */

import type { Setlist, SetlistMeta, SetlistItem } from '@/types/setlist';

const STORAGE_KEY = 'contiroom:setlists';

function readAll(): Setlist[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Setlist[];
  } catch {
    return [];
  }
}

function writeAll(lists: Setlist[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

export function getAllSetlists(): Setlist[] {
  return readAll().sort(
    (a, b) => new Date(b.meta.updatedAt).getTime() - new Date(a.meta.updatedAt).getTime()
  );
}

export function getSetlist(id: string): Setlist | undefined {
  return readAll().find((s) => s.meta.id === id);
}

export function saveSetlist(setlist: Setlist): void {
  const all = readAll();
  const idx = all.findIndex((s) => s.meta.id === setlist.meta.id);
  const updated = { ...setlist, meta: { ...setlist.meta, updatedAt: new Date().toISOString() } };
  if (idx >= 0) {
    all[idx] = updated;
  } else {
    all.push(updated);
  }
  writeAll(all);
}

export function deleteSetlist(id: string): void {
  writeAll(readAll().filter((s) => s.meta.id !== id));
}

export function createEmptySetlist(meta: Omit<SetlistMeta, 'id' | 'createdAt' | 'updatedAt'>): Setlist {
  const now = new Date().toISOString();
  return {
    meta: {
      ...meta,
      id: `sl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    },
    items: [],
  };
}

/** 날짜 포맷 (예: 2025. 6. 22.) */
export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
  } catch {
    return iso;
  }
}
