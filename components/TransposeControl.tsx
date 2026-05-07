'use client';

/**
 * TransposeControl
 * --------------------------------------------------------------------------
 *  v3 변경점:
 *   - ♯ / ♭ 토글이 우측 상단으로 이동
 *   - 키 배열 순서: 반음계 순 C → C# → D → D# → E → F → F# → G → G# → A → A# → B
 *     ♯ 모드일 땐 #, ♭ 모드일 땐 ♭ 표기
 *   - 4열 그리드로 재배치 (반음계 12개를 4열 × 3행으로)
 */

import { useState } from 'react';

interface TransposeControlProps {
  originalKey: string;
  currentKey: string;
  onChange: (newKey: string) => void;
}

const SHARP_CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_CHROMATIC  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const SHARP_FLAT_PAIRS: Record<string, string> = {
  'C#': 'Db', 'Db': 'C#',
  'D#': 'Eb', 'Eb': 'D#',
  'F#': 'Gb', 'Gb': 'F#',
  'G#': 'Ab', 'Ab': 'G#',
  'A#': 'Bb', 'Bb': 'A#',
};

export default function TransposeControl({
  originalKey,
  currentKey,
  onChange,
}: TransposeControlProps) {
  // 현재 키가 ♭ 표기면 flat 모드, 아니면 sharp 모드
  const [accidental, setAccidental] = useState<'sharp' | 'flat'>(() => {
    if (Object.keys(SHARP_FLAT_PAIRS).includes(currentKey) && currentKey.includes('b')) return 'flat';
    if (originalKey.includes('b')) return 'flat';
    return 'sharp';
  });

  const keys = accidental === 'sharp' ? SHARP_CHROMATIC : FLAT_CHROMATIC;

  function handleSwitchAccidental(mode: 'sharp' | 'flat') {
    setAccidental(mode);
    // 현재 키가 변화음이면 같은 음의 다른 표기로 즉시 전환
    if (SHARP_FLAT_PAIRS[currentKey]) {
      const newKey = mode === 'sharp'
        ? (currentKey.includes('b') ? SHARP_FLAT_PAIRS[currentKey] : currentKey)
        : (currentKey.includes('#') ? SHARP_FLAT_PAIRS[currentKey] : currentKey);
      if (newKey !== currentKey) onChange(newKey);
    }
  }

  /** 비교용 — sharp/flat 어느 표기든 같은 음이면 active 처리 */
  function isSameKey(a: string, b: string): boolean {
    if (a === b) return true;
    if (SHARP_FLAT_PAIRS[a] === b) return true;
    return false;
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      {/* Header: title left, sharp/flat toggle right */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-bold text-neutral-900">
            Transpose
          </h2>
          <span className="text-[10px] text-neutral-400">
            original {originalKey}
          </span>
        </div>

        {/* Sharp / Flat toggle */}
        <div className="flex overflow-hidden rounded-lg border border-neutral-200">
          <button
            type="button"
            onClick={() => handleSwitchAccidental('sharp')}
            className={[
              'flex h-7 w-8 items-center justify-center text-sm font-bold transition',
              accidental === 'sharp'
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900',
            ].join(' ')}
            aria-label="Sharp 표기"
            aria-pressed={accidental === 'sharp'}
          >
            ♯
          </button>
          <button
            type="button"
            onClick={() => handleSwitchAccidental('flat')}
            className={[
              'flex h-7 w-8 items-center justify-center border-l border-neutral-200 text-sm font-bold transition',
              accidental === 'flat'
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900',
            ].join(' ')}
            aria-label="Flat 표기"
            aria-pressed={accidental === 'flat'}
          >
            ♭
          </button>
        </div>
      </div>

      {/* Chromatic key buttons — 4 cols × 3 rows */}
      <div className="grid grid-cols-4 gap-1.5">
        {keys.map((k) => {
          const isCurrent = isSameKey(k, currentKey);
          const isOriginal = isSameKey(k, originalKey);
          return (
            <button
              key={k}
              type="button"
              onClick={() => onChange(k)}
              className={[
                'relative h-9 rounded-md border text-xs font-bold transition',
                isCurrent
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50',
              ].join(' ')}
            >
              {k}
              {isOriginal && !isCurrent && (
                <span className="absolute right-1 top-1 h-1 w-1 rounded-full bg-neutral-900" />
              )}
            </button>
          );
        })}
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={() => onChange(originalKey)}
        disabled={isSameKey(currentKey, originalKey)}
        className="mt-3 w-full rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-semibold tracking-wide text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Reset to original
      </button>
    </div>
  );
}
