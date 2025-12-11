# 언어 규칙
- 모든 응답은 한글로 작성한다.
- 코드 주석도 가능한 한글로 작성한다.
- 기술 용어는 필요시 영문 병기 가능 (예: "컴포넌트(Component)")

# 코드를 수정해야하는 일을 할때
- 항상 코드에 대한 수정을 할때는 해당 코드의 상위 컴포넌트들까지 다 조회해서 분석한뒤에 답변해줘
- 만약 비슷한 문제가 반복되면 오류를 추적할수있게 디버깅코드를 작성해줘
- 사용자가 명시적으로 요청하지 않는 한 절대로 git을 통해 이전 버전으로 되돌리지 않는다 (git restore, git checkout 등 사용 금지)
- 하위호환성을 고려하지 않는다

# 프로젝트 (next.js) 규칙 

- 공통 컴포넌트는 src/shared/components에, 기능별 컴포넌트는 src/domains/에 분리한다.
- 페이지는 src/app/(app router) 에 위치시킨다.
- 반응형은 Tailwind의 반응형 유틸리티(sm:, md:, lg: 등)로 구현한다.
- 모든 라우팅은 Next.js의 파일 기반 라우팅(app router) 을 사용한다.
- 동적 라우트, 중첩 라우트, 레이아웃 등은 공식 Next.js 방식에 맞춘다.
- 라우트 상수/경로는 src/app/router/routes.ts 에서 관리한다.
- 간단한 상태는 React의 useState/useContext, 복잡한 상태는 Zustand, Recoil, Jotai, Redux 등을 사용한다.
- 서버 상태는 React Query(TanStack Query)로 관리한다.
- 각 index.ts로 export를 관리한다.


# 스타일 규칙
- 글로벌 색상/폰트/테마는 tailwind.config.js에서 관리한다.
- 버튼, 메뉴 등 클릭 가능한 요소에는 cursor-pointer와 hover: 효과를 반드시 적용한다.
- 글로벌 스타일은 src/app/globals.css 또는 src/styles/에서 관리한다.
- next.js 공식문서를 참고해서 대답해줘.

# API-Endpoint-Rule

- 모든 API은 Restful 원칙을 따릅니다.

# 데이터베이스 관련 규칙

- DATABASE_SCHEMA.md 파일을 절대 참고하지 않는다.
- 데이터베이스 스키마, 테이블 구조, 관계 등을 확인해야 할 때는 반드시 Supabase MCP 도구를 사용한다.
- 데이터베이스 관련 작업 전에는 항상 mcp__supabase__list_tables, mcp__supabase__execute_sql 등의 MCP 도구로 현재 상태를 먼저 확인한다.
- DATABASE_SCHEMA.md는 문서로만 사용하며, 실제 DB 작업 시에는 절대 신뢰하지 않는다.
- **DB 테이블 생성/수정/삭제, 트리거 생성/삭제, 함수 생성/삭제 등 데이터베이스 스키마를 변경하는 모든 작업은 반드시 사용자에게 먼저 허락을 받고 진행한다.**
- 단순 SELECT 쿼리나 데이터 조회는 허락 없이 진행 가능하나, INSERT/UPDATE/DELETE/DROP/CREATE/ALTER 등의 작업은 무조건 사용자 승인 필요.

## 기능 구현 시 작업 프로세스

사용자가 기능 구현 또는 수정을 요구할 경우 다음 순서를 반드시 따른다:

### 1단계: 테이블 구조 파악
- Supabase MCP 도구를 사용하여 관련 테이블의 구조를 조회한다.
- **테이블명을 반드시 정확히 확인한다** (예: `interests` vs `interest`, `preferences` vs `preference` 등 단수/복수 혼동 방지)
- 필드(컬럼) 목록, 데이터 타입을 확인한다.
- 제약조건(PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL 등)을 파악한다.
- CHECK 제약조건이 있는지 확인한다.
- 인덱스, 트리거, RLS 정책 등 관련 DB 객체를 확인한다.
- **Storage 버킷을 사용할 경우 버킷명도 정확히 확인한다** (예: `avatars` vs `avatar`, `event-images` vs `event_images` 등)

### 2단계: 구현 방법 분석 및 제안
다음 방법들의 장단점을 분석하고 제시한다:

**A. 직접 쿼리 (Supabase Client Query)**
- 장점: 간단한 CRUD 작업에 적합, 코드 직관적
- 단점: 복잡한 비즈니스 로직 처리 어려움, 네트워크 왕복 증가 가능

**B. RPC (Remote Procedure Call - Database Function)**
- 장점: 복잡한 비즈니스 로직을 DB에서 처리, 성능 최적화, 트랜잭션 보장
- 단점: DB에 로직 의존, 디버깅 상대적으로 어려움

**C. Edge Function**
- 장점: 서버리스 환경에서 실행, 복잡한 외부 API 통합, 유연한 비즈니스 로직
- 단점: 콜드 스타트 지연, DB와의 추가 네트워크 통신 필요

**D. Database Function (Stored Procedure/Function)**
- 장점: DB 레벨에서 실행되어 최고 성능, 트랜잭션 안정성, 재사용성
- 단점: PostgreSQL 문법 필요, 버전 관리 복잡

현재 상황에 맞는 최선의 방법과 그 이유를 명확히 제시한다.

### 3단계: DB 최적화 쿼리 분석
- 선택된 방법에서 실제로 실행될 SQL 쿼리를 보여준다.
- 쿼리 실행 계획(EXPLAIN ANALYZE)을 고려한 최적화 방안을 설명한다.
- 인덱스 활용 여부, JOIN 전략, WHERE 절 최적화 등을 분석한다.
- 예상 성능 및 병목 지점을 설명한다.
- 필요시 대안 쿼리와 비교 분석을 제공한다.

### 4단계: 사용자 승인 후 구현
- 사용자가 제안한 방법에 동의하면 그때 실제 구현을 시작한다.
- 구현 시 1~3단계에서 분석한 내용을 바탕으로 진행한다.
- **코드 작성 시 테이블명, 컬럼명, Storage 버킷명을 1단계에서 확인한 정확한 이름으로 사용한다.**
- **절대로 추측하거나 일반적인 명명 규칙으로 가정하지 않는다.**
- 구현 완료 후 테스트 방법을 제안한다.


# 코딩 스타일

- 함수형/선언형 스타일을 우선한다.
- 변수명, 함수명은 명확하고 일관성 있게 작성한다(예: isLoading, hasError).
- 컴포넌트는 최대한 작고 명확하게 분리한다.
- 불필요하게 긴 코드/로직은 작은 함수로 분리한다.
- 불필요한 주석/코드는 남기지 않는다.
- console.log 대신 log 유틸리티 사용(필요시).
- 복잡한 로직, 비직관적 코드에는 간단한 주석을 남긴다.
- 공식 Next.js, Tailwind, 상태관리 라이브러리 공식문서를 참고해 구현한다.
- 코드 라인 길이 80자 이하 권장, 여러 prop/인자/클래스는 줄바꿈 및 trailing comma 사용.
- 공통 유틸리티 함수는 src/utils/에 작성한다.
- API 통신은 src/api/ 또는 src/domains/xxx/api/에서 관리한다.
- 테스트는 Jest/React Testing Library 등으로 작성한다(권장).