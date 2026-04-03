import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --bg:           #0e0c0a;
    --bg-card:      #141210;
    --bg-input:     #1a1714;
    --border:       rgba(255,255,255,0.07);
    --border-focus: rgba(196,156,104,0.5);
    --gold:         #c49c68;
    --gold-light:   #dbb98a;
    --text:         #f0ebe3;
    --text-muted:   #8a8178;
    --text-faint:   #4a4540;
    --success:      #7aab8a;
    --serif:        'Cormorant Garamond', Georgia, serif;
    --sans:         'Jost', sans-serif;
    --ease:         cubic-bezier(0.4, 0, 0.2, 1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page ── */
  .tm-page {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--sans);
    font-weight: 300;
    color: var(--text);
    position: relative;
    overflow: hidden;
  }

  /* Grain */
  .tm-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* Glows */
  .tm-glow {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(100px);
    z-index: 0;
  }
  .tm-glow-1 {
    width: 600px; height: 400px;
    top: -80px; right: -100px;
    background: radial-gradient(ellipse, rgba(196,156,104,0.05) 0%, transparent 70%);
  }
  .tm-glow-2 {
    width: 400px; height: 400px;
    bottom: 100px; left: -80px;
    background: radial-gradient(ellipse, rgba(122,171,138,0.04) 0%, transparent 70%);
  }

  /* ── Inner ── */
  .tm-inner {
    position: relative;
    z-index: 1;
    max-width: 1160px;
    margin: 0 auto;
    padding: 96px 48px 120px;
  }

  /* ── Header ── */
  .tm-header {
    text-align: center;
    max-width: 520px;
    margin: 0 auto 88px;
  }

  .tm-label {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
    opacity: 0;
    animation: fadeUp 0.6s 0.1s var(--ease) forwards;
  }
  .tm-label::before, .tm-label::after {
    content: '';
    display: inline-block;
    width: 24px; height: 1px;
    background: var(--gold);
    opacity: 0.45;
  }

  .tm-title {
    font-family: var(--serif);
    font-size: clamp(2.6rem, 4.5vw, 3.8rem);
    font-weight: 300;
    line-height: 1.08;
    color: var(--text);
    margin-bottom: 20px;
    opacity: 0;
    animation: fadeUp 0.7s 0.2s var(--ease) forwards;
  }
  .tm-title em { font-style: italic; color: var(--gold-light); }

  .tm-rule {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    border: none;
    margin: 0 auto 20px;
    opacity: 0;
    animation: fadeUp 0.6s 0.28s var(--ease) forwards;
  }

  .tm-subtitle {
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.78;
    letter-spacing: 0.02em;
    opacity: 0;
    animation: fadeUp 0.7s 0.34s var(--ease) forwards;
  }

  /* ── Rating summary bar ── */
  .tm-summary {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 40px;
    align-items: center;
    border: 1px solid var(--border);
    background: var(--bg-card);
    padding: 32px 40px;
    margin-bottom: 2px;
    position: relative;
    overflow: hidden;
    opacity: 0;
    animation: fadeUp 0.6s 0.4s var(--ease) forwards;
  }

  .tm-summary::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.22;
  }

  .tm-avg-block { text-align: center; }

  .tm-avg-num {
    font-family: var(--serif);
    font-size: 4.5rem;
    font-weight: 200;
    color: var(--text);
    line-height: 1;
    display: block;
    letter-spacing: -0.03em;
  }

  .tm-avg-max {
    font-size: 0.7rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.12em;
    margin-top: 4px;
    display: block;
  }

  /* Stars */
  .tm-stars-row {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 14px;
  }

  .tm-star {
    width: 14px; height: 14px;
    flex-shrink: 0;
  }

  .tm-star-filled { fill: var(--gold); }
  .tm-star-empty  { fill: var(--text-faint); opacity: 0.4; }

  /* Breakdown bars */
  .tm-breakdown { display: flex; flex-direction: column; gap: 8px; }

  .tm-bar-row {
    display: grid;
    grid-template-columns: 14px 1fr 36px;
    align-items: center;
    gap: 10px;
  }

  .tm-bar-label {
    font-size: 0.68rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.06em;
    text-align: right;
  }

  .tm-bar-track {
    height: 3px;
    background: var(--bg-input);
    border-radius: 2px;
    overflow: hidden;
  }

  .tm-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    border-radius: 2px;
    transition: width 1s 0.8s var(--ease);
  }

  .tm-bar-count {
    font-size: 0.62rem;
    font-weight: 300;
    color: var(--text-faint);
    text-align: right;
    letter-spacing: 0.05em;
  }

  /* Summary stats */
  .tm-summary-stats {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .tm-summary-stat {
    text-align: center;
    padding: 14px 20px;
    border: 1px solid var(--border);
    background: var(--bg-input);
    position: relative;
  }

  .tm-summary-stat::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: var(--gold);
    opacity: 0.15;
  }

  .tm-ss-num {
    font-family: var(--serif);
    font-size: 1.5rem;
    font-weight: 300;
    color: var(--text);
    display: block;
    letter-spacing: -0.01em;
    line-height: 1;
    margin-bottom: 4px;
  }

  .tm-ss-label {
    font-size: 0.58rem;
    font-weight: 300;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-faint);
    display: block;
  }

  /* ── Featured quote ── */
  .tm-featured {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-top: none;
    padding: 52px 56px;
    position: relative;
    overflow: hidden;
    margin-bottom: 2px;
    opacity: 0;
    animation: fadeUp 0.7s 0.45s var(--ease) forwards;
  }

  /* Large decorative quote mark */
  .tm-featured::before {
    content: '';
    position: absolute;
    top: -20px; left: 40px;
    font-family: var(--serif);
    font-size: 18rem;
    font-weight: 200;
    color: var(--text-faint);
    opacity: 0.08;
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }

  .tm-featured-quote {
    font-family: var(--serif);
    font-size: clamp(1.4rem, 2.5vw, 2rem);
    font-weight: 300;
    font-style: italic;
    color: var(--text);
    line-height: 1.5;
    letter-spacing: 0.01em;
    position: relative;
    z-index: 1;
    max-width: 680px;
    margin-bottom: 32px;
  }

  .tm-featured-quote em { color: var(--gold-light); font-style: normal; }

  .tm-featured-meta {
    display: flex;
    align-items: center;
    gap: 18px;
    position: relative;
    z-index: 1;
  }

  .tm-featured-avatar {
    width: 48px; height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid var(--border);
    filter: grayscale(15%);
    flex-shrink: 0;
  }

  .tm-featured-avatar-placeholder {
    width: 48px; height: 48px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--bg-input);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--serif);
    font-size: 1.2rem;
    font-weight: 300;
    color: var(--gold);
    flex-shrink: 0;
  }

  .tm-featured-name {
    font-size: 0.82rem;
    font-weight: 400;
    color: var(--text);
    letter-spacing: 0.04em;
    display: block;
    margin-bottom: 3px;
  }

  .tm-featured-role {
    font-size: 0.68rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: block;
  }

  .tm-featured-verified {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--success);
  }

  /* ── Testimonials grid ── */
  .tm-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    border: 1px solid var(--border);
    opacity: 0;
    animation: fadeUp 0.7s 0.5s var(--ease) forwards;
  }

  /* ── Testimonial card ── */
  .tm-card {
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    padding: 32px 28px 28px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    transition: background 0.28s var(--ease);
  }

  .tm-card:last-child { border-right: none; }
  .tm-card:hover { background: #171412; }

  .tm-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.3s var(--ease);
  }

  .tm-card:hover::before { opacity: 0.35; }

  /* Card quote mark */
  .tm-card-quote-icon {
    font-family: var(--serif);
    font-size: 4rem;
    font-weight: 200;
    color: var(--gold);
    opacity: 0.2;
    line-height: 1;
    margin-bottom: 8px;
    transition: opacity 0.25s;
    user-select: none;
    display: block;
  }

  .tm-card:hover .tm-card-quote-icon { opacity: 0.4; }

  /* Stars */
  .tm-card-stars {
    display: flex;
    gap: 3px;
    margin-bottom: 16px;
  }

  /* Text */
  .tm-card-text {
    font-family: var(--serif);
    font-size: 1.05rem;
    font-weight: 300;
    font-style: italic;
    color: var(--text-muted);
    line-height: 1.7;
    letter-spacing: 0.01em;
    flex: 1;
    margin-bottom: 24px;
    transition: color 0.25s;
  }

  .tm-card:hover .tm-card-text { color: var(--text); }

  /* Card meta */
  .tm-card-meta {
    padding-top: 20px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .tm-card-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid var(--border);
    filter: grayscale(15%);
    flex-shrink: 0;
    transition: filter 0.3s;
  }

  .tm-card:hover .tm-card-avatar { filter: grayscale(0%); }

  .tm-card-avatar-init {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--bg-input);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--serif);
    font-size: 1rem;
    font-weight: 300;
    color: var(--gold);
    flex-shrink: 0;
  }

  .tm-card-name {
    font-size: 0.78rem;
    font-weight: 400;
    color: var(--text);
    letter-spacing: 0.04em;
    display: block;
    margin-bottom: 2px;
    transition: color 0.2s;
  }

  .tm-card:hover .tm-card-name { color: var(--gold-light); }

  .tm-card-product {
    font-size: 0.62rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.08em;
    display: block;
  }

  .tm-card-date {
    margin-left: auto;
    font-size: 0.6rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.06em;
    white-space: nowrap;
  }

  /* ── Marquee strip ── */
  .tm-marquee-wrap {
    border: 1px solid var(--border);
    border-top: none;
    overflow: hidden;
    padding: 0;
    background: var(--bg-card);
    position: relative;
    opacity: 0;
    animation: fadeUp 0.6s 0.55s var(--ease) forwards;
  }

  .tm-marquee-wrap::before,
  .tm-marquee-wrap::after {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    width: 80px;
    z-index: 2;
    pointer-events: none;
  }
  .tm-marquee-wrap::before { left: 0; background: linear-gradient(to right, var(--bg-card), transparent); }
  .tm-marquee-wrap::after  { right: 0; background: linear-gradient(to left, var(--bg-card), transparent); }

  .tm-marquee {
    display: flex;
    align-items: center;
    gap: 0;
    padding: 20px 0;
    animation: marquee 30s linear infinite;
    width: max-content;
  }

  .tm-marquee:hover { animation-play-state: paused; }

  .tm-marquee-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 36px;
    border-right: 1px solid var(--border);
    white-space: nowrap;
  }

  .tm-marquee-stars {
    display: flex;
    gap: 2px;
    flex-shrink: 0;
  }

  .tm-marquee-text {
    font-family: var(--serif);
    font-size: 0.9rem;
    font-weight: 300;
    font-style: italic;
    color: var(--text-muted);
    letter-spacing: 0.01em;
  }

  .tm-marquee-author {
    font-size: 0.65rem;
    font-weight: 300;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-faint);
    flex-shrink: 0;
  }

  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* ── CTA ── */
  .tm-cta {
    border: 1px solid var(--border);
    border-top: none;
    background: var(--bg-card);
    padding: 52px;
    text-align: center;
    position: relative;
    overflow: hidden;
    opacity: 0;
    animation: fadeUp 0.7s 0.6s var(--ease) forwards;
  }

  .tm-cta::before {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.18;
  }

  .tm-cta-label {
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
  }

  .tm-cta-title {
    font-family: var(--serif);
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 300;
    color: var(--text);
    line-height: 1.1;
    margin-bottom: 12px;
  }

  .tm-cta-title em { font-style: italic; color: var(--gold-light); }

  .tm-cta-sub {
    font-size: 0.85rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.7;
    max-width: 380px;
    margin: 0 auto 36px;
    letter-spacing: 0.02em;
  }

  .tm-cta-btns {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .tm-btn-gold {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 44px;
    background: var(--gold);
    border: none;
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--bg);
    cursor: pointer;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.3s var(--ease), color 0.3s;
  }

  .tm-btn-gold::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold-light);
    transform: translateX(-101%);
    transition: transform 0.38s var(--ease);
    z-index: 0;
  }

  .tm-btn-gold:hover::before { transform: translateX(0); }
  .tm-btn-gold:hover { box-shadow: 0 10px 36px rgba(196,156,104,0.25); }
  .tm-btn-gold span { position: relative; z-index: 1; }

  .tm-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 36px;
    background: transparent;
    border: 1px solid rgba(196,156,104,0.35);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    cursor: pointer;
    text-decoration: none;
    transition: background 0.25s, border-color 0.25s;
  }

  .tm-btn-ghost:hover {
    background: rgba(196,156,104,0.07);
    border-color: var(--gold);
  }

  /* ── Reveal animation ── */
  .tm-card-reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s var(--ease), transform 0.55s var(--ease);
  }
  .tm-card-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 1000px) {
    .tm-grid    { grid-template-columns: 1fr 1fr; }
    .tm-summary { grid-template-columns: auto 1fr; }
    .tm-summary-stats { flex-direction: row; }
    .tm-summary-stat  { flex: 1; }
  }
  @media (max-width: 700px) {
    .tm-inner    { padding: 72px 20px 96px; }
    .tm-grid     { grid-template-columns: 1fr; }
    .tm-summary  { grid-template-columns: 1fr; gap: 24px; }
    .tm-featured { padding: 36px 24px; }
    .tm-cta      { padding: 36px 20px; }
    .tm-cta-btns { flex-direction: column; align-items: stretch; }
    .tm-btn-gold, .tm-btn-ghost { justify-content: center; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 3px; }

`

/* ── Data ── */
const FEATURED = {
  quote: "I have never worn anything that made me feel so completely myself. The craftsmanship is unlike anything I have experienced — every detail speaks of someone who genuinely cares about the person wearing these shoes.",
  highlight: "genuinely cares",
  name: "Adaeze Okonkwo",
  role: "Verified Purchase — Bespoke Derby",
  initials: "AO",
};

const TESTIMONIALS = [
  {
    name: "Tunde Adeyemi",
    product: "Heritage Loafer",
    rating: 5,
    date: "Mar 2026",
    text: "Ordered a pair for my wedding and received compliments all evening. The leather is supple, the fit is exact, and the finishing is immaculate. Worth every naira.",
    initials: "TA",
  },
  {
    name: "Chisom Eze",
    product: "Artisan Mule",
    rating: 5,
    date: "Feb 2026",
    text: "I was hesitant ordering handmade shoes online, but the sizing consultation call changed everything. They measured my exact foot shape and delivered perfection.",
    initials: "CE",
  },
  {
    name: "Emeka Nwosu",
    product: "Classic Oxford",
    rating: 5,
    date: "Feb 2026",
    text: "Six months in and these shoes still look brand new with minimal care. The sole construction is extraordinary — I can feel the difference with every step.",
    initials: "EN",
  },
  {
    name: "Kemi Fashola",
    product: "Bespoke Derby",
    rating: 5,
    date: "Jan 2026",
    text: "The customer experience matched the product quality. Responsive, patient, and deeply knowledgeable. They treated my order like it was the only one they had.",
    initials: "KF",
  },
  {
    name: "Femi Oduya",
    product: "Heritage Loafer",
    rating: 5,
    date: "Jan 2026",
    text: "My third pair and each one has been better than the last. You can tell these are made by people who have been doing this for generations.",
    initials: "FO",
  },
  {
    name: "Ngozi Amadi",
    product: "Artisan Mule",
    rating: 5,
    date: "Dec 2025",
    text: "Gifted a pair to my mother and she has not stopped telling everyone about them. The packaging alone was an experience. Truly luxury in every sense.",
    initials: "NA",
  },
];

const BREAKDOWN = [
  { stars: 5, count: 87 },
  { stars: 4, count: 10 },
  { stars: 3, count: 2  },
  { stars: 2, count: 1  },
  { stars: 1, count: 0  },
];

const TOTAL  = BREAKDOWN.reduce((a, b) => a + b.count, 0);
const AVG    = (BREAKDOWN.reduce((a, b) => a + b.stars * b.count, 0) / TOTAL).toFixed(1);

const MARQUEE_ITEMS = [
  { text: "Perfection from heel to toe.", author: "Bola A." },
  { text: "Worth every single kobo.", author: "Seun M." },
  { text: "Finally, shoes that actually fit.", author: "Dami O." },
  { text: "The most beautiful shoes I own.", author: "Ifeoma C." },
  { text: "Exceptional quality, exceptional service.", author: "Kayode T." },
  { text: "My feet have never been happier.", author: "Amara N." },
  { text: "Perfection from heel to toe.", author: "Bola A." },
  { text: "Worth every single kobo.", author: "Seun M." },
  { text: "Finally, shoes that actually fit.", author: "Dami O." },
  { text: "The most beautiful shoes I own.", author: "Ifeoma C." },
  { text: "Exceptional quality, exceptional service.", author: "Kayode T." },
  { text: "My feet have never been happier.", author: "Amara N." },
];

/* ── Star SVG ── */
function Stars({ rating, size = 11 }) {
  return (
    <div className="tm-stars-row" style={{ marginBottom: 0 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} className="tm-star" width={size} height={size} viewBox="0 0 24 24">
          <path
            className={s <= rating ? "tm-star-filled" : "tm-star-empty"}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.07 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      ))}
    </div>
  );
}

/* ── Testimonial card ── */
function TestimonialCard({ t, index }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target); } },
      { threshold: 0.1, rootMargin: "40px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`tm-card-reveal${visible ? " visible" : ""}`}
      style={{ transitionDelay: `${(index % 3) * 0.08}s` }}
    >
      <div className="tm-card">
        <span className="tm-card-quote-icon" aria-hidden="true">&ldquo;</span>

        <div className="tm-card-stars">
          <Stars rating={t.rating} size={11} />
        </div>

        <p className="tm-card-text">&ldquo;{t.text}&rdquo;</p>

        <div className="tm-card-meta">
          <div className="tm-card-avatar-init">{t.initials}</div>
          <div>
            <span className="tm-card-name">{t.name}</span>
            <span className="tm-card-product">{t.product}</span>
          </div>
          <span className="tm-card-date">{t.date}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main export ── */
export default function TestimonialsPage() {

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="tm-page">
      <style>{CSS}</style>
      <div className="tm-glow tm-glow-1" />
      <div className="tm-glow tm-glow-2" />

      <div className="tm-inner">

        {/* Header */}
        <header className="tm-header">
          <div className="tm-label">Customer Stories</div>
          <h1 className="tm-title">Worn With <em>Pride</em></h1>
          <hr className="tm-rule" />
          <p className="tm-subtitle">
            Every pair carries a story. Here is what our customers say about
            wearing Jofta Solemates.
          </p>
        </header>

        {/* Rating summary */}
        <div className="tm-summary">
          {/* Average */}
          <div className="tm-avg-block">
            <span className="tm-avg-num">{AVG}</span>
            <div className="tm-stars-row" style={{ justifyContent: "center", marginTop: 8 }}>
              <Stars rating={5} size={14} />
            </div>
            <span className="tm-avg-max">out of 5</span>
          </div>

          {/* Breakdown bars */}
          <div className="tm-breakdown">
            {BREAKDOWN.map(b => (
              <div key={b.stars} className="tm-bar-row">
                <span className="tm-bar-label">{b.stars}</span>
                <div className="tm-bar-track">
                  <div
                    className="tm-bar-fill"
                    style={{ width: `${(b.count / TOTAL) * 100}%` }}
                  />
                </div>
                <span className="tm-bar-count">{b.count}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="tm-summary-stats">
            <div className="tm-summary-stat">
              <span className="tm-ss-num">{TOTAL}</span>
              <span className="tm-ss-label">Reviews</span>
            </div>
            <div className="tm-summary-stat">
              <span className="tm-ss-num">100%</span>
              <span className="tm-ss-label">Recommend</span>
            </div>
          </div>
        </div>

        {/* Featured quote */}
        <div className="tm-featured">
          <blockquote className="tm-featured-quote">
            &ldquo;{FEATURED.quote.replace(FEATURED.highlight, `<em>${FEATURED.highlight}</em>`)
              .split(/<em>|<\/em>/)
              .map((part, i) =>
                i % 2 === 1 ? <em key={i}>{part}</em> : part
              )
            }&rdquo;
          </blockquote>
          <div className="tm-featured-meta">
            <div className="tm-featured-avatar-placeholder">{FEATURED.initials}</div>
            <div>
              <span className="tm-featured-name">{FEATURED.name}</span>
              <span className="tm-featured-role">{FEATURED.role}</span>
            </div>
            <div className="tm-featured-verified">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Verified Purchase
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="tm-grid">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} />
          ))}
        </div>

        {/* Marquee strip */}
        <div className="tm-marquee-wrap">
          <div className="tm-marquee">
            {MARQUEE_ITEMS.map((item, i) => (
              <div key={i} className="tm-marquee-item">
                <div className="tm-marquee-stars">
                  <Stars rating={5} size={9} />
                </div>
                <span className="tm-marquee-text">&ldquo;{item.text}&rdquo;</span>
                <span className="tm-marquee-author">— {item.author}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="tm-cta">
          <p className="tm-cta-label">Join Our Community</p>
          <h2 className="tm-cta-title">Step Into Your <em>Own Story</em></h2>
          <p className="tm-cta-sub">
            Discover the pair that was made for you. Every Jofta shoe begins
            with a conversation.
          </p>
          <div className="tm-cta-btns">
            <Link to="/collection" className="tm-btn-gold">
              <span>Shop Collection</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: "relative", zIndex: 1 }}>
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link to="/contact" className="tm-btn-ghost">
              Leave a Review
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}