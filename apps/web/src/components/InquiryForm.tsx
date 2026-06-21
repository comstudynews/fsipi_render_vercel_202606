import { useState, type FormEvent } from "react";
import { submitInquiry, type InquiryPayload } from "../services/api";

const initialForm: InquiryPayload = {
  inquiryType: "교육",
  organization: "",
  name: "",
  email: "",
  phone: "",
  message: "",
  privacyAgreed: false
};

export function InquiryForm() {
  const [form, setForm] = useState<InquiryPayload>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function update<K extends keyof InquiryPayload>(key: K, value: InquiryPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setIsError(false);

    try {
      const result = await submitInquiry(form);
      const storageNotice = result.storage === "memory"
        ? " 현재 서버는 데모 저장 모드입니다."
        : "";
      setMessage(`${result.message} 접수번호: ${result.receiptNumber}.${storageNotice}`);
      setForm(initialForm);
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "문의 접수에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="container contact-grid">
        <div>
          <p className="section-label">PARTNERSHIP</p>
          <h2>사업·교육 협력을<br />제안해 주세요.</h2>
          <p>
            교육 운영, 기업 지원, 공공사업, 산학연 협력에 관한 문의를 접수합니다.
            실제 운영 전 개인정보 처리방침과 보유기간을 확정해야 합니다.
          </p>
        </div>

        <form className="inquiry-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              문의 유형
              <select
                value={form.inquiryType}
                onChange={(event) => update("inquiryType", event.target.value as InquiryPayload["inquiryType"])}
              >
                <option>교육</option>
                <option>기업지원</option>
                <option>공공사업</option>
                <option>산학연</option>
                <option>기타</option>
              </select>
            </label>
            <label>
              소속
              <input
                value={form.organization}
                onChange={(event) => update("organization", event.target.value)}
                maxLength={100}
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              이름 <span aria-hidden="true">*</span>
              <input
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                maxLength={50}
              />
            </label>
            <label>
              이메일 <span aria-hidden="true">*</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
              />
            </label>
          </div>

          <label>
            연락처
            <input
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              maxLength={30}
            />
          </label>

          <label>
            문의 내용 <span aria-hidden="true">*</span>
            <textarea
              required
              minLength={10}
              maxLength={2000}
              rows={6}
              value={form.message}
              onChange={(event) => update("message", event.target.value)}
            />
          </label>

          <label className="check-label">
            <input
              type="checkbox"
              required
              checked={form.privacyAgreed}
              onChange={(event) => update("privacyAgreed", event.target.checked)}
            />
            <span>문의 처리를 위한 개인정보 수집·이용에 동의합니다.</span>
          </label>

          <button className="button primary submit-button" disabled={submitting} type="submit">
            {submitting ? "접수 중..." : "문의 접수"}
          </button>

          {message ? (
            <p className={isError ? "form-message error" : "form-message success"} role="status">
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
