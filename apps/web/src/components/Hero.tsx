export function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero-grid">
        <div>
          <p className="eyebrow">FUTURE · SMART · INDUSTRY</p>
          <h1>기술과 교육을 연결해<br />스마트산업의 미래를 설계합니다.</h1>
          <p className="hero-copy">
            미래스마트산업진흥원은 AI·디지털 전환 교육, 산업 연구, 기업 지원과
            산학연 협력을 바탕으로 실질적인 혁신 과제를 추진합니다.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#business">주요사업 보기</a>
            <a className="button secondary" href="#contact">협력 문의</a>
          </div>
        </div>
        <aside className="hero-panel" aria-label="핵심 추진 방향">
          <span>핵심 추진 방향</span>
          <strong>교육 · 연구 · 기업지원 · 지역혁신</strong>
          <p>현장의 문제를 구체적인 사업과 교육 프로그램으로 전환합니다.</p>
        </aside>
      </div>
    </section>
  );
}
