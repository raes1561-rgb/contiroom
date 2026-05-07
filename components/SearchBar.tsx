'use client';

import { useEffect, useRef, useState } from 'react';
import type { Song } from '@/types/song';
import { searchSongs, findMatchRange } from '@/lib/search/songSearch';

interface SearchBarProps {
  songs: Song[];
  onSelectSong: (songId: string) => void;
  /** Visual variant - 'hero' for the home page, 'compact' for top bar */
  variant?: 'hero' | 'compact';
  placeholder?: string;
  autoFocus?: boolean;
}

function SearchIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 L21 21" strokeLinecap="round" />
    </svg>
  );
}

function ClearIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
    </svg>
  );
}

/** Highlight the matched part of the title. */
function HighlightedTitle({ title, query }: { title: string; query: string }) {
  const range = findMatchRange(title, query);
  if (!range) return <>{title}</>;
  const [start, end] = range;
  return (
    <>
      {title.slice(0, start)}
      <mark className="bg-transparent font-bold text-indigo-700">{title.slice(start, end)}</mark>
      {title.slice(end)}
    </>
  );
}

export default function SearchBar({
  songs,
  onSelectSong,
  variant = 'hero',
  placeholder = '곡 제목을 검색하세요',
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hits = query.trim() ? searchSongs(songs, query).slice(0, 8) : [];
  const showDropdown = isOpen && query.trim().length > 0 && hits.length > 0;
  const showNoResults = isOpen && query.trim().length > 0 && hits.length === 0;

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function selectHit(songId: string) {
    onSelectSong(songId);
    setIsOpen(false);
    setQuery('');
    setActiveIndex(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, hits.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && hits[activeIndex]) {
        e.preventDefault();
        selectHit(hits[activeIndex].item.id);
      } else if (hits.length > 0) {
        e.preventDefault();
        selectHit(hits[0].item.id);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }

  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={[
          'relative flex items-center transition-all',
          isHero
            ? 'rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)] focus-within:border-neutral-900 focus-within:shadow-[0_1px_3px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.16)]'
            : 'rounded-full border border-neutral-200 bg-white focus-within:border-neutral-400',
        ].join(' ')}
      >
        <div className={isHero ? 'pl-5 text-neutral-400' : 'pl-3.5 text-neutral-400'}>
          <SearchIcon className={isHero ? 'h-5 w-5' : 'h-4 w-4'} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={[
            'min-w-0 flex-1 bg-transparent text-neutral-900 placeholder:text-neutral-400 focus:outline-none',
            isHero ? 'px-4 py-5 text-lg' : 'px-3 py-2 text-sm',
          ].join(' ')}
          aria-label="곡 검색"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            className={[
              'mr-3 flex items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600',
              isHero ? 'h-7 w-7' : 'h-6 w-6',
            ].join(' ')}
            aria-label="검색어 지우기"
          >
            <ClearIcon className={isHero ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className={[
            'absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)]',
            isHero ? 'text-base' : 'text-sm',
          ].join(' ')}
        >
          <div className="px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            검색 결과 · {hits.length}곡
          </div>
          <ul className="pb-1">
            {hits.map((hit, i) => {
              const song = hit.item;
              const isActive = i === activeIndex;
              return (
                <li key={song.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => selectHit(song.id)}
                    className={[
                      'flex w-full items-center gap-3 px-4 py-2.5 text-left transition',
                      isActive ? 'bg-neutral-100' : 'hover:bg-neutral-50',
                    ].join(' ')}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                      <SearchIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold text-neutral-900">
                        <HighlightedTitle title={song.title} query={query} />
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                        {song.artist && (
                          <>
                            <span className="font-medium text-neutral-600">{song.artist}</span>
                            <span className="text-neutral-300">·</span>
                          </>
                        )}
                        <span>Key {song.originalKey}</span>
                        <span className="text-neutral-300">·</span>
                        <span>♩ {song.bpm}</span>
                        <span className="text-neutral-300">·</span>
                        <span>{song.timeSignature.numerator}/{song.timeSignature.denominator}</span>
                      </div>
                    </div>
                    <div className="shrink-0 rounded-md border border-neutral-200 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-neutral-600">
                      {song.originalKey}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-neutral-100 px-4 py-2 text-[10px] text-neutral-400">
            ↑↓ 방향키로 이동 · Enter 로 선택
          </div>
        </div>
      )}

      {showNoResults && (
        <div className="absolute left-0 right-0 z-30 mt-2 rounded-2xl border border-neutral-200 bg-white px-4 py-6 text-center text-sm text-neutral-500 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]">
          <span className="font-medium text-neutral-700">"{query}"</span>
          <span className="ml-1">에 해당하는 곡을 찾지 못했어요</span>
        </div>
      )}
    </div>
  );
}
