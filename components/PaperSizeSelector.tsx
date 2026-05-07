'use client';

import { type PaperSize, PAPER_SIZES } from '@/lib/paperSizes';

interface PaperSizeSelectorProps {
  value: PaperSize;
  onChange: (size: PaperSize) => void;
}

const GROUPS: { heading: string; sizes: PaperSize[] }[] = [
  {
    heading: 'A4',
    sizes: ['a4-portrait', 'a4-landscape'],
  },
  {
    heading: 'A3',
    sizes: ['a3-portrait', 'a3-landscape'],
  },
  {
    heading: 'PPT  16:9',
    sizes: ['ppt-full', 'ppt-lyrics'],
  },
];

export default function PaperSizeSelector({ value, onChange }: PaperSizeSelectorProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 px-4 py-3">
        <h2 className="text-[13px] font-bold text-neutral-900">Paper / Size</h2>
      </div>

      <div className="space-y-3 p-3">
        {GROUPS.map(({ heading, sizes }) => (
          <div key={heading}>
            <div className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              {heading}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {sizes.map((size) => {
                const def = PAPER_SIZES[size];
                const active = value === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onChange(size)}
                    className={[
                      'flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition',
                      active
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50',
                    ].join(' ')}
                  >
                    {/* Paper icon — aspect ratio visualisation */}
                    <PaperIcon aspect={def.aspect} active={active} />
                    <span className={['text-[12px] font-bold', active ? 'text-indigo-700' : 'text-neutral-900'].join(' ')}>
                      {def.label}
                    </span>
                    <span className={['text-[10px]', active ? 'text-indigo-500' : 'text-neutral-500'].join(' ')}>
                      {def.sublabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaperIcon({ aspect, active }: { aspect: number; active: boolean }) {
  // Draw a small paper rectangle in the button; vary width/height by aspect.
  const isLandscape = aspect > 1;
  const isPpt = aspect >= 1.7;

  const W = isPpt ? 28 : isLandscape ? 26 : 18;
  const H = isPpt ? 16 : isLandscape ? 18 : 24;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      className="shrink-0"
    >
      <rect
        x="1"
        y="1"
        width={W - 2}
        height={H - 2}
        rx="2"
        fill={active ? '#EEF2FF' : '#F5F5F4'}
        stroke={active ? '#6366F1' : '#D4D4D4'}
        strokeWidth="1.5"
      />
      {/* Lines to suggest staff / content */}
      {Array.from({ length: isPpt ? 3 : 4 }).map((_, i) => {
        const y = Math.round(((i + 1) * H) / (isPpt ? 4 : 5));
        return (
          <line
            key={i}
            x1={4}
            y1={y}
            x2={W - 4}
            y2={y}
            stroke={active ? '#A5B4FC' : '#E5E5E5'}
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}
