# Pickdam Frontend 프로젝트 구조

## 📦 프로젝트 개요
Next.js 기반의 전자담배 가격 비교 및 커뮤니티 플랫폼

---

## 🗂️ 루트 디렉토리 구조

```
pickdam_frontend/
├── CLAUDE.md                    # AI 코딩 컨벤션 가이드
├── README.md                    # 프로젝트 문서
├── package.json                 # 의존성 및 스크립트
├── next.config.ts              # Next.js 설정
├── tailwind.config.ts          # Tailwind CSS 설정
├── tsconfig.json               # TypeScript 설정
├── eslint.config.mjs           # ESLint 설정
├── postcss.config.mjs          # PostCSS 설정
├── instrumentation.ts          # 모니터링 설정
├── public/                     # 정적 파일
└── src/                        # 소스 코드 (아래 상세 설명)
```

---

## 📂 src/ 디렉토리 상세 구조

### 1. 🎯 app/ (Next.js App Router)

```
app/
├── layout.tsx                  # 전역 레이아웃
├── page.tsx                    # 홈페이지
├── globals.css                 # 전역 스타일
│
├── providers/                  # 전역 Provider
│   └── QueryProvider.tsx       # React Query Provider
│
├── router/                     # 라우트 상수 관리
│   └── routes.ts               # 경로 상수 정의
│
├── auth/                       # 인증 관련 페이지
│   ├── signup/
│   │   ├── page.tsx           # 회원가입
│   │   └── complete/page.tsx  # 가입 완료
│   ├── verify/page.tsx        # 이메일 인증
│   ├── find-password/page.tsx # 비밀번호 찾기
│   └── reset-password/page.tsx # 비밀번호 재설정
│
├── product/                    # 제품 관련 페이지
│   ├── list/page.tsx          # 제품 목록
│   └── [id]/page.tsx          # 제품 상세
│
├── community/                  # 커뮤니티 페이지
│   ├── page.tsx               # 게시글 목록
│   ├── write/page.tsx         # 글쓰기
│   └── [id]/
│       ├── page.tsx           # 게시글 상세
│       └── edit/page.tsx      # 게시글 수정
│
├── mypage/                     # 마이페이지
│   ├── page.tsx               # 마이페이지 메인
│   ├── my-posts/page.tsx      # 내 게시글
│   ├── my-comments/page.tsx   # 내 댓글
│   └── reviews/page.tsx       # 내 리뷰
│
├── liquid-finder/              # 액상 찾기 페이지
│   └── page.tsx
│
├── events/                     # 이벤트 페이지
├── errors/                     # 에러 페이지
├── monitoring/                 # 모니터링 페이지
│
└── api/                        # API Routes (Next.js API)
    ├── auth/                   # 인증 API
    │   ├── login/route.ts
    │   ├── logout/route.ts
    │   ├── signup/route.ts
    │   ├── refresh/route.ts
    │   ├── me/route.ts
    │   ├── verify-email/route.ts
    │   ├── resend-email/route.ts
    │   ├── find-password/route.ts
    │   └── reset-password/route.ts
    │
    ├── users/                  # 유저 API
    │   ├── check-email/route.ts
    │   ├── check-nickname/route.ts
    │   └── [id]/
    │       ├── route.ts
    │       ├── stats/route.ts
    │       ├── my-posts/route.ts
    │       ├── my-comments/route.ts
    │       ├── my-reviews/route.ts
    │       └── wishlist/
    │           ├── route.ts
    │           └── [productId]/
    │               ├── route.ts
    │               └── status/route.ts
    │
    ├── products/               # 제품 API
    │   ├── route.ts
    │   ├── popular/route.ts
    │   ├── bestsellers/route.ts
    │   └── [id]/
    │       ├── route.ts
    │       ├── view/route.ts
    │       ├── reviews/route.ts
    │       └── price-history/route.ts
    │
    ├── community/              # 커뮤니티 API
    │   ├── posts/
    │   │   ├── route.ts
    │   │   ├── popular/route.ts
    │   │   └── [id]/
    │   │       ├── route.ts
    │   │       ├── view/route.ts
    │   │       └── like/route.ts
    │   └── comments/
    │       ├── route.ts
    │       └── [id]/
    │           ├── route.ts
    │           ├── like/route.ts
    │           └── replies/
    │               ├── route.ts
    │               └── [replyId]/route.ts
    │
    ├── reviews/                # 리뷰 API
    │   ├── route.ts
    │   └── [id]/route.ts
    │
    └── upload-image/           # 이미지 업로드 API
        └── route.ts
```

---

### 2. 🎨 domains/ (도메인별 비즈니스 로직)

각 도메인은 다음 구조를 따릅니다:
- `api/`: API 호출 함수
- `components/`: 도메인별 컴포넌트
- `hooks/`: 비즈니스 로직 커스텀 훅
- `types/`: 타입 정의 및 DTO
- `constants/`: Query Key, 상수 등
- `validation/`: 유효성 검증
- `store/`: 상태 관리 (필요시)

```
domains/
│
├── auth/                       # 인증 도메인
│   ├── api/
│   │   ├── authApi.ts         # 로그인, 로그아웃, 토큰 관리
│   │   └── signupApi.ts       # 회원가입 관련
│   ├── components/
│   │   ├── LoginModal.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── FindPasswordPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── form/              # 폼 필드 컴포넌트
│   │   │   ├── EmailField.tsx
│   │   │   ├── PasswordField.tsx
│   │   │   ├── NicknameField.tsx
│   │   │   └── TermsAgreement.tsx
│   │   ├── login/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RememberMeSection.tsx
│   │   │   ├── LoginDialogs.tsx
│   │   │   └── SignupPrompt.tsx
│   │   └── signup/
│   │       ├── SignupPage.tsx
│   │       ├── EmailVerifyPage.tsx
│   │       └── SignupCompletePage.tsx
│   ├── hooks/
│   │   ├── useAuthQueries.ts
│   │   ├── useAuthRedirect.ts
│   │   ├── useLoginModal.ts
│   │   ├── useLoginModalState.ts
│   │   ├── useResendEmail.ts
│   │   └── signup/
│   │       ├── useSignupQueries.ts
│   │       ├── useSignupForm.ts
│   │       ├── useEmailVerification.ts
│   │       └── useEmailCheck.ts
│   ├── types/
│   │   ├── auth.ts
│   │   └── dto/
│   │       ├── authDto.ts
│   │       └── authMapper.ts
│   ├── constants/
│   │   ├── authQueryKeys.ts
│   │   └── signupQueryKeys.ts
│   ├── validation/
│   │   └── signup.ts
│   └── store/
│       └── authStore.ts       # Zustand 인증 스토어
│
├── user/                       # 유저 도메인
│   ├── api/
│   │   ├── userApi.ts
│   │   ├── mypageApi.ts
│   │   └── wishlistApi.ts
│   ├── components/
│   │   ├── WithdrawModal.tsx
│   │   └── mypage/
│   │       ├── MypagePage.tsx
│   │       ├── MypageLayout.tsx
│   │       ├── ProfileCard.tsx
│   │       ├── ProfileEditModal.tsx
│   │       ├── MenuItem.tsx
│   │       ├── LogoutButton.tsx
│   │       ├── MyPostsPage.tsx
│   │       ├── MyPostCard.tsx
│   │       ├── MyCommentsPage.tsx
│   │       ├── MypageCommentCard.tsx
│   │       └── MyReviewsPage.tsx
│   ├── hooks/
│   │   ├── useUserQueries.ts
│   │   ├── useRecentProducts.ts
│   │   ├── useProfileEditor.ts
│   │   ├── mypage/
│   │   │   ├── useMyPageQueries.ts
│   │   │   ├── useMypage.ts
│   │   │   ├── useMyPostsPage.tsx
│   │   │   ├── useMyCommentsPage.tsx
│   │   │   └── useMyReviewsPage.tsx
│   │   └── wishlist/
│   │       ├── useWishlistQuery.ts
│   │       └── useWishlist.ts
│   ├── types/
│   │   ├── user.ts
│   │   ├── mypage.ts
│   │   └── dto/
│   │       ├── userDto.ts
│   │       ├── userMapper.ts
│   │       ├── mypageDto.ts
│   │       └── mypageMapper.ts
│   └── constants/
│       └── userQueryKeys.ts
│
├── product/                    # 제품 도메인
│   ├── api/
│   │   └── productApi.ts
│   ├── components/
│   │   ├── ProductListPage.tsx
│   │   ├── ProductListHeader.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductSortAndView.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ImageGallery.tsx
│   │   └── detail/
│   │       ├── ProductDetailPage.tsx
│   │       ├── ProductImageSection.tsx
│   │       ├── ProductImageGallery.tsx
│   │       ├── ProductBasicInfo.tsx
│   │       ├── ProductStats.tsx
│   │       ├── PriceComparisonSection.tsx
│   │       └── price-history/
│   │           ├── PriceHistoryHeader.tsx
│   │           ├── PriceHistoryChartView.tsx
│   │           ├── PriceHistoryChart.tsx
│   │           ├── PriceHistoryControls.tsx
│   │           └── PriceHistorySummary.tsx
│   ├── hooks/
│   │   ├── useProductQueries.ts
│   │   ├── useProductList.ts
│   │   ├── useProductListData.ts
│   │   ├── useProductListFilters.ts
│   │   ├── useProductListNavigation.ts
│   │   ├── useProductDetail.ts
│   │   ├── useProductImageGallery.ts
│   │   ├── useProductShare.ts
│   │   ├── useSellerComparison.ts
│   │   └── price-history/
│   │       ├── usePriceHistory.ts
│   │       ├── usePriceHistoryControls.ts
│   │       └── useChartData.ts
│   ├── types/
│   │   ├── product.ts
│   │   ├── category.ts
│   │   └── dto/
│   │       ├── productDto.ts
│   │       └── productMapper.ts
│   └── constants/
│       └── productQueryKeys.ts
│
├── review/                     # 리뷰 도메인
│   ├── api/
│   │   └── reviewApi.ts
│   ├── components/
│   │   ├── ReviewListSection.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── ReviewWriteSection.tsx
│   │   ├── ReviewEditModal.tsx
│   │   ├── ReviewAnalysisSection.tsx
│   │   └── write-form/
│   │       ├── ReviewFormHeader.tsx
│   │       ├── ReviewFormFooter.tsx
│   │       ├── ReviewRatingSection.tsx
│   │       ├── StarRating.tsx
│   │       ├── ReviewContentSection.tsx
│   │       └── ReviewImageUploadSection.tsx
│   ├── hooks/
│   │   ├── useReviewQueries.ts
│   │   ├── useReviewList.ts
│   │   ├── useReviewWriteSection.ts
│   │   └── useReviewEditForm.ts
│   ├── types/
│   │   ├── review.ts
│   │   └── dto/
│   │       ├── reviewDto.ts
│   │       └── reviewMapper.ts
│   ├── constants/
│   │   └── reviewQueryKeys.ts
│   └── validation/
│       └── reviewValidation.ts
│
├── community/                  # 커뮤니티 도메인
│   ├── api/
│   │   ├── postApi.ts
│   │   └── commentsApi.ts
│   ├── components/
│   │   ├── CommunityPage.tsx
│   │   ├── PostCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── SortSelect.tsx
│   │   ├── post/
│   │   │   ├── PostDetailPage.tsx
│   │   │   ├── PostHeader.tsx
│   │   │   ├── PostContent.tsx
│   │   │   ├── PostCategoryBadge.tsx
│   │   │   ├── PostLikeButton.tsx
│   │   │   ├── CategorySelector.tsx
│   │   │   ├── write/
│   │   │   │   └── PostWritePage.tsx
│   │   │   └── edit/
│   │   │       ├── PostEditPage.tsx
│   │   │       └── PostEditor.tsx
│   │   └── comment/
│   │       ├── CommentSection.tsx
│   │       ├── CommentList.tsx
│   │       ├── CommentCard.tsx
│   │       ├── CommentHeader.tsx
│   │       ├── CommentContent.tsx
│   │       ├── CommentForm.tsx
│   │       ├── CommentLikeButton.tsx
│   │       └── reply/
│   │           ├── CommentReplyList.tsx
│   │           └── ReplyWriteForm.tsx
│   ├── hooks/
│   │   ├── usePostQueries.ts
│   │   ├── useCommunityPage.ts
│   │   ├── usePostDetailPage.ts
│   │   ├── usePostHeader.ts
│   │   ├── usePostWritePage.ts
│   │   ├── usePostEditPage.ts
│   │   ├── usePostLikeButton.ts
│   │   ├── useQuill.ts
│   │   └── comment/
│   │       ├── useCommentQueries.ts
│   │       ├── useCommentSection.ts
│   │       ├── useCommentCard.ts
│   │       └── useCommentForm.ts
│   ├── types/
│   │   ├── community.ts
│   │   └── dto/
│   │       ├── communityDto.ts
│   │       └── communityMapper.ts
│   ├── constants/
│   │   ├── postQueryKeys.ts
│   │   └── commentQueryKeys.ts
│   └── validation/
│       └── post.ts
│
├── home/                       # 홈 도메인
│   ├── api/
│   │   └── homeApi.ts
│   ├── components/
│   │   ├── MainPage.tsx
│   │   ├── ProductSlider.tsx
│   │   └── PromoBanner.tsx
│   ├── hooks/
│   │   ├── useHomeQueries.ts
│   │   ├── useHomePage.ts
│   │   ├── useProductSlider.ts
│   │   └── usePromoBanner.ts
│   └── constants/
│       ├── homeQueryKeys.ts
│       └── banners.tsx
│
└── image/                      # 이미지 도메인
    ├── api/
    │   └── imageApi.ts
    ├── hooks/
    │   ├── useImageUploadQueries.ts
    │   ├── useImageUpload.ts
    │   ├── useImageManager.ts
    │   └── useImageViewer.ts
    ├── types/
    │   ├── Image.ts
    │   └── dto/
    │       ├── imageDto.ts
    │       └── imageMapper.ts
    ├── utils/
    │   └── compression.ts
    └── validation/
        └── image.ts
```

---

### 3. 🧩 shared/ (공통 모듈)

```
shared/
│
├── components/                 # 공통 컴포넌트
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Loading.tsx
│   ├── ErrorBoundary.tsx
│   ├── SEO.tsx
│   ├── Pagination.tsx
│   ├── ImageViewer.tsx
│   └── ...
│
├── layout/                     # 레이아웃 컴포넌트
│   ├── ResponsiveLayout.tsx   # 반응형 메인 레이아웃
│   ├── MainLayout.tsx         # 데스크톱 레이아웃
│   ├── MobileLayout.tsx       # 모바일 레이아웃
│   └── header/
│       ├── Header.tsx
│       ├── MobileHeader.tsx
│       └── components/
│           ├── Logo.tsx
│           ├── NavMenu.tsx
│           ├── UserMenu.tsx
│           ├── SearchBar.tsx
│           └── ...
│
├── hooks/                      # 공통 훅
│   ├── useMediaQuery.ts
│   ├── useDebounce.ts
│   ├── useInfiniteScroll.ts
│   ├── useLocalStorage.ts
│   └── ...
│
├── api/                        # API 기본 설정
│   ├── apiClient.ts           # Axios 인스턴스
│   └── interceptors.ts        # 인터셉터
│
├── types/                      # 공통 타입
│   ├── common.ts
│   ├── api.ts
│   └── ...
│
├── utils/                      # 유틸리티 함수
│   ├── format.ts
│   ├── validation.ts
│   ├── date.ts
│   └── ...
│
├── constants/                  # 공통 상수
│   ├── routes.ts
│   ├── config.ts
│   └── ...
│
├── config/                     # 설정
│   ├── env.ts
│   └── ...
│
├── error/                      # 에러 처리
│   └── errorHandler.ts
│
└── validation/                 # 공통 검증
    └── common.ts
```

---

### 4. 🏗️ infrastructure/ (인프라 레이어)

```
infrastructure/
│
├── api/                        # API 관련
│   └── baseApi.ts
│
├── errors/                     # 에러 처리
│   └── customErrors.ts
│
├── logging/                    # 로깅
│   └── logger.ts
│
├── monitoring/                 # 모니터링 (Sentry 등)
│   └── sentry.ts
│
└── utils/                      # 인프라 유틸
    └── ...
```

---

### 5. 🎨 fonts/ (폰트 파일)

```
fonts/
├── PretendardVariable.woff2
└── ...
```

---

## 🎯 주요 패턴 및 규칙

### 1. 계층 구조
```
컴포넌트 → 비즈니스 훅 → React Query → API 호출
```

### 2. 파일 명명 규칙
- 컴포넌트: `PascalCase.tsx` (예: `ProductCard.tsx`)
- 훅: `camelCase.ts` (예: `useProductList.ts`)
- API: `camelCase.ts` (예: `productApi.ts`)
- 타입: `camelCase.ts` (예: `product.ts`)
- 상수: `camelCase.ts` (예: `productQueryKeys.ts`)

### 3. 도메인별 구조
각 도메인은 독립적으로 운영되며, 다음 레이어를 포함:
- **API Layer**: 서버 통신
- **Hook Layer**: 비즈니스 로직
- **Component Layer**: UI 렌더링
- **Type Layer**: 타입 정의
- **Constants Layer**: 상수 관리

### 4. 반응형 처리
- Tailwind의 `sm:`, `md:`, `lg:` 유틸리티 활용
- `ResponsiveLayout`으로 데스크톱/모바일 분기

### 5. 상태 관리
- **로컬 상태**: `useState`, `useContext`
- **복잡한 상태**: `Zustand`
- **서버 상태**: `React Query (TanStack Query)`

---

## 📝 주요 기능별 위치

| 기능 | 위치 |
|-----|------|
| 로그인/회원가입 | `domains/auth/` |
| 제품 목록/상세 | `domains/product/` |
| 리뷰 작성/조회 | `domains/review/` |
| 커뮤니티 게시글/댓글 | `domains/community/` |
| 마이페이지 | `domains/user/` |
| 홈페이지 | `domains/home/` |
| 이미지 업로드 | `domains/image/` |
| 공통 컴포넌트 | `shared/components/` |
| 레이아웃 | `shared/layout/` |
| API 라우트 | `app/api/` |
| 페이지 라우트 | `app/` |

---

## 🔧 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand, React Query
- **Form Validation**: 커스텀 Validation
- **HTTP Client**: Axios
- **Monitoring**: Sentry
- **Code Quality**: ESLint, Prettier

---

## 📌 참고사항

1. 모든 컴포넌트는 최대한 작고 명확하게 분리
2. 비즈니스 로직은 반드시 커스텀 훅으로 분리
3. API 호출은 React Query를 통해 관리
4. 타입은 DTO 패턴으로 서버/클라이언트 분리
5. 공통 로직은 `shared/`에, 도메인 로직은 `domains/`에 배치
6. 각 디렉토리는 `index.ts`로 export 관리

---

**생성일**: 2025-10-31
**작성자**: Claude AI
