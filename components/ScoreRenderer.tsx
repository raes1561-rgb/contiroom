'use client';

/**
 * ScoreRenderer
 * --------------------------------------------------------------------------
 * 한 Section 을 5선 악보 + 코드 + 가사로 그립니다 (인라인 SVG).
 *
 *  v3 변경점:
 *   - 잉크 색을 짙은 네이비(#0F1E3D) 에서 차분한 잉크블랙(#0A0A0A) 으로
 *   - section label 영문 표기에 맞춘 letter spacing 미세 조정
 *
 *  좌표 시스템:
 *   - 클레프/조표/박자표 영역과 마디 영역을 분리하여 모든 마디 너비 균일
 *   - 음표는 마디 내부 박 위치 기반으로 정확히 배치
 *   - 5선 위/아래 음표에 ledger line 자동 추가
 */

import type { Section, MelodyNote, ChordEvent, TimeSignature } from '@/types/song';
import { transposeChordByKey, semitoneDistance } from '@/lib/music/transpose';

export type ScoreDensity = 'normal' | 'compact' | 'ultra-compact';

interface ScoreRendererProps {
  section: Section;
  originalKey: string;
  currentKey: string;
  timeSignature: TimeSignature;
  showSectionLabel?: boolean;
  startingMeasure?: number;
  showClefAndMeter?: boolean;
  density?: ScoreDensity;
}

const INK = '#0A0A0A';
const INK_MUTED = '#737373';

interface DensityConfig {
  viewBoxWidth: number;
  staffLineGap: number;
  chordRowHeight: number;
  lyricRowHeight: number;
  linePadBottom: number;
  chordFontSize: number;
  lyricFontSize: number;
  measureNumFontSize: number;
  paddingLeft: number;
  paddingRight: number;
  clefSpace: number;
  noteHeadSize: number;
  stemMultiplier: number;
}

const DENSITY: Record<ScoreDensity, DensityConfig> = {
  'normal': {
    viewBoxWidth: 720,
    staffLineGap: 7,
    chordRowHeight: 18,
    lyricRowHeight: 22,
    linePadBottom: 18,
    chordFontSize: 11,
    lyricFontSize: 11,
    measureNumFontSize: 9,
    paddingLeft: 28,
    paddingRight: 24,
    clefSpace: 42,
    noteHeadSize: 3.4,
    stemMultiplier: 0.85,
  },
  'compact': {
    viewBoxWidth: 380,
    staffLineGap: 5.4,
    chordRowHeight: 13,
    lyricRowHeight: 16,
    linePadBottom: 8,
    chordFontSize: 8.2,
    lyricFontSize: 8.2,
    measureNumFontSize: 6.5,
    paddingLeft: 14,
    paddingRight: 10,
    clefSpace: 28,
    noteHeadSize: 2.6,
    stemMultiplier: 0.85,
  },
  'ultra-compact': {
    viewBoxWidth: 380,
    staffLineGap: 4.2,
    chordRowHeight: 10.5,
    lyricRowHeight: 12.5,
    linePadBottom: 4,
    chordFontSize: 7,
    lyricFontSize: 7,
    measureNumFontSize: 5.5,
    paddingLeft: 12,
    paddingRight: 8,
    clefSpace: 22,
    noteHeadSize: 2.1,
    stemMultiplier: 0.85,
  },
};

const NOTE_LETTER_INDEX: Record<string, number> = {
  C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6,
};

function pitchToY(pitch: string | null, topY: number, gap: number): number | null {
  if (pitch === null) return null;
  const m = pitch.match(/^([A-G])([#b]?)(-?\d)$/);
  if (!m) return null;
  const [, letter, , octStr] = m;
  const octave = parseInt(octStr, 10);
  const stepsFromF5 = (5 - octave) * 7 + (NOTE_LETTER_INDEX['F'] - NOTE_LETTER_INDEX[letter]);
  return topY + stepsFromF5 * (gap / 2);
}

function TrebleClef({ x, topY, gap }: { x: number; topY: number; gap: number }) {
  return (
    <text
      x={x}
      y={topY + gap * 4 * 0.95}
      fontSize={gap * 4 * 1.5}
      fontFamily="'Times New Roman', serif"
      fill={INK}
    >
      𝄞
    </text>
  );
}

function relativeMajor(minorKey: string): string {
  const m = minorKey.slice(0, -1);
  const map: Record<string, string> = {
    A:'C', E:'G', B:'D', 'F#':'A', 'C#':'E', 'G#':'B', 'D#':'F#',
    D:'F', G:'Bb', C:'Eb', F:'Ab', Bb:'Db', Eb:'Gb',
  };
  return map[m] ?? 'C';
}

function KeySignature({
  startX, topY, gap, musicKey,
}: { startX: number; topY: number; gap: number; musicKey: string }) {
  const sharps: Record<string, number> = { C:0, G:1, D:2, A:3, E:4, B:5, 'F#':6, 'C#':7 };
  const flats:  Record<string, number> = { F:1, Bb:2, Eb:3, Ab:4, Db:5, Gb:6, Cb:7 };
  const root = musicKey.endsWith('m') ? relativeMajor(musicKey) : musicKey;
  const ns = sharps[root];
  const nf = flats[root];

  const sharpYsteps = [0, 1.5, -0.5, 1, 2.5, 1, 2.5];
  const flatYsteps  = [2, 0.5, 2.5, 1, 3, 1.5, 3.5];
  const items: { glyph: string; y: number; ox: number }[] = [];
  if (ns && ns > 0) {
    for (let i = 0; i < ns; i++) {
      items.push({ glyph: '♯', y: topY + sharpYsteps[i] * gap, ox: i * gap * 0.85 });
    }
  } else if (nf && nf > 0) {
    for (let i = 0; i < nf; i++) {
      items.push({ glyph: '♭', y: topY + flatYsteps[i] * gap, ox: i * gap * 0.85 });
    }
  }

  return (
    <g>
      {items.map((it, i) => (
        <text
          key={i}
          x={startX + it.ox}
          y={it.y + gap * 0.55}
          fontSize={gap * 2.4}
          fill={INK}
          fontFamily="serif"
        >
          {it.glyph}
        </text>
      ))}
    </g>
  );
}

function TimeSig({ x, topY, gap, ts }: { x: number; topY: number; gap: number; ts: TimeSignature }) {
  return (
    <g>
      <text x={x} y={topY + gap * 1.7} fontSize={gap * 2} fontFamily="'Times New Roman', serif" fontWeight={700} fill={INK}>
        {ts.numerator}
      </text>
      <text x={x} y={topY + gap * 3.7} fontSize={gap * 2} fontFamily="'Times New Roman', serif" fontWeight={700} fill={INK}>
        {ts.denominator}
      </text>
    </g>
  );
}

function NoteHead({
  x, y, duration, headSize, stemHeight,
}: {
  x: number; y: number;
  duration: MelodyNote['duration'];
  headSize: number;
  stemHeight: number;
}) {
  const isHollow = duration === 'w' || duration === 'h';
  const showStem = duration !== 'w';
  const stemX = x + headSize * 0.92;
  const stemTopY = y - stemHeight;

  return (
    <g>
      <ellipse
        cx={x} cy={y}
        rx={headSize} ry={headSize * 0.74}
        transform={`rotate(-22 ${x} ${y})`}
        fill={isHollow ? 'none' : INK}
        stroke={INK}
        strokeWidth={isHollow ? 0.9 : 0.5}
      />
      {showStem && (
        <line x1={stemX} y1={y - 0.4} x2={stemX} y2={stemTopY} stroke={INK} strokeWidth={0.9} />
      )}
      {duration === '8' && (
        <path
          d={`M ${stemX} ${stemTopY} q ${headSize * 1.5} ${headSize} ${headSize * 1.5} ${headSize * 2.6}`}
          stroke={INK} strokeWidth={1} fill="none"
        />
      )}
      {duration === '16' && (
        <>
          <path d={`M ${stemX} ${stemTopY} q ${headSize * 1.5} ${headSize} ${headSize * 1.5} ${headSize * 2.6}`} stroke={INK} strokeWidth={1} fill="none" />
          <path d={`M ${stemX} ${stemTopY + headSize * 1.5} q ${headSize * 1.5} ${headSize} ${headSize * 1.5} ${headSize * 2.6}`} stroke={INK} strokeWidth={1} fill="none" />
        </>
      )}
    </g>
  );
}

function Rest({
  x, topY, gap, duration,
}: {
  x: number; topY: number; gap: number;
  duration: MelodyNote['duration'];
}) {
  const cy = topY + gap * 2;
  if (duration === 'q') {
    return (
      <path
        d={`M ${x - gap * 0.3} ${cy - gap * 0.9} q ${gap * 0.55} ${gap * 0.5} 0 ${gap * 1.05} q ${-gap * 0.55} ${gap * 0.5} 0 ${gap}`}
        stroke={INK} strokeWidth={1.0} fill="none"
      />
    );
  }
  return <rect x={x - gap * 0.4} y={duration === 'w' ? cy - gap * 0.6 : cy} width={gap * 0.8} height={gap * 0.4} fill={INK} />;
}

export default function ScoreRenderer({
  section,
  originalKey,
  currentKey,
  timeSignature,
  showSectionLabel = true,
  startingMeasure = 1,
  showClefAndMeter = true,
  density = 'normal',
}: ScoreRendererProps) {
  const cfg = DENSITY[density];
  const semis = semitoneDistance(originalKey, currentKey);
  const staffHeight = cfg.staffLineGap * 4;
  const lineTotalHeight = cfg.chordRowHeight + staffHeight + cfg.lyricRowHeight + cfg.linePadBottom;

  let measureCounter = startingMeasure;
  const lineMeta = section.lines.map((line) => {
    const start = measureCounter;
    measureCounter += line.measuresPerLine ?? 4;
    return { line, start };
  });

  const totalHeight = lineMeta.length * lineTotalHeight + 2;

  return (
    <div className="w-full">
      {showSectionLabel && (
        <div className="mb-1.5 inline-flex items-center gap-2">
          <span
            className="rounded-md border border-neutral-300 bg-white px-2 py-0.5 font-semibold uppercase tracking-[0.12em] text-neutral-900"
            style={{
              fontSize: density === 'normal' ? 10 : density === 'compact' ? 8.5 : 7.5,
            }}
          >
            {section.label}
          </span>
        </div>
      )}

      <svg
        viewBox={`0 0 ${cfg.viewBoxWidth} ${totalHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="block w-full"
        role="img"
        aria-label={`${section.label} score`}
      >
        {lineMeta.map((rl, lineIdx) => {
          const lineY = lineIdx * lineTotalHeight;
          const chordRowY = lineY + cfg.chordRowHeight - 4;
          const staffTopY = lineY + cfg.chordRowHeight + 2;
          const lyricRowY = staffTopY + staffHeight + cfg.lyricRowHeight - 6;

          const renderClef = showClefAndMeter && lineIdx === 0;

          const staffStartX = cfg.paddingLeft;
          const measuresStartX = staffStartX + (renderClef ? cfg.clefSpace : 0);
          const measuresEndX = cfg.viewBoxWidth - cfg.paddingRight;
          const measuresWidth = measuresEndX - measuresStartX;
          const measuresPerLine = rl.line.measuresPerLine ?? 4;
          const measureWidth = measuresWidth / measuresPerLine;
          const beatsPerMeasure = timeSignature.numerator;
          const slotWidth = measureWidth / beatsPerMeasure;

          const totalBeats = measuresPerLine * beatsPerMeasure;
          const notes = rl.line.melodyNotes;
          const notesPerBeat = notes.length / totalBeats;
          const noteSlotWidth = measureWidth / (beatsPerMeasure * Math.max(notesPerBeat, 1));

          function noteX(noteIndex: number): number {
            const beatPos = noteIndex / Math.max(notesPerBeat, 1);
            const measureIdx = Math.min(measuresPerLine - 1, Math.floor(beatPos / beatsPerMeasure));
            const beatInMeasure = beatPos - measureIdx * beatsPerMeasure;
            return measuresStartX
              + measureIdx * measureWidth
              + beatInMeasure * slotWidth
              + noteSlotWidth / 2;
          }

          function chordX(c: ChordEvent): number {
            return measuresStartX
              + c.measureIndex * measureWidth
              + (c.beatPosition / beatsPerMeasure) * measureWidth
              + cfg.staffLineGap * 0.4;
          }

          return (
            <g key={lineIdx}>
              <text
                x={staffStartX - 2}
                y={staffTopY - cfg.staffLineGap * 0.4}
                fontSize={cfg.measureNumFontSize}
                fill={INK_MUTED}
                fontFamily="'Times New Roman', serif"
                fontStyle="italic"
              >
                {rl.start}
              </text>

              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1={staffStartX}
                  y1={staffTopY + i * cfg.staffLineGap}
                  x2={measuresEndX}
                  y2={staffTopY + i * cfg.staffLineGap}
                  stroke={INK}
                  strokeWidth={0.55}
                />
              ))}

              {renderClef && (
                <>
                  <TrebleClef x={staffStartX + 2} topY={staffTopY} gap={cfg.staffLineGap} />
                  <KeySignature
                    startX={staffStartX + cfg.clefSpace * 0.45}
                    topY={staffTopY}
                    gap={cfg.staffLineGap}
                    musicKey={currentKey}
                  />
                  <TimeSig
                    x={measuresStartX - cfg.staffLineGap * 1.6}
                    topY={staffTopY}
                    gap={cfg.staffLineGap}
                    ts={timeSignature}
                  />
                </>
              )}

              {Array.from({ length: measuresPerLine + 1 }).map((_, i) => {
                const x = measuresStartX + i * measureWidth;
                const isFinal = i === measuresPerLine;
                return (
                  <line
                    key={i}
                    x1={x}
                    y1={staffTopY}
                    x2={x}
                    y2={staffTopY + staffHeight}
                    stroke={INK}
                    strokeWidth={isFinal ? 1.4 : 0.6}
                  />
                );
              })}

              {rl.line.chords.map((ce, i) => {
                const sym = transposeChordByKey(ce.symbol, originalKey, currentKey);
                return (
                  <text
                    key={i}
                    x={chordX(ce)}
                    y={chordRowY}
                    fontSize={cfg.chordFontSize}
                    fontWeight={600}
                    fontFamily="'Times New Roman', serif"
                    fill={INK}
                  >
                    {sym}
                  </text>
                );
              })}

              {notes.map((note, i) => {
                const cx = noteX(i);
                if (note.pitch === null) {
                  return <Rest key={i} x={cx} topY={staffTopY} gap={cfg.staffLineGap} duration={note.duration} />;
                }
                const y = pitchToY(note.pitch, staffTopY, cfg.staffLineGap);
                if (y === null) return null;

                const ledgerLines: number[] = [];
                if (y < staffTopY) {
                  for (let ly = staffTopY - cfg.staffLineGap; ly >= y - 0.5; ly -= cfg.staffLineGap) {
                    ledgerLines.push(ly);
                  }
                } else if (y > staffTopY + staffHeight) {
                  for (let ly = staffTopY + staffHeight + cfg.staffLineGap; ly <= y + 0.5; ly += cfg.staffLineGap) {
                    ledgerLines.push(ly);
                  }
                }

                return (
                  <g key={i}>
                    {ledgerLines.map((ly, j) => (
                      <line
                        key={j}
                        x1={cx - cfg.noteHeadSize * 1.6}
                        y1={ly}
                        x2={cx + cfg.noteHeadSize * 1.6}
                        y2={ly}
                        stroke={INK}
                        strokeWidth={0.6}
                      />
                    ))}
                    <NoteHead
                      x={cx}
                      y={y}
                      duration={note.duration}
                      headSize={cfg.noteHeadSize}
                      stemHeight={staffHeight * cfg.stemMultiplier}
                    />
                  </g>
                );
              })}

              {rl.line.lyrics.map((syll, i) => {
                if (!syll) return null;
                const cx = noteX(i);
                return (
                  <text
                    key={i}
                    x={cx}
                    y={lyricRowY}
                    fontSize={cfg.lyricFontSize}
                    fontFamily="'Pretendard Variable', 'Pretendard', system-ui, sans-serif"
                    textAnchor="middle"
                    fill={INK}
                  >
                    {syll}
                  </text>
                );
              })}
            </g>
          );
        })}
      </svg>

      {showSectionLabel && semis !== 0 && density === 'normal' && (
        <div className="mt-1 text-[10px] tracking-[0.16em] text-neutral-400">
          Transposed {originalKey} → {currentKey}
        </div>
      )}
    </div>
  );
}
