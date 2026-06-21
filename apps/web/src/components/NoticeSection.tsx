import { useEffect, useState } from "react";
import { getNotices, type Notice } from "../services/api";

export function NoticeSection() {
  const [items, setItems] = useState<Notice[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getNotices().then(setItems).catch((reason: Error) => setError(reason.message));
  }, []);

  return (
    <section id="notices" className="section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="section-label">NEWS & NOTICE</p>
            <h2>공지사항</h2>
          </div>
          <p>백엔드 API에서 불러오는 샘플 게시물입니다.</p>
        </div>

        {error ? <p className="status error">{error}</p> : null}
        {!error && items.length === 0 ? <p className="status">공지사항을 불러오는 중입니다.</p> : null}

        <div className="notice-list">
          {items.map((notice) => (
            <article className="notice-item" key={notice.id}>
              <div>
                <span className={notice.important ? "badge important" : "badge"}>{notice.category}</span>
                <h3>{notice.title}</h3>
                <p>{notice.summary}</p>
              </div>
              <time dateTime={notice.publishedAt}>{notice.publishedAt}</time>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
