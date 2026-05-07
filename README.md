# contiroom

> 한국 찬양팀을 위한 악보·콘티 도구
> v0.3 — 홈 검색 / 사이드바 / 세련된 디자인 시스템

```bash
cd contiroom
npm install
npm run dev
# → http://localhost:3000
```

---

## v0.3 에서 달라진 점

### 1. 홈 화면이 새로 생겼습니다
첫 페이지는 Claude 홈처럼 **큰 검색바**를 중심으로 구성됩니다.
타이핑할 때마다 유튜브뮤직처럼 **실시간 드롭다운**이 떠서 곡을 빠르게 찾을 수 있어요.
- 부분 일치 검색: "은혜" → 은혜의 빛
- **초성 검색**: "ㅇㅎ" → 은혜의 빛
- 영문/태그 검색도 지원
- ↑↓ 방향키 + Enter 키보드 내비게이션

홈 화면 아래에는 **두 개의 메인 카드**가 있어요:
- **악보 보기** — 검색해서 리드시트 보기
- **콘티 만들기** — 여러 곡을 한 장에 자동 배치

### 2. 좌측 사이드바
악보/콘티 상세 페이지에 들어가면 좌측에 **고정 사이드바**가 등장합니다.
- 홈 / 악보 / 콘티 메인 내비게이션
- 라이브러리 (등록된 곡 목록)
- 악보 업로드 / 새 곡 만들기 (준비 중)

콘티에 곡이 추가되면 사이드바의 "콘티" 항목 옆에 카운트 배지가 자동으로 표시됩니다.

### 3. 디자인 시스템 새로 정리
이전 네이비/베이지 톤의 모눈종이 배경을 모두 걷어내고, 차분한 모노크롬으로 다시 짰어요.

| Role | Color |
|------|-------|
| 배경 | `#FAFAF7` (오프화이트) |
| 잉크 | `#0A0A0A` (소프트 블랙) |
| 액센트 | `#3730A3` (인디고 — 강조 포인트) |
| 보더 | `#E5E5E5` 계열 (neutral-200/300) |

- 모눈/그레인 텍스처 완전 제거
- 카드는 라이트 그레이 보더 + 부드러운 그림자
- 폰트 위계는 굵기 대비로 분명하게

### 4. Transpose 컨트롤 재구성
- ♯ / ♭ 토글이 **우측 상단**으로 이동
- 키 배열은 반음계 순: **C → C# → D → D# → E → F → F# → G → G# → A → A# → B**
- 4열 × 3행 그리드로 깔끔하게 정렬
- ♯ ↔ ♭ 토글하면 변화음 키가 동등 음으로 자동 변환 (C# ↔ Db)
- 원곡 키는 우상단에 점으로 표시

### 5. 섹션 라벨, "Transpose" → 영어 표기
Intro / Verse 1 / Chorus / Pre-Chorus / Bridge / Interlude / Outro
모든 음악 용어는 영어로 통일했습니다. 가사는 한국어 그대로 유지.

### 6. 샘플 곡 4 → 6곡 확장
검색 데모를 위해 2곡 추가:
- 작은 발걸음 (E major)
- 마음의 노래 (A major)

---

## 파일 구조

```
contiroom/
├─ app/
│  ├─ layout.tsx              # Pretendard CDN
│  ├─ page.tsx                # 홈/악보/콘티 라우팅
│  └─ globals.css             # 깨끗한 배경 + 스크롤바
│
├─ components/
│  ├─ HomeScreen.tsx          # ★ 첫 페이지 — 큰 검색바 + 두 개 카드
│  ├─ SearchBar.tsx           # ★ 실시간 드롭다운 검색바 (초성 지원)
│  ├─ Sidebar.tsx             # ★ 좌측 내비게이션
│  ├─ DetailLayout.tsx        # 상세 페이지 레이아웃
│  ├─ LeadSheetPreview.tsx    # 단일 곡 A4 미리보기
│  ├─ ScoreRenderer.tsx       # 5선 악보 SVG (3가지 density)
│  ├─ TransposeControl.tsx    # ♯/♭ 토글 + 반음계 키
│  ├─ SetlistBuilder.tsx      # 콘티 구성 패널
│  ├─ SetlistPreview.tsx      # 한 장 콘티 (자동 배치)
│  └─ ExportButtons.tsx       # 이미지/PDF/공유
│
├─ lib/
│  ├─ sampleData.ts           # 6곡 오리지널 (영문 섹션 라벨)
│  ├─ music/transpose.ts      # 코드 전조
│  ├─ search/songSearch.ts    # ★ 한국어 검색 (초성 매칭)
│  └─ setlist/
│     ├─ autoLayout.ts
│     └─ sectionSelect.ts
│
└─ types/
   ├─ song.ts
   └─ setlist.ts
```

---

## 검색 점수 시스템

```
title startsWith query   → 100  (제일 우선)
title includes   query   →  80
chosung startsWith query →  60   ("ㅇㅎ" → "은혜의 빛")
chosung includes   query →  40
author/tag includes      →  20
```

같은 점수일 땐 가나다순으로 정렬됩니다.

---

## 주요 화면 흐름

```
[홈]
 ├─ 검색바에 입력 → 실시간 드롭다운
 ├─ 드롭다운 클릭 → [악보] 화면
 ├─ "악보 보기" 카드 → [악보] 화면 (첫 곡)
 └─ "콘티 만들기" 카드 → [콘티] 화면

[악보] (사이드바 + 본문 + 우측 도구)
 ├─ 좌측 사이드바: 홈/악보/콘티/라이브러리
 ├─ 본문: 리드시트
 └─ 우측: Transpose / 콘티 추가 / Export

[콘티] (사이드바 + 본문 + 우측 도구)
 ├─ 좌측 사이드바: 홈/악보/콘티/라이브러리
 ├─ 본문: 한 장 콘티 (자동 배치)
 └─ 우측: 콘티 구성 / Export
```

---

## 다음 단계

1. **VexFlow 통합** — ScoreRenderer 를 진짜 음악 엔진으로
2. **html-to-image / pdf-lib** — Export 활성화
3. **Supabase 연동** — 사용자별 곡/콘티 저장
4. **OCR/OMR 업로드** — 사진 → 자동 리드시트
5. **PWA** — 아이패드/스마트폰
