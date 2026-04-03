import React, { useEffect, useRef } from "react";
import artisian from "../assets/artisian.jpg"
import certificate from "../assets/certificate.jpg"
import hero from "../assets/high-angle-summer-shoes.jpg"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;0,600;1,200;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --bg:           #0e0c0a;
    --bg-card:      #141210;
    --bg-input:     #1a1714;
    --border:       rgba(255,255,255,0.07);
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

  .ab {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    font-weight: 300;
    overflow-x: hidden;
  }

  /* Grain overlay */
  .ab-grain {
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 100;
    opacity: 0.5;
  }

  /* ── Reveal utility ── */
  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.75s var(--ease), transform 0.75s var(--ease);
  }
  .reveal.active {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-left {
    opacity: 0;
    transform: translateX(-32px);
    transition: opacity 0.75s var(--ease), transform 0.75s var(--ease);
  }
  .reveal-left.active { opacity: 1; transform: translateX(0); }
  .reveal-right {
    opacity: 0;
    transform: translateX(32px);
    transition: opacity 0.75s var(--ease), transform 0.75s var(--ease);
  }
  .reveal-right.active { opacity: 1; transform: translateX(0); }

  /* ── Shared section label ── */
  .ab-label {
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
  .ab-label::before {
    content: '';
    display: inline-block;
    width: 28px; height: 1px;
    background: var(--gold);
    opacity: 0.5;
  }

  /* ── Shared section title ── */
  .ab-h2 {
    font-family: var(--serif);
    font-size: clamp(2.4rem, 4vw, 3.6rem);
    font-weight: 300;
    line-height: 1.1;
    color: var(--text);
    letter-spacing: -0.01em;
    margin-bottom: 20px;
  }
  .ab-h2 em { font-style: italic; color: var(--gold-light); }

  .ab-rule {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    border: none;
    margin-bottom: 20px;
  }

  .ab-body {
    font-size: 0.875rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.85;
    letter-spacing: 0.02em;
    max-width: 520px;
  }

  /* ─────────────────────────────────────
     HERO
  ───────────────────────────────────── */
  .ab-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .ab-hero-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1800&q=80');
    background-size: cover;
    background-position: center 30%;
    filter: brightness(0.22) saturate(0.6);
    transform: scale(1.06);
    transition: transform 12s linear;
    will-change: transform;
  }

  .ab-hero-bg.scrolled { transform: scale(1.06) translateY(60px); }

  .ab-hero-vignette {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to right, rgba(14,12,10,0.85) 40%, transparent),
      linear-gradient(to top, rgba(14,12,10,0.7) 0%, transparent 50%);
    z-index: 1;
  }

  .ab-hero-inner {
    position: relative;
    z-index: 2;
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 80px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    min-height: 100vh;
    gap: 40px;
  }

  .ab-hero-left { padding: 100px 0 80px; }

  .ab-hero-est {
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--gold);
    opacity: 0;
    animation: fadeUp 0.6s 0.15s var(--ease) forwards;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ab-hero-est::before {
    content: '';
    width: 32px; height: 1px;
    background: var(--gold);
    opacity: 0.5;
  }

  .ab-hero-h1 {
    font-family: var(--serif);
    font-size: clamp(3rem, 5.5vw, 5.5rem);
    font-weight: 200;
    line-height: 1.0;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 28px;
    opacity: 0;
    animation: fadeUp 0.8s 0.3s var(--ease) forwards;
  }

  .ab-hero-h1 em {
    font-style: italic;
    color: var(--gold-light);
    display: block;
  }

  .ab-hero-sub {
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.8;
    max-width: 420px;
    margin-bottom: 48px;
    opacity: 0;
    animation: fadeUp 0.7s 0.5s var(--ease) forwards;
    letter-spacing: 0.02em;
  }

  .ab-hero-cta {
    display: flex;
    align-items: center;
    gap: 24px;
    opacity: 0;
    animation: fadeUp 0.7s 0.65s var(--ease) forwards;
  }

  /* Primary gold wipe button */
  .ab-btn-gold {
    padding: 15px 44px;
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
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.3s var(--ease);
  }
  .ab-btn-gold::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold-light);
    transform: translateX(-101%);
    transition: transform 0.38s var(--ease);
    z-index: 0;
  }
  .ab-btn-gold:hover::before { transform: translateX(0); }
  .ab-btn-gold:hover { box-shadow: 0 12px 36px rgba(196,156,104,0.25); }
  .ab-btn-gold span { position: relative; z-index: 1; }

  /* Ghost bordered button */
  .ab-btn-ghost {
    padding: 15px 36px;
    background: transparent;
    border: 1px solid rgba(196,156,104,0.4);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    cursor: pointer;
    transition: background 0.25s, border-color 0.25s, color 0.25s;
  }
  .ab-btn-ghost:hover {
    background: rgba(196,156,104,0.07);
    border-color: var(--gold);
  }

  /* Hero scroll indicator */
  .ab-hero-scroll {
    position: absolute;
    bottom: 40px; left: 80px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    opacity: 0;
    animation: fadeIn 0.6s 1.1s var(--ease) forwards;
  }
  .ab-hero-scroll-line {
    width: 1px; height: 48px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    opacity: 0.4;
    animation: scrollPulse 2s ease-in-out infinite;
  }
  .ab-hero-scroll-label {
    font-size: 0.55rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  /* ─────────────────────────────────────
     STORY
  ───────────────────────────────────── */
  .ab-story {
    padding: 120px 80px;
    max-width: 1160px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .ab-story-text { padding-right: 20px; }

  .ab-story-paras {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 36px;
  }

  .ab-story-paras p {
    font-size: 0.875rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.85;
    letter-spacing: 0.02em;
  }

  .ab-pullquote {
    border-left: 1px solid var(--gold);
    padding: 4px 0 4px 24px;
    margin-top: 8px;
  }

  .ab-pullquote p {
    font-family: var(--serif);
    font-size: 1.2rem;
    font-weight: 300;
    font-style: italic;
    color: var(--text-muted);
    line-height: 1.6;
    letter-spacing: 0.01em;
  }

  /* Story image */
  .ab-story-img-wrap {
    position: relative;
  }

  .ab-story-frame {
    width: 100%;
    aspect-ratio: 3/4;
    border: 1px solid var(--border);
    overflow: hidden;
    position: relative;
  }

  .ab-story-frame::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.25;
    z-index: 2;
  }

  /* Corner accents */
  .ab-corner {
    position: absolute;
    width: 18px; height: 18px;
    z-index: 3;
  }
  .ab-corner-tl { top: -1px; left: -1px; border-top: 1px solid var(--gold); border-left: 1px solid var(--gold); }
  .ab-corner-tr { top: -1px; right: -1px; border-top: 1px solid var(--gold); border-right: 1px solid var(--gold); }
  .ab-corner-bl { bottom: -1px; left: -1px; border-bottom: 1px solid var(--gold); border-left: 1px solid var(--gold); }
  .ab-corner-br { bottom: -1px; right: -1px; border-bottom: 1px solid var(--gold); border-right: 1px solid var(--gold); }

  .ab-story-frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.8) saturate(0.75);
    display: block;
    transition: transform 0.8s var(--ease), filter 0.4s;
  }
  .ab-story-frame:hover img {
    transform: scale(1.04);
    filter: brightness(0.9) saturate(0.9);
  }

  /* Badge over image */
  .ab-story-badge {
    position: absolute;
    bottom: -20px;
    right: -20px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 20px 22px;
    text-align: center;
    z-index: 4;
  }
  .ab-story-badge::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.25;
  }
  .ab-story-badge-num {
    font-family: var(--serif);
    font-size: 2.4rem;
    font-weight: 300;
    color: var(--text);
    line-height: 1;
    display: block;
    letter-spacing: -0.02em;
  }
  .ab-story-badge-label {
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-faint);
    margin-top: 4px;
    display: block;
    line-height: 1.5;
  }

  /* ─────────────────────────────────────
     VALUES
  ───────────────────────────────────── */
  .ab-values {
    background: var(--bg-card);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }
  .ab-values::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.15;
  }

  .ab-values-inner {
    max-width: 1160px;
    margin: 0 auto;
    padding: 100px 80px;
  }

  .ab-values-head {
    max-width: 480px;
    margin-bottom: 72px;
  }

  .ab-values-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    border: 1px solid var(--border);
  }

  .ab-val-card {
    background: var(--bg);
    border-right: 1px solid var(--border);
    padding: 40px 32px;
    position: relative;
    overflow: hidden;
    transition: background 0.3s var(--ease);
  }
  .ab-val-card:last-child { border-right: none; }
  .ab-val-card:hover { background: #171412; }

  .ab-val-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .ab-val-card:hover::before { opacity: 0.4; }

  .ab-val-num {
    font-family: var(--serif);
    font-size: 3rem;
    font-weight: 200;
    color: transparent;
    -webkit-text-stroke: 1px var(--text-faint);
    line-height: 1;
    margin-bottom: 20px;
    opacity: 0.5;
    transition: opacity 0.3s;
    user-select: none;
  }
  .ab-val-card:hover .ab-val-num { opacity: 0.8; }

  .ab-val-icon {
    width: 36px; height: 36px;
    border: 1px solid var(--border);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    color: var(--gold);
    transition: border-color 0.25s;
  }
  .ab-val-card:hover .ab-val-icon { border-color: rgba(196,156,104,0.35); }

  .ab-val-title {
    font-family: var(--serif);
    font-size: 1.2rem;
    font-weight: 400;
    color: var(--text);
    margin-bottom: 12px;
    line-height: 1.2;
    transition: color 0.25s;
  }
  .ab-val-card:hover .ab-val-title { color: var(--gold-light); }

  .ab-val-body {
    font-size: 0.8rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.75;
    letter-spacing: 0.02em;
  }

  /* ─────────────────────────────────────
     TEAM
  ───────────────────────────────────── */
  .ab-team {
    padding: 120px 80px;
    max-width: 1160px;
    margin: 0 auto;
  }

  .ab-team-head {
    max-width: 480px;
    margin-bottom: 64px;
  }

  .ab-team-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    border: 1px solid var(--border);
  }

  .ab-team-card {
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    overflow: hidden;
    position: relative;
    transition: background 0.3s var(--ease);
  }
  .ab-team-card:last-child { border-right: none; }
  .ab-team-card:hover { background: #171412; }

  .ab-team-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 2;
  }
  .ab-team-card:hover::before { opacity: 0.35; }

  .ab-team-img-wrap {
    position: relative;
    aspect-ratio: 3/4;
    overflow: hidden;
  }

  .ab-team-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    filter: grayscale(20%) brightness(0.82);
    display: block;
    transition: transform 0.7s var(--ease), filter 0.4s;
  }
  .ab-team-card:hover .ab-team-img {
    transform: scale(1.05);
    filter: grayscale(0%) brightness(0.92);
  }

  /* Social overlay */
  .ab-team-social {
    position: absolute;
    inset: 0;
    background: rgba(14,12,10,0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    opacity: 0;
    transition: opacity 0.3s var(--ease);
  }
  .ab-team-card:hover .ab-team-social { opacity: 1; }

  .ab-social-link {
    width: 36px; height: 36px;
    border: 1px solid rgba(196,156,104,0.4);
    border-radius: 2px;
    background: rgba(14,12,10,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
    text-decoration: none;
    transition: background 0.2s, border-color 0.2s;
  }
  .ab-social-link:hover {
    background: rgba(196,156,104,0.12);
    border-color: var(--gold);
  }

  .ab-team-info {
    padding: 22px 20px 24px;
  }

  .ab-team-name {
    font-family: var(--serif);
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--text);
    margin-bottom: 5px;
    line-height: 1.2;
    transition: color 0.25s;
  }
  .ab-team-card:hover .ab-team-name { color: var(--gold-light); }

  .ab-team-role {
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
    opacity: 0.8;
  }

  .ab-team-bio {
    font-size: 0.77rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.65;
    letter-spacing: 0.02em;
  }

  /* ─────────────────────────────────────
     SUSTAINABILITY
  ───────────────────────────────────── */
  .ab-sustain {
    position: relative;
    overflow: hidden;
    background: var(--bg-card);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .ab-sustain-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1800&q=80');
    background-size: cover;
    background-position: center;
    filter: brightness(0.12) saturate(0.5);
    z-index: 0;
  }

  .ab-sustain-inner {
    position: relative;
    z-index: 1;
    max-width: 1160px;
    margin: 0 auto;
    padding: 100px 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .ab-sustain-stats {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2px;
    border: 1px solid var(--border);
  }

  .ab-sustain-stat {
    background: rgba(14,12,10,0.7);
    padding: 28px 32px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 24px;
    transition: background 0.3s;
    position: relative;
  }
  .ab-sustain-stat:last-child { border-bottom: none; }
  .ab-sustain-stat:hover { background: rgba(26,23,20,0.85); }

  .ab-sustain-stat::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .ab-sustain-stat:hover::before { opacity: 0.5; }

  .ab-ss-num {
    font-family: var(--serif);
    font-size: 2.6rem;
    font-weight: 200;
    color: var(--text);
    line-height: 1;
    letter-spacing: -0.02em;
    flex-shrink: 0;
    min-width: 80px;
  }

  .ab-ss-label {
    font-size: 0.78rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.6;
    letter-spacing: 0.03em;
  }

  /* ─────────────────────────────────────
     CTA
  ───────────────────────────────────── */
  .ab-cta {
    padding: 120px 80px;
    max-width: 1160px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .ab-cta .ab-h2 { max-width: 560px; }

  .ab-cta .ab-body {
    max-width: 440px;
    text-align: center;
    margin: 0 auto 48px;
  }

  .ab-cta-btns {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  /* ─────────────────────────────────────
     ANIMATIONS
  ───────────────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scrollPulse {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 0.75; }
  }

  /* ─────────────────────────────────────
     RESPONSIVE
  ───────────────────────────────────── */
  @media (max-width: 1040px) {
    .ab-story, .ab-team, .ab-cta, .ab-values-inner { padding-left: 40px; padding-right: 40px; }
    .ab-hero-inner  { padding: 0 40px; }
    .ab-sustain-inner { padding: 80px 40px; }
  }

  @media (max-width: 900px) {
    .ab-story        { grid-template-columns: 1fr; gap: 48px; }
    .ab-values-grid  { grid-template-columns: 1fr 1fr; }
    .ab-team-grid    { grid-template-columns: 1fr 1fr; }
    .ab-sustain-inner { grid-template-columns: 1fr; gap: 48px; }
    .ab-hero-inner   { grid-template-columns: 1fr; }
    .ab-hero-scroll  { left: 40px; }
    .ab-story-badge  { right: 0; bottom: -16px; }
  }

  @media (max-width: 600px) {
    .ab-story, .ab-team, .ab-cta, .ab-values-inner { padding-left: 20px; padding-right: 20px; }
    .ab-hero-inner  { padding: 0 20px; }
    .ab-sustain-inner { padding: 64px 20px; }
    .ab-values-grid { grid-template-columns: 1fr; }
    .ab-team-grid   { grid-template-columns: 1fr; }
    .ab-cta-btns    { flex-direction: column; width: 100%; }
    .ab-hero-scroll { display: none; }
    .ab-hero-left   { padding: 100px 0 60px; }
    .ab-hero-h1     { font-size: 3rem; }
    .ab-hero-cta    { flex-direction: column; align-items: flex-start; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }
`;

const teamMembers = [
  {
    name: "Ajagbe Janet",
    role: "Master Artisan & Founder",
    image: artisian,
    bio: "Elite shoemaker with 5+ years of handcrafting excellence."
  },
   {
    image: certificate,
    bio: "CAC BUSINESS REGISTRATION"
  }
];

const values = [
  {
    num: "01",
    title: "Handcrafted Excellence",
    body: "Every shoe is meticulously crafted by skilled artisans who pour their expertise and passion into each stitch.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    )
  },
  {
    num: "02",
    title: "Sustainable Materials",
    body: "We source premium, ethically-tanned leathers and eco-friendly materials that respect both people and planet.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12m0 0C12 7 16 3 21 3c0 9-4 12-9 12z"/><path d="M12 12C12 7 8 3 3 3c0 9 4 12 9 12z"/>
      </svg>
    )
  },
  {
    num: "03",
    title: "Timeless Design",
    body: "Classic styles that transcend trends, ensuring your investment remains stylish for years to come.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    )
  },
  {
    num: "04",
    title: "Personalized Fit",
    body: "Each pair is designed with comfort in mind, celebrating the unique shape and story of your feet.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    )
  }
];

export default function About() {
  const heroBgRef = useRef(null);

  useEffect(() => {
    // Scroll reveal
    const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add("active"), Number(delay));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));

    // Parallax for hero bg
    const handleScroll = () => {
      if (heroBgRef.current) {
        const y = window.scrollY * 0.4;
        heroBgRef.current.style.transform = `scale(1.06) translateY(${y}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="ab">
      <style>{CSS}</style>
      <div className="ab-grain" />

      {/* ── HERO ── */}
      <section className="ab-hero">
        <div className="ab-hero-bg" ref={heroBgRef} />
        <div className="ab-hero-vignette" />

        <div className="ab-hero-inner">
          <div className="ab-hero-left">
            <div className="ab-hero-est">Est. 2024</div>

            <h1 className="ab-hero-h1">
              Handcrafted<br />
              <em>with Heart &amp; Sole</em>
            </h1>

            <p className="ab-hero-sub">
              We believe every step deserves to be taken in shoes made with
              passion, precision, and purpose. Each pair tells a story of
              artistry, heritage, and your unique journey.
            </p>

            <div className="ab-hero-cta">
              <button className="ab-btn-gold" onClick={() => window.location.href = "/collection"}>
                <span>Discover Collection</span>
              </button>
              <button className="ab-btn-ghost" onClick={() => document.getElementById("story").scrollIntoView({ behavior: "smooth" })}>
                Our Story
              </button>
            </div>
          </div>
        </div>

        <div className="ab-hero-scroll">
          <div className="ab-hero-scroll-line" />
          <span className="ab-hero-scroll-label">Scroll</span>
        </div>
      </section>

      {/* ── STORY ── */}
      <section id="story" style={{ background: "var(--bg)" }}>
        <div className="ab-story">
          <div className="ab-story-text reveal-left">
            <div className="ab-label">Our Heritage</div>
            <h2 className="ab-h2">Where Craftsmanship<br /><em>Meets Passion</em></h2>
            <hr className="ab-rule" />
            <div className="ab-story-paras">
              <p>
                Born from a deep appreciation for traditional craftsmanship and a desire to
                create footwear that truly connects with the wearer, our journey began in a
                small workshop where every stitch was placed with intention and care.
              </p>
              <p>
                Today, we carry forward the timeless art of shoemaking, combining generations
                of knowledge with sustainable practices. Each shoe is meticulously crafted
                using premium, ethically-sourced leathers and materials that honor the earth.
              </p>
            </div>
            <div className="ab-pullquote">
              <p>
                "A shoe is not just a shoe &mdash; it&apos;s a foundation for your day, a
                reflection of your spirit, and a companion on every step of your journey."
              </p>
            </div>
          </div>

          <div className="ab-story-img-wrap reveal-right">
            <div className="ab-story-frame">
              <div className="ab-corner ab-corner-tl" />
              <div className="ab-corner ab-corner-tr" />
              <div className="ab-corner ab-corner-bl" />
              <div className="ab-corner ab-corner-br" />
              <img
                src={hero}
                alt="Artisan crafting handmade leather shoes"
              />
            </div>
            <div className="ab-story-badge">
              <span className="ab-story-badge-num">5+</span>
              <span className="ab-story-badge-label">Years of<br />Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="ab-values">
        <div className="ab-values-inner">
          <div className="ab-values-head reveal">
            <div className="ab-label">Our Promise</div>
            <h2 className="ab-h2">Craftsmanship<br /><em>Excellence</em></h2>
            <hr className="ab-rule" />
            <p className="ab-body">Every pair tells a story of dedication, quality, and timeless design.</p>
          </div>

          <div className="ab-values-grid">
            {values.map((v, i) => (
              <div
                key={i}
                className="ab-val-card reveal"
                data-delay={i * 80}
              >
                <div className="ab-val-num">{v.num}</div>
                <div className="ab-val-icon">{v.icon}</div>
                <h3 className="ab-val-title">{v.title}</h3>
                <p className="ab-val-body">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ background: "var(--bg)" }}>
        <div className="ab-team">
          <div className="ab-team-head reveal">
            <div className="ab-label">Meet the Marker</div>
            <h2 className="ab-h2">The Artisan Behind<br /><em>Every Step</em></h2>
            <hr className="ab-rule" />
            <p className="ab-body">Skilled hands and creative mind dedicated to your comfort.</p>
          </div>

          <div className="ab-team-grid">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="ab-team-card reveal"
                data-delay={i * 80}
              >
                <div className="ab-team-img-wrap">
                  <img src={member.image} alt={member.name} className="ab-team-img" />
                  
                </div>
                <div className="ab-team-info">
                  <h3 className="ab-team-name">{member.name}</h3>
                  <p className="ab-team-role">{member.role}</p>
                  <p className="ab-team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUSTAINABILITY ── */}
      <section className="ab-sustain">
        <div className="ab-sustain-bg" />
        <div className="ab-sustain-inner">
          <div className="reveal">
            <div className="ab-label">Sustainability</div>
            <h2 className="ab-h2">Walking Lightly<br /><em>on the Earth</em></h2>
            <hr className="ab-rule" />
            <p className="ab-body">
              Our commitment to sustainability goes beyond materials. We believe in creating
              footwear that honors both traditional craftsmanship and environmental responsibility.
            </p>
          </div>

          <div className="ab-sustain-stats reveal" data-delay="150">
            {[
              { num: "100%", label: "Ethically Sourced Leather" },
              { num: "50%",  label: "Reduced Water Usage" },
              { num: "Zero", label: "Plastic Packaging" },
            ].map((s, i) => (
              <div key={i} className="ab-sustain-stat">
                <span className="ab-ss-num">{s.num}</span>
                <span className="ab-ss-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
        <div className="ab-cta reveal">
          <div className="ab-label" style={{ marginBottom: "28px" }}>Step Into Something Special</div>
          <h2 className="ab-h2" style={{ textAlign: "center", marginBottom: "16px" }}>
            Let&apos;s Walk This<br /><em>Journey Together</em>
          </h2>
          <hr className="ab-rule" style={{ margin: "0 auto 20px" }} />
          <p className="ab-body" style={{ textAlign: "center", marginBottom: "48px" }}>
            Discover shoes crafted with purpose, designed for you.
            Our artisans are ready to craft your perfect pair.
          </p>
          <div className="ab-cta-btns">
            <button className="ab-btn-gold" onClick={() => window.location.href = "/collection"}>
              <span>Explore Collection</span>
            </button>
            <button className="ab-btn-ghost" onClick={() => window.location.href = "/contact"}>
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}