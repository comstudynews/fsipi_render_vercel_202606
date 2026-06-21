import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const port = 10081;
const baseUrl = `http://127.0.0.1:${port}`;

const server = spawn(process.execPath, ["apps/api/dist/index.js"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    PORT: String(port),
    CLIENT_ORIGIN: "http://localhost:5173",
    MONGODB_URI: ""
  },
  stdio: ["ignore", "pipe", "pipe"]
});

let output = "";
server.stdout.on("data", (chunk) => { output += chunk.toString(); });
server.stderr.on("data", (chunk) => { output += chunk.toString(); });

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      // 서버가 준비될 때까지 재시도합니다.
    }
    await delay(250);
  }
  throw new Error(`API 서버가 제한 시간 안에 시작되지 않았습니다.\n${output}`);
}

async function assertJson(path, validate) {
  const response = await fetch(`${baseUrl}${path}`);
  const body = await response.json();
  if (!response.ok || !validate(body)) {
    throw new Error(`${path} 검증 실패: ${response.status} ${JSON.stringify(body)}`);
  }
}

try {
  await waitForServer();

  await assertJson("/api/health", (body) => body.ok === true && body.service === "fsipi-api");
  await assertJson("/api/businesses", (body) => Array.isArray(body.items) && body.items.length === 6);
  await assertJson("/api/notices", (body) => Array.isArray(body.items) && body.items.length >= 1);

  const inquiryResponse = await fetch(`${baseUrl}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inquiryType: "교육",
      organization: "미래스마트산업진흥원",
      name: "김범준",
      email: "test@example.com",
      phone: "010-0000-0000",
      message: "CI 환경에서 문의 접수 API를 점검합니다.",
      privacyAgreed: true
    })
  });
  const inquiryBody = await inquiryResponse.json();
  if (inquiryResponse.status !== 201 || !String(inquiryBody.receiptNumber ?? "").startsWith("FSIPI-")) {
    throw new Error(`문의 접수 검증 실패: ${inquiryResponse.status} ${JSON.stringify(inquiryBody)}`);
  }

  console.log("API smoke test passed");
} finally {
  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.once("exit", resolve)),
    delay(2000).then(() => server.kill("SIGKILL"))
  ]);
}
