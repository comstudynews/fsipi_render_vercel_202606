import type { Server } from "node:http";

import { createApp } from "./app.js";
import { connectDatabase } from "./services/database.js";

const DEFAULT_PORT = 10000;
const HOST = "0.0.0.0";
const SHUTDOWN_TIMEOUT_MS = 10_000;

let server: Server | undefined;
let shuttingDown = false;

/**
 * PORT 환경변수를 검증하여 서버 포트를 반환합니다.
 */
function getPort(): number {
  const configuredPort = process.env.PORT?.trim();

  if (!configuredPort) {
    return DEFAULT_PORT;
  }

  const parsedPort = Number(configuredPort);

  if (
    !Number.isInteger(parsedPort) ||
    parsedPort < 1 ||
    parsedPort > 65_535
  ) {
    throw new Error(
      `유효하지 않은 PORT 환경변수입니다: ${configuredPort}`
    );
  }

  return parsedPort;
}

/**
 * unknown 타입의 오류를 로그 출력용 문자열로 변환합니다.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  }

  return String(error);
}

/**
 * HTTP 서버가 실제로 요청을 받을 준비가 될 때까지 기다립니다.
 */
function listen(
  port: number,
  host: string
): Promise<Server> {
  const app = createApp();

  return new Promise((resolve, reject) => {
    const httpServer = app.listen(port, host);

    const handleListening = () => {
      httpServer.off("error", handleError);
      resolve(httpServer);
    };

    const handleError = (error: Error) => {
      httpServer.off("listening", handleListening);
      reject(error);
    };

    httpServer.once("listening", handleListening);
    httpServer.once("error", handleError);
  });
}

/**
 * 데이터베이스 연결 후 HTTP 서버를 시작합니다.
 */
async function startServer(): Promise<void> {
  const port = getPort();
  const environment =
    process.env.NODE_ENV ?? "development";

  console.info("[server] 서버 시작 준비");
  console.info(`[server] Environment: ${environment}`);

  await connectDatabase();

  console.info("[database] 데이터베이스 연결 완료");

  server = await listen(port, HOST);

  console.info("[server] API 서버가 시작되었습니다.");
  console.info(`[server] Listening: http://${HOST}:${port}`);

  if (environment !== "production") {
    console.info(
      `[server] Local API: http://localhost:${port}`
    );
    console.info(
      `[server] Health check: http://localhost:${port}/api/health`
    );
  }
}

/**
 * 진행 중인 요청을 마친 뒤 HTTP 서버를 정상 종료합니다.
 */
async function shutdown(
  reason: string,
  exitCode = 0
): Promise<void> {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  console.info(
    `[server] ${reason} 감지: 서버 종료를 시작합니다.`
  );

  const currentServer = server;

  if (!currentServer || !currentServer.listening) {
    console.info("[server] 실행 중인 HTTP 서버가 없습니다.");
    process.exit(exitCode);
  }

  const forceShutdownTimer = setTimeout(() => {
    console.error(
      `[server] ${SHUTDOWN_TIMEOUT_MS / 1000}초 안에 종료되지 않아 연결을 강제로 종료합니다.`
    );

    currentServer.closeAllConnections();
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  forceShutdownTimer.unref();

  try {
    await new Promise<void>((resolve, reject) => {
      currentServer.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    clearTimeout(forceShutdownTimer);

    console.info(
      "[server] HTTP 서버가 정상적으로 종료되었습니다."
    );

    process.exit(exitCode);
  } catch (error: unknown) {
    clearTimeout(forceShutdownTimer);

    console.error(
      "[server] 서버 종료 중 오류가 발생했습니다:",
      getErrorMessage(error)
    );

    process.exit(1);
  }
}

/**
 * Render 재배포 및 서비스 종료 시 전달되는 신호입니다.
 */
process.once("SIGTERM", () => {
  void shutdown("SIGTERM");
});

/**
 * 터미널에서 Ctrl+C를 눌렀을 때 전달되는 신호입니다.
 */
process.once("SIGINT", () => {
  void shutdown("SIGINT");
});

/**
 * 처리되지 않은 Promise 오류를 기록한 뒤 서버를 종료합니다.
 */
process.once(
  "unhandledRejection",
  (reason: unknown) => {
    console.error(
      "[server] 처리되지 않은 Promise 오류:",
      getErrorMessage(reason)
    );

    void shutdown("unhandledRejection", 1);
  }
);

/**
 * 처리되지 않은 동기 예외를 기록한 뒤 서버를 종료합니다.
 */
process.once(
  "uncaughtException",
  (error: Error) => {
    console.error(
      "[server] 처리되지 않은 예외:",
      getErrorMessage(error)
    );

    void shutdown("uncaughtException", 1);
  }
);

/**
 * 애플리케이션 시작
 */
startServer().catch((error: unknown) => {
  console.error(
    "[server] 서버 시작에 실패했습니다:",
    getErrorMessage(error)
  );

  process.exit(1);
});
