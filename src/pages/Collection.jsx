import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// import { products } from "../data/Products";
import { useCart } from "../context/CartContext";
import { ProductCard } from "../components/NewArrival";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

import { fetchAllProducts } from "../api/products";




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
  .col-section {
    background: var(--bg);
    padding: 100px 48px 120px;
    position: relative;
    overflow: hidden;
    font-family: var(--sans);
  }

  .col-section::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }
    *{
  margin:0;
  padding:0;}

  /* Ambient glow */
  .col-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(90px);
  }
  .col-glow-1 {
    width: 600px; height: 600px;
    top: -120px; left: -80px;
    background: radial-gradient(ellipse, rgba(196,156,104,0.05) 0%, transparent 70%);
  }
  .col-glow-2 {
    width: 400px; height: 400px;
    bottom: 80px; right: -60px;
    background: radial-gradient(ellipse, rgba(122,171,138,0.035) 0%, transparent 70%);
  }

  /* ── Header ── */
  .col-header {
    position: relative;
    z-index: 2;
    max-width: 520px;
    margin: 0 auto 56px;
    text-align: center;
  }

  .col-label {
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
  .col-label::before,
  .col-label::after {
    content: '';
    display: inline-block;
    width: 24px; height: 1px;
    background: var(--gold);
    opacity: 0.5;
  }

  .col-title {
    font-family: var(--serif);
    font-size: clamp(2.6rem, 4.5vw, 3.8rem);
    font-weight: 300;
    line-height: 1.08;
    color: var(--text);
    margin-bottom: 20px;
    opacity: 0;
    animation: fadeUp 0.7s 0.2s var(--ease) forwards;
  }
  .col-title em {
    font-style: italic;
    color: var(--gold-light);
  }

  .col-rule {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    border: none;
    margin: 0 auto 20px;
    opacity: 0;
    animation: fadeUp 0.6s 0.28s var(--ease) forwards;
  }

  .col-subtitle {
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.75;
    letter-spacing: 0.02em;
    opacity: 0;
    animation: fadeUp 0.7s 0.35s var(--ease) forwards;
  }

  /* ── Filter bar ── */
  .col-filters {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto 32px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    opacity: 0;
    animation: fadeUp 0.6s 0.42s var(--ease) forwards;
  }

  .col-filter-label {
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-faint);
    margin-right: 8px;
    white-space: nowrap;
  }

  .col-filter-btn {
    padding: 8px 20px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    cursor: pointer;
    transition: border-color 0.22s var(--ease), color 0.22s var(--ease), background 0.22s var(--ease);
    white-space: nowrap;
  }
  .col-filter-btn:hover {
    border-color: rgba(196,156,104,0.35);
    color: var(--gold);
    background: rgba(196,156,104,0.04);
  }
  .col-filter-btn.active {
    border-color: var(--gold);
    color: var(--bg);
    background: var(--gold);
  }

  /* Price filter dropdown */
  .col-price-filter {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .col-price-label {
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-faint);
    white-space: nowrap;
  }
  .col-price-select {
    background: var(--bg-input);
    border: 1px solid var(--border);
    padding: 8px 24px 8px 12px;
    font-family: var(--sans);
    font-size: 0.7rem;
    font-weight: 300;
    color: var(--text);
    border-radius: 2px;
    cursor: pointer;
    transition: border-color 0.2s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a8178' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
  }
  .col-price-select:hover {
    border-color: var(--border-focus);
  }
  .col-price-select:focus {
    outline: none;
    border-color: var(--gold);
  }
  .col-reset-btn {
    background: transparent;
    border: 1px solid var(--border);
    padding: 7px 14px;
    font-family: var(--sans);
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-faint);
    cursor: pointer;
    border-radius: 2px;
    transition: border-color 0.2s, color 0.2s;
  }
  .col-reset-btn:hover {
    border-color: var(--gold);
    color: var(--gold);
  }

  /* count pill */
  .col-count {
    margin-left: auto;
    font-size: 0.6rem;
    font-weight: 300;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-faint);
    white-space: nowrap;
  }

  /* ── Grid ── */
  .col-grid {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    max-width: 1200px;
    margin: 0 auto 2px;
    border: 1px solid var(--border);
  }

  /* Empty state */
  .col-empty {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    border: 1px solid var(--border);
    padding: 80px 48px;
    text-align: center;
  }
  .col-empty-icon {
    margin: 0 auto 20px;
    width: 40px; height: 40px;
    opacity: 0.2;
  }
  .col-empty p {
    font-size: 0.78rem;
    font-weight: 300;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  /* ── Product card ── */
  .col-card-reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s var(--ease), transform 0.55s var(--ease);
  }
  .col-card-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .col-card {
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    transition: background 0.3s var(--ease);
  }

  .col-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.35s var(--ease);
  }

  .col-card:hover { background: #171412; }
  .col-card:hover::after { opacity: 0.35; }

  /* ── Image area ── */
  .col-img-wrap {
    position: relative;
    aspect-ratio: 3/4;
    overflow: hidden;
    background: var(--bg-input);
  }

  .col-img-skeleton {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--bg-input) 25%, #1f1c18 50%, var(--bg-input) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
  }
    /* Optimize image rendering */
.col-img {
  will-change: transform, opacity;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
}

/* Improve skeleton animation */
.col-img-skeleton {
  will-change: background-position;
  backface-visibility: hidden;
}

/* Reduce layout shifts */
.col-img-wrap {
  aspect-ratio: 3/4;
  background: #1a1714;
  contain: strict;
}

/* Optimize for slower connections */
@media (prefers-reduced-data: reduce) {
  .col-img {
    filter: blur(5px);
  }
}

  .col-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.65s var(--ease), opacity 0.3s;
    display: block;
  }
  .col-card:hover .col-img { transform: scale(1.05); }

  /* Badge */
  .col-badge {
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
  .col-wish {
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
  .col-card:hover .col-wish {
    opacity: 1;
    transform: translateX(0);
  }
  .col-wish:hover {
    border-color: rgba(196,156,104,0.4);
    background: rgba(14,12,10,0.85);
  }
  .col-wish svg {
    width: 14px; height: 14px;
    transition: transform 0.2s;
  }
  .col-wish:hover svg { transform: scale(1.15); }

  /* Cart overlay */
  .col-cart-overlay {
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
  .col-card:hover .col-cart-overlay { transform: translateY(0); }

  .col-cart-btn {
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
  .col-cart-btn:hover {
    background: var(--gold-light);
    box-shadow: 0 6px 24px rgba(196,156,104,0.25);
  }

  .col-view-btn {
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
  .col-view-btn:hover {
    border-color: rgba(196,156,104,0.4);
    color: var(--gold);
  }

  /* ── Info ── */
  .col-info {
    padding: 24px 22px 26px;
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
    z-index: 2;
  }

  .col-category {
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 7px;
    opacity: 0.8;
  }

  .col-name {
    font-family: var(--serif);
    font-size: 1.2rem;
    font-weight: 400;
    color: var(--text);
    line-height: 1.25;
    margin-bottom: 12px;
    transition: color 0.25s;
  }
  .col-card:hover .col-name { color: var(--gold-light); }

  /* Stars */
  .col-stars {
    display: flex;
    align-items: center;
    gap: 3px;
    margin-bottom: 14px;
  }
  .col-stars svg { flex-shrink: 0; }
  .col-stars span {
    font-size: 0.7rem;
    color: var(--text-faint);
    margin-left: 5px;
    font-weight: 300;
  }

  /* Price row */
  .col-price-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
  }

  .col-price {
    font-family: var(--serif);
    font-size: 1.4rem;
    font-weight: 400;
    color: var(--text);
    letter-spacing: -0.01em;
  }

  .col-original {
    font-size: 0.82rem;
    font-weight: 300;
    color: var(--text-faint);
    text-decoration: line-through;
  }

  .col-save {
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--success);
    margin-left: auto;
  }

  /* ── Load more / end ── */
  .col-footer {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 40px auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .col-load-btn {
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
  .col-load-btn:hover {
    border-color: rgba(196,156,104,0.4);
    color: var(--gold);
    background: rgba(196,156,104,0.04);
  }

  .col-end-msg {
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
    .col-section { padding: 72px 24px 96px; }
    .col-grid { grid-template-columns: repeat(2, 1fr); }
    .col-filters { gap: 6px; }
    .col-price-filter { margin-left: 0; width: 100%; justify-content: flex-start; margin-top: 8px; }
  }

  @media (max-width: 600px) {
    .col-section { padding: 56px 16px 80px; }
    .col-grid { grid-template-columns: repeat(2, 1fr); }
    .col-count { display: none; }
  }

  @media (max-width: 420px) {
    .col-grid { grid-template-columns: repeat(2, 1fr); }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }
`;

/* ── Heart icon ── */
function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "#c49c68" : "none"}
      stroke={filled ? "#c49c68" : "#8a8178"} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

/* ── Star rating ── */
function StarRating({ rating }) {
  return (
    <div className="col-stars">
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="11" height="11" viewBox="0 0 24 24"
          fill={s <= rating ? "#c49c68" : "#2a2620"} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.07 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span>({rating})</span>
    </div>
  );
}






/* ── Product card ── */

import CloudinaryImage from "../components/CloudinaryImage"; // We'll create this

function CollectionCard({ product, index, addToCart }) {
  const [liked, setLiked] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const ref = useRef(null);
  const { toggleWishlist, isWishlisted } = useCart();

  // Generate optimized Cloudinary URL with different sizes
  const getOptimizedImageUrl = (url, width = 400, height = 400) => {
    if (!url) return null;
    if (imgError) return 'https://via.placeholder.com/500?text=No+Image';
    
    // If it's already a Cloudinary URL, add transformations
    if (url.includes('cloudinary.com')) {
      return url.replace(
        '/upload/',
        `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`
      );
    }
    
    // For non-Cloudinary URLs, return as is
    return url;
  };

  // Get low-quality placeholder (blurry, loads instantly)
  const getPlaceholderUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    return url.replace(
      '/upload/',
      '/upload/w_20,h_20,c_fill,q_1,e_blur:500/'
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "100px" } // Increased rootMargin for earlier loading
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(prev => !prev);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 300);
  };

  const productImage = product.image || product.images?.[0];
  const optimizedImage = getOptimizedImageUrl(productImage, 400, 400);
  const placeholderImage = getPlaceholderUrl(productImage);
  const isPriority = index < 6; // First 3 images load immediately

  return (
    <div
      ref={ref}
      className={`col-card-reveal${isVisible ? " visible" : ""}`}
      style={{ transitionDelay: `${(index % 6) * 0.08}s` }}
    >
      <div className="col-card">
        <div className="col-img-wrap">
          <Link to={`/product/${product._id || product.id}`} style={{ display: "block", textDecoration: "none" }}>
            
            {/* Skeleton loader */}
            {!imageLoaded && (
              <div className="col-img-skeleton" style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(90deg, #1a1714 25%, #2a2520 50%, #1a1714 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
                zIndex: 1
              }} />
            )}

            {/* Blur placeholder (if using Cloudinary) */}
            {placeholderImage && !imageLoaded && isVisible && (
              <img
                src={placeholderImage}
                alt=""
                className="col-img"
                style={{
                  opacity: 0.8,
                  filter: "blur(10px)",
                  transform: "scale(1.05)",
                  transition: "opacity 0.3s ease"
                }}
              />
            )}

            {/* Main image with lazy loading */}
            {isVisible && (
              <img
                src={optimizedImage || productImage}
                alt={product.name}
                className="col-img"
                loading={isPriority ? "eager" : "lazy"}
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImgError(true)}
                style={{ 
                  opacity: imageLoaded ? 1 : 0,
                  transition: "opacity 0.3s ease-in-out"
                }}
              />
            )}

            {product.badge && <span className="col-badge">{product.badge}</span>}

            <div className="col-cart-overlay">
              <button
                className="col-cart-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(product);
                }}
              >
                Add to Cart
              </button>

              <div
                className="col-view-btn"
                title="View product"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/product/${product._id || product.id}`;
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M22 12c-2.667 4.667-6 7-10 7S4.667 16.667 2 12c2.667-4.667 6-7 10-7s7.333 2.333 10 7z" />
                </svg>
              </div>
            </div>
          </Link>

          <button
            className={`col-wish${heartAnim ? " heart-pop" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon filled={isWishlisted(product._id || product.id)}/>
          </button>
        </div>

        <Link to={`/product/${product._id || product.id}`} style={{ textDecoration: "none" }}>
          <div className="col-info">
            <div className="col-category">{product.category}</div>
            <h3 className="col-name">{product.name}</h3>
            <StarRating rating={product.rating || 4.5} />

            <div className="col-price-row">
              <span className="col-price">
                ₦{product.price.toLocaleString()}
              </span>

              {product.originalPrice && (
                <>
                  <span className="col-original">
                    ₦{product.originalPrice.toFixed(2)}
                  </span>
                  <span className="col-save">
                    Save ₦{(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Add shimmer animation keyframes if not already in CSS */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

// export default CollectionCard;

export default function Collections() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [priceRange, setPriceRange] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const [products, setProducts] = useState([]); // NEW: State for products from backend
  const [loading, setLoading] = useState(true); // NEW: Loading state
  const [error, setError] = useState(null); // NEW: Error state
  const { addToCart, cart } = useCart();
  const location = useLocation();

  // NEW: Fetch products from backend when component mounts
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []); // Empty dependency array = run once on mount

  const params = new URLSearchParams(location.search);
  const search = (params.get("search") || "").toLowerCase();

  // First filter by search
  let filteredBySearch = products.filter((product) =>
    product.name?.toLowerCase().includes(search) ||
    product.category?.toLowerCase().includes(search) ||
    product.description?.toLowerCase().includes(search)
  );

  // Then filter by category
  const filteredByCategory =
    activeFilter === "All"
      ? filteredBySearch
      : filteredBySearch.filter((p) => p.category === activeFilter);

  // Finally filter by price range
  const getFilteredByPrice = () => {
    if (priceRange === "all") return filteredByCategory;
    if (priceRange === "under-15k") {
      return filteredByCategory.filter(p => p.price < 15000);
    }
    if (priceRange === "10k-20k") {
      return filteredByCategory.filter(p => p.price >= 10000 && p.price <= 20000);
    }
    if (priceRange === "over-20k") {
      return filteredByCategory.filter(p => p.price > 20000);
    }
    return filteredByCategory;
  };

  const filteredProducts = getFilteredByPrice();
  
  // Derive unique categories from product data
  const categories = [
    "All",
    ...Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    ),
  ];

  const visible = filteredProducts.slice(0, visibleCount);

  const handleFilter = (cat) => {
    setActiveFilter(cat);
    setVisibleCount(6);
  };

  const handlePriceChange = (e) => {
    setPriceRange(e.target.value);
    setVisibleCount(6);
  };

  const resetPriceFilter = () => {
    setPriceRange("all");
    setVisibleCount(6);
  };

  // NEW: Loading state UI
  if (loading) {
    return (
      <section className="col-section">
        <style>{CSS}</style>
        <div className="col-glow col-glow-1" />
        <div className="col-glow col-glow-2" />
        <header className="col-header">
          <div className="col-label">Browse Our Range</div>
          <h2 className="col-title">Our <em>Collections</em></h2>
          <hr className="col-rule" />
          <p className="col-subtitle">Loading exquisite footwear...</p>
        </header>
        <div className="col-grid" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="col-img-skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 20px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Curating our collection...</p>
          </div>
        </div>
      </section>
    );
  }

  // NEW: Error state UI
  if (error) {
    return (
      <section className="col-section">
        <style>{CSS}</style>
        <div className="col-glow col-glow-1" />
        <div className="col-glow col-glow-2" />
        <header className="col-header">
          <div className="col-label">Browse Our Range</div>
          <h2 className="col-title">Our <em>Collections</em></h2>
          <hr className="col-rule" />
          <p className="col-subtitle">Unable to load products at this moment</p>
        </header>
        <div className="col-empty">
          <svg className="col-empty-icon" viewBox="0 0 24 24" fill="none" stroke="#8a8178" strokeWidth="1.2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <circle cx="12" cy="16" r="0.5" fill="#8a8178" stroke="none" />
          </svg>
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '20px', padding: '8px 24px', background: 'var(--gold)', border: 'none', color: '#0e0c0a', cursor: 'pointer', fontFamily: 'var(--sans)', letterSpacing: '0.1em' }}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="col-section">
      <style>{CSS}</style>

      <div className="col-glow col-glow-1" />
      <div className="col-glow col-glow-2" />

      <header className="col-header">
        <div className="col-label">Browse Our Range</div>
        <h2 className="col-title">Our <em>Collections</em></h2>
        <hr className="col-rule" />
        <p className="col-subtitle">
          Every piece, a statement. Explore the full breadth of our
          handcrafted artisan footwear.
        </p>
      </header>

      <div className="col-filters">
        <span className="col-filter-label">Filter by</span>

        {categories.map((cat) => (
          <button
            key={cat}
            className={`col-filter-btn${activeFilter === cat ? " active" : ""}`}
            onClick={() => handleFilter(cat)}
          >
            {cat}
          </button>
        ))}

        <div className="col-price-filter">
          <span className="col-price-label">Price</span>
          <select
            className="col-price-select"
            value={priceRange}
            onChange={handlePriceChange}
          >
            <option value="all">All prices</option>
            <option value="under-15k">Under 15,000</option>
            <option value="10k-20k">₦10,000 – ₦20,000</option>
            <option value="over-20k">Over ₦20,000</option>
          </select>
          {priceRange !== "all" && (
            <button className="col-reset-btn" onClick={resetPriceFilter}>
              Reset
            </button>
          )}
        </div>

        <span className="col-count">
          {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
        </span>
      </div>

      {visible.length > 0 ? (
        <div className="col-grid">
          {visible.map((product, index) => (
            <CollectionCard
              key={product._id || product.id}
              product={product}
              index={index}
              addToCart={addToCart}
            />
          ))}
        </div>
      ) : (
        <div className="col-empty">
          <svg
            className="col-empty-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8a8178"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p>No products found matching your filters</p>
        </div>
      )}

      <div className="col-footer">
        {visibleCount < filteredProducts.length ? (
          <button
            className="col-load-btn"
            onClick={() => setVisibleCount((prev) => prev + 3)}
          >
            Load More
          </button>
        ) : visible.length > 0 ? (
          <p className="col-end-msg">
            All {filteredProducts.length} pieces shown
          </p>
        ) : null}
      </div>
    </section>
  );
}