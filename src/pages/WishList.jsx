import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

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
    --danger:     #a87878;
    --success:    #7aab8a;
    --serif:      'Cormorant Garamond', Georgia, serif;
    --sans:       'Jost', sans-serif;
    --ease:       cubic-bezier(0.4, 0, 0.2, 1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page ── */
  .wl-page {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--sans);
    font-weight: 300;
    color: var(--text);
    position: relative;
  }

  /* Grain */
  .wl-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* Ambient glow */
  .wl-glow {
    position: fixed;
    top: -80px; right: -60px;
    width: 500px; height: 400px;
    background: radial-gradient(ellipse, rgba(196,156,104,0.045) 0%, transparent 70%);
    pointer-events: none;
    filter: blur(80px);
    z-index: 0;
  }

  /* ── Inner ── */
  .wl-inner {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 80px 48px 120px;
  }

  /* ── Header ── */
  .wl-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 52px;
    padding-bottom: 28px;
    border-bottom: 1px solid var(--border);
    position: relative;
    animation: fadeUp 0.6s 0.1s var(--ease) both;
  }

  .wl-header::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0;
    width: 56px; height: 1px;
    background: var(--gold);
    opacity: 0.55;
  }

  .wl-title {
    font-family: var(--serif);
    font-size: clamp(2rem, 3.5vw, 2.8rem);
    font-weight: 300;
    color: var(--text);
    letter-spacing: -0.01em;
    line-height: 1;
  }

  .wl-title em { font-style: italic; color: var(--gold-light); }

  .wl-count {
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  /* ── Clear all btn ── */
  .wl-clear-btn {
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-faint);
    padding: 8px 18px;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .wl-clear-btn:hover {
    border-color: rgba(168,120,120,0.4);
    color: var(--danger);
  }

  /* ── Grid ── */
  .wl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2px;
    border: 1px solid var(--border);
    animation: fadeUp 0.6s 0.18s var(--ease) both;
  }

  /* ── Wishlist card ── */
  .wl-card {
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    transition: background 0.28s var(--ease);
  }

  .wl-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.3s var(--ease);
    z-index: 2;
  }

  .wl-card:hover { background: #171412; }
  .wl-card:hover::before { opacity: 0.35; }

  /* ── Card image ── */
  .wl-img-wrap {
    position: relative;
    aspect-ratio: 3/4;
    overflow: hidden;
    background: var(--bg-input);
  }

  .wl-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(0.88);
    transition: transform 0.65s var(--ease), filter 0.3s;
  }

  .wl-card:hover .wl-img {
    transform: scale(1.05);
    filter: brightness(0.96);
  }

  /* Image overlay (add to cart) */
  .wl-img-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 20px 18px 16px;
    background: linear-gradient(to top, rgba(14,12,10,0.9) 60%, transparent);
    transform: translateY(100%);
    transition: transform 0.32s var(--ease);
    z-index: 3;
    display: flex;
    gap: 8px;
  }

  .wl-card:hover .wl-img-overlay { transform: translateY(0); }

  .wl-atc-btn {
    flex: 1;
    padding: 10px 14px;
    background: var(--gold);
    border: none;
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.65rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--bg);
    cursor: pointer;
    transition: background 0.2s var(--ease);
    position: relative;
    overflow: hidden;
  }

  .wl-atc-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold-light);
    transform: translateX(-101%);
    transition: transform 0.32s var(--ease);
    z-index: 0;
  }

  .wl-atc-btn:hover::before { transform: translateX(0); }
  .wl-atc-btn span { position: relative; z-index: 1; }

  .wl-view-btn {
    width: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 2px;
    color: var(--text-muted);
    text-decoration: none;
    cursor: pointer;
    flex-shrink: 0;
    transition: border-color 0.2s, color 0.2s;
  }

  .wl-view-btn:hover {
    border-color: rgba(196,156,104,0.4);
    color: var(--gold);
  }

  /* Remove (heart) btn — top right */
  .wl-remove-btn {
    position: absolute;
    top: 14px; right: 14px;
    width: 34px; height: 34px;
    background: rgba(14,12,10,0.65);
    backdrop-filter: blur(8px);
    border: 1px solid var(--border);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--gold);
    z-index: 4;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }

  .wl-remove-btn:hover {
    background: rgba(168,120,120,0.12);
    border-color: rgba(168,120,120,0.4);
    color: var(--danger);
  }

  /* ── Card info ── */
  .wl-info {
    padding: 20px 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .wl-category {
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    opacity: 0.8;
    margin-bottom: 7px;
  }

  .wl-name {
    font-family: var(--serif);
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--text);
    line-height: 1.25;
    margin-bottom: 14px;
    transition: color 0.22s;
  }

  .wl-card:hover .wl-name { color: var(--gold-light); }

  .wl-price-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
  }

  .wl-price {
    font-family: var(--serif);
    font-size: 1.3rem;
    font-weight: 300;
    color: var(--text);
    letter-spacing: -0.01em;
  }

  .wl-original {
    font-size: 0.8rem;
    font-weight: 300;
    color: var(--text-faint);
    text-decoration: line-through;
  }

  /* ── Added toast ── */
  .wl-toast {
    position: fixed;
    bottom: 32px; left: 50%;
    transform: translateX(-50%) translateY(0);
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-left: 2px solid var(--success);
    padding: 14px 24px;
    font-size: 0.78rem;
    font-weight: 300;
    color: var(--success);
    letter-spacing: 0.05em;
    z-index: 999;
    animation: toastIn 0.35s var(--ease) both;
    white-space: nowrap;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  /* ── Empty state ── */
  .wl-empty {
    min-height: 65vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    animation: fadeUp 0.6s var(--ease) both;
  }

  .wl-empty-icon {
    width: 52px; height: 52px;
    color: var(--text-faint);
    margin-bottom: 24px;
  }

  .wl-empty h2 {
    font-family: var(--serif);
    font-size: 2rem;
    font-weight: 300;
    color: var(--text);
    margin-bottom: 10px;
  }

  .wl-empty p {
    font-size: 0.85rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.75;
    margin-bottom: 36px;
    max-width: 320px;
  }

  .wl-empty-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 44px;
    background: transparent;
    border: 1px solid var(--gold);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: color 0.3s;
  }

  .wl-empty-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold);
    transform: translateX(-101%);
    transition: transform 0.36s var(--ease);
    z-index: 0;
  }

  .wl-empty-btn:hover::before { transform: translateX(0); }
  .wl-empty-btn:hover { color: var(--bg); }
  .wl-empty-btn span { position: relative; z-index: 1; }

  /* ── Footer bar (move all to cart) ── */
  .wl-footer {
    margin-top: 2px;
    border: 1px solid var(--border);
    border-top: none;
    background: var(--bg-card);
    padding: 20px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    animation: fadeUp 0.6s 0.25s var(--ease) both;
    flex-wrap: wrap;
  }

  .wl-footer-note {
    font-size: 0.72rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.05em;
  }

  .wl-footer-note strong {
    color: var(--text-muted);
    font-weight: 400;
  }

  .wl-move-all-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 32px;
    background: transparent;
    border: 1px solid var(--gold);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.65rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: color 0.3s;
  }

  .wl-move-all-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold);
    transform: translateX(-101%);
    transition: transform 0.36s var(--ease);
    z-index: 0;
  }

  .wl-move-all-btn:hover::before { transform: translateX(0); }
  .wl-move-all-btn:hover { color: var(--bg); }
  .wl-move-all-btn span { position: relative; z-index: 1; }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .wl-inner { padding: 60px 24px 96px; }
  }
  @media (max-width: 560px) {
    .wl-inner { padding: 48px 16px 80px; }
    .wl-grid  { grid-template-columns: 1fr 1fr; }
    .wl-footer { flex-direction: column; align-items: flex-start; }
  }
  @media (max-width: 360px) {
    .wl-grid { grid-template-columns: 1fr; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }
`;

// ── Sample wishlist data ─────────────────────────────────────────────────
// In a real app, replace this with context / localStorage / API state.
const INITIAL_WISHLIST = [
  {
    id: 1,
    name: "Artisan Derby",
    category: "Men",
    price: 42000,
    originalPrice: 52000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  },
  {
    id: 2,
    name: "Heritage Loafer",
    category: "Men",
    price: 38000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
  },
  {
    id: 3,
    name: "Bespoke Mule",
    category: "Women",
    price: 29500,
    originalPrice: 36000,
    image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80",
  },
  {
    id: 4,
    name: "Classic Oxford",
    category: "Unisex",
    price: 47000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80",
  },
];

export default function WishlistPage() {
  
  const [toast, setToast]       = useState(null);
  const { addToCart }           = useCart();
  const navigate                = useNavigate();
  const { wishlist, toggleWishlist } = useCart();
  



  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const removeItem = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: 1, color: "Default", size: "Default" });
    showToast(`${item.name} added to cart`);
  };

 const handleMoveAll = () => {
  wishlist.forEach((item) => {
    addToCart({
      ...item,
      quantity: 1,
      color: "Default",
      size: "Default",
    });
  });

  // clear wishlist after moving
  wishlist.forEach((item) => toggleWishlist(item));

  showToast("All items moved to cart");
};

  const handleClearAll = () => {
  wishlist.forEach((item) => toggleWishlist(item));
};


  return (
    <div className="wl-page">
      <style>{CSS}</style>
      <div className="wl-glow" />

      <div className="wl-inner">

        {/* ── Header ── */}
        <div className="wl-header">
          <div>
            <h1 className="wl-title">
              My <em>Wishlist</em>
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span className="wl-count">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
            </span>
            {wishlist.length > 0 && (
              <button className="wl-clear-btn" onClick={handleClearAll}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* ── Empty state ── */}
        {wishlist.length === 0 ? (
          <div className="wl-empty">
            <svg className="wl-empty-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <h2>Your wishlist is empty</h2>
            <p>
              Browse our collection and save the pieces that speak to you.
            </p>
            <Link to="/collection" className="wl-empty-btn">
              <span>Browse Collection</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: "relative", zIndex: 1 }}>
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        ) : (
          <>
            {/* ── Grid ── */}
            <div className="wl-grid">
              {wishlist.map((item, index) => (
                <div
                  key={item.id}
                  className="wl-card"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  {/* Image */}
                  <div className="wl-img-wrap">
                    <img src={item.image} alt={item.name} className="wl-img" />

                    {/* Overlay — add to cart + view */}
                    <div className="wl-img-overlay">
                      <button
                        className="wl-atc-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        <span>Add to Cart</span>
                      </button>
                      <Link
                        to={`/product/${item.id}`}
                        className="wl-view-btn"
                        aria-label="View product"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M22 12c-2.667 4.667-6 7-10 7S4.667 16.667 2 12c2.667-4.667 6-7 10-7s7.333 2.333 10 7z"/>
                        </svg>
                      </Link>
                    </div>

                    {/* Remove (filled heart) */}
                    <button
                      className="wl-remove-btn"
                      onClick={() => toggleWishlist(item)}

                      aria-label="Remove from wishlist"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24"
                        fill="currentColor" stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Info */}
                  <div className="wl-info">
                    <span className="wl-category">{item.category}</span>
                    <Link
                      to={`/product/${item.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <h3 className="wl-name">{item.name}</h3>
                    </Link>
                    <div className="wl-price-row">
                      <span className="wl-price">&#8358;{item.price.toLocaleString()}</span>
                      {item.originalPrice && (
                        <span className="wl-original">
                          &#8358;{item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Footer bar ── */}
            <div className="wl-footer">
              <p className="wl-footer-note">
                <strong>{wishlist.length} {wishlist.length === 1 ? "piece" : "pieces"}</strong> saved
                &nbsp;&mdash;&nbsp; move them to your cart to secure your order.
              </p>
              <button className="wl-move-all-btn" onClick={handleMoveAll}>
                <span>Move All to Cart</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ position: "relative", zIndex: 1 }}>
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="wl-toast" role="status">{toast}</div>
      )}
    </div>
  );
}