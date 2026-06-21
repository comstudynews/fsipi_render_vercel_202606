import mongoose from "mongoose";

let connected = false;

export async function connectDatabase(): Promise<boolean> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    console.warn("[database] MONGODB_URI가 없어 메모리 저장 모드로 실행합니다.");
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    connected = true;
    console.info("[database] MongoDB 연결 완료");
    return true;
  } catch (error) {
    connected = false;
    console.error("[database] MongoDB 연결 실패, 메모리 저장 모드로 전환합니다.", error);
    return false;
  }
}

export function isDatabaseConnected(): boolean {
  return connected && mongoose.connection.readyState === 1;
}
