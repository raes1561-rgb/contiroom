'use client';

import { useState } from 'react';
import type { Song } from '@/types/song';
import type { Setlist } from '@/types/setlist';
import SearchBar from './SearchBar';
import NewSetlistModal from './NewSetlistModal';
import MySetlists from './MySetlists';
import { createEmptySetlist, saveSetlist } from '@/lib/setlistStorage';
import type { SetlistMeta } from '@/types/setlist';

interface HomeScreenProps {
  songs: Song[];
  onSelectSong: (songId: string) => void;
  onCreateSetlist: (setlist: Setlist) => void;
  onOpenSetlist: (setlist: Setlist) => void;
}

function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect width="36" height="36" rx="10" fill="#0A0A0A" />
      <path d="M10 26V12h4v4.5h8V12h4v14h-4v-6h-8v6z" fill="white" />
      <circle cx="26" cy="26" r="2" fill="#6366F1" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}

function SetlistIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomeScreen({
  songs, onSelectSong, onCreateSetlist, onOpenSetlist,
}: HomeScreenProps) {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeSection, setActiveSection] = useState<'search' | 'mysetlists'>('search');

  function handleCreateConfirm(meta: Omit<SetlistMeta, 'id' | 'createdAt' | 'updatedAt'>) {
    const newSetlist = createEmptySetlist(meta);
    saveSetlist(newSetlist);
    setShowModal(false);
    setRefreshKey((k) => k + 1);
    onCreateSetlist(newSetlist);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F4]">

      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-200 bg-white px-8 py-4">
        {/* Logo — always goes home (no-op since we're already home, but keeps it clickable) */}
        <button
          type="button"
          onClick={() => { setActiveSection('search'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2.5 rounded-lg transition hover:opacity-80"
        >
          <Logo size={32} />
          <span className="text-[15px] font-bold tracking-tight text-neutral-900">contiroom</span>
        </button>

        {/* Nav tabs */}
        <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 p-1">
          <NavTab
            active={activeSection === 'search'}
            onClick={() => setActiveSection('search')}
            icon={<SearchIcon />}
            label="악보 검색"
          />
          <NavTab
            active={activeSection === 'mysetlists'}
            onClick={() => setActiveSection('mysetlists')}
            icon={<FolderIcon />}
            label="나의 콘티"
          />
        </div>

        <div className="text-[11px] text-neutral-400">찬양팀을 위한 악보 · 콘티 도구</div>
      </nav>

      {/* ── Content ─────────────────────────────────────── */}
      <main className="flex flex-1 flex-col items-center px-6 pb-20 pt-12">
        <div className="w-full max-w-[680px]">

          {/* ═══ SEARCH SECTION ═══ */}
          {activeSection === 'search' && (
            <>
              {/* Headline */}
              <div className="mb-10 text-center">
                <h1 className="text-[40px] font-bold leading-[1.15] tracking-tight text-neutral-900">
                  찬양 악보,<br />한 곳에서
                </h1>
                <p className="mt-4 text-[17px] leading-relaxed text-neutral-500">
                  악보를 검색하고, 키를 바꾸고,<br />
                  콘티를 한 장에 담아보세요
                </p>
              </div>

              {/* Search bar */}
              <SearchBar
                songs={songs}
                onSelectSong={onSelectSong}
                variant="hero"
                placeholder="곡 제목으로 검색..."
                autoFocus
              />
              <p className="mt-2.5 text-center text-[12px] text-neutral-400">
                {songs.length}곡 등록 · 한 글자씩 칠 때마다 결과가 바로 나와요
              </p>

              {/* 인기 찬양 리스트 */}
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[13px] font-bold text-neutral-700">🔥 인기 찬양 리스트</h3>
                  <span className="text-[11px] text-neutral-400">{songs.length}곡</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {songs.map((song, i) => (
                    <button
                      key={song.id}
                      type="button"
                      onClick={() => onSelectSong(song.id)}
                      className="group flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-left shadow-sm transition hover:border-neutral-800 hover:bg-neutral-900 hover:shadow-none"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-bold text-neutral-500 group-hover:bg-white/20 group-hover:text-white">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-semibold text-neutral-900 group-hover:text-white">
                          {song.title}
                        </div>
                        {song.artist && (
                          <div className="text-[10px] text-neutral-400 group-hover:text-white/60">
                            {song.artist}
                          </div>
                        )}
                      </div>
                      <span className="shrink-0 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-neutral-500 group-hover:bg-white/20 group-hover:text-white/80">
                        {song.originalKey}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature cards — 3개 같은 라인 */}
              <div className="mt-10 grid grid-cols-3 gap-3">
                <FeatureCard
                  icon={<SearchIcon />}
                  title="악보 보기"
                  desc="원하는 곡을 검색해 리드시트로 확인하세요"
                  label="검색하기"
                  variant="light"
                  onClick={() => songs[0] && onSelectSong(songs[0].id)}
                />
                <FeatureCard
                  icon={<SetlistIcon />}
                  title="콘티 만들기"
                  desc="여러 곡을 한 장에 자동으로 배치해요"
                  label="콘티 시작"
                  variant="dark"
                  onClick={() => setShowModal(true)}
                />
                <FeatureCard
                  icon={<FolderIcon />}
                  title="나의 콘티"
                  desc="이전에 만든 콘티를 불러와 계속 작업하세요"
                  label="불러오기"
                  variant="amber"
                  onClick={() => setActiveSection('mysetlists')}
                />
              </div>
            </>
          )}

          {/* ═══ MY SETLISTS SECTION ═══ */}
          {activeSection === 'mysetlists' && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-[28px] font-bold tracking-tight text-neutral-900">나의 콘티</h2>
                  <p className="mt-1 text-[14px] text-neutral-500">저장된 콘티를 불러와 계속 작업하세요</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-neutral-700"
                >
                  <span>+</span>
                  새 콘티
                </button>
              </div>

              <MySetlists
                onOpen={onOpenSetlist}
                refreshKey={refreshKey}
              />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-[11px] text-neutral-400">
        contiroom MVP — 모든 샘플 곡은 오리지널 가사·코드입니다
      </footer>

      {/* Modal */}
      {showModal && (
        <NewSetlistModal
          onConfirm={handleCreateConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────── */

function NavTab({
  active, onClick, icon, label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition',
        active
          ? 'bg-neutral-900 text-white shadow-sm'
          : 'text-neutral-600 hover:bg-white hover:text-neutral-900',
      ].join(' ')}
    >
      <span className={active ? 'text-white' : 'text-neutral-400'}>{icon}</span>
      {label}
    </button>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  label: string;
  variant: 'light' | 'dark' | 'amber';
  onClick: () => void;
}

function FeatureCard({ icon, title, desc, label, variant, onClick }: FeatureCardProps) {
  const dark = variant === 'dark';
  const amber = variant === 'amber';
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all duration-200',
        dark  ? 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800' :
        amber ? 'border-amber-200 bg-amber-50 text-neutral-900 hover:border-amber-300 hover:bg-amber-100' :
                'border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.10)]',
      ].join(' ')}
    >
      <div className={[
        'flex h-10 w-10 items-center justify-center rounded-xl',
        dark  ? 'bg-white/10 text-indigo-300' :
        amber ? 'bg-amber-100 text-amber-600' :
                'bg-indigo-50 text-indigo-600',
      ].join(' ')}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[15px] font-bold tracking-tight">{title}</div>
        <p className={['mt-1 text-[12px] leading-relaxed', dark ? 'text-neutral-400' : 'text-neutral-500'].join(' ')}>
          {desc}
        </p>
      </div>
      <div className={[
        'flex items-center gap-1.5 text-[13px] font-semibold',
        dark  ? 'text-indigo-300' :
        amber ? 'text-amber-700' :
                'text-indigo-600',
      ].join(' ')}>
        {label} →
      </div>
    </button>
  );
}
