# 🚨 보안 사고 해결 가이드

## 사고 개요
2025-11-01에 GitGuardian에서 민감한 정보가 GitHub에 노출되었다는 경고를 받았습니다.

### 노출된 정보
- ✅ Supabase Public Anon Key (JWT)
- ✅ Supabase Service Role Key (JWT) - **매우 위험!**
- ✅ Supabase Access Token (mcp.json) - **매우 위험!**
- ✅ Sentry Auth Token
- ✅ Generic High Entropy Secrets

## 완료된 조치

### ✅ 1. Git 히스토리 정리
- `env.local` 파일을 전체 Git 히스토리에서 완전히 제거
- `mcp.json` 파일을 전체 Git 히스토리에서 완전히 제거
- `.gitignore` 강화로 향후 유사 사고 방지
- `.env.example` 및 `mcp.json.example` 템플릿 파일 생성

### ✅ 2. 강제 푸시 완료
- GitHub 원격 저장소에 정리된 히스토리 강제 업데이트 완료
- 최종 커밋 해시: `e16b2e9`

---

## ⚠️ 즉시 해야 할 작업

### 🔴 중요: 모든 시크릿 키를 즉시 재발급해야 합니다!

Git 히스토리를 정리했지만, **이미 노출된 키는 여전히 위험합니다.**
악의적인 사용자가 이미 키를 복사했을 가능성이 있습니다.

---

## 📋 키 재발급 체크리스트

### 1. Supabase 키 재발급 (최우선!)

#### Service Role Key 재발급
1. https://supabase.com/dashboard 접속
2. 프로젝트 선택: `jyzusgfmajdarftoxmbk`
3. **Settings** → **API** 이동
4. **Service Role Key** 섹션에서 **Reset Key** 클릭
5. 새로운 키를 복사하여 `.env.local` 파일에 붙여넣기:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=새로운_키_여기에_붙여넣기
   ```

#### Anon Key 확인 (필요시 재발급)
1. 같은 페이지에서 **Anon Public Key** 확인
2. 필요시 재발급
3. `.env.local` 업데이트:
   ```bash
   NEXT_PUBLIC_SUPABASE_ANON_KEY=새로운_키_여기에_붙여넣기
   ```

### 2. Supabase Access Token 재발급 (mcp.json용)

#### Access Token 재발급
1. https://supabase.com/dashboard 접속
2. 프로젝트 선택: `jyzusgfmajdarftoxmbk`
3. **Settings** → **Access Tokens** 이동
4. 기존 노출된 토큰 찾기:
   - `sbp_ab506e3c0748f8b2a9aa37086eda4b094692f54b`
5. **Delete** 클릭하여 기존 토큰 삭제
6. **Generate new token** 클릭
   - Name: `MCP Server Token` (또는 원하는 이름)
   - Scopes: 필요한 권한 선택
7. 생성된 새 토큰을 `mcp.json`에 붙여넣기:
   ```json
   {
     "mcpServers": {
       "supabase": {
         "env": {
           "SUPABASE_ACCESS_TOKEN": "새로운_토큰_여기에_붙여넣기",
           "SUPABASE_PROJECT_REF": "jyzusgfmajdarftoxmbk"
         }
       }
     }
   }
   ```

### 3. Sentry Auth Token 재발급

1. https://sentry.io/settings/pickdam/auth-tokens/ 접속
2. 기존 노출된 토큰 찾기:
   - `sntrys_eyJpYXQiOjE3NTkxNTY2ODYuMTEzMjIsInVybCI6...` (일부)
3. **Delete** 클릭하여 기존 토큰 삭제
4. **Create New Token** 클릭
   - Name: `Production Deploy Token` (또는 원하는 이름)
   - Scopes:
     - ✅ `project:releases`
     - ✅ `org:read`
5. 생성된 새 토큰을 `.env.local`에 붙여넣기:
   ```bash
   SENTRY_AUTH_TOKEN=새로운_토큰_여기에_붙여넣기
   ```

### 4. .env.local 및 mcp.json 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 새로운 키들을 입력하세요:

```bash
# .env.example를 복사하여 시작
cp .env.example .env.local

# 편집기로 열기
code .env.local  # VS Code
# 또는
nano .env.local  # 터미널
```

새로운 키들로 값을 채우세요:
```env
# Supabase 연결 설정
NEXT_PUBLIC_SUPABASE_URL=https://jyzusgfmajdarftoxmbk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=새로운_anon_키

# 🔒 서버 전용 키
SUPABASE_SERVICE_ROLE_KEY=새로운_service_role_키

# 애플리케이션 설정
NEXT_PUBLIC_APP_URL=https://pickdam.co.kr

# 이미지 저장 경로 설정
NEXT_PUBLIC_STORAGE_BUCKET_NAME=pickdam

# Sentry 설정
NEXT_PUBLIC_SENTRY_DSN=https://540698468ea70f650f838042a222ad82@o4510006625239040.ingest.us.sentry.io/4510006675046400
SENTRY_AUTH_TOKEN=새로운_sentry_토큰

# NODE_ENV 명시적 설정
NODE_ENV=development
```

#### mcp.json 파일 설정
```bash
# mcp.json.example을 복사
cp mcp.json.example mcp.json

# 편집기로 열기
code mcp.json  # VS Code
# 또는
nano mcp.json  # 터미널
```

새로운 Access Token으로 값을 채우세요:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@0.4.0"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "새로운_access_token",
        "SUPABASE_PROJECT_REF": "jyzusgfmajdarftoxmbk"
      }
    }
  }
}
```

### 5. 애플리케이션 테스트

키를 재발급한 후 반드시 애플리케이션이 정상 작동하는지 확인하세요:

```bash
# 개발 서버 실행
npm run dev

# 다음 기능들이 정상 작동하는지 테스트:
# - Supabase 데이터베이스 연결
# - 인증 (로그인/로그아웃)
# - 이미지 업로드
# - Sentry 에러 리포팅
```

---

## 📊 GitGuardian 해결 확인

### 1. Incident 해결 표시
1. GitGuardian 대시보드 접속
2. 해당 incident 찾기
3. "Mark as Resolved" 또는 "False Positive" 선택
4. 사유 입력:
   ```
   - All exposed secrets have been regenerated
   - Sensitive file removed from git history
   - .gitignore strengthened to prevent future incidents
   ```

### 2. 재스캔 대기
- GitGuardian이 자동으로 저장소를 재스캔합니다
- 24시간 내에 경고가 사라지는지 확인

---

## 🔒 향후 예방 조치

### .gitignore 규칙 확인
다음 파일들이 자동으로 무시됩니다:
- `.env`
- `.env.*`
- `.env.local`
- `env.local` (점 없는 버전도!)
- `.supabase/`
- `*secret*`
- `*credentials*`

### Pre-commit Hook 설정 (권장)
```bash
# git-secrets 설치
brew install git-secrets

# 저장소에 git-secrets 설정
git secrets --install
git secrets --register-aws

# Supabase 키 패턴 추가
git secrets --add 'eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*'

# 스캔
git secrets --scan
```

---

## ✅ 완료 체크리스트

### Git 히스토리 정리 (완료)
- [x] `env.local` Git 히스토리에서 완전히 제거
- [x] `mcp.json` Git 히스토리에서 완전히 제거
- [x] `.gitignore` 강화
- [x] 템플릿 파일 생성 (`.env.example`, `mcp.json.example`)
- [x] GitHub에 강제 푸시 완료

### 키 재발급 (즉시 필요!)
- [ ] **Supabase Service Role Key 재발급** ⚠️
- [ ] **Supabase Access Token 재발급** ⚠️
- [ ] Supabase Anon Key 확인/재발급
- [ ] Sentry Auth Token 재발급
- [ ] `.env.local` 파일 생성 및 새 키 입력
- [ ] `mcp.json` 파일 생성 및 새 키 입력
- [ ] 애플리케이션 테스트 (로그인, DB 연결, MCP 서버 등)

### 사후 확인
- [ ] GitGuardian incident 해결 표시
- [ ] 24시간 후 GitGuardian 재확인
- [ ] 팀원들에게 변경사항 공유

---

## 📞 도움이 필요한 경우

- Supabase 키 재발급 가이드: https://supabase.com/docs/guides/api/api-keys
- Sentry 토큰 관리: https://docs.sentry.io/product/accounts/auth-tokens/
- GitGuardian 문서: https://docs.gitguardian.com/

---

**작성일**: 2025-11-01
**작성자**: Claude Code
**상태**: ✅ Git 히스토리 정리 완료 / ⚠️ 키 재발급 필요
