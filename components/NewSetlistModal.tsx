'use client';

import { useEffect, useRef, useState } from 'react';
import type { SetlistMeta } from '@/types/setlist';

interface NewSetlistModalProps {
  onConfirm: (meta: Omit<SetlistMeta, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const SERVICE_OPTIONS = [
  '1부 예배',
  '2부 예배',
  '3부 예배',
  '새벽기도',
  '수요예배',
  '금요기도회',
  '특별집회',
  '기타',
];

export default function NewSetlistModal({ onConfirm, onCancel }: NewSetlistModalProps) {
  const today = new Date().toISOString().slice(0, 10);

  const [title, setTitle]     = useState('');
  const [date, setDate]       = useState(today);
  const [church, setChurch]   = useState('');
  const [leader, setLeader]   = useState('');
  const [service, setService] = useState('');
  const [notes, setNotes]     = useState('');

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    // Close on backdrop Esc
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  function handleSubmit() {
    const trimTitle = title.trim() || '새 콘티';
    onConfirm({
      title: trimTitle,
      date,
      church: church.trim() || undefined,
      leader: leader.trim() || undefined,
      service: service || undefined,
      notes: notes.trim() || undefined,
    });
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 px-4 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      {/* Modal */}
      <div className="w-full max-w-md rounded-2xl bg-white shadow-[0_8px_64px_rgba(0,0,0,0.18)]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
          <div>
            <h2 className="text-[17px] font-bold text-neutral-900">새 콘티 만들기</h2>
            <p className="mt-0.5 text-[12px] text-neutral-500">
              콘티 정보를 입력하고 곡을 추가하세요
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">

          {/* 콘티 제목 — required */}
          <Field label="콘티 제목" required>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예) 주일 2부 찬양 콘티"
              className="input"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            />
          </Field>

          {/* 날짜 + 예배 구분 */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="날짜">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="예배 구분">
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="input"
              >
                <option value="">선택 (선택사항)</option>
                {SERVICE_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* 교회 + 담당자 */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="교회">
              <input
                type="text"
                value={church}
                onChange={(e) => setChurch(e.target.value)}
                placeholder="예) 온누리교회"
                className="input"
              />
            </Field>
            <Field label="담당자">
              <input
                type="text"
                value={leader}
                onChange={(e) => setLeader(e.target.value)}
                placeholder="예) 홍길동"
                className="input"
              />
            </Field>
          </div>

          {/* 메모 */}
          <Field label="메모">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="특이사항, 악기 편성 등 (선택사항)"
              rows={2}
              className="input resize-none"
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-neutral-100 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-[13px] font-semibold text-neutral-700 transition hover:bg-neutral-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-neutral-900 px-5 py-2 text-[13px] font-bold text-white transition hover:bg-neutral-700"
          >
            콘티 만들기 →
          </button>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #E5E5E5;
          border-radius: 10px;
          padding: 8px 12px;
          font-size: 13px;
          color: #0A0A0A;
          background: #FAFAFA;
          outline: none;
          transition: border-color 0.15s;
          font-family: inherit;
        }
        .input::placeholder { color: #A3A3A3; }
        .input:focus { border-color: #6366F1; background: #fff; }
        select.input { cursor: pointer; }
      `}</style>
    </div>
  );
}

function Field({
  label, required, children,
}: {
  label: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-neutral-600">
        {label}
        {required && <span className="ml-0.5 text-indigo-500">*</span>}
      </label>
      {children}
    </div>
  );
}
