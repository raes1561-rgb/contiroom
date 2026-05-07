'use client';

import { useMemo, useState } from 'react';
import { SAMPLE_SONGS, getSongById } from '@/lib/sampleData';
import type { Song } from '@/types/song';
import type { Setlist, SetlistItem } from '@/types/setlist';
import type { PaperSize } from '@/lib/paperSizes';
import { saveSetlist } from '@/lib/setlistStorage';

import Sidebar, { type AppView } from '@/components/Sidebar';
import HomeScreen from '@/components/HomeScreen';
import DetailLayout from '@/components/DetailLayout';
import LeadSheetPreview from '@/components/LeadSheetPreview';
import SetlistPreview from '@/components/SetlistPreview';
import TransposeControl from '@/components/TransposeControl';
import SetlistBuilder from '@/components/SetlistBuilder';
import ExportButtons from '@/components/ExportButtons';
import PaperSizeSelector from '@/components/PaperSizeSelector';
import SlideshowView from '@/components/SlideshowView';

let counter = 0;
function newId() { counter++; return `sli-${counter}-${Date.now().toString(36)}`; }

type SlideshowState =
  | { mode: 'full' | 'lyrics'; songs: [Song] }
  | { mode: 'setlist'; songs: Song[] };

export default function App() {
  const [view, setView]                 = useState<AppView>('home');
  const [keyOverrides, setKeyOverrides] = useState<Record<string, string>>({});
  const [selectedSongId, setSelectedSongId] = useState<string | undefined>(undefined);
  const [paperSize, setPaperSize]       = useState<PaperSize>('a4-portrait');
  const [slideshow, setSlideshow]       = useState<SlideshowState | null>(null);
  const [activeSetlist, setActiveSetlist] = useState<Setlist | null>(null);
  const [setlistItems, setSetlistItems]   = useState<SetlistItem[]>([]);

  const songs = useMemo<Song[]>(() =>
    SAMPLE_SONGS.map((s) => keyOverrides[s.id] ? { ...s, currentKey: keyOverrides[s.id] } : s),
    [keyOverrides]
  );

  const selectedSong = selectedSongId ? songs.find((s) => s.id === selectedSongId) : undefined;
  const songForLeadsheet = selectedSong ?? songs[0];

  // Songs in current setlist (in order, with key overrides)
  const setlistSongs = useMemo<Song[]>(() =>
    setlistItems
      .sort((a, b) => a.order - b.order)
      .map((item) => {
        const base = songs.find((s) => s.id === item.songId);
        if (!base) return null;
        return item.key ? { ...base, currentKey: item.key } : base;
      })
      .filter(Boolean) as Song[],
    [setlistItems, songs]
  );

  // ── Navigation ──────────────────────────────────────────────────────────
  function goHome() { setView('home'); setSlideshow(null); }

  function handleSelectSong(songId: string) {
    setSelectedSongId(songId);
    setView('leadsheet');
  }

  function changeCurrentKey(songId: string, newKey: string) {
    setKeyOverrides((p) => ({ ...p, [songId]: newKey }));
  }

  function handleCreateSetlist(sl: Setlist) {
    setActiveSetlist(sl);
    setSetlistItems([]);
    setView('setlist');
  }

  function handleOpenSetlist(sl: Setlist) {
    setActiveSetlist(sl);
    setSetlistItems(sl.items);
    setView('setlist');
  }

  function persistItems(items: SetlistItem[]) {
    setSetlistItems(items);
    if (activeSetlist) {
      const updated: Setlist = { ...activeSetlist, items };
      setActiveSetlist(updated);
      saveSetlist(updated);
    }
  }

  function addToSetlist(songId: string) {
    const s = getSongById(songId);
    if (!s) return;
    persistItems([...setlistItems, { id: newId(), songId, key: keyOverrides[songId] ?? s.currentKey, order: setlistItems.length }]);
  }

  function removeFromSetlist(id: string) {
    persistItems(setlistItems.filter((it) => it.id !== id).map((it, i) => ({ ...it, order: i })));
  }

  function moveSetlistItem(id: string, dir: 'up' | 'down') {
    const idx = setlistItems.findIndex((it) => it.id === id);
    if (idx < 0) return;
    const t = dir === 'up' ? idx - 1 : idx + 1;
    if (t < 0 || t >= setlistItems.length) return;
    const n = [...setlistItems];
    [n[idx], n[t]] = [n[t], n[idx]];
    persistItems(n.map((it, i) => ({ ...it, order: i })));
  }

  function setMemo(id: string, memo: string) {
    persistItems(setlistItems.map((it) => it.id === id ? { ...it, memo } : it));
  }

  // ── Slideshow overlay ───────────────────────────────────────────────────
  if (slideshow) {
    if (slideshow.mode === 'setlist') {
      return (
        <SlideshowView
          mode="setlist"
          songs={slideshow.songs}
          onClose={() => setSlideshow(null)}
        />
      );
    }
    return (
      <SlideshowView
        mode={slideshow.mode}
        song={slideshow.songs[0]}
        onClose={() => setSlideshow(null)}
      />
    );
  }

  // ── Home ────────────────────────────────────────────────────────────────
  if (view === 'home') {
    return (
      <HomeScreen
        songs={songs}
        onSelectSong={handleSelectSong}
        onCreateSetlist={handleCreateSetlist}
        onOpenSetlist={handleOpenSetlist}
      />
    );
  }

  // ── App shell ───────────────────────────────────────────────────────────
  const setlistTitle = activeSetlist?.meta.title ?? 'Setlist';

  return (
    <div className="flex h-screen bg-[#F5F5F4]">
      <Sidebar
        currentView={view}
        onNavigate={(v) => { if (v === 'home') goHome(); else setView(v); }}
        songs={songs}
        selectedSongId={selectedSongId}
        onSelectSong={handleSelectSong}
        setlistCount={setlistItems.length}
      />

      <div className="min-w-0 flex-1">
        {/* ── Lead Sheet ── */}
        {view === 'leadsheet' && (
          <DetailLayout
            songs={songs}
            onSelectSong={handleSelectSong}
            pageTitle="Lead Sheet"
            pageSubtitle={songForLeadsheet.title}
            tools={
              <>
                <TransposeControl
                  originalKey={songForLeadsheet.originalKey}
                  currentKey={songForLeadsheet.currentKey}
                  onChange={(k) => changeCurrentKey(songForLeadsheet.id, k)}
                />
                <PaperSizeSelector value={paperSize} onChange={setPaperSize} />
                <button
                  type="button"
                  onClick={() => addToSetlist(songForLeadsheet.id)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                >
                  + Add to Setlist
                </button>
                <ExportButtons
                  context="sheet"
                  onStartSlideshow={(mode) =>
                    setSlideshow({ mode, songs: [songForLeadsheet] })
                  }
                />
              </>
            }
          >
            <LeadSheetPreview song={songForLeadsheet} paperSize={paperSize} />
          </DetailLayout>
        )}

        {/* ── Setlist ── */}
        {view === 'setlist' && (
          <DetailLayout
            songs={songs}
            onSelectSong={handleSelectSong}
            pageTitle="Setlist"
            pageSubtitle={setlistTitle}
            tools={
              <>
                {activeSetlist && (
                  <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[12px] text-neutral-600 space-y-0.5">
                    <div className="font-bold text-neutral-900 text-[14px]">{activeSetlist.meta.title}</div>
                    {activeSetlist.meta.date && <div>{activeSetlist.meta.date}</div>}
                    {activeSetlist.meta.service && <div className="text-indigo-600 font-medium">{activeSetlist.meta.service}</div>}
                    {activeSetlist.meta.church && <div>⛪ {activeSetlist.meta.church}</div>}
                    {activeSetlist.meta.leader && <div>👤 {activeSetlist.meta.leader}</div>}
                    <div className="pt-1 text-[10px] text-neutral-400">변경사항 자동 저장</div>
                  </div>
                )}
                <SetlistBuilder
                  songs={songs}
                  items={setlistItems}
                  onAdd={addToSetlist}
                  onRemove={removeFromSetlist}
                  onMove={moveSetlistItem}
                  onMemoChange={setMemo}
                />
                <ExportButtons
                  context="setlist"
                  onStartSetlistShow={
                    setlistSongs.length > 0
                      ? () => setSlideshow({ mode: 'setlist', songs: setlistSongs })
                      : undefined
                  }
                />
              </>
            }
          >
            <SetlistPreview
              songs={songs}
              items={setlistItems}
              serviceTitle={activeSetlist?.meta.title ?? 'Sunday Service'}
              serviceDate={activeSetlist?.meta.date ?? new Date().toISOString().slice(0, 10)}
            />
          </DetailLayout>
        )}
      </div>
    </div>
  );
}
