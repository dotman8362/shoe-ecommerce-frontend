import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

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
    --success:    #7aab8a;
    --danger:     #a87878;
    --serif:      'Cormorant Garamond', Georgia, serif;
    --sans:       'Jost', sans-serif;
    --ease:       cubic-bezier(0.4, 0, 0.2, 1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page ── */
  .tc-page {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--sans);
    font-weight: 300;
    color: var(--text);
    position: relative;
  }

  .tc-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  .tc-glow {
    position: fixed;
    top: -80px; left: -80px;
    width: 520px; height: 420px;
    background: radial-gradient(ellipse, rgba(196,156,104,0.04) 0%, transparent 70%);
    pointer-events: none;
    filter: blur(80px);
    z-index: 0;
  }

  /* ── Layout ── */
  .tc-layout {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 80px 48px 120px;
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 60px;
    align-items: start;
  }

  /* ── Sidebar ── */
  .tc-sidebar {
    position: sticky;
    top: 80px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .tc-sidebar-label {
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-faint);
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }

  .tc-nav-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    font-size: 0.75rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.04em;
    border-bottom: 1px solid var(--border);
    border-left: none;
    border-right: none;
    border-top: none;
    background: none;
    text-align: left;
    width: 100%;
    font-family: var(--sans);
    cursor: pointer;
    position: relative;
    transition: color 0.2s var(--ease);
  }

  .tc-nav-btn::before {
    content: '';
    position: absolute;
    left: -16px; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.22s;
    border-radius: 1px;
  }

  .tc-nav-btn:hover { color: var(--text-muted); }
  .tc-nav-btn.active { color: var(--gold); }
  .tc-nav-btn.active::before { opacity: 0.7; }

  .tc-nav-num {
    font-family: var(--serif);
    font-size: 0.75rem;
    font-weight: 300;
    color: var(--text-faint);
    opacity: 0.5;
    flex-shrink: 0;
    min-width: 20px;
    transition: color 0.2s, opacity 0.2s;
  }

  .tc-nav-btn.active .tc-nav-num { color: var(--gold); opacity: 1; }

  /* Sidebar acceptance notice */
  .tc-sidebar-notice {
    margin-top: 20px;
    padding: 16px 18px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    position: relative;
  }

  .tc-sidebar-notice::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    opacity: 0.2;
  }

  .tc-notice-text {
    font-size: 0.7rem;
    font-weight: 300;
    color: var(--text-faint);
    line-height: 1.7;
    letter-spacing: 0.02em;
  }

  .tc-notice-text strong {
    color: var(--text-muted);
    font-weight: 400;
  }

  .tc-sidebar-meta {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .tc-meta-row { display: flex; flex-direction: column; gap: 3px; }

  .tc-meta-key {
    font-size: 0.55rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  .tc-meta-val {
    font-size: 0.72rem;
    font-weight: 300;
    color: var(--text-muted);
    letter-spacing: 0.03em;
  }

  /* ── Content ── */
  .tc-content {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* ── Header ── */
  .tc-header {
    margin-bottom: 52px;
    animation: fadeUp 0.7s 0.1s var(--ease) both;
  }

  .tc-label {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 18px;
  }

  .tc-label::before {
    content: '';
    display: inline-block;
    width: 28px; height: 1px;
    background: var(--gold);
    opacity: 0.45;
  }

  .tc-title {
    font-family: var(--serif);
    font-size: clamp(2.4rem, 4vw, 3.4rem);
    font-weight: 300;
    line-height: 1.1;
    letter-spacing: -0.01em;
    color: var(--text);
    margin-bottom: 18px;
  }

  .tc-title em { font-style: italic; color: var(--gold-light); }

  .tc-rule {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    border: none;
    margin-bottom: 18px;
  }

  .tc-intro {
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.8;
    letter-spacing: 0.02em;
    max-width: 580px;
  }

  /* ── Acceptance banner ── */
  .tc-acceptance {
    border: 1px solid rgba(196,156,104,0.2);
    background: rgba(196,156,104,0.04);
    padding: 20px 24px;
    margin-bottom: 2px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    animation: fadeUp 0.6s 0.25s var(--ease) both;
    position: relative;
  }

  .tc-acceptance::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    opacity: 0.5;
    border-radius: 1px;
  }

  .tc-acc-icon {
    width: 32px; height: 32px;
    border: 1px solid rgba(196,156,104,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--gold);
    margin-top: 1px;
  }

  .tc-acc-text {
    font-size: 0.82rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.72;
    letter-spacing: 0.02em;
  }

  .tc-acc-text strong { color: var(--text); font-weight: 400; }

  /* ── Section ── */
  .tc-section {
    border: 1px solid var(--border);
    border-top: none;
    background: var(--bg-card);
    position: relative;
    overflow: hidden;
    transition: background 0.28s var(--ease);
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.55s var(--ease), transform 0.55s var(--ease), background 0.28s var(--ease);
  }

  .tc-section.visible { opacity: 1; transform: translateY(0); }
  .tc-section:hover   { background: #171412; }

  .tc-section::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.28s;
  }

  .tc-section:hover::after { opacity: 0.22; }

  /* Trigger */
  .tc-sec-trigger {
    width: 100%;
    background: none;
    border: none;
    padding: 26px 32px;
    display: grid;
    grid-template-columns: 48px 1fr auto;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    text-align: left;
    font-family: var(--sans);
  }

  .tc-sec-num {
    font-family: var(--serif);
    font-size: 1.7rem;
    font-weight: 200;
    color: transparent;
    -webkit-text-stroke: 1px var(--text-faint);
    opacity: 0.3;
    line-height: 1;
    user-select: none;
    transition: opacity 0.22s, -webkit-text-stroke-color 0.22s;
  }

  .tc-section.open    .tc-sec-num,
  .tc-section:hover   .tc-sec-num {
    opacity: 0.72;
    -webkit-text-stroke-color: var(--gold);
  }

  .tc-sec-head { display: flex; flex-direction: column; gap: 3px; }

  .tc-sec-title {
    font-size: 0.8rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color 0.22s;
    line-height: 1.4;
  }

  .tc-section.open  .tc-sec-title,
  .tc-section:hover .tc-sec-title { color: var(--text); }

  .tc-sec-tag {
    font-size: 0.58rem;
    font-weight: 300;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-faint);
    opacity: 0.7;
  }

  /* Expand icon */
  .tc-expand-icon {
    width: 28px; height: 28px;
    border: 1px solid var(--border);
    border-radius: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.22s, background 0.22s;
    position: relative;
  }

  .tc-section.open  .tc-expand-icon,
  .tc-section:hover .tc-expand-icon {
    border-color: rgba(196,156,104,0.3);
    background: rgba(196,156,104,0.05);
  }

  .tc-expand-h, .tc-expand-v {
    position: absolute;
    background: var(--text-faint);
    border-radius: 1px;
    transition: transform 0.3s var(--ease), opacity 0.3s, background 0.22s;
  }
  .tc-expand-h { width: 10px; height: 1px; }
  .tc-expand-v { width: 1px; height: 10px; }

  .tc-section.open .tc-expand-h,
  .tc-section.open .tc-expand-v { background: var(--gold); }

  .tc-section.open .tc-expand-v { transform: scaleY(0); opacity: 0; }

  /* Body */
  .tc-sec-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.42s var(--ease);
  }

  .tc-section.open .tc-sec-body { max-height: 1400px; }

  .tc-sec-inner { padding: 0 32px 32px 96px; }

  /* Content elements */
  .tc-text {
    font-size: 0.875rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.88;
    letter-spacing: 0.02em;
    margin-bottom: 14px;
  }

  .tc-text:last-child { margin-bottom: 0; }

  .tc-highlight {
    background: var(--bg-input);
    border: 1px solid var(--border);
    padding: 16px 20px;
    margin: 16px 0;
    position: relative;
  }

  .tc-highlight::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    opacity: 0.5;
    border-radius: 1px;
  }

  .tc-highlight p {
    font-size: 0.82rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.75;
    letter-spacing: 0.02em;
  }

  /* Warning highlight */
  .tc-warning {
    background: rgba(168,120,120,0.06);
    border: 1px solid rgba(168,120,120,0.18);
    padding: 14px 18px;
    margin: 16px 0;
    position: relative;
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .tc-warning::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--danger), transparent);
    opacity: 0.5;
    border-radius: 1px;
  }

  .tc-warning p {
    font-size: 0.8rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.72;
    letter-spacing: 0.02em;
  }

  .tc-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 14px 0;
    list-style: none;
    padding: 0;
  }

  .tc-list li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 0.84rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.7;
    letter-spacing: 0.02em;
  }

  .tc-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--gold);
    flex-shrink: 0;
    margin-top: 8px;
    opacity: 0.7;
  }

  .tc-link {
    color: var(--gold);
    text-decoration: none;
    border-bottom: 1px solid rgba(196,156,104,0.3);
    padding-bottom: 1px;
    transition: color 0.2s, border-color 0.2s;
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
  }

  .tc-link:hover { color: var(--gold-light); border-color: var(--gold-light); }

  /* Sub-heading within section */
  .tc-sub-heading {
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--gold);
    margin: 20px 0 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .tc-sub-heading::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--gold);
    opacity: 0.12;
  }

  /* ── CTA banner ── */
  .tc-cta {
    border: 1px solid var(--border);
    border-top: none;
    background: var(--bg-card);
    padding: 36px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.6s 0.5s var(--ease) both;
    flex-wrap: wrap;
  }

  .tc-cta::before {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.18;
  }

  .tc-cta-text { flex: 1; min-width: 200px; }

  .tc-cta-title {
    font-family: var(--serif);
    font-size: 1.2rem;
    font-weight: 300;
    color: var(--text);
    margin-bottom: 5px;
    letter-spacing: -0.01em;
  }

  .tc-cta-sub {
    font-size: 0.78rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.65;
    letter-spacing: 0.02em;
  }

  .tc-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 36px;
    background: var(--gold);
    border: none;
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.65rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--bg);
    cursor: pointer;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.3s var(--ease);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .tc-cta-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold-light);
    transform: translateX(-101%);
    transition: transform 0.36s var(--ease);
    z-index: 0;
  }

  .tc-cta-btn:hover::before { transform: translateX(0); }
  .tc-cta-btn:hover { box-shadow: 0 8px 28px rgba(196,156,104,0.22); }
  .tc-cta-btn span { position: relative; z-index: 1; }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .tc-layout   { grid-template-columns: 1fr; gap: 40px; padding: 60px 28px 96px; }
    .tc-sidebar  { position: static; }
    .tc-sec-inner { padding: 0 24px 28px; }
    .tc-sec-trigger { padding: 22px 24px; grid-template-columns: 40px 1fr auto; }
  }
  @media (max-width: 540px) {
    .tc-layout { padding: 48px 16px 80px; }
    .tc-cta    { flex-direction: column; align-items: flex-start; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }
`;

/* ── Sections data ── */
const SECTIONS = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    tag: "Agreement",
    content: (
      <>
        <p className="tc-text">
          By accessing or using the Jofta Solemates website, placing an order, or
          engaging with any of our services, you agree to be bound by these Terms
          and Conditions. Please read them carefully before proceeding.
        </p>
        <div className="tc-highlight">
          <p>
            If you do not agree to any part of these terms, you must not use our
            website or services. Your continued use of our platform constitutes
            your ongoing acceptance of these terms as they may be updated from
            time to time.
          </p>
        </div>
        <p className="tc-text">
          These terms apply to all visitors, customers, and users of our services,
          including those who browse without placing an order.
        </p>
      </>
    ),
  },
  {
    id: "products",
    title: "Products & Services",
    tag: "Offerings",
    content: (
      <>
        <p className="tc-text">
          Jofta Solemates offers handcrafted footwear, bespoke order services, and
          related customer support. We reserve the right to modify, discontinue, or
          limit the availability of any product or service at any time without prior notice.
        </p>
        <div className="tc-sub-heading">Product descriptions</div>
        <p className="tc-text">
          We make every effort to ensure that product descriptions, images, and
          specifications are accurate. However, slight variations in colour, texture,
          or dimensions may occur due to the handcrafted nature of our products and
          differences in device display settings. These variations do not constitute
          grounds for return unless the item is materially different from what was ordered.
        </p>
        <div className="tc-sub-heading">Bespoke orders</div>
        <p className="tc-text">
          Custom and bespoke orders are produced specifically for each customer.
          Once production has begun, bespoke orders cannot be cancelled or refunded
          except in cases of defect or material error on our part.
        </p>
        <ul className="tc-list">
          <li><span className="tc-dot" /><span>Bespoke consultations are offered at no additional cost.</span></li>
          <li><span className="tc-dot" /><span>Production timelines for bespoke orders will be communicated at the time of order.</span></li>
          <li><span className="tc-dot" /><span>Changes to bespoke specifications after confirmation may incur additional charges.</span></li>
        </ul>
      </>
    ),
  },
  {
    id: "ordering",
    title: "Placing an Order",
    tag: "Purchase",
    content: (
      <>
        <p className="tc-text">
          By placing an order on our website, you make an offer to purchase the selected
          products at the stated price. An order is only confirmed once payment has been
          successfully processed and verified.
        </p>
        <ul className="tc-list">
          <li><span className="tc-dot" /><span>You must provide accurate personal, delivery, and payment information.</span></li>
          <li><span className="tc-dot" /><span>You must be 18 years or older to place an order.</span></li>
          <li><span className="tc-dot" /><span>We reserve the right to refuse or cancel any order at our discretion.</span></li>
          <li><span className="tc-dot" /><span>Order confirmation will be sent to the email address provided at checkout.</span></li>
          <li><span className="tc-dot" /><span>Prices displayed are in Nigerian Naira (&#8358;) and are inclusive of applicable taxes.</span></li>
        </ul>
        <div className="tc-highlight">
          <p>
            We reserve the right to cancel orders where payment verification fails,
            where the product is no longer available, or where we have reason to
            suspect fraudulent activity. You will be notified promptly in such cases.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "payment",
    title: "Payment",
    tag: "Transactions",
    content: (
      <>
        <p className="tc-text">
          All payments are processed securely through Paystack, a PCI DSS compliant
          payment gateway. We accept debit cards, credit cards, and other payment
          methods supported by Paystack.
        </p>
        <ul className="tc-list">
          <li><span className="tc-dot" /><span>Payment is required in full at the time of ordering.</span></li>
          <li><span className="tc-dot" /><span>We do not store your card details on our servers.</span></li>
          <li><span className="tc-dot" /><span>All transactions are encrypted using SSL technology.</span></li>
          <li><span className="tc-dot" /><span>Payment references are verified server-side before order fulfilment begins.</span></li>
        </ul>
        <div className="tc-warning">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:2 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p>
            Jofta Solemates will never contact you requesting payment outside of our
            official checkout process. If you receive such a request, please report it
            to us immediately.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    tag: "Fulfilment",
    content: (
      <>
        <p className="tc-text">
          We deliver across Nigeria using third-party courier services. Delivery
          timelines are estimates and may be affected by factors outside our control,
          including weather, public holidays, or courier delays.
        </p>
        <div className="tc-sub-heading">Delivery timelines</div>
        <ul className="tc-list">
          <li><span className="tc-dot" /><span>Standard delivery: 2–5 business days depending on location.</span></li>
          <li><span className="tc-dot" /><span>Bespoke orders: timelines communicated individually at order confirmation.</span></li>
          <li><span className="tc-dot" /><span>A courier representative will contact you directly to coordinate delivery.</span></li>
        </ul>
        <div className="tc-sub-heading">Shipping charges</div>
        <p className="tc-text">
          Shipping is free on orders above &#8358;50,000. Orders below this threshold
          will be quoted a shipping fee at checkout based on delivery location.
          We are not responsible for delays caused by incorrect delivery information
          provided at checkout.
        </p>
        <p className="tc-text">
          Risk of loss and title for items pass to you upon delivery. If your package
          arrives damaged, please photograph it immediately and contact us within
          48 hours of receipt.
        </p>
      </>
    ),
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    tag: "Policy",
    content: (
      <>
        <p className="tc-text">
          We want you to be completely satisfied with your purchase. If for any reason
          you are not, we will work with you to find a fair resolution.
        </p>
        <div className="tc-sub-heading">Eligibility</div>
        <ul className="tc-list">
          <li><span className="tc-dot" /><span>Items must be returned within 7 days of delivery.</span></li>
          <li><span className="tc-dot" /><span>Items must be unused, unworn, and in their original packaging.</span></li>
          <li><span className="tc-dot" /><span>Bespoke and custom orders are non-refundable unless faulty.</span></li>
          <li><span className="tc-dot" /><span>Sale items are non-refundable unless defective.</span></li>
        </ul>
        <div className="tc-sub-heading">Process</div>
        <p className="tc-text">
          To initiate a return, contact us at{" "}
          <a href="mailto:ajagbejanet2018@gmail.com" className="tc-link">
            ajagbejanet2018@gmail.com
          </a>{" "}
          within the return window. We will provide instructions for returning the item.
          Refunds will be processed within 7 business days of receiving the returned item
          and will be issued to the original payment method.
        </p>
        <div className="tc-highlight">
          <p>
            Return shipping costs are the responsibility of the customer unless the
            return is due to a defect, incorrect item, or error on our part.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "intellectual",
    title: "Intellectual Property",
    tag: "Ownership",
    content: (
      <>
        <p className="tc-text">
          All content on the Jofta Solemates website — including text, images,
          logos, designs, product photographs, and software — is the intellectual
          property of Jofta Solemates and is protected by applicable copyright,
          trademark, and design laws.
        </p>
        <ul className="tc-list">
          <li><span className="tc-dot" /><span>You may not reproduce, distribute, or use our content for commercial purposes without written consent.</span></li>
          <li><span className="tc-dot" /><span>You may not use our brand name, logo, or trademarks in any manner that implies endorsement.</span></li>
          <li><span className="tc-dot" /><span>Personal, non-commercial use of content (e.g. sharing product pages) is permitted.</span></li>
        </ul>
        <p className="tc-text">
          Unauthorised use of our intellectual property may result in legal action.
          If you wish to collaborate or use our content, please contact us directly.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    tag: "Legal",
    content: (
      <>
        <p className="tc-text">
          To the maximum extent permitted by applicable law, Jofta Solemates shall
          not be liable for any indirect, incidental, special, consequential, or
          punitive damages arising from your use of our website or products.
        </p>
        <div className="tc-warning">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:2 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p>
            Our total liability to you for any claim arising from or related to
            these terms or our services shall not exceed the amount you paid for
            the specific product or service giving rise to the claim.
          </p>
        </div>
        <p className="tc-text">
          We do not warrant that our website will be uninterrupted, error-free, or
          free of viruses. We are not responsible for any loss or damage resulting
          from third-party actions, including payment processor errors or courier failures.
        </p>
      </>
    ),
  },
  {
    id: "conduct",
    title: "User Conduct",
    tag: "Behaviour",
    content: (
      <>
        <p className="tc-text">
          By using our website, you agree to conduct yourself in a manner that is
          lawful, respectful, and does not interfere with the experience of other users.
        </p>
        <p className="tc-text">You agree not to:</p>
        <ul className="tc-list">
          <li><span className="tc-dot" /><span>Use our website for any unlawful, fraudulent, or harmful purpose.</span></li>
          <li><span className="tc-dot" /><span>Attempt to gain unauthorised access to our systems or data.</span></li>
          <li><span className="tc-dot" /><span>Transmit any malware, spam, or disruptive content through our platform.</span></li>
          <li><span className="tc-dot" /><span>Misrepresent your identity or impersonate any person or entity.</span></li>
          <li><span className="tc-dot" /><span>Scrape, crawl, or harvest data from our website without written permission.</span></li>
          <li><span className="tc-dot" /><span>Engage in any activity that places an unreasonable load on our infrastructure.</span></li>
        </ul>
        <p className="tc-text">
          We reserve the right to suspend or terminate access to any user who
          violates these conduct requirements.
        </p>
      </>
    ),
  },
  {
    id: "governing",
    title: "Governing Law",
    tag: "Jurisdiction",
    content: (
      <>
        <p className="tc-text">
          These Terms and Conditions are governed by and construed in accordance
          with the laws of the Federal Republic of Nigeria. Any disputes arising
          from or related to these terms or your use of our services shall be
          subject to the exclusive jurisdiction of the courts of Nigeria.
        </p>
        <p className="tc-text">
          If any provision of these terms is found to be unenforceable or invalid
          under applicable law, that provision will be modified to the minimum extent
          necessary to make it enforceable, and the remaining provisions will
          continue in full force and effect.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    tag: "Updates",
    content: (
      <>
        <p className="tc-text">
          We reserve the right to update or modify these Terms and Conditions at
          any time. Changes will be effective immediately upon posting to our website.
          The effective date at the top of this page will reflect the date of the
          most recent revision.
        </p>
        <p className="tc-text">
          It is your responsibility to review these terms periodically. Your continued
          use of our website or services after any changes constitutes your acceptance
          of the revised terms. If you do not agree to the updated terms, please
          discontinue use of our services.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    tag: "Enquiries",
    content: (
      <>
        <p className="tc-text">
          If you have questions about these Terms and Conditions or wish to report
          a concern, please contact us:
        </p>
        <div className="tc-highlight">
          <p>
            <strong style={{ color: "var(--text)", fontWeight: 400 }}>Jofta Solemates</strong><br />
            Olukotun Compound, Oke Alapata Area, Ogbomosho, Oyo State<br />
            Email: <a href="mailto:ajagbejanet2018@gmail.com" className="tc-link">ajagbejanet2018@gmail.com</a><br />
            Phone: <a href="tel:+2349137496458" className="tc-link">+234 903 308 0879</a><br />
            WhatsApp: <a href="https://wa.me/2349137496458" className="tc-link" target="_blank" rel="noopener noreferrer">+234 903 308 0879</a>
          </p>
        </div>
        <p className="tc-text">
          We aim to respond to all legal and policy enquiries within 5 business days.
        </p>
      </>
    ),
  },
];

/* ── Section component ── */
function TermsSection({ section, index, isOpen, onToggle }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target); } },
      { threshold: 0.04, rootMargin: "40px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={section.id}
      className={`tc-section${isOpen ? " open" : ""}${visible ? " visible" : ""}`}
      style={{ transitionDelay: `${index * 0.035}s` }}
    >
      <button className="tc-sec-trigger" onClick={() => onToggle(section.id)}>
        <span className="tc-sec-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="tc-sec-head">
          <span className="tc-sec-title">{section.title}</span>
          <span className="tc-sec-tag">{section.tag}</span>
        </span>
        <span className="tc-expand-icon">
          <span className="tc-expand-h" />
          <span className="tc-expand-v" />
        </span>
      </button>

      <div className="tc-sec-body">
        <div className="tc-sec-inner">{section.content}</div>
      </div>
    </div>
  );
}

/* ── Main export ── */
export default function TermsAndConditions() {
  const [openId,   setOpenId]   = useState("acceptance");
  const [activeId, setActiveId] = useState("acceptance");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const onScroll = () => {
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveId(s.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = (id) => setOpenId(prev => prev === id ? null : id);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
      setOpenId(id);
      setActiveId(id);
    }
  };

  return (
    <div className="tc-page">
      <style>{CSS}</style>
      <div className="tc-glow" />

      <div className="tc-layout">

        {/* ── Sidebar ── */}
        <aside className="tc-sidebar">
          <p className="tc-sidebar-label">Contents</p>

          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              className={`tc-nav-btn${activeId === s.id ? " active" : ""}`}
              onClick={() => scrollTo(s.id)}
            >
              <span className="tc-nav-num">{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </button>
          ))}

          <div className="tc-sidebar-notice">
            <p className="tc-notice-text">
              <strong>By using our website</strong>, you acknowledge that you have
              read, understood, and agree to these Terms and Conditions.
            </p>
          </div>

          <div className="tc-sidebar-meta">
            <div className="tc-meta-row">
              <span className="tc-meta-key">Effective</span>
              <span className="tc-meta-val">1 January 2026</span>
            </div>
            <div className="tc-meta-row">
              <span className="tc-meta-key">Last Updated</span>
              <span className="tc-meta-val">April 2026</span>
            </div>
            <div className="tc-meta-row">
              <span className="tc-meta-key">Jurisdiction</span>
              <span className="tc-meta-val">Federal Republic of Nigeria</span>
            </div>
          </div>
        </aside>

        {/* ── Content ── */}
        <div className="tc-content">

          {/* Header */}
          <div className="tc-header">
            <div className="tc-label">Legal</div>
            <h1 className="tc-title">Terms &amp; <em>Conditions</em></h1>
            <hr className="tc-rule" />
            <p className="tc-intro">
              These terms govern your use of the Jofta Solemates website and services.
              Please read them carefully — they are written to be clear and fair to both parties.
            </p>
          </div>

          {/* Acceptance notice */}
          <div className="tc-acceptance">
            <div className="tc-acc-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <p className="tc-acc-text">
              <strong>Agreement notice:</strong> By accessing or placing an order through
              the Jofta Solemates website, you confirm that you have read, understood,
              and agree to be bound by these Terms and Conditions in their entirety.
            </p>
          </div>

          {/* Sections */}
          {SECTIONS.map((section, i) => (
            <TermsSection
              key={section.id}
              section={section}
              index={i}
              isOpen={openId === section.id}
              onToggle={toggle}
            />
          ))}

          {/* CTA */}
          <div className="tc-cta">
            <div className="tc-cta-text">
              <p className="tc-cta-title">Have a question about our terms?</p>
              <p className="tc-cta-sub">
                Our team is happy to clarify any part of these terms or discuss
                any concerns before you place an order.
              </p>
            </div>
            <Link to="/contact" className="tc-cta-btn">
              <span>Contact Us</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: "relative", zIndex: 1 }}>
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
