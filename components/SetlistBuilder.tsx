'use client';

import type { Song } from '@/types/song';
import type { SetlistItem } from '@/types/setlist';

interface Props {
  songs: Song[];
  items: SetlistItem[];
  onAdd: (songId: string) => void;
  onRemove: (itemId: string) => void;
  onMove: (itemId: string, direction: 'up' | 'down') => void;
  onMemoChange: (itemId: string, memo: string) => void;
}

export default function SetlistBuilder({ songs, items, onAdd, onRemove, onMove, onMemoChange }: Props) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <h2 className="text-[13px] font-bold text-neutral-900">Setlist</h2>
        <span className="text-[11px] text-neutral-400">
          {items.length} {items.length === 1 ? 'song' : 'songs'}
        </span>
      </div>

      {/* Items */}
      <div className="px-3 py-2">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-3 py-5 text-center">
            <p className="text-[12px] text-neutral-500">Add songs from below to build your setlist.</p>
          </div>
        ) : (
          <ol className="space-y-1.5">
            {items.map((item, idx) => {
              const song = songs.find((s) => s.id === item.songId);
              if (!song) return null;
              return (
                <li key={item.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="flex-1 truncate text-[13px] font-semibold text-neutral-900">
                      {song.title}
                    </span>
                    <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                      {item.key ?? song.currentKey}
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onMove(item.id, 'up')}
                      disabled={idx === 0}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500 text-[11px] transition hover:border-neutral-400 disabled:opacity-30"
                    >↑</button>
                    <button
                      type="button"
                      onClick={() => onMove(item.id, 'down')}
                      disabled={idx === items.length - 1}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500 text-[11px] transition hover:border-neutral-400 disabled:opacity-30"
                    >↓</button>
                    <input
                      type="text"
                      value={item.memo ?? ''}
                      placeholder="note (e.g. repeat chorus)"
                      onChange={(e) => onMemoChange(item.id, e.target.value)}
                      className="min-w-0 flex-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-400 text-[11px] transition hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                    >×</button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* Add songs */}
      <div className="border-t border-neutral-100 px-4 py-3">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
          Add to setlist
        </div>
        <div className="flex flex-wrap gap-1.5">
          {songs.map((song) => (
            <button
              key={song.id}
              type="button"
              onClick={() => onAdd(song.id)}
              className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[12px] font-medium text-neutral-700 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
            >
              <span className="text-neutral-400 text-[10px]">+</span>
              {song.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
