# 코드를 수정해야하는 일을 할때
- 항상 코드에 대한 수정을 할때는 해당 코드의 상위 컴포넌트들까지 다 조회해서 분석한뒤에 답변해줘
- 만약 비슷한 문제가 반복되면 오류를 추적할수있게 디버깅코드를 작성해줘

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