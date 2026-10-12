import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

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

  /* ── Page ── */
  .sp-page {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--sans);
    font-weight: 300;
    color: var(--text);
    padding: 64px 24px 120px;
    position: relative;
  }

  .sp-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* Ambient glow behind checkmark */
  .sp-glow {
    position: fixed;
    top: -80px; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 400px;
    background: radial-gradient(ellipse, rgba(122,171,138,0.07) 0%, transparent 70%);
    pointer-events: none;
    filter: blur(60px);
    z-index: 0;
  }

  /* ── Card ── */
  .sp-card {
    position: relative;
    z-index: 1;
    max-width: 680px;
    margin: 0 auto;
    background: var(--bg-card);
    border: 1px solid var(--border);
    animation: fadeUp 0.7s var(--ease) both;
  }

  .sp-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--success), transparent);
    opacity: 0.35;
  }

  /* ── Header ── */
  .sp-header {
    padding: 56px 48px 40px;
    text-align: center;
    border-bottom: 1px solid var(--border);
    position: relative;
  }

  /* Checkmark ring */
  .sp-check-wrap {
    width: 72px; height: 72px;
    margin: 0 auto 28px;
    position: relative;
  }

  .sp-check-svg {
    width: 72px; height: 72px;
    color: var(--success);
  }

  .sp-check-circle {
    stroke: var(--success);
    opacity: 0.2;
  }

  .sp-check-path {
    stroke: var(--success);
    stroke-dasharray: 50;
    stroke-dashoffset: 50;
    animation: drawCheck 0.55s cubic-bezier(0.4,0,0.2,1) 0.55s forwards;
  }

  .sp-check-ring {
    stroke: var(--success);
    stroke-dasharray: 160;
    stroke-dashoffset: 160;
    animation: drawRing 0.6s var(--ease) 0.1s forwards;
  }

  /* Label above title */
  .sp-confirm-label {
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--success);
    margin-bottom: 14px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .sp-confirm-label::before,
  .sp-confirm-label::after {
    content: '';
    display: inline-block;
    width: 20px; height: 1px;
    background: var(--success);
    opacity: 0.4;
  }

  .sp-title {
    font-family: var(--serif);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 300;
    color: var(--text);
    line-height: 1.1;
    margin-bottom: 14px;
    letter-spacing: -0.01em;
  }

  .sp-title em { font-style: italic; color: var(--gold-light); }

  .sp-subtitle {
    font-size: 0.85rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.75;
    max-width: 440px;
    margin: 0 auto 12px;
    letter-spacing: 0.02em;
  }

  .sp-contact {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.72rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    color: var(--gold);
    margin-top: 4px;
  }

  /* ── Tracking ── */
  .sp-tracking {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 36px 48px;
    border-bottom: 1px solid var(--border);
    gap: 0;
  }

  .sp-track-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    flex: 1;
    position: relative;
  }

  .sp-track-dot {
    width: 12px; height: 12px;
    border-radius: 50%;
    position: relative;
    z-index: 2;
    flex-shrink: 0;
  }

  .sp-track-dot.done {
    background: var(--success);
    box-shadow: 0 0 0 4px rgba(122,171,138,0.12);
  }

  .sp-track-dot.pending {
    background: transparent;
    border: 1px solid var(--text-faint);
  }

  .sp-track-label {
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-faint);
    text-align: center;
    line-height: 1.4;
  }

  .sp-track-label.done { color: var(--success); }

  .sp-track-line {
    position: absolute;
    top: 5px;
    left: calc(50% + 8px);
    right: calc(-50% + 8px);
    height: 1px;
    background: var(--border);
    z-index: 1;
  }

  /* ── Sections ── */
  .sp-section {
    padding: 32px 48px;
    border-bottom: 1px solid var(--border);
  }

  .sp-section-head {
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sp-section-head::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--gold);
    opacity: 0.12;
  }

  /* ── Order items ── */
  .sp-items {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
  }

  .sp-order-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    gap: 16px;
    transition: background 0.2s;
  }

  .sp-order-item:last-child { border-bottom: none; }
  .sp-order-item:hover { background: rgba(255,255,255,0.02); }

  .sp-item-name {
    font-family: var(--serif);
    font-size: 1rem;
    font-weight: 400;
    color: var(--text);
    flex: 1;
  }

  .sp-item-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .sp-item-qty {
    font-size: 0.72rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.08em;
  }

  .sp-item-price {
    font-family: var(--serif);
    font-size: 1rem;
    font-weight: 400;
    color: var(--text);
    min-width: 80px;
    text-align: right;
  }

  /* Total row */
  .sp-total-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    background: rgba(196,156,104,0.04);
    border: 1px solid var(--border);
    border-top: none;
  }

  .sp-total-label {
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .sp-total-val {
    font-family: var(--serif);
    font-size: 1.6rem;
    font-weight: 300;
    color: var(--text);
    letter-spacing: -0.01em;
  }

  /* ── Address ── */
  .sp-address {
    background: var(--bg-input);
    border: 1px solid var(--border);
    padding: 20px 22px;
    position: relative;
  }

  .sp-address::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    opacity: 0.4;
    border-radius: 1px;
  }

  .sp-address-text {
    font-size: 0.85rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.75;
    letter-spacing: 0.02em;
  }

  /* Notes */
  .sp-notes {
    margin-top: 14px;
    background: var(--bg-input);
    border: 1px solid var(--border);
    padding: 16px 20px;
  }

  .sp-notes-label {
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-faint);
    margin-bottom: 8px;
  }

  .sp-notes-text {
    font-size: 0.82rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.65;
  }

  /* ── Footer ── */
  .sp-footer {
    padding: 36px 48px 44px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .sp-cta-btn {
    padding: 14px 52px;
    background: transparent;
    border: 1px solid var(--gold);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: color 0.3s var(--ease), box-shadow 0.3s;
  }

  .sp-cta-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold);
    transform: translateX(-101%);
    transition: transform 0.35s var(--ease);
    z-index: 0;
  }

  .sp-cta-btn:hover::before { transform: translateX(0); }
  .sp-cta-btn:hover { color: var(--bg); box-shadow: 0 8px 28px rgba(196,156,104,0.22); }
  .sp-cta-btn span { position: relative; z-index: 1; }

  .sp-footer-note {
    font-size: 0.62rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.1em;
  }

  /* ── Error state ── */
  .sp-error {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0;
    animation: fadeUp 0.6s var(--ease) both;
  }

  .sp-error-icon {
    width: 48px; height: 48px;
    color: var(--text-faint);
    margin-bottom: 22px;
  }

  .sp-error h2 {
    font-family: var(--serif);
    font-size: 2rem;
    font-weight: 300;
    color: var(--text);
    margin-bottom: 10px;
  }

  .sp-error p {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 32px;
    line-height: 1.7;
  }

  .sp-error-btn {
    padding: 13px 40px;
    background: transparent;
    border: 1px solid var(--gold);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .sp-error-btn:hover { background: var(--gold); color: var(--bg); }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes drawCheck {
    to { stroke-dashoffset: 0; }
  }

  @keyframes drawRing {
    to { stroke-dashoffset: 0; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }

  @media (max-width: 640px) {
    .sp-page    { padding: 40px 16px 96px; }
    .sp-header  { padding: 40px 24px 32px; }
    .sp-section { padding: 28px 24px; }
    .sp-tracking { padding: 28px 24px; }
    .sp-footer  { padding: 28px 24px 40px; }
  }
`;

const trackSteps = ["Received", "Processing", "Shipped", "Delivered"];

export default function SuccessPage() {
  const location = useLocation();
  const navigate  = useNavigate();

  const { shipping, cart, total } = location.state || {};

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!shipping || !cart || !total || !shipping?.email) return;

    (async () => {
      try {
        const res = await axios.post("https://jofta-backend.onrender.com/api/send-order-email", {
          shipping, cart, total, email: shipping.email,
        });
       
      } catch (err) {
        console.error("Email failed:", err.response?.data || err.message);
      }
    })();
  }, [shipping, cart, total]);

  if (!shipping || !cart || !total) {
    return (
      <div className="sp-page">
        <style>{CSS}</style>
        <div className="sp-error">
          <svg className="sp-error-icon" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h2>Order Not Found</h2>
          <p>It seems you have reached this page without completing an order.</p>
          <button className="sp-error-btn" onClick={() => navigate("/")}>Return to Shop</button>
        </div>
      </div>
    );
  }

  return (
    <div className="sp-page">
      <style>{CSS}</style>
      <div className="sp-glow" />

      <div className="sp-card">

        {/* ── Header ── */}
        <div className="sp-header">

          {/* Animated checkmark */}
          <div className="sp-check-wrap">
            <svg className="sp-check-svg" viewBox="0 0 72 72" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              {/* Background fill circle */}
              <circle cx="36" cy="36" r="35" className="sp-check-circle" strokeWidth="0" fill="currentColor" opacity="0.06"/>
              {/* Animated ring */}
              <circle cx="36" cy="36" r="33" className="sp-check-ring"
                strokeWidth="1.5" strokeLinecap="round" fill="none"
                style={{ transformOrigin:"center", transform:"rotate(-90deg)" }}/>
              {/* Check path */}
              <path className="sp-check-path" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                d="M20 37 L31 48 L52 26"/>
            </svg>
          </div>

          <div className="sp-confirm-label">Order Confirmed</div>

          <h1 className="sp-title">
            Thank you, <em>{shipping.name.split(" ")[0]}</em>
          </h1>

          <p className="sp-subtitle">
            Your order has been received and is now being processed.
            You will be contacted with shipping details shortly.
            Check your Email/Spam Folder
          </p>

          <div className="sp-contact">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
            Call / WhatsApp: 09033080879
          </div>
        </div>

        {/* ── Order tracking ── */}
        <div className="sp-tracking">
          {trackSteps.map((step, i) => (
            <div key={i} className="sp-track-step">
              <div className={`sp-track-dot ${i === 0 ? "done" : "pending"}`} />
              {i < trackSteps.length - 1 && <div className="sp-track-line" />}
              <span className={`sp-track-label ${i === 0 ? "done" : ""}`}>{step}</span>
            </div>
          ))}
        </div>

        {/* ── Order summary ── */}
        <div className="sp-section">
          <div className="sp-section-head">Order Summary</div>

          <div className="sp-items">
            {cart.map((item, i) => (
              <div key={i} className="sp-order-item">
                <span className="sp-item-name">{item.name}</span>
                <div className="sp-item-right">
                  <span className="sp-item-qty">&times;&nbsp;{item.quantity}</span>
                  <span className="sp-item-price">&#8358;{item.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sp-total-row">
            <span className="sp-total-label">Total Amount</span>
            <span className="sp-total-val">&#8358;{total.toLocaleString()}</span>
          </div>
        </div>

        {/* ── Delivery info ── */}
        <div className="sp-section">
          <div className="sp-section-head">Delivery Information</div>

          <div className="sp-address">
            <p className="sp-address-text">
              {shipping.address}<br />
              {shipping.city}, {shipping.state} {shipping.zip}
            </p>
          </div>

          {shipping.deliveryNotes && (
            <div className="sp-notes">
              <p className="sp-notes-label">Delivery Notes</p>
              <p className="sp-notes-text">{shipping.deliveryNotes}</p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="sp-footer">
          <button className="sp-cta-btn" onClick={() => navigate("/")}>
            <span>Continue Shopping</span>
          </button>
          <p className="sp-footer-note">A confirmation has been sent to {shipping.email}</p>
        </div>

      </div>
    </div>
  );
}
