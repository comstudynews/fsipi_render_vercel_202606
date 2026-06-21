# Vercel·Render 배포 안내

## 1. GitHub 저장소 준비

```bash
git init
git add .
git commit -m "feat: FSIPI 홈페이지 MVP"
git branch -M main
git remote add origin <GitHub 저장소 URL>
git push -u origin main
```

## 2. Render 백엔드 배포

### 방법 A: Blueprint 사용

① Render에서 `New +` → `Blueprint`를 선택합니다.  
② GitHub 저장소를 연결합니다.  
③ 루트의 `render.yaml`을 인식시킵니다.  
④ `CLIENT_ORIGIN`에는 배포할 Vercel 주소를 입력합니다.

초기에는 Vercel 주소가 아직 없으므로 임시로 다음처럼 설정할 수 있습니다.

```text
CLIENT_ORIGIN=http://localhost:5173
```

Vercel 배포가 끝나면 다음처럼 변경합니다.

```text
CLIENT_ORIGIN=https://프로젝트명.vercel.app
```

MongoDB Atlas를 사용할 경우 다음 값도 설정합니다.

```text
MONGODB_URI=mongodb+srv://...
```

설정하지 않으면 문의는 Render 프로세스 메모리에 저장되며 재시작 시 사라집니다.

### Render 설정값

| 항목 | 값 |
|---|---|
| Root Directory | `apps/api` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

배포 후 다음 주소를 확인합니다.

```text
https://<render-service>.onrender.com/api/health
```

## 3. Vercel 프런트엔드 배포

① Vercel에서 GitHub 저장소를 Import합니다.  
② Root Directory를 `apps/web`으로 지정합니다.  
③ Framework Preset은 Vite를 선택합니다.  
④ 환경변수를 등록합니다.

```text
VITE_API_BASE_URL=https://<render-service>.onrender.com
```

⑤ Build Command는 `npm run build`, Output Directory는 `dist`로 설정합니다.  
⑥ 배포합니다.

Vite에서 브라우저에 노출할 환경변수는 `VITE_` 접두사가 필요합니다.

## 4. CORS 최종 연결

Vercel 배포 URL을 확인한 다음 Render의 `CLIENT_ORIGIN`을 변경합니다.

```text
CLIENT_ORIGIN=https://<vercel-project>.vercel.app
```

미리보기 도메인까지 허용할 때는 쉼표로 여러 주소를 입력합니다.

```text
CLIENT_ORIGIN=https://<vercel-project>.vercel.app,https://preview-domain.vercel.app
```

환경변수 변경 후 Render를 재배포합니다.

## 5. 동작 확인

① 메인 페이지가 표시되는지 확인합니다.  
② 주요사업 6개가 API에서 로딩되는지 확인합니다.  
③ 공지사항 3개가 표시되는지 확인합니다.  
④ 문의 폼을 제출하고 접수번호가 반환되는지 확인합니다.  
⑤ 브라우저 개발자 도구에서 CORS 오류가 없는지 확인합니다.
