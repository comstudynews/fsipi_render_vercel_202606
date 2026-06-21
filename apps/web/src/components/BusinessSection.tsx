import { useEffect, useState } from "react";
import { getBusinesses, type Business } from "../services/api";

export function BusinessSection() {
  const [items, setItems] = useState<Business[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getBusinesses().then(setItems).catch((reason: Error) => setError(reason.message));
  }, []);

  return (
    <section id="business" className="section muted-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="section-label">OUR BUSINESS</p>
            <h2>주요사업</h2>
          </div>
          <p>기획 문서의 6개 핵심 사업을 MVP 카드로 구성했습니다.</p>
        </div>

        {error ? <p className="status error">{error}</p> : null}
        {!error && items.length === 0 ? <p className="status">주요사업을 불러오는 중입니다.</p> : null}

        <div className="card-grid">
          {items.map((item, index) => (
            <article className="business-card" key={item.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
