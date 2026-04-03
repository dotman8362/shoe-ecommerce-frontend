import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

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

  /* ── Section ── */
  .na-section {
    background: var(--bg);
    padding: 100px 48px 120px;
    position: relative;
    overflow: hidden;
    font-family: var(--sans);
  }

  .na-section::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* Ambient glow */
  .na-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(90px);
  }
  .na-glow-1 {
    width: 600px; height: 600px;
    top: -120px; right: -80px;
    background: radial-gradient(ellipse, rgba(196,156,104,0.05) 0%, transparent 70%);
  }
  .na-glow-2 {
    width: 400px; height: 400px;
    bottom: 80px; left: -60px;
    background: radial-gradient(ellipse, rgba(122,171,138,0.035) 0%, transparent 70%);
  }

  /* ── Header ── */
  .na-header {
    position: relative;
    z-index: 2;
    max-width: 520px;
    margin: 0 auto 72px;
    text-align: center;
  }

  .na-label {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 0.65rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
    opacity: 0;
    animation: fadeUp 0.6s 0.1s var(--ease) forwards;
  }
  .na-label::before,
  .na-label::after {
    content: '';
    display: inline-block;
    width: 24px; height: 1px;
    background: var(--gold);
    opacity: 0.5;
  }

  .na-title {
    font-family: var(--serif);
    font-size: clamp(2.6rem, 4.5vw, 3.8rem);
    font-weight: 300;
    line-height: 1.08;
    color: var(--text);
    margin-bottom: 20px;
    opacity: 0;
    animation: fadeUp 0.7s 0.2s var(--ease) forwards;
  }
  .na-title em {
    font-style: italic;
    color: var(--gold-light);
  }

  .na-rule {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    border: none;
    margin: 0 auto 20px;
    opacity: 0;
    animation: fadeUp 0.6s 0.28s var(--ease) forwards;
  }

  .na-subtitle {
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.75;
    letter-spacing: 0.02em;
    opacity: 0;
    animation: fadeUp 0.7s 0.35s var(--ease) forwards;
  }

  /* ── Grid ── */
  .na-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* desktop */
  gap: 2px;
  max-width: 1200px;
  margin: 0 auto 2px;
  border: 1px solid var(--border);
}


  /* ── Product card ── */
  .na-card-reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s var(--ease), transform 0.55s var(--ease);
  }
  .na-card-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .na-card {
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    transition: background 0.3s var(--ease);
  }

  /* Remove right border from cards that are last in a row — handled via nth-child in JS by using full-width border on grid */
  .na-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.35s var(--ease);
  }

  .na-card:hover { background: #171412; }
  .na-card:hover::after { opacity: 0.35; }

  /* ── Image area ── */
  .na-img-wrap {
    position: relative;
    aspect-ratio: 3/4;
    overflow: hidden;
    background: var(--bg-input);
  }

  .na-img-skeleton {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--bg-input) 25%, #1f1c18 50%, var(--bg-input) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
  }

  .na-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.65s var(--ease), opacity 0.3s;
    display: block;
  }

  .na-card:hover .na-img {
    transform: scale(1.05);
  }

  /* Badge */
  .na-badge {
    position: absolute;
    top: 16px; left: 16px;
    font-family: var(--sans);
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--bg);
    background: var(--gold);
    padding: 5px 10px;
    border-radius: 1px;
    z-index: 3;
  }

  /* Wishlist btn */
  .na-wish {
    position: absolute;
    top: 14px; right: 14px;
    width: 36px; height: 36px;
    background: rgba(14,12,10,0.6);
    backdrop-filter: blur(8px);
    border: 1px solid var(--border);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 3;
    opacity: 0;
    transform: translateX(6px);
    transition: opacity 0.25s var(--ease), transform 0.25s var(--ease), border-color 0.2s, background 0.2s;
  }
  .na-card:hover .na-wish {
    opacity: 1;
    transform: translateX(0);
  }
  .na-wish:hover {
    border-color: rgba(196,156,104,0.4);
    background: rgba(14,12,10,0.85);
  }
  .na-wish svg {
    width: 14px; height: 14px;
    transition: transform 0.2s;
  }
  .na-wish:hover svg { transform: scale(1.15); }

  /* Cart overlay */
  .na-cart-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 20px 20px 16px;
    background: linear-gradient(to top, rgba(14,12,10,0.92) 60%, transparent);
    transform: translateY(100%);
    transition: transform 0.32s var(--ease);
    z-index: 4;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .na-card:hover .na-cart-overlay {
    transform: translateY(0);
  }

  .na-cart-btn {
    flex: 1;
    padding: 11px 16px;
    background: var(--gold);
    border: none;
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--bg);
    cursor: pointer;
    transition: background 0.2s var(--ease), box-shadow 0.2s;
  }
  .na-cart-btn:hover {
    background: var(--gold-light);
    box-shadow: 0 6px 24px rgba(196,156,104,0.25);
  }

  .na-view-btn {
    width: 38px; height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 2px;
    cursor: pointer;
    color: var(--text-muted);
    transition: border-color 0.2s, color 0.2s;
    flex-shrink: 0;
    text-decoration: none;
  }
  .na-view-btn:hover {
    border-color: rgba(196,156,104,0.4);
    color: var(--gold);
  }

  /* ── Info ── */
  .na-info {
    padding: 24px 22px 26px;
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
    z-index: 2;
  }

  .na-category {
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 7px;
    opacity: 0.8;
  }

  .na-name {
    font-family: var(--serif);
    font-size: 1.2rem;
    font-weight: 400;
    color: var(--text);
    line-height: 1.25;
    margin-bottom: 12px;
    transition: color 0.25s;
  }
  .na-card:hover .na-name { color: var(--gold-light); }

  /* Stars */
  .na-stars {
    display: flex;
    align-items: center;
    gap: 3px;
    margin-bottom: 14px;
  }
  .na-stars svg { flex-shrink: 0; }
  .na-stars span {
    font-size: 0.7rem;
    color: var(--text-faint);
    margin-left: 5px;
    font-weight: 300;
  }

  /* Price row */
  .na-price-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
  }

  .na-price {
    font-family: var(--serif);
    font-size: 1.4rem;
    font-weight: 400;
    color: var(--text);
    letter-spacing: -0.01em;
  }

  .na-original {
    font-size: 0.82rem;
    font-weight: 300;
    color: var(--text-faint);
    text-decoration: line-through;
  }

  .na-save {
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--success);
    margin-left: auto;
  }

  /* ── Load more / end ── */
  .na-footer {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 40px auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .na-load-btn {
    padding: 13px 48px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    cursor: pointer;
    transition: border-color 0.25s, color 0.25s, background 0.25s;
  }
  .na-load-btn:hover {
    border-color: rgba(196,156,104,0.4);
    color: var(--gold);
    background: rgba(196,156,104,0.04);
  }

  .na-end-msg {
    font-size: 0.72rem;
    font-weight: 300;
    letter-spacing: 0.14em;
    color: var(--text-faint);
    text-transform: uppercase;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  @keyframes heartPop {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.35); }
    100% { transform: scale(1); }
  }
  .heart-pop { animation: heartPop 0.3s var(--ease); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
  .na-section { padding: 72px 24px 96px; }

  .na-grid {
    grid-template-columns: repeat(2, 1fr); /* tablet */
  }
}

@media (max-width: 600px) {
  .na-section { padding: 56px 16px 80px; }

  .na-grid {
    grid-template-columns: repeat(2, 1fr); /* mobile → FORCE 2 */
  }
}

@media (max-width: 420px) {
  .na-grid {
    grid-template-columns: repeat(2, 1fr); /* still 2 cards */
  }
}


  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }
`;


const styles = {
  heartBtn: {
    width: "40px",
    height: "40px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
  }
};

/* ── Heart icon ── */
function HeartIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "#c49c68" : "none"}
      stroke={filled ? "#c49c68" : "#8a8178"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ── Star rating ── */
function StarRating({ rating }) {
  return (
    <div className="na-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill={s <= rating ? "#c49c68" : "#2a2620"}
          stroke="none"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.07 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span>({rating})</span>
    </div>
  );
}

export function ProductCard({ product, index, addToCart }) {
  const [liked, setLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);
  const { toggleWishlist, isWishlisted } = useCart();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "40px" },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleLike = (e) => {
    e.preventDefault();
    setLiked((prev) => !prev);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 300);
  };

  return (
    <div
      ref={ref}
      className={`na-card-reveal${isVisible ? " visible" : ""}`}
      style={{ transitionDelay: `${(index % 6) * 0.08}s` }}
    >
      <div className="na-card">
        {/* IMAGE (Clickable) */}
        <Link
          to={`/product/${product.id}`}
          style={{ display: "block", textDecoration: "none" }}
        >
          <div className="na-img-wrap">
            {!imageLoaded && <div className="na-img-skeleton" />}

            <img
              src={product.image}
              alt={product.name}
              className="na-img"
              onLoad={() => setImageLoaded(true)}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />

            {product.badge && <span className="na-badge">{product.badge}</span>}

            {/* OVERLAY */}
            <div className="na-cart-overlay">
              {/* ADD TO CART */}
              <button
                className="na-cart-btn"
                onClick={(e) => {
                  e.preventDefault(); // stop Link navigation
                  addToCart(product);
                }}
              >
                Add to Cart
              </button>

              {/* VIEW PRODUCT (FIXED) */}
              <button
                className="na-view-btn"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/product/${product.id}`);
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M22 12c-2.667 4.667-6 7-10 7S4.667 16.667 2 12c2.667-4.667 6-7 10-7s7.333 2.333 10 7z" />
                </svg>
              </button>
            </div>
          </div>
        </Link>

        


         {/* Wishlist */}
        <button
          className={`na-wish${heartAnim ? " heart-pop" : ""}`}
          onClick={() => toggleWishlist(product)}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon filled={isWishlisted(product.id)} />
        </button>

        {/* PRODUCT INFO */}
        <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <div className="na-info">
            <div className="na-category">{product.category}</div>

            <h3 className="na-name">{product.name}</h3>

            <StarRating rating={product.rating} />

            <div className="na-price-row">
              <span className="na-price">
                &#8358;{product.price.toLocaleString()}
              </span>

              {product.originalPrice && (
                <>
                  <span className="na-original">
                    &#8358;{product.originalPrice.toFixed(2)}
                  </span>
                  <span className="na-save">
                    Save &#8358;
                    {(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
/* ── Main export ── */
export default function NewArrival() {
  const [visibleProducts, setVisibleProducts] = useState(6);
  const { addToCart, cart } = useCart();

  useEffect(() => {}, [cart]);

  return (
    <section className="na-section">
      <style>{CSS}</style>

      <div className="na-glow na-glow-1" />
      <div className="na-glow na-glow-2" />

      {/* Header */}
      <header className="na-header">
        <div className="na-label">Discover Our Latest</div>
        <h2 className="na-title">
          New <em>Arrivals</em>
        </h2>
        <hr className="na-rule" />
        <p className="na-subtitle">
          A carefully curated collection of the season's most refined and
          sought-after pieces.
        </p>
      </header>

      {/* Grid */}
      <div className="na-grid">
        {products.slice(0, visibleProducts).map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            addToCart={addToCart}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="na-footer">
        {visibleProducts < products.length ? (
          <button
            className="na-load-btn"
            onClick={() => setVisibleProducts((prev) => prev + 3)}
          >
            Load More
          </button>
        ) : (
          <p className="na-end-msg">All products shown</p>
        )}
      </div>
    </section>
  );
}
