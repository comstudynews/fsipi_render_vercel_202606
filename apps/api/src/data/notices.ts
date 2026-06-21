export interface Notice {
  id: number;
  title: string;
  category: string;
  summary: string;
  publishedAt: string;
  important: boolean;
}

export const notices: Notice[] = [
  {
    id: 3,
    title: "미래스마트산업진흥원 홈페이지 MVP를 공개합니다",
    category: "공지",
    summary: "진흥원 소개, 주요 사업, 공지사항, 문의 접수 기능을 우선 제공합니다.",
    publishedAt: "2026-06-20",
    important: true
  },
  {
    id: 2,
    title: "AI·디지털 전환 교육 협력기관을 모집합니다",
    category: "협력",
    summary: "대학, 기업, 공공기관과 함께 실무형 교육 프로그램을 기획합니다.",
    publishedAt: "2026-06-18",
    important: false
  },
  {
    id: 1,
    title: "스마트산업 정책·연구 제안 접수 안내",
    category: "사업",
    summary: "현장 수요에 기반한 정책 연구와 지역혁신 사업 제안을 접수합니다.",
    publishedAt: "2026-06-15",
    important: false
  }
];
