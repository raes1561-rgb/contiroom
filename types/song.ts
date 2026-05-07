/**
 * 콘티룸 — 핵심 타입 정의
 *
 * Section.label 은 영어로 표기 (Intro / Verse 1 / Chorus / Bridge …)
 * Section.type 은 코드 분기용 식별자.
 *
 * 데이터 구조는 향후 VexFlow / OpenSheetMusicDisplay / MusicXML 변환과
 * 호환되도록 유지합니다.
 */

export type SectionType =
  | 'intro'
  | 'verse'
  | 'pre-chorus'
  | 'chorus'
  | 'bridge'
  | 'interlude'
  | 'outro'
  | 'ending';

export type RightsStatus =
  | 'public_domain'
  | 'original'
  | 'permission_granted'
  | 'team_private'
  | 'unknown';

export interface MelodyNote {
  pitch: string | null;            // "G4" or null (rest)
  duration: 'w' | 'h' | 'q' | '8' | '16';
  beatPosition: number;            // beat index from line start
  tied?: boolean;
}

export interface ChordEvent {
  symbol: string;
  measureIndex: number;            // 0-based, within line
  beatPosition: number;            // 0-based, within measure
}

export interface Line {
  id: string;
  chords: ChordEvent[];
  melodyNotes: MelodyNote[];
  lyrics: string[];                // aligned 1:1 with melodyNotes
  measuresPerLine?: number;        // default 4
}

export interface Section {
  id: string;
  type: SectionType;
  label: string;                   // English label, e.g. "Verse 1", "Chorus"
  lines: Line[];
}

export interface TimeSignature {
  numerator: number;
  denominator: number;
}

export interface Song {
  id: string;
  title: string;
  originalKey: string;
  currentKey: string;
  bpm: number;
  timeSignature: TimeSignature;
  form: string;                    // e.g. "Intro – Verse – Chorus – Outro"
  sections: Section[];
  rightsStatus: RightsStatus;
  author?: string;
  /** 아티스트/찬양팀 이름. 찬송가이면 "새 찬송가". */
  artist?: string;
  /** Tags for search (mood, style, theme) */
  tags?: string[];
}
