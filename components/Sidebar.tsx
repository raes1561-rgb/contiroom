'use client';

import type { Song } from '@/types/song';

export type AppView = 'home' | 'leadsheet' | 'setlist';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  songs: Song[];
  selectedSongId?: string;
  onSelectSong: (songId: string) => void;
  setlistCount: number;
}

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect width="36" height="36" rx="10" fill="#0A0A0A" />
      <path d="M10 26V12h4v4.5h8V12h4v14h-4v-6h-8v6z" fill="white" />
      <circle cx="26" cy="26" r="2" fill="#6366F1" />
    </svg>
  );
}

const NAV = [
  {
    view: 'home' as AppView,
    label: 'Home',
    icon: (
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <path d="M3 9.5L10 3l7 6.5M5 8v9h4v-5h2v5h4V8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    view: 'leadsheet' as AppView,
    label: 'Sheet Music',
    icon: (
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <circle cx="5" cy="15" r="2" />
        <circle cx="14" cy="13" r="2" />
        <path d="M7 15V5l9-2v10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    view: 'setlist' as AppView,
    label: 'Setlist',
    icon: (
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.6}>
        <rect x="3" y="3" width="14" height="14" rx="2.5" />
        <path d="M7 7h6M7 10h6M7 13h4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Sidebar({
  currentView, onNavigate, songs, selectedSongId, onSelectSong, setlistCount,
}: SidebarProps) {
  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-neutral-200 bg-white">
      {/* Brand */}
      <div className="px-4 py-4">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition hover:bg-neutral-100"
        >
          <Logo />
          <span className="text-[15px] font-bold tracking-tight text-neutral-900">contiroom</span>
        </button>
      </div>

      <div className="mx-4 h-px bg-neutral-100" />

      {/* Primary nav */}
      <nav className="px-3 pt-3">
        {NAV.map(({ view, label, icon }) => {
          const active = currentView === view;
          const badge = view === 'setlist' && setlistCount > 0 ? setlistCount : null;
          return (
            <button
              key={view}
              type="button"
              onClick={() => onNavigate(view)}
              className={[
                'group mb-0.5 flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-left text-[13.5px] font-medium transition',
                active
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
              ].join(' ')}
            >
              <span className="flex items-center gap-2.5">
                <span className={active ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-600'}>
                  {icon}
                </span>
                {label}
              </span>
              {badge && (
                <span className={[
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                  active ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-600',
                ].join(' ')}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Library */}
      <div className="mt-5 flex min-h-0 flex-1 flex-col px-3">
        <div className="mb-2 flex items-center justify-between px-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Library
          </span>
          <span className="text-[10px] text-neutral-400">{songs.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {songs.map((song) => {
            const active = song.id === selectedSongId && currentView === 'leadsheet';
            return (
              <button
                key={song.id}
                type="button"
                onClick={() => onSelectSong(song.id)}
                className={[
                  'group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition',
                  active
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900',
                ].join(' ')}
              >
                <span className="truncate text-[13px] font-medium">{song.title}</span>
                <span className={[
                  'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold',
                  active ? 'bg-white/15 text-white/90' : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200',
                ].join(' ')}>
                  {song.currentKey}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer actions */}
      <div className="border-t border-neutral-100 px-3 py-3">
        {[
          { label: 'Upload Sheet', icon: '↑' },
          { label: 'New Song', icon: '+' },
        ].map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => alert(`${label} — coming soon`)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <span className="text-neutral-400 text-sm">{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}
