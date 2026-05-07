export interface SetlistItem {
  id: string;
  songId: string;
  key?: string;
  memo?: string;
  order: number;
}

export interface SetlistMeta {
  id: string;
  title: string;          // e.g. "주일 2부 예배"
  date: string;           // ISO date string
  church?: string;        // e.g. "온누리교회"
  leader?: string;        // e.g. "홍길동"
  service?: string;       // e.g. "1부 예배 / 2부 예배 / 새벽기도"
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Setlist {
  meta: SetlistMeta;
  items: SetlistItem[];
}
