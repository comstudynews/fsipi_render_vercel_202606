import { Router } from "express";

export const businessesRouter = Router();

const businesses = [
  {
    id: "education",
    title: "AI·디지털 전환 교육",
    description: "현장 중심의 AI, 소프트웨어, 데이터 활용 교육을 기획하고 운영합니다."
  },
  {
    id: "policy",
    title: "스마트산업 연구·정책",
    description: "산업과 교육 현장의 수요를 조사하고 실효성 있는 정책 과제를 발굴합니다."
  },
  {
    id: "business-support",
    title: "기업·창업 지원",
    description: "디지털 전환, 기술 검증, 인재 양성에 필요한 협력 프로그램을 지원합니다."
  },
  {
    id: "regional-innovation",
    title: "지역혁신·스마트빌리지",
    description: "지역 문제 해결과 생활환경 개선을 위한 스마트 서비스 모델을 연구합니다."
  },
  {
    id: "industry-academia",
    title: "산학연 협력",
    description: "대학, 기업, 연구기관, 공공기관을 연결해 공동사업을 추진합니다."
  },
  {
    id: "experts",
    title: "전문가 네트워크",
    description: "교육, 기술, 정책 분야 전문가와 협력할 수 있는 기반을 조성합니다."
  }
];

businessesRouter.get("/", (_req, res) => {
  res.json({ items: businesses, total: businesses.length });
});
