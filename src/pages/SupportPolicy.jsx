import { useEffect } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --bg:         #0e0c0a;
    --bg-card:    #141210;
    --bg-input:   #1a1714;
    --border:     rgba(255,255,255,0.07);
    --gold:       #c49c68;
    --gold-light: #dbb98a;
    --text:       #f0ebe3;
    --text-muted: #8a8178;
    --text-faint: #4a4540;
    --serif:      'Cormorant Garamond', Georgia, serif;
    --sans:       'Jost', sans-serif;
    --ease:       cubic-bezier(0.4, 0, 0.2, 1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page ── */
  .sp-page {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--sans);
    font-weight: 300;
    color: var(--text);
    position: relative;
  }

  /* Grain */
  .sp-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* Ambient glow */
  .sp-glow {
    position: fixed;
    top: -100px; right: -80px;
    width: 500px; height: 400px;
    background: radial-gradient(ellipse, rgba(196,156,104,0.045) 0%, transparent 70%);
    pointer-events: none;
    filter: blur(80px);
    z-index: 0;
  }

  /* ── Inner ── */
  .sp-inner {
    position: relative;
    z-index: 1;
    max-width: 860px;
    margin: 0 auto;
    padding: 80px 48px 120px;
  }

  /* ── Page header ── */
  .sp-header {
    text-align: center;
    margin-bottom: 80px;
    animation: fadeUp 0.7s 0.1s var(--ease) both;
  }

  .sp-label {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
  }
  .sp-label::before, .sp-label::after {
    content: '';
    display: inline-block;
    width: 22px; height: 1px;
    background: var(--gold);
    opacity: 0.45;
  }

  .sp-title {
    font-family: var(--serif);
    font-size: clamp(2.4rem, 4.5vw, 3.6rem);
    font-weight: 300;
    line-height: 1.1;
    letter-spacing: -0.01em;
    color: var(--text);
    margin-bottom: 20px;
  }

  .sp-title em {
    font-style: italic;
    color: var(--gold-light);
  }

  .sp-rule {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    border: none;
    margin: 0 auto 20px;
  }

  .sp-subtitle {
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.78;
    max-width: 480px;
    margin: 0 auto;
    letter-spacing: 0.02em;
  }

  /* ── Sections ── */
  .sp-sections {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    animation: fadeUp 0.7s 0.2s var(--ease) both;
  }

  .sp-section {
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    padding: 36px 40px;
    position: relative;
    transition: background 0.28s var(--ease);
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 32px;
    align-items: start;
  }

  .sp-section:last-child { border-bottom: none; }

  .sp-section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.28s var(--ease);
  }

  .sp-section:hover { background: #171412; }
  .sp-section:hover::before { opacity: 0.3; }

  /* Left — number + heading */
  .sp-section-left {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 3px;
  }

  .sp-section-num {
    font-family: var(--serif);
    font-size: 2.4rem;
    font-weight: 200;
    color: transparent;
    -webkit-text-stroke: 1px var(--text-faint);
    line-height: 1;
    opacity: 0.4;
    transition: opacity 0.25s;
    user-select: none;
  }

  .sp-section:hover .sp-section-num { opacity: 0.7; }

  .sp-section-title {
    font-size: 0.65rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
  }

  /* Right — content */
  .sp-section-body {
    font-size: 0.875rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.85;
    letter-spacing: 0.02em;
  }

  /* Contact box */
  .sp-contact-box {
    margin-top: 16px;
    border: 1px solid var(--border);
    background: var(--bg-input);
    position: relative;
    overflow: hidden;
  }

  .sp-contact-box::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    opacity: 0.2;
  }

  .sp-contact-item {
    display: grid;
    grid-template-columns: 80px 1fr;
    align-items: center;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    gap: 16px;
  }

  .sp-contact-item:last-child { border-bottom: none; }

  .sp-contact-key {
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  .sp-contact-val {
    font-size: 0.82rem;
    font-weight: 300;
    color: var(--text-muted);
    letter-spacing: 0.03em;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 700px) {
    .sp-inner   { padding: 60px 20px 96px; }
    .sp-section {
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 28px 24px;
    }
    .sp-section-num { font-size: 1.8rem; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }
`;

const sections = [
  {
    num: "01",
    title: "Our Commitment",
    body: "Our support team is available to assist you with inquiries, order issues, and general concerns. We strive to provide timely and effective solutions to all customer requests, ensuring your experience with us reflects the same care and precision that goes into every pair of shoes we craft.",
  },
  {
    num: "02",
    title: "Contact Support",
    isContact: true,
    contacts: [
      { key: "Email",     val: "ajagbejanet2018@gmail.com" },
      { key: "Phone",     val: "+2349033080879" },
      { key: "Live Chat", val: "Available on our website" },
    ],
  },
  {
    num: "03",
    title: "Response Time",
    body: "We aim to respond to all inquiries within 24 hours. During peak periods, responses may take up to 48 hours. We appreciate your patience and will always keep you informed of any delays.",
  },
  {
    num: "04",
    title: "Order Issues",
    body: "If you experience issues such as missing items, incorrect orders, or delayed delivery, please contact us within 48 hours of receiving your order. Prompt communication allows us to resolve concerns as efficiently as possible.",
  },
  {
    num: "05",
    title: "Returns & Refunds",
    body: "We assist customers with returns, exchanges, and refunds in accordance with our return policy. Items must be unused and in their original condition, returned within the specified time frame. Our team will guide you through every step of the process.",
  },
];

export default function SupportPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sp-page">
      <style>{CSS}</style>
      <div className="sp-glow" />

      <div className="sp-inner">

        {/* Header */}
        <header className="sp-header">
          <div className="sp-label">Customer Care</div>
          <h1 className="sp-title">
            Support <em>Policy</em>
          </h1>
          <hr className="sp-rule" />
          <p className="sp-subtitle">
            We are committed to providing reliable, fast, and helpful support
            to ensure your shopping experience is smooth and satisfactory.
          </p>
        </header>

        {/* Sections */}
        <div className="sp-sections">
          {sections.map((s) => (
            <div key={s.num} className="sp-section">

              <div className="sp-section-left">
                <span className="sp-section-num">{s.num}</span>
                <span className="sp-section-title">{s.title}</span>
              </div>

              <div>
                {s.isContact ? (
                  <div className="sp-contact-box">
                    {s.contacts.map((c) => (
                      <div key={c.key} className="sp-contact-item">
                        <span className="sp-contact-key">{c.key}</span>
                        <span className="sp-contact-val">{c.val}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="sp-section-body">{s.body}</p>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}