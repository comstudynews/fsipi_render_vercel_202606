# FSIPI Render 배포 자료 검증 보고서

## 1. 검증 결론

기존 보완본은 로컬 빌드와 기본 API 실행이 가능했으며 Render Blueprint의 핵심 설정도 공식 사양에 부합했습니다. 그러나 그대로 따라 할 경우 운영 중 문제가 될 수 있는 설정과 누락이 확인되어 수정했습니다.

## 2. 실제 실행 검증 결과

- `npm ci`: 성공
- TypeScript 검사: 성공
- 백엔드 빌드: 성공
- 프런트엔드 빌드: 성공
- `/api/health`: HTTP 200
- `/api/businesses`: 6건 반환
- `/api/notices`: 정상 반환
- 문의 접수: HTTP 201 및 접수번호 발급
- 잘못된 문의 입력: HTTP 400 및 필드 오류 반환
- npm audit: 검증 시점 취약점 0건

## 3. 확인된 결함과 수정 사항

### 3.1 CLIENT_ORIGIN 고정값

기존 `render.yaml`은 `CLIENT_ORIGIN=http://localhost:5173`을 고정값으로 관리했습니다. Render Dashboard에서 Vercel URL로 바꾸더라도 다음 Blueprint 동기화에서 localhost로 되돌아갈 수 있습니다.

수정:

```yaml
- key: CLIENT_ORIGIN
  sync: false
```

최초 Blueprint 생성 시 값을 입력하고, 이후에는 Dashboard에서 변경한 값이 Blueprint 동기화로 덮어써지지 않게 했습니다.

### 3.2 CI에 실행 테스트가 없음

기존 CI는 타입 검사와 빌드만 수행했습니다. 컴파일은 성공하지만 서버가 시작되지 않거나 API 응답이 잘못된 경우를 발견하지 못합니다.

수정:

- Health API 확인
- 주요사업 6건 확인
- 공지사항 확인
- 문의 접수 및 접수번호 확인

위 항목을 검증하는 `scripts/smoke-api.mjs`를 추가하고 GitHub Actions에서 실행하도록 했습니다.

### 3.3 Node.js 버전 범위가 무제한

기존 `engines.node` 값은 `>=22.12.0`이어서 향후 Node 23, 24 등으로 자동 해석될 수 있었습니다.

수정:

```json
"node": ">=22.16.0 <23"
```

`.node-version`도 추가해 로컬, GitHub Actions, Render가 같은 Node 22 계열을 사용하도록 정리했습니다.

### 3.4 Node 타입 정의와 런타임 불일치

기존 API는 Node 22에서 실행하면서 `@types/node` 26을 사용했습니다. 타입 검사에서 Node 22에 없는 API를 허용할 가능성이 있습니다.

수정:

```json
"@types/node": "22.19.21"
```

### 3.5 Git 초보자 절차 누락

첫 Git Commit에서 자주 발생하는 `user.name`, `user.email` 오류와 이미 등록된 `origin` 오류 대응이 누락되어 있었습니다.

수정된 가이드에 두 절차를 추가했습니다.

### 3.6 MongoDB 연결 실패를 놓칠 가능성

현재 MVP는 MongoDB 연결 실패 시 메모리 저장으로 전환합니다. 배포는 성공하지만 실제 문의 데이터는 사라질 수 있습니다.

가이드에 `/api/health`의 `database` 값을 반드시 확인하도록 추가했습니다.

### 3.7 개인정보 운영 조건 누락

문의 폼은 개인정보를 수집하지만 개인정보 처리방침, 보유기간, 담당자 정보가 아직 확정되지 않았습니다.

공개 운영 전 필수 확인 항목을 가이드에 추가하고, 그 전에는 테스트 데이터만 사용하도록 명시했습니다.

## 4. 남아 있는 제한

- Render 무료 인스턴스는 15분 유휴 후 내려가며 재시작 시간이 발생합니다.
- 메모리 저장은 재시작과 재배포 시 사라집니다.
- Vercel Preview URL은 동적으로 바뀌므로 현재 CORS 설정에서 자동 허용되지 않습니다.
- 자동화 테스트는 최소 스모크 테스트이며 전체 단위 테스트와 브라우저 E2E 테스트는 아닙니다.
- Render 실제 계정에서의 최종 배포는 계정 권한, 저장소 연결, 서비스명 중복 여부에 따라 화면과 URL이 달라질 수 있습니다.

## 5. 최종 판단

수정본은 Render에 첫 배포하고 GitHub Push 기반 CI/CD를 검증하기에 적합합니다. 다만 실제 대외 운영은 MongoDB Atlas 연결과 개인정보 처리방침 확정 이후에 시작해야 합니다.
