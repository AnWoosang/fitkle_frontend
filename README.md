# 👀 눈치게임 (Nunchi Game)

실시간 멀티플레이어 눈치게임 - Next.js + Supabase로 구현

## 🎮 게임 소개

눈치게임은 여러 플레이어가 순서 없이 1부터 차례대로 숫자를 외치는 게임입니다. 동시에 같은 숫자를 외치면 탈락! 마지막까지 살아남으세요!

## ✨ 주요 기능

- 🌍 **다국어 지원**: 한국어, English, 日本語, 中文, Español
- 📱 **반응형 디자인**: 모바일 최적화
- 🎯 **실시간 게임**: Supabase Realtime 활용
- 💾 **인메모리 모드**: 로컬 개발 및 테스트 지원
- 🚀 **Vercel 최적화**: Next.js App Router 사용

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Deployment**: Vercel
- **Styling**: CSS Modules

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정 (선택사항)

Supabase를 사용하려면 `.env.local` 파일을 생성하세요:

```bash
cp .env.example .env.local
```

`.env.local` 파일을 편집하여 Supabase 정보를 입력하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Note**: 환경 변수를 설정하지 않으면 자동으로 인메모리 모드로 실행됩니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어주세요.

## 🗄️ Supabase 설정

Supabase를 사용하려면 다음 SQL을 실행하세요:

```sql
-- supabase-schema.sql 파일 참조
```

## 🚀 Vercel 배포

### 1. Vercel에 프로젝트 연결

```bash
npm i -g vercel
vercel
```

### 2. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. 배포

```bash
vercel --prod
```

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지 (로비)
│   ├── globals.css        # 전역 스타일
│   └── room/[code]/       # 게임방 동적 라우트
│       └── page.tsx
├── components/            # React 컴포넌트
│   ├── GameResultModal.tsx
│   ├── GameRulesModal.tsx
│   └── PlayerList.tsx
├── contexts/              # React Context
│   └── LanguageContext.tsx
├── hooks/                 # Custom Hooks
│   └── useGameRoom.ts
├── i18n/                  # 다국어 번역
│   └── translations.ts
├── lib/                   # 라이브러리
│   ├── memoryStore.ts    # 인메모리 저장소
│   └── supabase.ts       # Supabase 클라이언트
└── types/                 # TypeScript 타입
    ├── database.ts
    └── game.ts
```

## 🎯 게임 규칙

1. 최소 3명의 플레이어가 필요합니다
2. 게임이 시작되면 1부터 순서대로 숫자를 외칩니다
3. 순서는 정해져 있지 않아요. 눈치껏 외치세요!
4. 두 명 이상이 동시에 같은 숫자를 외치면 모두 탈락!
5. n명이면 n-1개의 숫자만 외칠 수 있습니다
6. 마지막 남은 한 명도 탈락! 눈치게임에는 승자가 없습니다

## 🌍 지원 언어

- 🇰🇷 한국어
- 🇺🇸 English
- 🇯🇵 日本語
- 🇨🇳 中文
- 🇪🇸 Español

## 📄 라이선스

MIT License

## 🤝 기여

이슈와 PR을 환영합니다!

## 📞 문의

문제가 있거나 제안사항이 있으시면 이슈를 생성해주세요.
