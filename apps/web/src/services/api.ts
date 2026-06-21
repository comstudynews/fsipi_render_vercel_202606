const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:10000").replace(/\/$/, "");

export interface Notice {
  id: number;
  title: string;
  category: string;
  summary: string;
  publishedAt: string;
  important: boolean;
}

export interface Business {
  id: string;
  title: string;
  description: string;
}

export interface InquiryPayload {
  inquiryType: "교육" | "기업지원" | "공공사업" | "산학연" | "기타";
  organization: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  privacyAgreed: boolean;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message ?? "API 요청에 실패했습니다.");
  }

  return data as T;
}

export async function getBusinesses(): Promise<Business[]> {
  const data = await request<{ items: Business[] }>("/api/businesses");
  return data.items;
}

export async function getNotices(): Promise<Notice[]> {
  const data = await request<{ items: Notice[] }>("/api/notices");
  return data.items;
}

export async function submitInquiry(payload: InquiryPayload): Promise<{
  message: string;
  receiptNumber: string;
  storage: "mongodb" | "memory";
}> {
  return request("/api/inquiries", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
