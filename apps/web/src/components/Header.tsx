import { useState } from "react";

const links = [
  ["진흥원 소개", "#about"],
  ["주요사업", "#business"],
  ["소식", "#notices"],
  ["참여·협력", "#contact"]
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label="미래스마트산업진흥원 홈">
          <span className="brand-mark" aria-hidden="true">FS</span>
          <span>
            <strong>미래스마트산업진흥원</strong>
            <small>Future Smart Industry Promotion Institute</small>
          </span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          메뉴
        </button>

        <nav id="main-navigation" className={open ? "nav open" : "nav"} aria-label="주 메뉴">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
