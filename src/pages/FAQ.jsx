import { useState, useEffect } from "react";

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
  .faq-page {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--sans);
    font-weight: 300;
    color: var(--text);
    position: relative;
  }

  .faq-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* Ambient glow */
  .faq-glow {
    position: fixed;
    top: -80px; left: -80px;
    width: 520px; height: 400px;
    background: radial-gradient(ellipse, rgba(196,156,104,0.04) 0%, transparent 70%);
    pointer-events: none;
    filter: blur(80px);
    z-index: 0;
  }

  /* ── Inner ── */
  .faq-inner {
    position: relative;
    z-index: 1;
    max-width: 820px;
    margin: 0 auto;
    padding: 80px 48px 120px;
  }

  /* ── Header ── */
  .faq-header {
    text-align: center;
    margin-bottom: 72px;
    animation: fadeUp 0.7s 0.1s var(--ease) both;
  }

  .faq-label {
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
  .faq-label::before, .faq-label::after {
    content: '';
    display: inline-block;
    width: 22px; height: 1px;
    background: var(--gold);
    opacity: 0.45;
  }

  .faq-title {
    font-family: var(--serif);
    font-size: clamp(2.4rem, 4.5vw, 3.6rem);
    font-weight: 300;
    line-height: 1.1;
    letter-spacing: -0.01em;
    color: var(--text);
    margin-bottom: 20px;
  }
  .faq-title em { font-style: italic; color: var(--gold-light); }

  .faq-rule {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    border: none;
    margin: 0 auto 20px;
  }

  .faq-subtitle {
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.78;
    max-width: 440px;
    margin: 0 auto;
    letter-spacing: 0.02em;
  }

  /* ── FAQ list ── */
  .faq-list {
    border: 1px solid var(--border);
    animation: fadeUp 0.7s 0.22s var(--ease) both;
  }

  /* ── FAQ item ── */
  .faq-item {
    border-bottom: 1px solid var(--border);
    background: var(--bg-card);
    position: relative;
    transition: background 0.25s var(--ease);
    overflow: hidden;
  }
  .faq-item:last-child { border-bottom: none; }

  .faq-item.faq-open { background: #171412; }

  /* Left gold bar — visible when open */
  .faq-item::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.3s var(--ease);
    border-radius: 1px;
  }
  .faq-item.faq-open::before { opacity: 0.55; }

  /* ── Question button ── */
  .faq-question {
    width: 100%;
    background: none;
    border: none;
    color: var(--text-muted);
    text-align: left;
    padding: 24px 32px;
    font-family: var(--sans);
    font-size: 0.88rem;
    font-weight: 300;
    letter-spacing: 0.03em;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    transition: color 0.22s var(--ease);
  }

  .faq-question:hover { color: var(--text); }
  .faq-item.faq-open .faq-question { color: var(--text); }

  /* Question number */
  .faq-q-num {
    font-family: var(--serif);
    font-size: 1rem;
    font-weight: 300;
    color: var(--text-faint);
    flex-shrink: 0;
    opacity: 0.6;
    transition: color 0.22s, opacity 0.22s;
    min-width: 28px;
  }
  .faq-item.faq-open .faq-q-num {
    color: var(--gold);
    opacity: 1;
  }

  .faq-q-text {
    flex: 1;
    line-height: 1.5;
  }

  /* Plus / minus icon */
  .faq-icon {
    width: 28px; height: 28px;
    border: 1px solid var(--border);
    border-radius: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.22s var(--ease), background 0.22s;
    position: relative;
  }

  .faq-item.faq-open .faq-icon {
    border-color: rgba(196,156,104,0.35);
    background: rgba(196,156,104,0.07);
  }

  /* Animated cross → minus */
  .faq-icon-h,
  .faq-icon-v {
    position: absolute;
    background: var(--text-faint);
    border-radius: 1px;
    transition: transform 0.3s var(--ease), opacity 0.3s, background 0.22s;
  }
  .faq-icon-h { width: 10px; height: 1px; }
  .faq-icon-v { width: 1px; height: 10px; }

  .faq-item.faq-open .faq-icon-h,
  .faq-item.faq-open .faq-icon-v { background: var(--gold); }

  .faq-item.faq-open .faq-icon-v {
    transform: scaleY(0);
    opacity: 0;
  }

  /* ── Answer ── */
  .faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.38s var(--ease);
  }
  .faq-answer.faq-answer-open { max-height: 240px; }

  .faq-answer-inner {
    padding: 0 32px 24px 60px;
    font-size: 0.845rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.85;
    letter-spacing: 0.02em;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 620px) {
    .faq-inner    { padding: 60px 20px 96px; }
    .faq-question { padding: 20px 20px; }
    .faq-answer-inner { padding: 0 20px 20px 20px; }
    .faq-q-num    { display: none; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }
`;

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse our collection, select your preferred size and colour options, and click 'Add to Cart'. When you're ready, proceed to checkout to complete your purchase securely.",
  },
  {
    q: "How long does delivery take?",
    a: "Delivery typically takes 2–5 business days depending on your location within Nigeria. A courier representative will contact you to arrange delivery once your order is dispatched.",
  },
  {
    q: "Can I cancel my order?",
    a: "Yes, orders can be cancelled within 24 hours of placement. Please contact our support team as soon as possible so we can process the cancellation before production begins.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes, we offer refunds for eligible returns in accordance with our return policy. Items must be unused and in their original condition. Please reach out within 48 hours of receiving your order.",
  },
  {
    q: "How can I contact support?",
    a: "You can reach us via email, phone, or the contact form on our website. Our team responds within 24 hours on business days. You can also reach us via WhatsApp for faster assistance.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept secure online payments via Paystack, including debit and credit cards. All transactions are encrypted and processed through industry-standard secure gateways.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="faq-page">
      <style>{CSS}</style>
      <div className="faq-glow" />

      <div className="faq-inner">

        {/* Header */}
        <header className="faq-header">
          <div className="faq-label">Need Answers</div>
          <h1 className="faq-title">
            Frequently Asked <em>Questions</em>
          </h1>
          <hr className="faq-rule" />
          <p className="faq-subtitle">
            Find answers to common questions about orders, delivery,
            payments, and support.
          </p>
        </header>

        {/* FAQ accordion */}
        <div className="faq-list">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`faq-item${isOpen ? " faq-open" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-num">0{i + 1}</span>
                  <span className="faq-q-text">{item.q}</span>
                  <span className="faq-icon" aria-hidden="true">
                    <span className="faq-icon-h" />
                    <span className="faq-icon-v" />
                  </span>
                </button>

                <div className={`faq-answer${isOpen ? " faq-answer-open" : ""}`}>
                  <p className="faq-answer-inner">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}