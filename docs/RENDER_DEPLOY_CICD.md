# 미래스마트산업진흥원 MVP Render 배포 및 CI/CD 가이드

## 1. 배포 목표

이 프로젝트는 하나의 GitHub 저장소 안에 프런트엔드와 백엔드가 함께 있는 모노레포 구조입니다.

- 프런트엔드: `apps/web` → Vercel
- 백엔드: `apps/api` → Render
- CI: GitHub Actions
- CD: Render Auto-Deploy
- 데이터 저장: 기본 메모리, 선택적으로 MongoDB Atlas

이번 단계에서는 백엔드 API를 먼저 Render에 배포합니다.

## 2. 준비 사항

- GitHub 계정
- Render 계정
- Git 설치
- Node.js `22.16.0` 이상, `23` 미만
- 프로젝트 압축 해제

권장 프로젝트 폴더:

```text
D:\fspip_web_workspace2026\fsipi-mvp
```

Node.js 버전을 확인합니다.

```powershell
node --version
npm --version
```

## 3. 로컬 검증

프로젝트 루트에서 다음 명령을 실행합니다.

```powershell
cd D:\fspip_web_workspace2026\fsipi-mvp
npm ci
npm run verify
```

`npm run verify`는 다음 검사를 순서대로 수행합니다.

```text
TypeScript 검사
→ 백엔드·프런트엔드 프로덕션 빌드
→ API 서버 실행
→ Health·주요사업·공지사항·문의 접수 스모크 테스트
```

마지막에 다음 문구가 표시되면 정상입니다.

```text
API smoke test passed
```

## 4. GitHub 저장소 생성

GitHub에서 새 저장소를 생성합니다.

- Repository name: `fsipi-mvp`
- Visibility: 초기에는 `Private` 권장
- README, `.gitignore`, License: 추가하지 않음

Git을 처음 사용하는 PC라면 사용자 정보를 먼저 설정합니다.

```powershell
git config --global user.name "김범준"
git config --global user.email "GitHub에 등록한 이메일"
```

프로젝트를 GitHub에 올립니다.

```powershell
cd D:\fspip_web_workspace2026\fsipi-mvp

git init
git add .
git commit -m "feat: FSIPI 홈페이지 MVP 및 Render CI/CD 설정"
git branch -M main
git remote add origin https://github.com/본인아이디/fsipi-mvp.git
git push -u origin main
```

이미 `origin`이 등록되어 있다는 오류가 나오면 다음 명령으로 주소를 교체합니다.

```powershell
git remote set-url origin https://github.com/본인아이디/fsipi-mvp.git
git push -u origin main
```

GitHub 비밀번호 대신 인증을 요구하면 GitHub CLI 또는 Personal Access Token을 사용합니다.

```powershell
gh auth login
```

GitHub CLI가 설치되지 않았다면 웹 브라우저 인증을 제공하는 Git Credential Manager를 사용할 수 있습니다.

## 5. GitHub Actions 확인

GitHub 저장소의 `Actions` 탭에서 `FSIPI CI`가 실행되는지 확인합니다.

검사 단계는 다음과 같습니다.

```text
npm ci
→ TypeScript 검사
→ 프로덕션 빌드
→ API smoke test
```

모든 단계가 녹색 체크로 끝난 뒤 Render 배포를 진행합니다.

## 6. Render 회원가입 및 GitHub 연결

1. Render에서 회원가입합니다.
2. GitHub 계정으로 로그인하거나 기존 Render 계정에 GitHub를 연결합니다.
3. GitHub 저장소 접근 권한에서 가능하면 `Only select repositories`를 선택합니다.
4. `fsipi-mvp` 저장소만 허용합니다.

## 7. Blueprint 방식으로 백엔드 배포

프로젝트 루트의 `render.yaml`을 이용합니다.

1. Render Dashboard에서 Blueprint 생성 화면으로 이동합니다.
2. `fsipi-mvp` 저장소를 연결합니다.
3. Branch는 `main`을 선택합니다.
4. Blueprint Path는 `render.yaml`을 사용합니다.
5. 환경변수 입력 화면에서 `CLIENT_ORIGIN` 값을 입력합니다.
6. `Deploy Blueprint`를 선택합니다.

첫 배포의 `CLIENT_ORIGIN` 값:

```text
http://localhost:5173
```

`render.yaml`에는 `CLIENT_ORIGIN`이 `sync: false`로 선언되어 있습니다. 따라서 Render가 최초 생성 시 값을 입력받고, 이후 Blueprint를 다시 동기화해도 Dashboard에서 수정한 값이 localhost로 되돌아가지 않습니다.

적용되는 핵심 설정:

```yaml
name: fsipi-api
runtime: node
plan: free
region: singapore
buildCommand: npm ci && npm run build --workspace @fsipi/api
startCommand: npm run start --workspace @fsipi/api
healthCheckPath: /api/health
autoDeployTrigger: checksPass
```

## 8. 첫 배포 확인

배포 로그에서 다음 과정이 끝나는지 확인합니다.

```text
Cloning repository
Installing dependencies
Running build command
Starting service
Service live
```

배포 주소 예시:

```text
https://fsipi-api.onrender.com
```

같은 서비스 이름이 이미 존재하면 주소에 임의 문자열이 붙을 수 있습니다.

## 9. API 테스트

### 9.1 브라우저 테스트

다음 주소를 차례로 엽니다.

```text
https://본인서비스.onrender.com/
https://본인서비스.onrender.com/api/health
https://본인서비스.onrender.com/api/businesses
https://본인서비스.onrender.com/api/notices
```

정상적인 Health Check 예시:

```json
{
  "ok": true,
  "service": "fsipi-api",
  "database": "memory",
  "timestamp": "2026-06-21T00:00:00.000Z"
}
```

### 9.2 PowerShell 테스트

```powershell
$api = "https://본인서비스.onrender.com"

Invoke-RestMethod "$api/api/health"
Invoke-RestMethod "$api/api/businesses"
Invoke-RestMethod "$api/api/notices"
```

### 9.3 문의 접수 테스트

실제 개인정보가 아닌 테스트 값을 사용합니다.

```powershell
$api = "https://본인서비스.onrender.com"

$body = @{
  inquiryType = "교육"
  organization = "미래스마트산업진흥원"
  name = "테스트사용자"
  email = "test@example.com"
  phone = "010-0000-0000"
  message = "Render 배포 후 문의 접수 기능을 테스트합니다."
  privacyAgreed = $true
} | ConvertTo-Json -Compress

Invoke-RestMethod `
  -Uri "$api/api/inquiries" `
  -Method Post `
  -ContentType "application/json; charset=utf-8" `
  -Body $body
```

정상이라면 `FSIPI-날짜-코드` 형식의 접수번호가 반환됩니다.

## 10. CI/CD 동작 구조

```text
로컬 코드 수정
→ git push
→ GitHub Actions 실행
→ 타입 검사·빌드·API 스모크 테스트
→ 모든 검사 통과
→ Render 자동 배포
→ Health Check 통과
→ 새 버전 서비스 전환
```

`autoDeployTrigger: checksPass` 설정으로 인해 GitHub CI가 실패한 커밋은 자동 배포되지 않습니다. 단, 첫 배포에는 유지할 이전 버전이 없으므로 첫 배포 자체가 실패하면 서비스가 생성되더라도 Live 상태가 되지 않습니다.

## 11. CI/CD 자동 배포 테스트

`apps/api/src/app.ts`의 루트 API 이름을 임시로 수정합니다.

```typescript
name: "미래스마트산업진흥원 MVP API v1"
```

GitHub에 Push합니다.

```powershell
git add .
git commit -m "test: Render 자동 배포 확인"
git push origin main
```

확인 순서:

1. GitHub `Actions`에서 `FSIPI CI`가 성공하는지 확인합니다.
2. Render `Events`에서 새 배포가 시작되는지 확인합니다.
3. Render 배포가 Live로 바뀌는지 확인합니다.
4. 루트 API 응답에서 `v1`이 반영됐는지 확인합니다.

## 12. Vercel 연결 전후의 CORS 설정

첫 Render 배포에서는 다음 값을 사용합니다.

```text
CLIENT_ORIGIN=http://localhost:5173
```

Vercel 프런트엔드를 배포한 뒤 Render Dashboard에서 다음처럼 변경합니다.

```text
CLIENT_ORIGIN=https://본인프로젝트.vercel.app
```

로컬과 운영 주소를 모두 허용하려면 쉼표로 구분합니다.

```text
CLIENT_ORIGIN=http://localhost:5173,https://본인프로젝트.vercel.app
```

주의 사항:

- 각 주소 끝에 `/`를 붙이지 않습니다.
- Vercel Preview URL은 배포마다 달라질 수 있으므로 현재 설정에서는 자동 허용되지 않습니다.
- Preview 배포까지 연동하려면 허용 도메인 정책을 별도로 확장해야 합니다.

## 13. MongoDB Atlas 연결

`MONGODB_URI`가 없으면 문의 내용은 메모리에만 저장됩니다. 서버가 재시작되거나 유휴 상태에서 내려가면 데이터가 사라집니다.

Render 환경변수에 다음 값을 추가하면 MongoDB Atlas를 사용합니다.

```text
MONGODB_URI=mongodb+srv://아이디:비밀번호@클러스터주소/fsipi
```

환경변수를 저장한 뒤 재배포하고 `/api/health`를 확인합니다.

정상 연결:

```json
{
  "database": "mongodb"
}
```

다음처럼 계속 표시되면 MongoDB 연결에 실패한 것입니다.

```json
{
  "database": "memory"
}
```

현재 MVP는 MongoDB 연결에 실패하면 메모리 모드로 전환합니다. 실제 문의를 받기 시작하기 전에는 반드시 `database: mongodb`를 확인해야 합니다.

## 14. 개인정보와 운영 전 주의사항

현재 문의 폼은 이름, 이메일, 연락처와 문의 내용을 받습니다. 공개 운영 전에 다음 항목을 확정해야 합니다.

- 개인정보 처리방침
- 수집 목적
- 수집 항목
- 보유 및 파기 기간
- 개인정보 보호 책임자 또는 담당 연락처
- 문의 데이터 열람과 삭제 절차

이 항목을 갖추기 전에는 실제 사용자의 개인정보를 받지 말고 테스트 데이터만 사용합니다.

## 15. 무료 서비스 제한

Render 무료 Web Service에는 다음 제한이 있습니다.

- 15분 동안 인바운드 트래픽이 없으면 유휴 상태로 내려갑니다.
- 다음 요청에서 다시 시작되며 약 1분이 걸릴 수 있습니다.
- 재배포, 재시작, 유휴 전환 때 로컬 파일과 메모리 데이터가 사라집니다.
- Workspace당 월 750 Free instance hours가 제공됩니다.
- 무료 인스턴스는 정식 운영 서비스보다 테스트와 MVP 검증에 적합합니다.

## 16. 주요 오류 대응

### `npm ci` 실패

`package-lock.json`이 프로젝트 루트에 있는지 확인합니다.

```powershell
npm install
npm ci
```

`npm install`로 lock 파일을 갱신했다면 변경된 `package-lock.json`도 Git에 포함합니다.

### Git Commit 사용자 정보 오류

```powershell
git config --global user.name "김범준"
git config --global user.email "GitHub에 등록한 이메일"
```

### `No open ports detected`

서버가 `process.env.PORT`와 `0.0.0.0`을 사용해야 합니다. 현재 프로젝트에는 이미 반영되어 있습니다.

### CORS 오류

- `CLIENT_ORIGIN`이 브라우저 주소와 정확히 같은지 확인합니다.
- `https://`와 `http://`를 구분합니다.
- 마지막 `/`를 제거합니다.
- 값을 변경한 뒤 Render를 다시 배포합니다.

### MongoDB를 설정했는데 `database: memory`

- Atlas 사용자 아이디와 비밀번호 확인
- 비밀번호 특수문자 URL 인코딩 확인
- Atlas Network Access 허용 범위 확인
- Render 로그의 MongoDB 연결 오류 확인

### 첫 접속이 느림

무료 인스턴스의 유휴 상태 해제 과정일 가능성이 큽니다.

## 17. 배포 완료 기준

- [ ] `npm ci`가 성공한다.
- [ ] `npm run verify`가 성공한다.
- [ ] GitHub `main` 브랜치에 소스가 존재한다.
- [ ] GitHub Actions가 녹색으로 통과한다.
- [ ] Render 서비스 상태가 Live이다.
- [ ] `/api/health`가 200 응답을 반환한다.
- [ ] 주요사업과 공지사항 API가 정상 동작한다.
- [ ] 문의 POST 요청이 접수번호를 반환한다.
- [ ] 다음 `git push`에서 자동 재배포된다.
- [ ] 실제 운영 전 MongoDB와 개인정보 처리방침을 확정한다.
