export function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container split-grid">
        <div>
          <p className="section-label">ABOUT FSIPI</p>
          <h2>미래 산업에 필요한 변화가<br />현장에서 작동하도록 지원합니다.</h2>
        </div>
        <div className="about-copy">
          <p>
            진흥원은 기술 자체보다 기술이 사람과 조직의 문제를 해결하는 과정에 주목합니다.
            교육기관, 기업, 공공기관, 전문가가 함께 실행 가능한 모델을 만들도록 연결합니다.
          </p>
          <dl className="metrics">
            <div><dt>01</dt><dd>현장 중심 교육</dd></div>
            <div><dt>02</dt><dd>산업·정책 연구</dd></div>
            <div><dt>03</dt><dd>산학연 협력</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
