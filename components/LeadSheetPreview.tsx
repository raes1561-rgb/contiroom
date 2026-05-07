'use client';

import { useState } from 'react';
import type { Song } from '@/types/song';
import ScoreRenderer from './ScoreRenderer';
import { type PaperSize, PAPER_SIZES } from '@/lib/paperSizes';

interface LeadSheetPreviewProps {
  song: Song;
  paperSize?: PaperSize;
}

/** Section types hidden when "hide bridges" is on */
const HIDE_WHEN_FILTERED = new Set(['intro', 'interlude', 'outro', 'ending']);

export default function LeadSheetPreview({ song, paperSize = 'a4-portrait' }: LeadSheetPreviewProps) {
  const def = PAPER_SIZES[paperSize];
  const [hideExtras, setHideExtras] = useState(false);

  const visibleSections = hideExtras
    ? song.sections.filter((s) => !HIDE_WHEN_FILTERED.has(s.type))
    : song.sections;

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12px] text-neutral-500">
          <span className="font-semibold text-neutral-700">{song.title}</span>
          {song.artist && (
            <>
              <span className="text-neutral-300">·</span>
              <span>{song.artist}</span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setHideExtras((v) => !v)}
          className={[
            'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition',
            hideExtras
              ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
              : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400',
          ].join(' ')}
        >
          {hideExtras ? '🎵 간주 숨김' : '🎵 간주 가리기'}
        </button>
      </div>

      {/* ── Paper ── */}
      <div
        className="mx-auto bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06),0_16px_48px_-16px_rgba(0,0,0,0.12)] ring-1 ring-neutral-200"
        style={{
          width: '100%',
          maxWidth: def.aspect >= 1 ? '900px' : '760px',
          aspectRatio: String(def.aspect),
          padding: def.aspect >= 1.5 ? '28px 44px' : '40px 48px 36px',
        }}
      >
        {/* Header */}
        <header className="border-b border-neutral-200 pb-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                contiroom · Lead Sheet
              </div>
              <h1
                className="mt-1.5 font-bold tracking-tight text-neutral-900"
                style={{ fontSize: def.aspect >= 1 ? 'clamp(18px,2.2vw,28px)' : 'clamp(20px,2.6vw,32px)', lineHeight: 1.1 }}
              >
                {song.title}
              </h1>
              {song.artist && (
                <div className="mt-1 text-[12px] text-neutral-500">{song.artist}</div>
              )}
            </div>
            <div className="text-right text-[11px] text-neutral-400">Original {song.originalKey}</div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <MetaPill label="Key" value={song.currentKey} highlight />
            <MetaPill label="BPM" value={song.bpm} />
            <MetaPill label="Time" value={`${song.timeSignature.numerator}/${song.timeSignature.denominator}`} />
            {hideExtras && (
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                Verse · Chorus · Pre-Chorus · Bridge only
              </span>
            )}
          </div>
        </header>

        {/* Score */}
        <div className="mt-4 space-y-2.5">
          {visibleSections.map((section, idx) => {
            // recalculate measure numbers from full song
            let m = 1;
            const fullIdx = song.sections.indexOf(section);
            for (let i = 0; i < fullIdx; i++) {
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
                showClefAndMeter={idx === 0}
                density="normal"
              />
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-5 flex items-center justify-around border-t border-neutral-200 pt-4">
          {[
            { label: 'Original', value: song.originalKey },
            { label: 'Current',  value: song.currentKey },
            { label: 'BPM',      value: song.bpm },
            { label: 'Time',     value: `${song.timeSignature.numerator}/${song.timeSignature.denominator}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-400">{label}</span>
              <span className="text-[15px] font-bold text-neutral-900">{value}</span>
            </div>
          ))}
        </footer>
      </div>
    </div>
  );
}

function MetaPill({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] text-neutral-400">{label}</span>
      <span className={[
        'rounded-md px-2 py-0.5 text-[12px] font-bold',
        highlight ? 'bg-indigo-50 text-indigo-700' : 'bg-neutral-100 text-neutral-700',
      ].join(' ')}>
        {value}
      </span>
    </div>
  );
}
