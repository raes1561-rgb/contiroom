'use client';

import type { Song } from '@/types/song';
import type { SetlistItem } from '@/types/setlist';
import { computeSetlistLayout, type LayoutDensity } from '@/lib/setlist/autoLayout';
import { selectSectionsForDensity } from '@/lib/setlist/sectionSelect';
import ScoreRenderer, { type ScoreDensity } from './ScoreRenderer';

interface Props {
  songs: Song[];
  items: SetlistItem[];
  serviceTitle?: string;
  serviceDate?: string;
}

const TO_SCORE: Record<LayoutDensity, ScoreDensity> = {
  'feature': 'normal',
  'comfortable': 'compact',
  'compact': 'compact',
  'ultra-compact': 'ultra-compact',
};

const CARD_STYLE: Record<LayoutDensity, { title: string; meta: string; pad: string }> = {
  'feature':       { title: 'text-xl',   meta: 'text-[11px]', pad: 'p-5' },
  'comfortable':   { title: 'text-base', meta: 'text-[10px]', pad: 'p-4' },
  'compact':       { title: 'text-sm',   meta: 'text-[9px]',  pad: 'p-3' },
  'ultra-compact': { title: 'text-xs',   meta: 'text-[8px]',  pad: 'p-2.5' },
};

export default function SetlistPreview({
  songs, items, serviceTitle = 'Sunday Service', serviceDate,
}: Props) {
  const layout = computeSetlistLayout(items.length);
  const S = CARD_STYLE[layout.density];
  const page = items.slice(0, layout.recommendedPerPage);

  return (
    <div
      className="mx-auto flex flex-col bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06),0_16px_48px_-16px_rgba(0,0,0,0.12)] ring-1 ring-neutral-150"
      style={{ width: '100%', maxWidth: '820px', aspectRatio: '1 / 1.414', padding: '28px 32px 24px' }}
    >
      {/* Header */}
      <header className="flex items-end justify-between border-b border-neutral-200 pb-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            contiroom · Setlist
          </div>
          <h1 className="mt-1 text-[22px] font-bold tracking-tight text-neutral-900 leading-tight">
            {serviceTitle}
          </h1>
        </div>
        <div className="text-right text-[11px] text-neutral-500">
          {serviceDate && <div className="font-semibold text-neutral-800">{serviceDate}</div>}
          <div>{items.length} songs</div>
        </div>
      </header>

      {/* Empty */}
      {items.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <div className="h-12 w-12 rounded-2xl border-2 border-dashed border-neutral-200" />
          <p className="text-sm text-neutral-500">No songs yet</p>
          <p className="text-[11px] text-neutral-400">Add songs from the right panel to build your setlist</p>
        </div>
      )}

      {/* Grid */}
      {items.length > 0 && (
        <div
          className="mt-3 grid flex-1 gap-2.5"
          style={{
            gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
          }}
        >
          {page.map((item, idx) => {
            const song = songs.find((s) => s.id === item.songId);
            if (!song) return null;
            const performKey = item.key ?? song.currentKey;
            const sections = selectSectionsForDensity(song.sections, layout.density);

            return (
              <article
                key={item.id}
                className={['flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white', S.pad].join(' ')}
              >
                {/* Card header */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[9px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className={['truncate font-bold tracking-tight text-neutral-900', S.title].join(' ')}>
                      {song.title}
                    </span>
                  </div>
                  <div className={['flex items-center gap-1.5 text-neutral-400 shrink-0', S.meta].join(' ')}>
                    <span className="font-bold text-indigo-600">{performKey}</span>
                    <span>·</span>
                    <span>♩{song.bpm}</span>
                  </div>
                </div>

                {item.memo && (
                  <p className={['italic text-amber-700 mb-1', S.meta].join(' ')}>* {item.memo}</p>
                )}

                {/* Score */}
                <div className="flex-1 overflow-hidden space-y-1">
                  {sections.map((sec, si) => (
                    <ScoreRenderer
                      key={sec.id}
                      section={sec}
                      originalKey={song.originalKey}
                      currentKey={performKey}
                      timeSignature={song.timeSignature}
                      density={TO_SCORE[layout.density]}
                      showSectionLabel={layout.density !== 'ultra-compact'}
                      showClefAndMeter={si === 0}
                    />
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Overflow */}
      {layout.overflow && (
        <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] text-amber-800">
          Showing first {layout.recommendedPerPage} of {items.length} songs. Full version will paginate across {layout.totalPages} pages.
        </div>
      )}

      <footer className="mt-2 flex items-center justify-between border-t border-neutral-200 pt-2 text-[9px] uppercase tracking-[0.2em] text-neutral-400">
        <span>contiroom</span>
        <span>Page 1 of {Math.max(layout.totalPages, 1)}</span>
      </footer>
    </div>
  );
}
