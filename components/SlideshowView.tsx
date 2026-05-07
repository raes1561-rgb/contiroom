'use client';

/**
 * SlideshowView
 * ─────────────────────────────────────────────────────────────────────────
 * 세 가지 모드:
 *
 *  'full'    — 단일 곡 전체 악보를 16:9 풀스크린
 *  'lyrics'  — 단일 곡: Intro/Interlude/Outro 제외, 섹션 한 장씩
 *  'setlist' — 콘티 전체: 곡 → 섹션 → 라인 순으로 넘기기
 *              (태블릿으로 예배 중 옆으로 넘기면서 연주)
 *
 * 키보드: ← → (Space) 이동 / Esc 종료
 * 터치: 좌우 스와이프
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Song } from '@/types/song';
import ScoreRenderer from './ScoreRenderer';
import { LYRICS_PPT_EXCLUDE } from '@/lib/paperSizes';

// ── Types ──────────────────────────────────────────────────────────────────

type SingleMode = 'full' | 'lyrics';

interface SingleProps {
  mode: SingleMode;
  song: Song;
  songs?: never;
  onClose: () => void;
}

interface SetlistProps {
  mode: 'setlist';
  song?: never;
  songs: Song[];
  onClose: () => void;
}

type Props = SingleProps | SetlistProps;

// ── Slide descriptors ──────────────────────────────────────────────────────

type Slide =
  | { kind: 'full-song'; songIdx: number }
  | { kind: 'section-line'; songIdx: number; sectionIdx: number; lineIdx: number };

function buildSlides(mode: 'full' | 'lyrics' | 'setlist', songs: Song[]): Slide[] {
  const slides: Slide[] = [];

  songs.forEach((song, si) => {
    if (mode === 'full') {
      slides.push({ kind: 'full-song', songIdx: si });
    } else {
      // 'lyrics' or 'setlist' — section-by-line
      song.sections.forEach((section, secIdx) => {
        if (LYRICS_PPT_EXCLUDE.has(section.type)) return;
        section.lines.forEach((_, lineIdx) => {
          slides.push({ kind: 'section-line', songIdx: si, sectionIdx: secIdx, lineIdx });
        });
      });
    }
  });

  return slides.length ? slides : songs.map((_, si) => ({ kind: 'full-song', songIdx: si }));
}

// ── Main component ─────────────────────────────────────────────────────────

export default function SlideshowView(props: Props) {
  const { onClose } = props;
  const isSetlist = props.mode === 'setlist';
  const songs: Song[] = isSetlist
    ? (props as SetlistProps).songs
    : [(props as SingleProps).song];
  const mode = props.mode;

  const slides = buildSlides(mode, songs);
  const [idx, setIdx] = useState(0);
  const total = slides.length;

  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIdx((i) => Math.min(total - 1, i + 1)), [total]);

  // Keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, next, prev]);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    touchStartX.current = null;
  }

  const slide = slides[idx];
  const song = songs[slide.songIdx];

  // Figure out which song index we're on (for setlist progress display)
  const songIdx = slide.songIdx;
  const prevSongIdx = idx > 0 ? slides[idx - 1].songIdx : -1;
  const isSongTransition = songIdx !== prevSongIdx;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-neutral-950 select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Song transition label (setlist mode) ── */}
      {isSetlist && (
        <div className="shrink-0 flex items-center justify-between border-b border-white/10 bg-neutral-900 px-5 py-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Setlist
            </span>
            {songs.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  // Jump to first slide of that song
                  const firstIdx = slides.findIndex((sl) => sl.songIdx === i);
                  if (firstIdx >= 0) setIdx(firstIdx);
                }}
                className={[
                  'rounded-full px-3 py-1 text-[12px] font-semibold transition',
                  songIdx === i
                    ? 'bg-white text-neutral-900'
                    : 'text-white/50 hover:text-white/80',
                ].join(' ')}
              >
                {i + 1}. {s.title}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-[11px] text-white/60 transition hover:text-white"
          >
            ✕ Exit
          </button>
        </div>
      )}

      {/* ── Slide area ── */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-6 md:p-10">

        {/* 16:9 card */}
        <div
          className="relative w-full overflow-hidden rounded-xl shadow-[0_8px_64px_rgba(0,0,0,0.7)] bg-white"
          style={{ aspectRatio: '16/9', maxHeight: '88vh', maxWidth: '157vh' }}
        >
          {slide.kind === 'full-song' && <FullSongSlide song={song} />}
          {slide.kind === 'section-line' && (
            <SectionLineSlide
              song={song}
              sectionIdx={slide.sectionIdx}
              lineIdx={slide.lineIdx}
            />
          )}
        </div>

        {/* Prev/Next invisible tap zones */}
        <button
          type="button" onClick={prev} disabled={idx === 0}
          className="absolute left-0 top-0 h-full w-16 cursor-pointer disabled:cursor-default"
          aria-label="Previous"
        />
        <button
          type="button" onClick={next} disabled={idx === total - 1}
          className="absolute right-0 top-0 h-full w-16 cursor-pointer disabled:cursor-default"
          aria-label="Next"
        />
      </div>

      {/* ── Bottom HUD ── */}
      <div className="shrink-0 flex items-center justify-between border-t border-white/10 bg-neutral-900 px-5 py-3">
        {/* Left info */}
        <div className="flex items-center gap-3 min-w-0">
          {!isSetlist && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-1.5 text-[12px] text-white/70 transition hover:text-white"
            >
              ✕ Exit
            </button>
          )}
          <div className="min-w-0">
            <span className="text-[13px] font-bold text-white truncate">{song.title}</span>
            {song.artist && (
              <span className="ml-2 text-[11px] text-white/40">{song.artist}</span>
            )}
          </div>
          {mode === 'lyrics' && (
            <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Lyrics
            </span>
          )}
          {isSetlist && (
            <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Setlist
            </span>
          )}
        </div>

        {/* Slide controls */}
        <div className="flex items-center gap-2">
          <button
            type="button" onClick={prev} disabled={idx === 0}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white/70 transition hover:border-white/40 hover:text-white disabled:opacity-30"
          >←</button>

          {/* Dots — max 20 shown */}
          <div className="flex items-center gap-1">
            {slides.length <= 20
              ? slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={[
                      'rounded-full transition-all',
                      i === idx
                        ? 'h-2 w-5 bg-indigo-400'
                        : slides[i].songIdx !== (slides[i - 1]?.songIdx ?? -1)
                          ? 'h-2 w-2 bg-white/50 hover:bg-white/70'
                          : 'h-1.5 w-1.5 bg-white/25 hover:bg-white/50',
                    ].join(' ')}
                  />
                ))
              : (
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-indigo-400 transition-all"
                    style={{ width: `${((idx + 1) / total) * 100}%` }}
                  />
                </div>
              )
            }
          </div>

          <button
            type="button" onClick={next} disabled={idx === total - 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white/70 transition hover:border-white/40 hover:text-white disabled:opacity-30"
          >→</button>

          <span className="ml-2 text-[12px] text-white/40">{idx + 1} / {total}</span>
        </div>
      </div>
    </div>
  );
}

// ── Slide content components ───────────────────────────────────────────────

function FullSongSlide({ song }: { song: Song }) {
  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden bg-white"
      style={{ padding: 'clamp(16px,2.5vw,48px) clamp(20px,3.5vw,72px)' }}
    >
      <div className="mb-3 flex items-end justify-between shrink-0">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            contiroom · Lead Sheet
          </div>
          <h1
            className="font-bold tracking-tight text-neutral-900"
            style={{ fontSize: 'clamp(18px,2.8vw,40px)', lineHeight: 1.1 }}
          >
            {song.title}
          </h1>
          {song.artist && (
            <div style={{ fontSize: 'clamp(10px,1.2vw,15px)' }} className="text-neutral-500 mt-0.5">{song.artist}</div>
          )}
        </div>
        <div className="flex gap-3 text-right" style={{ fontSize: 'clamp(9px,1vw,13px)' }}>
          <span className="text-neutral-500">Key <strong className="text-neutral-900">{song.currentKey}</strong></span>
          <span className="text-neutral-500">BPM <strong className="text-neutral-900">{song.bpm}</strong></span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden space-y-1">
        {song.sections.map((section, si) => {
          let m = 1;
          for (let i = 0; i < si; i++) {
            for (const ln of song.sections[i].lines) m += ln.measuresPerLine ?? 4;
          }
          return (
            <ScoreRenderer
              key={section.id}
              section={section}
              originalKey={song.originalKey}
              currentKey={song.currentKey}
              timeSignature={song.timeSignature}
              startingMeasure={m}
              showClefAndMeter={si === 0}
              density="normal"
            />
          );
        })}
      </div>
    </div>
  );
}

function SectionLineSlide({
  song, sectionIdx, lineIdx,
}: {
  song: Song;
  sectionIdx: number;
  lineIdx: number;
}) {
  const section = song.sections[sectionIdx];
  if (!section) return null;
  const singleLineSection = { ...section, lines: [section.lines[lineIdx]] };

  return (
    <div
      className="relative flex h-full w-full flex-col justify-center bg-white"
      style={{ padding: 'clamp(24px,3.5vw,72px) clamp(32px,5vw,110px)' }}
    >
      {/* Section badge */}
      <div className="mb-5 shrink-0">
        <span
          className="inline-block rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1 font-semibold text-neutral-500"
          style={{ fontSize: 'clamp(10px,1.1vw,15px)' }}
        >
          {section.label}
        </span>
      </div>

      {/* Score — takes up the space */}
      <div className="w-full">
        <ScoreRenderer
          section={singleLineSection}
          originalKey={song.originalKey}
          currentKey={song.currentKey}
          timeSignature={song.timeSignature}
          density="normal"
          showSectionLabel={false}
          showClefAndMeter={lineIdx === 0}
        />
      </div>

      {/* Watermark */}
      <div
        className="absolute bottom-4 right-6 text-neutral-300"
        style={{ fontSize: 'clamp(9px,0.9vw,12px)' }}
      >
        {song.title} · {song.currentKey}
      </div>
    </div>
  );
}
