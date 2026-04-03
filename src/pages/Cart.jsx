import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

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
    --danger:       #a87878;
    --serif:        'Cormorant Garamond', Georgia, serif;
    --sans:         'Jost', sans-serif;
    --ease:         cubic-bezier(0.4, 0, 0.2, 1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page ── */
  .cp-page {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--sans);
    font-weight: 300;
    color: var(--text);
    position: relative;
  }

  .cp-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  .cp-inner {
    position: relative;
    z-index: 1;
    max-width: 980px;
    margin: 0 auto;
    padding: 80px 48px 120px;
  }

  /* Ambient glow */
  .cp-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(100px);
  }
  .cp-glow-1 {
    width: 500px; height: 400px;
    top: 0; right: -80px;
    background: radial-gradient(ellipse, rgba(196,156,104,0.05) 0%, transparent 70%);
  }

  /* ── Header ── */
  .cp-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 52px;
    padding-bottom: 28px;
    border-bottom: 1px solid var(--border);
    position: relative;
    animation: fadeUp 0.6s 0.1s var(--ease) both;
  }

  .cp-header::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0;
    width: 64px; height: 1px;
    background: var(--gold);
    opacity: 0.6;
  }

  .cp-title {
    font-family: var(--serif);
    font-size: clamp(2rem, 3.5vw, 2.8rem);
    font-weight: 300;
    color: var(--text);
    letter-spacing: -0.01em;
    line-height: 1;
  }

  .cp-count {
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  /* ── Layout ── */
  .cp-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 40px;
    align-items: start;
  }

  /* ── Item list ── */
  .cp-list {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
  }

  /* ── Cart item ── */
  .cp-item {
    display: grid;
    grid-template-columns: 88px 1fr auto auto;
    gap: 20px;
    align-items: center;
    padding: 24px 24px;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    position: relative;
    transition: background 0.25s var(--ease);
    animation: fadeUp 0.5s var(--ease) both;
  }

  .cp-item:last-child { border-bottom: none; }
  .cp-item:hover { background: #171412; }

  .cp-item::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .cp-item:hover::before { opacity: 0.35; }

  /* Image */
  .cp-img-wrap {
    width: 88px; height: 88px;
    border: 1px solid var(--border);
    overflow: hidden;
    flex-shrink: 0;
    position: relative;
  }

  .cp-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(0.9);
    transition: transform 0.5s var(--ease), filter 0.3s;
  }
  .cp-item:hover .cp-img {
    transform: scale(1.06);
    filter: brightness(1);
  }

  /* Info */
  .cp-item-info { min-width: 0; }

  .cp-item-name {
    font-family: var(--serif);
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--text);
    margin-bottom: 6px;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s;
  }
  .cp-item:hover .cp-item-name { color: var(--gold-light); }

  .cp-item-variant {
    font-size: 0.72rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.08em;
    margin-bottom: 10px;
  }

  .cp-item-variant span {
    color: var(--text-muted);
  }

  .cp-item-price {
    font-family: var(--serif);
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--text);
    letter-spacing: -0.01em;
  }

  /* Quantity control */
  .cp-qty {
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: 1px;
  }

  .cp-qty-btn {
    width: 36px; height: 36px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--sans);
    transition: color 0.2s, background 0.2s;
    user-select: none;
  }
  .cp-qty-btn:hover:not(:disabled) {
    color: var(--gold);
    background: rgba(196,156,104,0.05);
  }
  .cp-qty-btn:disabled { opacity: 0.2; cursor: not-allowed; }

  .cp-qty-val {
    min-width: 40px; height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--serif);
    font-size: 1rem;
    font-weight: 400;
    color: var(--text);
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
  }

  /* Remove */
  .cp-remove {
    width: 34px; height: 34px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 1px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-faint);
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    flex-shrink: 0;
  }
  .cp-remove:hover {
    border-color: rgba(168,120,120,0.4);
    color: var(--danger);
    background: rgba(168,120,120,0.05);
  }

  /* ── Summary card ── */
  .cp-summary {
    position: sticky;
    top: 100px;
    border: 1px solid var(--border);
    background: var(--bg-card);
    padding: 32px;
    animation: fadeUp 0.6s 0.2s var(--ease) both;
    position: relative;
  }

  .cp-summary::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.25;
  }

  .cp-summary-title {
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cp-summary-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--gold);
    opacity: 0.15;
  }

  .cp-summary-rows {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 24px;
  }

  .cp-summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: var(--text-muted);
    font-weight: 300;
  }

  .cp-summary-row.total {
    padding-top: 18px;
    border-top: 1px solid var(--border);
    font-size: 1rem;
    color: var(--text);
    margin-top: 8px;
  }

  .cp-summary-row.total .cp-total-val {
    font-family: var(--serif);
    font-size: 1.5rem;
    font-weight: 300;
    color: var(--text);
    letter-spacing: -0.01em;
  }

  /* Checkout button */
  .cp-checkout-btn {
    width: 100%;
    height: 52px;
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.25s var(--ease), box-shadow 0.25s;
    margin-top: 24px;
    position: relative;
    overflow: hidden;
  }

  .cp-checkout-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold-light);
    transform: translateX(-101%);
    transition: transform 0.35s var(--ease);
  }

  .cp-checkout-btn:hover::before { transform: translateX(0); }
  .cp-checkout-btn:hover { box-shadow: 0 8px 28px rgba(196,156,104,0.22); }
  .cp-checkout-btn span { position: relative; z-index: 1; }

  .cp-checkout-note {
    font-size: 0.65rem;
    font-weight: 300;
    color: var(--text-faint);
    text-align: center;
    margin-top: 14px;
    letter-spacing: 0.05em;
    line-height: 1.6;
  }

  /* ── Empty state ── */
  .cp-empty {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0;
    animation: fadeUp 0.6s var(--ease) both;
  }

  .cp-empty-icon {
    width: 56px; height: 56px;
    color: var(--text-faint);
    margin-bottom: 24px;
  }

  .cp-empty h2 {
    font-family: var(--serif);
    font-size: 2rem;
    font-weight: 300;
    color: var(--text);
    margin-bottom: 10px;
  }

  .cp-empty p {
    font-size: 0.85rem;
    font-weight: 300;
    color: var(--text-muted);
    margin-bottom: 36px;
    line-height: 1.7;
  }

  .cp-empty-btn {
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
  .cp-empty-btn:hover { background: var(--gold); color: var(--bg); }

  /* ── SweetAlert overrides ── */
  .swal2-popup.cp-swal {
    background: var(--bg-card) !important;
    border: 1px solid var(--border) !important;
    border-radius: 4px !important;
    font-family: var(--sans) !important;
    color: var(--text) !important;
    padding: 36px !important;
  }
  .swal2-popup.cp-swal .swal2-title {
    font-family: var(--serif) !important;
    font-size: 1.5rem !important;
    font-weight: 300 !important;
    color: var(--text) !important;
  }
  .swal2-popup.cp-swal .swal2-html-container {
    color: var(--text-muted) !important;
    font-size: 0.83rem !important;
    font-weight: 300 !important;
  }
  .swal2-popup.cp-swal .swal2-confirm {
    background: var(--danger) !important;
    color: #fff !important;
    border-radius: 2px !important;
    font-family: var(--sans) !important;
    font-size: 0.65rem !important;
    font-weight: 400 !important;
    letter-spacing: 0.16em !important;
    text-transform: uppercase !important;
    box-shadow: none !important;
    padding: 11px 24px !important;
  }
  .swal2-popup.cp-swal .swal2-cancel {
    background: transparent !important;
    color: var(--text-muted) !important;
    border: 1px solid var(--border) !important;
    border-radius: 2px !important;
    font-family: var(--sans) !important;
    font-size: 0.65rem !important;
    font-weight: 400 !important;
    letter-spacing: 0.16em !important;
    text-transform: uppercase !important;
    box-shadow: none !important;
    padding: 11px 24px !important;
  }
  .swal2-popup.cp-swal .swal2-icon.swal2-warning {
    border-color: var(--gold) !important;
    color: var(--gold) !important;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .cp-inner   { padding: 60px 24px 100px; }
    .cp-layout  { grid-template-columns: 1fr; }
    .cp-item    { grid-template-columns: 72px 1fr; grid-template-rows: auto auto; gap: 14px 16px; }
    .cp-qty     { grid-column: 2; }
    .cp-remove  { position: absolute; top: 20px; right: 20px; }
  }
  @media (max-width: 520px) {
    .cp-inner   { padding: 48px 16px 100px; }
    .cp-item    { padding: 18px 16px; }
    .cp-img-wrap { width: 72px; height: 72px; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }
`;

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, total } = useCart();

  const handleRemove = (index) => {
    MySwal.fire({
      customClass: { popup: "cp-swal" },
      title: "Remove Item?",
      text: "Are you sure you want to remove this item from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Keep",
      background: "#141210",
      backdrop: "rgba(14,12,10,0.75)",
    }).then((result) => {
      if (result.isConfirmed) removeFromCart(index);
    });
  };

  const shipping = total > 50000 ? 0 : 2500;
  const grandTotal = total

  if (cart.length === 0) {
    return (
      <div className="cp-page">
        <style>{CSS}</style>
        <div className="cp-inner">
          <div className="cp-empty">
            <svg className="cp-empty-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <h2>Your cart is empty</h2>
            <p>Discover our collection and find something you love.</p>
            <button className="cp-empty-btn" onClick={() => navigate("/collection")}>
              Browse Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-page">
      <style>{CSS}</style>
      <div className="cp-glow cp-glow-1" />

      <div className="cp-inner">

        {/* Header */}
        <div className="cp-header">
          <h1 className="cp-title">Your Cart</h1>
          <span className="cp-count">{cart.length} {cart.length === 1 ? "item" : "items"}</span>
        </div>

        <div className="cp-layout">

          {/* ── Item list ── */}
          <div className="cp-list">
            {cart.map((item, index) => (
              <div
                key={index}
                className="cp-item"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                {/* Image */}
                <div className="cp-img-wrap">
                  <img src={item.image} alt={item.name} className="cp-img" />
                </div>

                {/* Info */}
                <div className="cp-item-info">
                  <p className="cp-item-name">{item.name}</p>
                  <p className="cp-item-variant">
                    Color: <span>{item.color}</span> &nbsp;&middot;&nbsp; Size: <span>{item.size}</span>
                  </p>
                  <p className="cp-item-price">&#8358;{item.price.toLocaleString()}</p>
                </div>

                {/* Quantity */}
                <div className="cp-qty">
                  <button
                    className="cp-qty-btn"
                    onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    &#8722;
                  </button>
                  <div className="cp-qty-val">{item.quantity}</div>
                  <button
                    className="cp-qty-btn"
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    &#43;
                  </button>
                </div>

                {/* Remove */}
                <button
                  className="cp-remove"
                  onClick={() => handleRemove(index)}
                  aria-label="Remove item"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* ── Summary ── */}
          <div>
            <div className="cp-summary">
              <div className="cp-summary-title">Order Summary</div>

              <div className="cp-summary-rows">
                <div className="cp-summary-row">
                  <span>Subtotal</span>
                  <span>&#8358;{total.toLocaleString()}</span>
                </div>
                <div className="cp-summary-row">
                  <span>Shipping</span>
                  <span style={{ color: shipping === 0 ? "var(--success)" : "inherit" }}>
                    {shipping === 0 ? "Free" : `Our Courier Service will contact you`}
                  </span>
                </div>
                {shipping === 0 && (
                  <div className="cp-summary-row" style={{ fontSize: "0.68rem", color: "var(--success)" }}>
                    <span>Free shipping applied</span>
                  </div>
                )}
                <div className="cp-summary-row total">
                  <span>Total</span>
                  <span className="cp-total-val">&#8358;{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                className="cp-checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                <span>Proceed to Checkout</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ position: "relative", zIndex: 1 }}>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>

              <p className="cp-checkout-note">
                Secure checkout &middot; Free returns &middot; Encrypted payment
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}