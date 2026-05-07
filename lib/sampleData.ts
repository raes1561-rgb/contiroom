/**
 * 샘플 곡 데이터 — 6곡 모두 오리지널 가사·코드 (저작권 청결)
 *
 *   섹션 라벨은 영어 (Intro / Verse 1 / Chorus / Bridge / Outro)
 *   가사는 한국어 (오리지널)
 *   검색 데모를 위해 4곡 → 6곡으로 확장
 */

import type { Song, MelodyNote, ChordEvent, Line } from '@/types/song';

function quarterNotes(pitches: (string | null)[]): MelodyNote[] {
  return pitches.map((pitch, i) => ({ pitch, duration: 'q', beatPosition: i }));
}

function chordsPerMeasure(symbols: string[]): ChordEvent[] {
  return symbols.map((s, i) => ({ symbol: s, measureIndex: i, beatPosition: 0 }));
}

function splitChordsAcrossMeasures(spec: Array<string | [string, string]>): ChordEvent[] {
  const events: ChordEvent[] = [];
  spec.forEach((entry, mi) => {
    if (typeof entry === 'string') {
      events.push({ symbol: entry, measureIndex: mi, beatPosition: 0 });
    } else {
      events.push({ symbol: entry[0], measureIndex: mi, beatPosition: 0 });
      events.push({ symbol: entry[1], measureIndex: mi, beatPosition: 2 });
    }
  });
  return events;
}

/* ========== 곡 1 — 은혜의 빛 (G major) ========== */
const s1_intro: Line = {
  id: 's1-intro-l1',
  chords: chordsPerMeasure(['G', 'D/F#', 'Em7', 'C']),
  melodyNotes: quarterNotes(['G4','B4','A4','G4', 'F#4','A4','G4','E4', 'D4','F#4','E4','C5', 'B4','A4','G4',null]),
  lyrics: Array(16).fill(''),
};
const s1_verseA: Line = {
  id: 's1-verse-l1',
  chords: chordsPerMeasure(['G', 'D/F#', 'Em7', 'C']),
  melodyNotes: quarterNotes(['G4','A4','B4','A4', 'G4','F#4','A4','A4', 'G4','E4','D4','D4', 'E4','D4','C5',null]),
  lyrics: ['고','요','한','이','시','간','에','나','두','눈','들','어','주','를','보','네'],
};
const s1_verseB: Line = {
  id: 's1-verse-l2',
  chords: splitChordsAcrossMeasures(['Am7', 'D', ['G', 'G/B'], ['C', 'D']]),
  melodyNotes: quarterNotes(['A4','B4','C5','B4', 'A4','G4','B4','B4', 'B4','A4','G4','A4', 'G4','F#4','G4',null]),
  lyrics: ['어','둠','과','깊','은','침','묵','속','에','주','의','빛','비','추','시','네'],
};
const s1_chorusA: Line = {
  id: 's1-chorus-l1',
  chords: chordsPerMeasure(['G', 'D/F#', 'Em7', 'C']),
  melodyNotes: quarterNotes(['D5','D5','C5','B4', 'A4','B4','A4','G4', 'G4','A4','G4','E4', 'F#4','G4','A4',null]),
  lyrics: ['은','혜','의','빛','나','를','인','도','해','내','마','음','평','안','케','하'],
};
const s1_chorusB: Line = {
  id: 's1-chorus-l2',
  chords: splitChordsAcrossMeasures(['Am7', 'D', ['G', 'Em7'], ['C', 'D']]),
  melodyNotes: quarterNotes(['C5','C5','B4','A4', 'G4','F#4','G4','A4', 'B4','A4','G4','A4', 'G4','F#4','G4',null]),
  lyrics: ['힘','이','다','하','여','약','할','때','도','주','사','랑','안','에','쉬','네'],
};
const s1_outro: Line = {
  id: 's1-outro-l1',
  chords: chordsPerMeasure(['G', 'D/F#', 'Em7', 'C', 'G']),
  melodyNotes: quarterNotes(['G4','A4','B4','A4', 'G4','F#4','A4','G4', 'E4','D4','C5','B4', 'A4','G4',null,null]),
  lyrics: ['주','의','사','랑','안','에','나','참','된','안','식','을','얻','네','',''],
};

/* ========== 곡 2 — 새벽의 노래 (D major) ========== */
const s2_intro: Line = {
  id: 's2-intro-l1',
  chords: chordsPerMeasure(['D', 'A/C#', 'Bm7', 'G']),
  melodyNotes: quarterNotes(['D5','F#5','E5','D5', 'C#5','E5','D5','B4', 'A4','C#5','B4','G4', 'A4','B4','D5',null]),
  lyrics: Array(16).fill(''),
};
const s2_verseA: Line = {
  id: 's2-verse-l1',
  chords: chordsPerMeasure(['D', 'A/C#', 'Bm7', 'G']),
  melodyNotes: quarterNotes(['D5','D5','F#5','F#5', 'E5','C#5','E5','E5', 'D5','B4','A4','A4', 'B4','A4','D5',null]),
  lyrics: ['새','벽','의','고','요','함','속','에','주','를','부','르','며','노','래','해'],
};
const s2_verseB: Line = {
  id: 's2-verse-l2',
  chords: splitChordsAcrossMeasures(['Em7', 'A', ['D', 'A/C#'], ['G', 'A']]),
  melodyNotes: quarterNotes(['E5','F#5','G5','F#5', 'E5','D5','F#5','F#5', 'F#5','E5','D5','E5', 'D5','C#5','D5',null]),
  lyrics: ['주','님','내','맘','을','만','지','시','며','새','힘','을','부','어','주','네'],
};
const s2_chorusA: Line = {
  id: 's2-chorus-l1',
  chords: chordsPerMeasure(['D', 'A/C#', 'Bm7', 'G']),
  melodyNotes: quarterNotes(['A5','A5','G5','F#5', 'E5','F#5','E5','D5', 'D5','E5','D5','B4', 'C#5','D5','E5',null]),
  lyrics: ['주','님','한','분','만','이','내','삶','의','이','유','이','시','며','빛','은'],
};
const s2_chorusB: Line = {
  id: 's2-chorus-l2',
  chords: splitChordsAcrossMeasures(['Em7', 'A', ['D', 'Bm7'], ['G', 'A']]),
  melodyNotes: quarterNotes(['G5','G5','F#5','E5', 'D5','C#5','D5','E5', 'F#5','E5','D5','E5', 'D5','C#5','D5',null]),
  lyrics: ['이','어','두','운','내','맘','속','에','주','의','빛','이','비','치','네',''],
};
const s2_bridge: Line = {
  id: 's2-bridge-l1',
  chords: chordsPerMeasure(['G', 'A', 'F#m7', 'Bm7']),
  melodyNotes: quarterNotes(['B4','C#5','D5','E5', 'D5','C#5','B4','A4', 'B4','A4','G4','A4', 'G4','F#4','A4',null]),
  lyrics: ['언','제','나','함','께','하','시','는','주','를','찬','양','드','립','니','다'],
};
const s2_outro: Line = {
  id: 's2-outro-l1',
  chords: chordsPerMeasure(['D', 'A/C#', 'Bm7', 'G', 'D']),
  melodyNotes: quarterNotes(['D5','F#5','E5','D5', 'C#5','E5','D5','B4', 'A4','C#5','B4','G4', 'A4','D5',null,null]),
  lyrics: ['새','벽','의','노','래','로','주','를','부','르','네','','','','',''],
};

/* ========== 곡 3 — 거룩한 손 (C major) ========== */
const s3_intro: Line = {
  id: 's3-intro-l1',
  chords: chordsPerMeasure(['C', 'G/B', 'Am7', 'F']),
  melodyNotes: quarterNotes(['C5','E5','D5','C5', 'B4','D5','C5','A4', 'A4','C5','B4','A4', 'G4','A4','F4',null]),
  lyrics: Array(16).fill(''),
};
const s3_verseA: Line = {
  id: 's3-verse-l1',
  chords: chordsPerMeasure(['C', 'G/B', 'Am7', 'F']),
  melodyNotes: quarterNotes(['C5','C5','D5','E5', 'D5','C5','B4','B4', 'A4','A4','B4','C5', 'A4','F4','G4',null]),
  lyrics: ['낮','은','자','리','로','오','신','주','님','우','릴','부','르','시','네',''],
};
const s3_verseB: Line = {
  id: 's3-verse-l2',
  chords: splitChordsAcrossMeasures(['Dm7', 'G', ['C', 'Am7'], ['F', 'G']]),
  melodyNotes: quarterNotes(['D5','E5','F5','E5', 'D5','C5','B4','B4', 'C5','A4','G4','A4', 'G4','F4','G4',null]),
  lyrics: ['우','리','맘','문','을','두','드','리','며','함','께','하','자','하','시','네'],
};
const s3_preChorus: Line = {
  id: 's3-pc-l1',
  chords: chordsPerMeasure(['Am7', 'Em7', 'F', 'G']),
  melodyNotes: quarterNotes(['A4','B4','C5','B4', 'A4','B4','C5','C5', 'C5','D5','E5','F5', 'E5','D5','C5',null]),
  lyrics: ['이','제','내','마','음','열','어','주','를','맞','이','하','네','오','늘',''],
};
const s3_chorusA: Line = {
  id: 's3-chorus-l1',
  chords: chordsPerMeasure(['F', 'C/E', 'Dm7', 'G']),
  melodyNotes: quarterNotes(['F5','F5','E5','D5', 'C5','D5','E5','E5', 'D5','C5','A4','A4', 'B4','C5','D5',null]),
  lyrics: ['거','룩','하','신','주','님','손','을','잡','고','걸','어','갑','니','다',''],
};
const s3_chorusB: Line = {
  id: 's3-chorus-l2',
  chords: splitChordsAcrossMeasures(['Am7', 'Dm7', ['F', 'G'], ['C', 'C']]),
  melodyNotes: quarterNotes(['E5','E5','D5','C5', 'D5','C5','A4','A4', 'F5','E5','D5','E5', 'D5','C5','C5',null]),
  lyrics: ['우','리','걸','음','지','켜','주','시','며','함','께','걸','으','시','네',''],
};
const s3_outro: Line = {
  id: 's3-outro-l1',
  chords: chordsPerMeasure(['C', 'G/B', 'Am7', 'F', 'C']),
  melodyNotes: quarterNotes(['C5','E5','D5','C5', 'B4','D5','C5','A4', 'A4','C5','B4','A4', 'G4','C5',null,null]),
  lyrics: ['주','와','함','께','걷','는','이','길','복','된','길','','','','',''],
};

/* ========== 곡 4 — 변치 않는 사랑 (F major) ========== */
const s4_intro: Line = {
  id: 's4-intro-l1',
  chords: chordsPerMeasure(['F', 'Bb', 'Dm7', 'C']),
  melodyNotes: quarterNotes(['F4','A4','G4','F4', 'E4','G4','F4','D4', 'D4','F4','E4','D4', 'C4','E4','F4',null]),
  lyrics: Array(16).fill(''),
};
const s4_verseA: Line = {
  id: 's4-verse-l1',
  chords: chordsPerMeasure(['F', 'Bb', 'Dm7', 'C']),
  melodyNotes: quarterNotes(['F4','F4','A4','A4', 'G4','E4','G4','G4', 'F4','D4','C4','C4', 'D4','C4','F4',null]),
  lyrics: ['언','제','나','한','결','같','은','주','의','사','랑','을','노','래','하','네'],
};
const s4_verseB: Line = {
  id: 's4-verse-l2',
  chords: splitChordsAcrossMeasures(['Gm7', 'C', ['F', 'Dm7'], ['Bb', 'C']]),
  melodyNotes: quarterNotes(['G4','A4','Bb4','A4', 'G4','F4','A4','A4', 'A4','G4','F4','G4', 'F4','E4','F4',null]),
  lyrics: ['오','늘','도','내','맘','어','루','만','져','새','힘','을','주','시','네',''],
};
const s4_chorusA: Line = {
  id: 's4-chorus-l1',
  chords: chordsPerMeasure(['Bb', 'F/A', 'Gm7', 'C']),
  melodyNotes: quarterNotes(['Bb4','Bb4','A4','G4', 'F4','G4','A4','A4', 'G4','F4','D4','D4', 'E4','F4','G4',null]),
  lyrics: ['변','치','않','는','주','의','사','랑','내','삶','을','감','싸','네','오','늘'],
};
const s4_chorusB: Line = {
  id: 's4-chorus-l2',
  chords: splitChordsAcrossMeasures(['Dm7', 'Gm7', ['Bb', 'C'], ['F', 'F']]),
  melodyNotes: quarterNotes(['D5','D5','C5','Bb4', 'A4','G4','A4','Bb4', 'C5','Bb4','A4','Bb4', 'A4','G4','F4',null]),
  lyrics: ['은','혜','로','우','신','주','만','이','나','의','참','된','희','망','이','네'],
};
const s4_bridge: Line = {
  id: 's4-bridge-l1',
  chords: chordsPerMeasure(['Bb', 'C', 'Am7', 'Dm7']),
  melodyNotes: quarterNotes(['F5','E5','D5','C5', 'D5','C5','Bb4','A4', 'G4','A4','Bb4','C5', 'A4','G4','F4',null]),
  lyrics: ['세','상','다','지','나','도','주','사','랑','은','영','원','하','네','늘',''],
};
const s4_outro: Line = {
  id: 's4-outro-l1',
  chords: chordsPerMeasure(['F', 'Bb', 'Dm7', 'C', 'F']),
  melodyNotes: quarterNotes(['F4','A4','G4','F4', 'E4','G4','F4','D4', 'D4','F4','E4','D4', 'C4','F4',null,null]),
  lyrics: ['변','치','않','는','주','의','사','랑','노','래','해','','','','',''],
};

/* ========== 곡 5 — 작은 발걸음 (E major) ========== */
const s5_intro: Line = {
  id: 's5-intro-l1',
  chords: chordsPerMeasure(['E', 'B/D#', 'C#m7', 'A']),
  melodyNotes: quarterNotes(['E5','G#5','F#5','E5', 'D#5','F#5','E5','C#5', 'B4','D#5','C#5','A4', 'B4','C#5','E5',null]),
  lyrics: Array(16).fill(''),
};
const s5_verseA: Line = {
  id: 's5-verse-l1',
  chords: chordsPerMeasure(['E', 'B/D#', 'C#m7', 'A']),
  melodyNotes: quarterNotes(['E5','E5','G#5','G#5', 'F#5','D#5','F#5','F#5', 'E5','C#5','B4','B4', 'C#5','B4','E5',null]),
  lyrics: ['오','늘','도','작','은','발','걸','음','으','로','주','를','따','라','가','네'],
};
const s5_chorusA: Line = {
  id: 's5-chorus-l1',
  chords: chordsPerMeasure(['A', 'E/G#', 'F#m7', 'B']),
  melodyNotes: quarterNotes(['A5','A5','G#5','F#5', 'E5','F#5','G#5','G#5', 'F#5','E5','C#5','C#5', 'D#5','E5','F#5',null]),
  lyrics: ['주','와','함','께','걸','어','가','는','이','길','이','참','평','안','이','네'],
};
const s5_chorusB: Line = {
  id: 's5-chorus-l2',
  chords: splitChordsAcrossMeasures(['C#m7', 'F#m7', ['A', 'B'], ['E', 'E']]),
  melodyNotes: quarterNotes(['G#5','G#5','F#5','E5', 'F#5','E5','C#5','C#5', 'A5','G#5','F#5','G#5', 'F#5','E5','E5',null]),
  lyrics: ['주','의','손','잡','고','한','걸','음','씩','새','롭','게','걸','어','가','네'],
};
const s5_outro: Line = {
  id: 's5-outro-l1',
  chords: chordsPerMeasure(['E', 'B/D#', 'C#m7', 'A', 'E']),
  melodyNotes: quarterNotes(['E5','G#5','F#5','E5', 'D#5','F#5','E5','C#5', 'B4','D#5','C#5','A4', 'B4','E5',null,null]),
  lyrics: ['주','와','함','께','걷','는','삶','이','복','된','길','','','','',''],
};

/* ========== 곡 6 — 마음의 노래 (A major) ========== */
const s6_intro: Line = {
  id: 's6-intro-l1',
  chords: chordsPerMeasure(['A', 'E/G#', 'F#m7', 'D']),
  melodyNotes: quarterNotes(['A4','C#5','B4','A4', 'G#4','B4','A4','F#4', 'E4','G#4','F#4','D4', 'E4','F#4','A4',null]),
  lyrics: Array(16).fill(''),
};
const s6_verseA: Line = {
  id: 's6-verse-l1',
  chords: chordsPerMeasure(['A', 'E/G#', 'F#m7', 'D']),
  melodyNotes: quarterNotes(['A4','A4','C#5','C#5', 'B4','G#4','B4','B4', 'A4','F#4','E4','E4', 'F#4','E4','A4',null]),
  lyrics: ['마','음','깊','은','곳','에','서','부','터','주','님','을','부','르','네','늘'],
};
const s6_verseB: Line = {
  id: 's6-verse-l2',
  chords: splitChordsAcrossMeasures(['Bm7', 'E', ['A', 'F#m7'], ['D', 'E']]),
  melodyNotes: quarterNotes(['B4','C#5','D5','C#5', 'B4','A4','C#5','C#5', 'C#5','B4','A4','B4', 'A4','G#4','A4',null]),
  lyrics: ['주','님','만','이','나','를','참','된','자','유','로','이','끄','시','네',''],
};
const s6_chorusA: Line = {
  id: 's6-chorus-l1',
  chords: chordsPerMeasure(['D', 'A/C#', 'Bm7', 'E']),
  melodyNotes: quarterNotes(['D5','D5','C#5','B4', 'A4','B4','C#5','C#5', 'B4','A4','F#4','F#4', 'G#4','A4','B4',null]),
  lyrics: ['내','마','음','의','노','래','주','님','만','을','향','해','드','리','네','늘'],
};
const s6_chorusB: Line = {
  id: 's6-chorus-l2',
  chords: splitChordsAcrossMeasures(['F#m7', 'Bm7', ['D', 'E'], ['A', 'A']]),
  melodyNotes: quarterNotes(['C#5','C#5','B4','A4', 'B4','A4','F#4','F#4', 'D5','C#5','B4','C#5', 'B4','A4','A4',null]),
  lyrics: ['오','직','주','만','이','나','의','진','정','한','노','래','이','시','네',''],
};
const s6_bridge: Line = {
  id: 's6-bridge-l1',
  chords: chordsPerMeasure(['D', 'E', 'C#m7', 'F#m7']),
  melodyNotes: quarterNotes(['F#5','E5','D5','C#5', 'D5','C#5','B4','A4', 'B4','A4','G#4','A4', 'G#4','F#4','A4',null]),
  lyrics: ['세','상','이','다','변','해','도','주','만','은','변','치','않','으','시','네'],
};
const s6_outro: Line = {
  id: 's6-outro-l1',
  chords: chordsPerMeasure(['A', 'E/G#', 'F#m7', 'D', 'A']),
  melodyNotes: quarterNotes(['A4','C#5','B4','A4', 'G#4','B4','A4','F#4', 'E4','G#4','F#4','D4', 'E4','A4',null,null]),
  lyrics: ['마','음','의','노','래','주','께','드','리','네','','','','','',''],
};

/* ========================================================================== */

export const SAMPLE_SONGS: Song[] = [
  {
    id: 'song-1',
    title: '은혜의 빛',
    artist: '콘티룸 워십',
    originalKey: 'G',
    currentKey: 'G',
    bpm: 72,
    timeSignature: { numerator: 4, denominator: 4 },
    form: 'Intro – Verse – Chorus – Interlude – Chorus – Outro',
    rightsStatus: 'original',
    tags: ['은혜', '평안', 'worship'],
    sections: [
      { id: 's1-intro',     type: 'intro',     label: 'Intro',     lines: [s1_intro] },
      { id: 's1-verse',     type: 'verse',     label: 'Verse 1',   lines: [s1_verseA, s1_verseB] },
      { id: 's1-chorus',    type: 'chorus',    label: 'Chorus',    lines: [s1_chorusA, s1_chorusB] },
      { id: 's1-interlude', type: 'interlude', label: 'Interlude', lines: [s1_intro] },
      { id: 's1-chorus2',   type: 'chorus',    label: 'Chorus',    lines: [s1_chorusA, s1_chorusB] },
      { id: 's1-outro',     type: 'outro',     label: 'Outro',     lines: [s1_outro] },
    ],
  },
  {
    id: 'song-2',
    title: '새벽의 노래',
    artist: '콘티룸 워십',
    originalKey: 'D',
    currentKey: 'D',
    bpm: 88,
    timeSignature: { numerator: 4, denominator: 4 },
    form: 'Intro – Verse 1 – Chorus – Verse 2 – Chorus – Bridge – Chorus – Outro',
    rightsStatus: 'original',
    tags: ['새벽', '경배', 'praise'],
    sections: [
      { id: 's2-intro',   type: 'intro',  label: 'Intro',    lines: [s2_intro] },
      { id: 's2-verse',   type: 'verse',  label: 'Verse 1',  lines: [s2_verseA, s2_verseB] },
      { id: 's2-chorus',  type: 'chorus', label: 'Chorus',   lines: [s2_chorusA, s2_chorusB] },
      { id: 's2-bridge',  type: 'bridge', label: 'Bridge',   lines: [s2_bridge] },
      { id: 's2-chorus2', type: 'chorus', label: 'Chorus',   lines: [s2_chorusA, s2_chorusB] },
      { id: 's2-outro',   type: 'outro',  label: 'Outro',    lines: [s2_outro] },
    ],
  },
  {
    id: 'song-3',
    title: '거룩한 손',
    artist: '예수전도단',
    originalKey: 'C',
    currentKey: 'C',
    bpm: 76,
    timeSignature: { numerator: 4, denominator: 4 },
    form: 'Intro – Verse 1 – Pre-Chorus – Chorus – Verse 2 – Chorus – Outro',
    rightsStatus: 'original',
    tags: ['거룩', '헌신'],
    sections: [
      { id: 's3-intro',     type: 'intro',      label: 'Intro',      lines: [s3_intro] },
      { id: 's3-verse',     type: 'verse',      label: 'Verse 1',    lines: [s3_verseA, s3_verseB] },
      { id: 's3-prechorus', type: 'pre-chorus', label: 'Pre-Chorus', lines: [s3_preChorus] },
      { id: 's3-chorus',    type: 'chorus',     label: 'Chorus',     lines: [s3_chorusA, s3_chorusB] },
      { id: 's3-outro',     type: 'outro',      label: 'Outro',      lines: [s3_outro] },
    ],
  },
  {
    id: 'song-4',
    title: '변치 않는 사랑',
    artist: '마커스 워십',
    originalKey: 'F',
    currentKey: 'F',
    bpm: 80,
    timeSignature: { numerator: 4, denominator: 4 },
    form: 'Intro – Verse 1 – Chorus – Verse 2 – Chorus – Bridge – Chorus – Outro',
    rightsStatus: 'original',
    tags: ['사랑', '신실'],
    sections: [
      { id: 's4-intro',   type: 'intro',  label: 'Intro',   lines: [s4_intro] },
      { id: 's4-verse',   type: 'verse',  label: 'Verse 1', lines: [s4_verseA, s4_verseB] },
      { id: 's4-chorus',  type: 'chorus', label: 'Chorus',  lines: [s4_chorusA, s4_chorusB] },
      { id: 's4-bridge',  type: 'bridge', label: 'Bridge',  lines: [s4_bridge] },
      { id: 's4-chorus2', type: 'chorus', label: 'Chorus',  lines: [s4_chorusA, s4_chorusB] },
      { id: 's4-outro',   type: 'outro',  label: 'Outro',   lines: [s4_outro] },
    ],
  },
  {
    id: 'song-5',
    title: '작은 발걸음',
    artist: '새 찬송가',
    originalKey: 'E',
    currentKey: 'E',
    bpm: 84,
    timeSignature: { numerator: 4, denominator: 4 },
    form: 'Intro – Verse – Chorus – Verse – Chorus – Outro',
    rightsStatus: 'original',
    tags: ['걸음', '동행'],
    sections: [
      { id: 's5-intro',  type: 'intro',  label: 'Intro',   lines: [s5_intro] },
      { id: 's5-verse',  type: 'verse',  label: 'Verse 1', lines: [s5_verseA] },
      { id: 's5-chorus', type: 'chorus', label: 'Chorus',  lines: [s5_chorusA, s5_chorusB] },
      { id: 's5-outro',  type: 'outro',  label: 'Outro',   lines: [s5_outro] },
    ],
  },
  {
    id: 'song-6',
    title: '마음의 노래',
    artist: '힐송 코리아',
    originalKey: 'A',
    currentKey: 'A',
    bpm: 92,
    timeSignature: { numerator: 4, denominator: 4 },
    form: 'Intro – Verse 1 – Chorus – Verse 2 – Chorus – Bridge – Chorus – Outro',
    rightsStatus: 'original',
    tags: ['마음', '찬양'],
    sections: [
      { id: 's6-intro',   type: 'intro',  label: 'Intro',   lines: [s6_intro] },
      { id: 's6-verse',   type: 'verse',  label: 'Verse 1', lines: [s6_verseA, s6_verseB] },
      { id: 's6-chorus',  type: 'chorus', label: 'Chorus',  lines: [s6_chorusA, s6_chorusB] },
      { id: 's6-bridge',  type: 'bridge', label: 'Bridge',  lines: [s6_bridge] },
      { id: 's6-chorus2', type: 'chorus', label: 'Chorus',  lines: [s6_chorusA, s6_chorusB] },
      { id: 's6-outro',   type: 'outro',  label: 'Outro',   lines: [s6_outro] },
    ],
  },
];

export function getSongById(id: string): Song | undefined {
  return SAMPLE_SONGS.find((s) => s.id === id);
}
