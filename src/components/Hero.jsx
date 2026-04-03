import { Link } from "react-router-dom";
import hero from "../assets/high-angle-summer-shoes.jpg"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,200;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --bg:           #0e0c0a;
    --bg-card:      #141210;
    --border:       rgba(255,255,255,0.07);
    --gold:         #c49c68;
    --gold-light:   #dbb98a;
    --text:         #f0ebe3;
    --text-muted:   #8a8178;
    --text-faint:   #4a4540;
    --serif:        'Cormorant Garamond', Georgia, serif;
    --sans:         'Jost', sans-serif;
    --ease:         cubic-bezier(0.4, 0, 0.2, 1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Hero shell ── */
  .hr {
    position: relative;
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    align-items: center;
    overflow: hidden;
    font-family: var(--sans);
  }

  /* Grain */
  .hr::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
    opacity: 0.6;
  }

  /* ── Background geometric lines ── */
  .hr-grid {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
  }

  /* Diagonal rule — top left to bottom right */
  .hr-grid::before {
    content: '';
    position: absolute;
    top: -20%;
    left: 55%;
    width: 1px;
    height: 160%;
    background: linear-gradient(to bottom, transparent, rgba(196,156,104,0.1), transparent);
    transform: rotate(15deg);
    transform-origin: top center;
  }

  /* Second vertical rule */
  .hr-grid::after {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    left: 58%;
    width: 1px;
    background: var(--border);
  }

  /* Ambient radial glow — left */
  .hr-glow-l {
    position: absolute;
    top: 10%; left: -10%;
    width: 700px; height: 700px;
    background: radial-gradient(ellipse, rgba(196,156,104,0.055) 0%, transparent 65%);
    filter: blur(60px);
    pointer-events: none;
    z-index: 0;
    animation: glowPulse 8s ease-in-out infinite alternate;
  }

  /* Ambient radial glow — right */
  .hr-glow-r {
    position: absolute;
    bottom: -10%; right: -5%;
    width: 500px; height: 500px;
    background: radial-gradient(ellipse, rgba(196,156,104,0.04) 0%, transparent 65%);
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }

  /* ── Content wrapper ── */
  .hr-inner {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    min-height: 100vh;
    gap: 0;
  }

  /* ── Left — text ── */
  .hr-left {
    display: flex;
    flex-direction: column;
    padding: 80px 0;
  }

  /* Eyebrow label */
  .hr-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 32px;
    opacity: 0;
    animation: fadeUp 0.7s 0.2s var(--ease) forwards;
  }

  .hr-eyebrow::before {
    content: '';
    display: inline-block;
    width: 32px; height: 1px;
    background: var(--gold);
    opacity: 0.6;
  }

  /* Main heading */
  .hr-h1 {
    font-family: var(--serif);
    font-size: clamp(3.2rem, 5.5vw, 5.8rem);
    font-weight: 200;
    line-height: 1.0;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 28px;
    opacity: 0;
    animation: fadeUp 0.8s 0.35s var(--ease) forwards;
  }

  .hr-h1 em {
    font-style: italic;
    font-weight: 200;
    color: var(--gold-light);
    display: block;
  }

  /* Divider rule */
  .hr-rule {
    width: 48px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    border: none;
    margin-bottom: 24px;
    opacity: 0;
    animation: fadeUp 0.6s 0.5s var(--ease) forwards;
  }

  /* Tagline */
  .hr-tagline {
    font-family: var(--serif);
    font-size: clamp(1rem, 1.4vw, 1.25rem);
    font-weight: 300;
    font-style: italic;
    color: var(--text-muted);
    line-height: 1.6;
    letter-spacing: 0.02em;
    max-width: 360px;
    margin-bottom: 52px;
    opacity: 0;
    animation: fadeUp 0.7s 0.55s var(--ease) forwards;
  }

  /* CTA row */
  .hr-cta {
    display: flex;
    align-items: center;
    gap: 28px;
    opacity: 0;
    animation: fadeUp 0.7s 0.7s var(--ease) forwards;
  }

  /* Primary button */
  .hr-btn {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 44px;
    background: var(--gold);
    border: none;
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--bg);
    cursor: pointer;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.3s var(--ease), color 0.3s;
  }

  .hr-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold-light);
    transform: translateX(-101%);
    transition: transform 0.4s var(--ease);
    z-index: 0;
  }

  .hr-btn:hover::before { transform: translateX(0); }

  .hr-btn:hover {
    box-shadow: 0 12px 40px rgba(196,156,104,0.28);
  }

  .hr-btn span { position: relative; z-index: 1; }

  .hr-btn-arrow {
    position: relative;
    z-index: 1;
    width: 14px; height: 14px;
    transition: transform 0.25s var(--ease);
    flex-shrink: 0;
  }

  .hr-btn:hover .hr-btn-arrow { transform: translateX(4px); }

  /* Secondary link */
  .hr-link {
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-faint);
    text-decoration: none;
    transition: color 0.25s var(--ease);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 2px;
    border-bottom: 1px solid var(--text-faint);
  }

  .hr-link:hover {
    color: var(--text-muted);
    border-color: var(--text-muted);
  }

  /* Stats row */
  .hr-stats {
    display: flex;
    align-items: flex-start;
    gap: 0;
    margin-top: 72px;
    border-top: 1px solid var(--border);
    padding-top: 36px;
    opacity: 0;
    animation: fadeUp 0.7s 0.85s var(--ease) forwards;
  }

  .hr-stat {
    flex: 1;
    padding-right: 24px;
    position: relative;
  }

  .hr-stat + .hr-stat {
    padding-left: 24px;
    padding-right: 24px;
    border-left: 1px solid var(--border);
  }

  .hr-stat-num {
    font-family: var(--serif);
    font-size: 2rem;
    font-weight: 300;
    color: var(--text);
    line-height: 1;
    margin-bottom: 6px;
    letter-spacing: -0.02em;
  }

  .hr-stat-label {
    font-size: 0.6rem;
    font-weight: 300;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  /* ── Right — visual panel ── */
  .hr-right {
    position: relative;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    animation: fadeIn 1s 0.4s var(--ease) forwards;
  }

  /* Large serif number watermark */
  .hr-watermark {
    position: absolute;
    bottom: 8%;
    right: -2%;
    font-family: var(--serif);
    font-size: 22vw;
    font-weight: 200;
    color: transparent;
    -webkit-text-stroke: 1px rgba(196,156,104,0.06);
    line-height: 1;
    pointer-events: none;
    user-select: none;
    letter-spacing: -0.04em;
  }

  /* Bordered image frame */
  .hr-frame {
    width: 78%;
    aspect-ratio: 3/4;
    border: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }

  .hr-frame::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.25;
    z-index: 2;
  }

  /* Corner accents */
  .hr-corner {
    position: absolute;
    width: 20px; height: 20px;
    z-index: 3;
  }
  .hr-corner-tl { top: -1px; left: -1px; border-top: 1px solid var(--gold); border-left: 1px solid var(--gold); }
  .hr-corner-tr { top: -1px; right: -1px; border-top: 1px solid var(--gold); border-right: 1px solid var(--gold); }
  .hr-corner-bl { bottom: -1px; left: -1px; border-bottom: 1px solid var(--gold); border-left: 1px solid var(--gold); }
  .hr-corner-br { bottom: -1px; right: -1px; border-bottom: 1px solid var(--gold); border-right: 1px solid var(--gold); }

  .hr-frame-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(0.82) saturate(0.9);
    transition: transform 0.9s var(--ease), filter 0.4s;
    transform: scale(1.04);
    animation: imgReveal 1.2s 0.5s var(--ease) forwards;
  }

  @keyframes imgReveal {
    to { transform: scale(1); }
  }

  .hr-frame:hover .hr-frame-img {
    filter: brightness(0.9) saturate(1);
  }

  /* Floating tag */
  .hr-tag {
    position: absolute;
    bottom: 36px;
    left: -28px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    animation: slideTag 0.7s 1s var(--ease) both;
  }

  .hr-tag::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    opacity: 0.35;
  }

  .hr-tag-label {
    font-size: 0.56rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
  }

  .hr-tag-value {
    font-family: var(--serif);
    font-size: 1.1rem;
    font-weight: 300;
    color: var(--text);
    letter-spacing: 0.02em;
  }

  /* Scroll indicator */
  .hr-scroll {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    opacity: 0;
    animation: fadeIn 0.6s 1.2s var(--ease) forwards;
  }

  .hr-scroll-line {
    width: 1px;
    height: 48px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    opacity: 0.4;
    animation: scrollPulse 2s ease-in-out infinite;
  }

  .hr-scroll-label {
    font-size: 0.55rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes slideTag {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes glowPulse {
    from { opacity: 0.7; transform: scale(1); }
    to   { opacity: 1; transform: scale(1.08); }
  }

  @keyframes scrollPulse {
    0%, 100% { transform: scaleY(1); opacity: 0.4; }
    50%       { transform: scaleY(1.15); opacity: 0.7; }
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .hr-inner {
      grid-template-columns: 1fr;
      padding: 0 32px;
      min-height: auto;
    }
    .hr-left  { padding: 120px 0 48px; }
    .hr-right { height: 60vw; min-height: 400px; }
    .hr-frame { width: 88%; }
    .hr-tag   { left: -8px; }
    .hr-grid::after { display: none; }
    .hr-watermark   { font-size: 40vw; }
    .hr-scroll { display: none; }
  }

  @media (max-width: 580px) {
    .hr-inner   { padding: 0 20px; }
    .hr-left    { padding: 100px 0 40px; }
    .hr-h1      { font-size: clamp(2.8rem, 10vw, 3.8rem); }
    .hr-cta     { flex-direction: column; align-items: flex-start; gap: 18px; }
    .hr-stats   { gap: 0; }
    .hr-right   { height: 70vw; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
`;



const uploadProducts = async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/products/seed`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(products),
      }
    );

    const data = await res.json();
    console.log("Uploaded:", data);
  } catch (err) {
    console.error(err);
  }
};

// call it once


export default function Hero() {
  return (
    <div className="hr">
      <style>{CSS}</style>

      {/* Background layers */}
      <div className="hr-grid" />
      <div className="hr-glow-l" />
      <div className="hr-glow-r" />

      <div className="hr-inner">

        {/* ── Left — text ── */}
        <div className="hr-left">

          <div className="hr-eyebrow">Artisan Footwear</div>

          <h1 className="hr-h1">
            Luxury You<br />
            <em>Can Walk On</em>
          </h1>

          <hr className="hr-rule" />

          <p className="hr-tagline">
            The love put into every sole &mdash; crafted by hand,
            worn for a lifetime.
          </p>

          <div className="hr-cta">
            <Link to="/collection" className="hr-btn">
              <span>Shop Now</span>
              <svg className="hr-btn-arrow" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>

            <Link to="/about" className="hr-link">
              Our Story
            </Link>
          </div>

          {/* Stats */}
          <div className="hr-stats">
            <div className="hr-stat">
              <div className="hr-stat-num">100+</div>
              <div className="hr-stat-label">Happy Clients</div>
            </div>
            <div className="hr-stat">
              <div className="hr-stat-num">100%</div>
              <div className="hr-stat-label">Handcrafted</div>
            </div>
            <div className="hr-stat">
              <div className="hr-stat-num">24/7</div>
              <div className="hr-stat-label">Support</div>
            </div>
          </div>
        </div>

        {/* ── Right — image ── */}
        <div className="hr-right">
          <div className="hr-watermark">J</div>

          <div className="hr-frame">
            {/* Corner accents */}
            <div className="hr-corner hr-corner-tl" />
            <div className="hr-corner hr-corner-tr" />
            <div className="hr-corner hr-corner-bl" />
            <div className="hr-corner hr-corner-br" />

            {/* Placeholder — swap src for your hero image */}
            <img
              src={hero}
              alt="Jofta artisan footwear"
              className="hr-frame-img"
            />
          </div>

          {/* Floating product tag */}
          <div className="hr-tag">
            <span className="hr-tag-label">New Season</span>
            <span className="hr-tag-value">Bespoke Collection</span>
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="hr-scroll">
        <div className="hr-scroll-line" />
        <span className="hr-scroll-label">Scroll</span>
      </div>
    </div>
  );
}