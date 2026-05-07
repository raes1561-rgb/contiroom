'use client';

import { useState } from 'react';

interface ExportButtonsProps {
  onStartSlideshow?: (mode: 'full' | 'lyrics') => void;
  onStartSetlistShow?: () => void;
  /** 'sheet' = single song mode, 'setlist' = setlist mode */
  context?: 'sheet' | 'setlist';
}

export default function ExportButtons({
  onStartSlideshow,
  onStartSetlistShow,
  context = 'sheet',
}: ExportButtonsProps) {
  const [msg, setMsg] = useState<string | null>(null);

  function trigger(label: string) {
    setMsg(`${label} — coming soon`);
    setTimeout(() => setMsg(null), 2000);
  }

  return (
    <div className="space-y-3">
      {/* ── Slideshow panel ── */}
      {(onStartSlideshow || onStartSetlistShow) && (
        <div className="rounded-2xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-4 py-3">
            <h2 className="text-[13px] font-bold text-neutral-900">Slideshow</h2>
          </div>
          <div className="space-y-2 p-3">

            {/* Setlist mode — 예배 시작 */}
            {context === 'setlist' && onStartSetlistShow && (
              <button
                type="button"
                onClick={onStartSetlistShow}
                className="flex w-full items-center justify-between gap-3 rounded-xl bg-neutral-900 px-4 py-3 text-left transition hover:bg-neutral-800 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-lg">▶</span>
                  <div>
                    <div className="text-[13px] font-bold text-white">예배 시작</div>
                    <div className="text-[10px] text-white/50">콘티 전체 · 곡별 슬라이드</div>
                  </div>
                </div>
                <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-semibold text-white/60">
                  Setlist
                </span>
              </button>
            )}

            {/* Single-song modes */}
            {context === 'sheet' && onStartSlideshow && (
              <>
                <button
                  type="button"
                  onClick={() => onStartSlideshow('full')}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-neutral-900 px-4 py-3 text-left transition hover:bg-neutral-800 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-lg">▶</span>
                    <div>
                      <div className="text-[13px] font-bold text-white">예배 시작</div>
                      <div className="text-[10px] text-white/50">전체 악보 풀스크린</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onStartSlideshow('lyrics')}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-left transition hover:bg-indigo-100 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-base">🎵</span>
                    <div>
                      <div className="text-[13px] font-bold text-indigo-900">가사 PPT</div>
                      <div className="text-[10px] text-indigo-500">섹션별 슬라이드 · 넘기면서 보기</div>
                    </div>
                  </div>
                  <span className="rounded-md bg-indigo-100 px-2 py-1 text-[10px] font-semibold text-indigo-600">16:9</span>
                </button>
              </>
            )}
          </div>
          <div className="border-t border-neutral-100 px-4 py-2 text-[10px] text-neutral-400">
            ← → 방향키 · 스와이프 이동 · Esc 종료
          </div>
        </div>
      )}

      {/* ── Export ── */}
      <div className="rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-4 py-3">
          <h2 className="text-[13px] font-bold text-neutral-900">Export</h2>
        </div>
        <div className="grid grid-cols-3 gap-2 p-3">
          {[
            { label: 'Image', sub: '.PNG', icon: '🖼' },
            { label: 'PDF',   sub: '.PDF', icon: '📄' },
            { label: 'Share', sub: 'Link', icon: '🔗' },
          ].map(({ label, sub, icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => trigger(label)}
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-neutral-200 bg-white py-3 text-center transition hover:border-neutral-800 hover:bg-neutral-900"
            >
              <span className="text-lg">{icon}</span>
              <span className="text-[12px] font-semibold text-neutral-900 group-hover:text-white">{label}</span>
              <span className="text-[10px] text-neutral-400 group-hover:text-white/50">{sub}</span>
            </button>
          ))}
        </div>
        <div className="min-h-[26px] px-4 pb-3 text-center text-[11px] text-amber-600">
          {msg ?? ''}
        </div>
      </div>
    </div>
  );
}
