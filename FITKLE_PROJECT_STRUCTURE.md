# Fitkle Frontend 프로젝트 구조

## 📦 프로젝트 개요
Next.js 기반의 외국인 커뮤니티 및 이벤트 플랫폼

---

## 🗂️ 현재 프로젝트 구조

```
fitkle_frontend/
├── CLAUDE.md
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── public/
└── src/
    ├── app/                    # Next.js App Router
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── events/
    │   ├── groups/
    │   ├── messages/
    │   ├── profile/
    │   ├── login/
    │   └── signup/
    │
    ├── domains/                # 도메인별 비즈니스 로직
    │   ├── event/
    │   │   ├── api/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── types/
    │   │   └── constants/
    │   ├── group/
    │   ├── message/
    │   ├── user/
    │   └── home/
    │
    ├── shared/                 # 공통 모듈
    │   ├── components/
    │   ├── layout/
    │   ├── hooks/
    │   ├── api/
    │   ├── types/
    │   └── utils/
    │
    └── fonts/
```

## 🎯 주요 특징

- ✅ 도메인 기반 아키텍처
- ✅ Next.js 15 App Router
- ✅ ResponsiveLayout 패턴
- ✅ index.ts로 Export 관리
- ✅ TypeScript Path Alias
