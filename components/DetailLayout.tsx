'use client';

import type { ReactNode } from 'react';
import SearchBar from './SearchBar';
import type { Song } from '@/types/song';

interface DetailLayoutProps {
  songs: Song[];
  onSelectSong: (songId: string) => void;
  pageTitle: string;
  pageSubtitle?: string;
  tools: ReactNode;
  children: ReactNode;
}

export default function DetailLayout({
  songs, onSelectSong, pageTitle, pageSubtitle, tools, children,
}: DetailLayoutProps) {
  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <header className="flex shrink-0 items-center gap-6 border-b border-neutral-200 bg-white px-6 py-3">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            {pageTitle}
          </div>
          {pageSubtitle && (
            <div className="truncate text-[14px] font-bold text-neutral-900 leading-tight mt-0.5">
              {pageSubtitle}
            </div>
          )}
        </div>
        <div className="flex-1" />
        <div className="w-64">
          <SearchBar
            songs={songs}
            onSelectSong={onSelectSong}
            variant="compact"
            placeholder="Search..."
          />
        </div>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Main preview */}
        <div className="flex-1 overflow-y-auto bg-[#F5F5F4] px-8 py-8">
          {children}
        </div>

        {/* Right tool rail */}
        <aside className="w-72 shrink-0 overflow-y-auto border-l border-neutral-200 bg-white px-5 py-5">
          <div className="space-y-4">
            {tools}
          </div>
        </aside>
      </div>
    </div>
  );
}
