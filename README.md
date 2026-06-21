# 미래스마트산업진흥원 홈페이지 MVP

기획 문서의 핵심 내용을 실제 배포 가능한 최소 기능으로 구현한 샘플입니다.

## 1. MVP 범위

- 반응형 메인 화면
- 진흥원 소개
- 주요사업 6개 API 조회
- 공지사항 API 조회
- 문의 접수와 접수번호 발급
- MongoDB Atlas 선택 연동
- Vercel 프런트엔드 배포
- Render 백엔드 배포

관리자 화면, 로그인, 파일 업로드, 교육 신청, 검색은 다음 단계에서 추가합니다.

## 2. 기술 구성

| 구분 | 기술 |
|---|---|
| 프런트엔드 | React 19, Vite 8, TypeScript |
| 백엔드 | Node.js, Express 5, TypeScript |
| 검증·보안 | Zod, Helmet, CORS, Rate Limit |
| 데이터 저장 | MongoDB Atlas 선택, 미설정 시 메모리 |
| 배포 | Vercel, Render |

## 3. 폴더 구조

```text
fsipi-mvp/
├── apps/
│   ├── web/          # Vercel 배포 대상
│   └── api/          # Render 배포 대상
├── docs/
│   └── DEPLOYMENT.md
├── planning/         # 홈페이지 기획 문서 9종
├── render.yaml
└── package.json
```

## 4. 로컬 실행

### 4.1 의존성 설치

프로젝트 루트에서 실행합니다.

```bash
npm install
```

### 4.2 환경변수 생성

Windows PowerShell:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env
```

현재 코드는 별도 dotenv 패키지 없이 배포 환경변수를 사용합니다. 로컬에서 `.env`를 자동 읽게 하려면 Node.js의 `--env-file`을 사용해 백엔드를 실행합니다.

### 4.3 백엔드 실행

```bash
cd apps/api
npm run build
node --env-file=.env dist/index.js
```

개발 모드는 PowerShell에서 다음처럼 환경변수를 지정한 뒤 실행합니다.

```powershell
$env:PORT="10000"
$env:CLIENT_ORIGIN="http://localhost:5173"
npm run dev
```

### 4.4 프런트엔드 실행

새 터미널에서 실행합니다.

```bash
cd apps/web
npm run dev
```

브라우저에서 다음 주소를 엽니다.

```text
http://localhost:5173
```

## 5. API 목록

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/health` | 서버·저장 모드 확인 |
| GET | `/api/businesses` | 주요사업 목록 |
| GET | `/api/notices` | 공지사항 목록 |
| GET | `/api/notices/:id` | 공지사항 1건 |
| POST | `/api/inquiries` | 문의 접수 |

## 6. 문의 저장 방식

`MONGODB_URI`가 있으면 MongoDB Atlas에 저장합니다. 값이 없거나 연결에 실패하면 메모리에 저장합니다.

메모리 저장은 기능 확인용입니다. Render가 재시작되면 데이터가 사라지므로 실제 운영에서는 MongoDB Atlas 연결이 필요합니다.

## 7. 배포

자세한 절차는 다음 파일을 참고합니다.

```text
docs/DEPLOYMENT.md
```

## 8. 다음 개발 단계

1. 관리자 로그인과 콘텐츠 CRUD
2. 교육·행사 목록과 신청
3. 파일 업로드
4. 검색과 필터
5. 이메일 접수 알림
6. 개인정보 보유기간과 삭제 정책
