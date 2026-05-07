'use client';

import { useEffect, useState } from 'react';
import type { Setlist } from '@/types/setlist';
import { getAllSetlists, deleteSetlist, formatDate } from '@/lib/setlistStorage';
import { SAMPLE_SONGS } from '@/lib/sampleData';

interface MySetlistsProps {
  onOpen: (setlist: Setlist) => void;
  refreshKey?: number;
}

function getSongTitle(songId: string): string {
  return SAMPLE_SONGS.find((s) => s.id === songId)?.title ?? songId;
}

export default function MySetlists({ onOpen, refreshKey = 0 }: MySetlistsProps) {
  const [lists, setLists] = useState<Setlist[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    setLists(getAllSetlists());
  }, [refreshKey]);

  function handleDelete(id: string) {
    deleteSetlist(id);
    setLists(getAllSetlists());
    setConfirmDelete(null);
  }

  if (lists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white py-14 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-100 bg-neutral-50 text-3xl">
          📋
        </div>
        <p className="text-[15px] font-semibold text-neutral-700">저장된 콘티가 없어요</p>
        <p className="mt-1.5 text-[13px] text-neutral-400">
          위의 "새 콘티" 버튼으로 첫 콘티를 시작해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {lists.map((sl) => {
        const { meta, items } = sl;
        return (
          <div
            key={meta.id}
            className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.10)]"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-semibold text-neutral-400">
                  {formatDate(meta.date)}
                </span>
                {meta.service && (
                  <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                    {meta.service}
                  </span>
                )}
                <h3 className="mt-1 text-[15px] font-bold leading-tight text-neutral-900 truncate">
                  {meta.title}
                </h3>
              </div>
            </div>

            {/* Church / Leader */}
            {(meta.church || meta.leader) && (
              <div className="mt-1.5 flex flex-wrap gap-3 text-[11px] text-neutral-500">
                {meta.church && <span>⛪ {meta.church}</span>}
                {meta.leader && <span>👤 {meta.leader}</span>}
              </div>
            )}

            {/* Song list */}
            <div className="mt-3 flex-1">
              {items.length === 0 ? (
                <p className="text-[11px] italic text-neutral-400">곡이 없어요</p>
              ) : (
                <div className="space-y-0.5">
                  {items.slice(0, 4).map((item, i) => (
                    <div key={item.id} className="flex items-center gap-2 text-[12px] text-neutral-700">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[9px] font-bold text-neutral-500">
                        {i + 1}
                      </span>
                      <span className="truncate">{getSongTitle(item.songId)}</span>
                      {item.key && (
                        <span className="ml-auto shrink-0 text-[10px] font-bold text-indigo-500">{item.key}</span>
                      )}
                    </div>
                  ))}
                  {items.length > 4 && (
                    <div className="text-[11px] text-neutral-400">외 {items.length - 4}곡 더...</div>
                  )}
                </div>
              )}
            </div>

            {/* Notes */}
            {meta.notes && (
              <p className="mt-2 line-clamp-1 text-[11px] italic text-neutral-400">
                "{meta.notes}"
              </p>
            )}

            {/* Actions */}
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpen(sl)}
                className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-[13px] font-bold text-white transition hover:bg-neutral-700"
              >
                열기 →
              </button>

              {confirmDelete === meta.id ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleDelete(meta.id)}
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] font-bold text-red-600 transition hover:bg-red-100"
                  >
                    삭제
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(null)}
                    className="rounded-xl border border-neutral-200 px-3 py-2.5 text-[12px] text-neutral-500 transition hover:bg-neutral-50"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(meta.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-neutral-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  title="삭제"
                >
                  🗑
                </button>
              )}
            </div>

            <div className="mt-2 text-[10px] text-neutral-300">
              마지막 수정: {formatDate(meta.updatedAt)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
