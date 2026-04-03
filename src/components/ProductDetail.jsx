import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { fetchProductById } from "../api/products";

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
    --whatsapp:     #25D366;
    --serif:        'Cormorant Garamond', Georgia, serif;
    --sans:         'Jost', sans-serif;
    --ease:         cubic-bezier(0.4, 0, 0.2, 1);
  }

  *, *::before, *::after { box-sizing: border-box;
  margin:0;
  padding:0 }


  .pd-page {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--sans);
    font-weight: 300;
    color: var(--text);
    position: relative;
  }

  /* Grain */
  .pd-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

 .pd-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0 64px 120px;
}

  /* ── Breadcrumb ── */
  .pd-breadcrumb {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 36px 0 48px;
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    animation: fadeUp 0.5s var(--ease) both;
  }

  .pd-bc-btn {
    background: none;
    border: none;
    color: var(--text-faint);
    cursor: pointer;
    font-family: var(--sans);
    font-size: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    padding: 0;
    transition: color 0.2s;
  }
  .pd-bc-btn:hover { color: var(--gold); }

  .pd-bc-sep {
    color: var(--text-faint);
    font-size: 0.6rem;
    opacity: 0.5;
  }

  .pd-bc-current {
    color: var(--text-muted);
  }

  /* ── Main grid ── */
  .pd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 72px;
    align-items: start;
  }

  /* ── Image panel ── */
  .pd-img-panel {
    position: sticky;
    top: 100px;
    animation: fadeUp 0.6s 0.1s var(--ease) both;
  }

  .pd-img-wrap {
    position: relative;
    aspect-ratio: 1;
    background: var(--bg-card);
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .pd-img-wrap::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.2;
    z-index: 2;
  }

  .pd-skeleton {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--bg-card) 25%, #1c1a16 50%, var(--bg-card) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
  }

  .pd-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 32px;
    transition: transform 0.7s var(--ease), opacity 0.3s;
    display: block;
  }

  .pd-img-wrap:hover .pd-img {
    transform: scale(1.04);
  }

  .pd-zoom-hint {
    position: absolute;
    bottom: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-faint);
    background: rgba(14,12,10,0.7);
    backdrop-filter: blur(8px);
    border: 1px solid var(--border);
    padding: 7px 12px;
    border-radius: 2px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .pd-img-wrap:hover .pd-zoom-hint {
    opacity: 1;
  }

  /* ── Info panel ── */
  .pd-info {
    padding-top: 8px;
    animation: fadeUp 0.6s 0.2s var(--ease) both;
  }

  /* Stock badge */
  .pd-stock {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    padding: 6px 12px;
    border-radius: 2px;
    margin-bottom: 24px;
  }
  .pd-stock.in  { color: var(--success); background: rgba(122,171,138,0.08); border: 1px solid rgba(122,171,138,0.2); }
  .pd-stock.out { color: #a87878; background: rgba(168,120,120,0.08); border: 1px solid rgba(168,120,120,0.2); }
  .pd-stock-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }

  /* Title */
  .pd-title {
    font-family: var(--serif);
    font-size: clamp(2rem, 3.5vw, 2.8rem);
    font-weight: 300;
    line-height: 1.1;
    color: var(--text);
    margin-bottom: 16px;
    letter-spacing: -0.01em;
  }

  /* Stars */
  .pd-stars {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 28px;
  }
  .pd-star-count {
    font-size: 0.75rem;
    color: var(--text-faint);
    margin-left: 8px;
    font-weight: 300;
  }

  /* Divider */
  .pd-rule {
    width: 100%;
    height: 1px;
    background: var(--border);
    border: none;
    margin: 28px 0;
  }

  /* Price */
  .pd-price-row {
    display: flex;
    align-items: baseline;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  .pd-price {
    font-family: var(--serif);
    font-size: 2.2rem;
    font-weight: 300;
    color: var(--text);
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .pd-original {
    font-size: 1rem;
    font-weight: 300;
    color: var(--text-faint);
    text-decoration: line-through;
  }

  .pd-save {
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--success);
    padding: 4px 10px;
    border: 1px solid rgba(122,171,138,0.2);
    border-radius: 2px;
    background: rgba(122,171,138,0.06);
  }

  /* Description */
  .pd-desc {
    font-size: 0.875rem;
    font-weight: 300;
    line-height: 1.8;
    color: var(--text-muted);
    letter-spacing: 0.02em;
    margin-bottom: 0;
  }

  /* Selector block */
  .pd-selector {
    margin-bottom: 28px;
  }

  .pd-selector-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }

  .pd-selector-label {
    font-size: 0.65rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .pd-selector-val {
    font-size: 0.75rem;
    font-weight: 300;
    color: var(--gold);
    letter-spacing: 0.06em;
  }

  /* Colors */
  .pd-colors {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .pd-color-btn {
    width: 28px; height: 28px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    padding: 0;
    position: relative;
    transition: transform 0.2s var(--ease);
    flex-shrink: 0;
  }
  .pd-color-btn::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1px solid var(--gold);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .pd-color-btn.active::after { opacity: 1; }
  .pd-color-btn:hover { transform: scale(1.1); }

  /* Sizes */
  .pd-sizes {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .pd-size-btn {
    min-width: 48px;
    height: 44px;
    padding: 0 14px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.78rem;
    font-weight: 300;
    color: var(--text-muted);
    cursor: pointer;
    transition: border-color 0.2s var(--ease), color 0.2s, background 0.2s;
    letter-spacing: 0.06em;
  }
  .pd-size-btn:hover:not(:disabled) {
    border-color: rgba(196,156,104,0.4);
    color: var(--text);
  }
  .pd-size-btn.active {
    border-color: var(--gold);
    color: var(--bg);
    background: var(--gold);
  }
  .pd-size-btn:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  /* Quantity */
  .pd-qty {
    display: flex;
    align-items: center;
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 2px;
    width: fit-content;
  }

  .pd-qty-btn {
    width: 44px; height: 44px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--sans);
    transition: color 0.2s, background 0.2s;
  }
  .pd-qty-btn:hover:not(:disabled) {
    color: var(--gold);
    background: rgba(196,156,104,0.05);
  }
  .pd-qty-btn:disabled { opacity: 0.25; cursor: not-allowed; }

  .pd-qty-val {
    min-width: 52px; height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--serif);
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--text);
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
  }

  /* Actions */
  .pd-actions {
    display: flex;
    gap: 10px;
    margin-top: 36px;
    flex-wrap: wrap;
  }

  .pd-cart-btn {
    flex: 1;
    min-width: 180px;
    height: 52px;
    background: var(--gold);
    border: none;
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.7rem;
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
    position: relative;
    overflow: hidden;
  }
  .pd-cart-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold-light);
    transform: translateX(-100%);
    transition: transform 0.35s var(--ease);
  }
  .pd-cart-btn:hover::before { transform: translateX(0); }
  .pd-cart-btn:hover { box-shadow: 0 8px 28px rgba(196,156,104,0.25); }
  .pd-cart-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .pd-cart-btn.success { background: var(--success); }
  .pd-cart-btn.success::before { display: none; }
  .pd-cart-btn span { position: relative; z-index: 1; }

  /* WhatsApp Button */
  .pd-wa-btn {
    flex: 1;
    min-width: 180px;
    height: 52px;
    background: var(--whatsapp);
    border: none;
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.25s var(--ease);
    position: relative;
    overflow: hidden;
  }
  .pd-wa-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: #1da851;
    transform: translateX(-100%);
    transition: transform 0.35s var(--ease);
  }
  .pd-wa-btn:hover::before { transform: translateX(0); }
  .pd-wa-btn:hover { 
    box-shadow: 0 8px 28px rgba(37, 211, 102, 0.3);
    transform: translateY(-1px);
  }
  .pd-wa-btn span { position: relative; z-index: 1; }

  .pd-wish-btn {
    width: 52px; height: 52px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-faint);
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    flex-shrink: 0;
  }
  .pd-wish-btn:hover {
    border-color: rgba(196,156,104,0.35);
    color: var(--gold);
    background: rgba(196,156,104,0.04);
  }
  .pd-wish-btn.liked {
    border-color: var(--gold);
    color: var(--gold);
    background: rgba(196,156,104,0.06);
  }

  /* Mobile FAB */
  .pd-fab {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 100;
    background: var(--bg-card);
    border-top: 1px solid var(--border);
    padding: 16px 20px;
    display: none;
    animation: slideUp 0.3s var(--ease);
    gap: 10px;
  }

  .pd-fab-btn {
    flex: 1;
    height: 52px;
    background: var(--gold);
    border: none;
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--bg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    transition: background 0.2s;
  }
  .pd-fab-btn:hover { background: var(--gold-light); }

  .pd-fab-wa {
    flex: 1;
    height: 52px;
    background: var(--whatsapp);
    border: none;
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    transition: background 0.2s;
  }
  .pd-fab-wa:hover { background: #1da851; }

  /* ── Not found ── */
  .pd-notfound {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    font-family: var(--sans);
  }

  .pd-notfound-inner {
    text-align: center;
    max-width: 380px;
  }

  .pd-notfound-icon {
    width: 52px; height: 52px;
    color: var(--text-faint);
    margin: 0 auto 24px;
  }

  .pd-notfound h2 {
    font-family: var(--serif);
    font-size: 2rem;
    font-weight: 300;
    color: var(--text);
    margin-bottom: 12px;
  }

  .pd-notfound p {
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 32px;
  }

  .pd-notfound-btn {
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
  .pd-notfound-btn:hover {
    background: var(--gold);
    color: var(--bg);
  }

  /* ── SweetAlert overrides ── */
  .swal2-popup.pd-swal {
    background: var(--bg-card) !important;
    border: 1px solid var(--border) !important;
    border-radius: 4px !important;
    font-family: var(--sans) !important;
    color: var(--text) !important;
    padding: 36px !important;
  }
  .swal2-popup.pd-swal .swal2-title {
    font-family: var(--serif) !important;
    font-size: 1.6rem !important;
    font-weight: 300 !important;
    color: var(--text) !important;
  }
  .swal2-popup.pd-swal .swal2-html-container {
    color: var(--text-muted) !important;
    font-size: 0.85rem !important;
    font-weight: 300 !important;
  }
  .swal2-popup.pd-swal .swal2-confirm {
    background: var(--gold) !important;
    color: var(--bg) !important;
    border-radius: 2px !important;
    font-family: var(--sans) !important;
    font-size: 0.68rem !important;
    font-weight: 400 !important;
    letter-spacing: 0.16em !important;
    text-transform: uppercase !important;
    box-shadow: none !important;
    padding: 12px 28px !important;
  }
  .swal2-popup.pd-swal .swal2-cancel {
    background: transparent !important;
    color: var(--text-muted) !important;
    border: 1px solid var(--border) !important;
    border-radius: 2px !important;
    font-family: var(--sans) !important;
    font-size: 0.68rem !important;
    font-weight: 400 !important;
    letter-spacing: 0.16em !important;
    text-transform: uppercase !important;
    box-shadow: none !important;
    padding: 12px 28px !important;
  }
  .swal2-popup.pd-swal .swal2-icon.swal2-success {
    border-color: var(--gold) !important;
    color: var(--gold) !important;
  }
  .swal2-popup.pd-swal .swal2-success-ring { background: transparent !important; }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .pd-inner { padding: 0 28px 120px; }
    .pd-grid { grid-template-columns: 1fr; gap: 40px; }
    .pd-img-panel { position: static; }
    .pd-actions { display: none; }
    .pd-fab { display: flex; }
  }
  @media (max-width: 600px) {
    .pd-inner { padding: 0 18px 120px; }
    .pd-title { font-size: 2rem; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }
`;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ✅ CHANGE: Replace static product lookup with state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useCart();

  // ✅ CHANGE: Initialize with product data once loaded
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  // WhatsApp business number (replace with your actual number)
  const WHATSAPP_NUMBER = "2349033080879";

  // ✅ NEW: Fetch product from backend
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductById(id);
        setProduct(data);
        
        // Initialize selections after product loads
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ✅ CHANGE: Update selections when product changes
  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0 && !selectedColor) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product, selectedColor, selectedSize]);

  // ✅ NEW: Loading state
  if (loading) {
    return (
      <div className="pd-page">
        <style>{CSS}</style>
        <div className="pd-inner" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="pd-skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 20px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ NEW: Error state
  if (error) {
    return (
      <div className="pd-page">
        <style>{CSS}</style>
        <div className="pd-notfound">
          <div className="pd-notfound-inner">
            <svg
              className="pd-notfound-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2>Error Loading Product</h2>
            <p>{error}</p>
            <button className="pd-notfound-btn" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ CHANGE: Not found check
  if (!product) {
    return (
      <div className="pd-page">
        <style>{CSS}</style>
        <div className="pd-notfound">
          <div className="pd-notfound-inner">
            <svg
              className="pd-notfound-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2>Product Not Found</h2>
            <p>
              The product you are looking for does not exist or has been
              removed.
            </p>
            <button className="pd-notfound-btn" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity,
      image: product.image || product.images?.[0],
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    MySwal.fire({
      customClass: { popup: "pd-swal" },
      title: "Added to Cart",
      html: `
        <div style="text-align:center;padding:8px 0;">
          <img src="${product.image || product.images?.[0] || ''}" alt="${product.name}"
            style="width:72px;height:72px;object-fit:contain;margin-bottom:12px;border:1px solid rgba(255,255,255,0.07);padding:8px;" />
          <p style="font-size:0.95rem;margin:0 0 6px;color:#f0ebe3;">${product.name}</p>
          <p style="font-size:0.78rem;color:#8a8178;font-weight:300;">
            ${selectedColor || 'N/A'} &middot; Size ${selectedSize || 'N/A'} &middot; Qty ${quantity}
          </p>
        </div>
      `,
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "View Cart",
      cancelButtonText: "Continue",
      background: "#141210",
      backdrop: "rgba(14,12,10,0.75)",
    }).then((result) => {
      if (result.isConfirmed) navigate("/cart");
    });
  };

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `*ORDER INQUIRY*\n` +
      `*Product:* ${product.name}\n` +
      `*Price:* ₦${product.price.toLocaleString()}\n` +
      `*Color:* ${selectedColor || 'N/A'}\n` +
      `*Size:* ${selectedSize || 'N/A'}\n` +
      `*Quantity:* ${quantity}\n` +
      `*Total:* ₦${(product.price * quantity).toLocaleString()}\n\n` +
      `*Customer Details:*\n` +
      `Name: \n` +
      `Phone: \n` +
      `Address: \n\n` +
      `Link: ${window.location.href}`
    );
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  // Calculate original price (20% markup if not provided)
  const originalPrice = product.originalPrice || (product.price * 1.2).toFixed(2);
  
  // Check if product is in stock (default to true if not specified)
  const inStock = product.stock !== undefined ? product.stock > 0 : true;

  return (
    <div className="pd-page">
      <style>{CSS}</style>

      <div className="pd-inner">
        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <button className="pd-bc-btn" onClick={() => navigate("/")}>
            Home
          </button>
          <span className="pd-bc-sep">&#47;</span>
          <button className="pd-bc-btn" onClick={() => navigate("/collection")}>
            Collection
          </button>
          <span className="pd-bc-sep">&#47;</span>
          <span className="pd-bc-current">{product.name}</span>
        </nav>

        {/* Grid */}
        <div className="pd-grid">
          {/* Image */}
          <div className="pd-img-panel">
            <div
              className="pd-img-wrap"
              onMouseEnter={() => !isMobile && setImageHover(true)}
              onMouseLeave={() => !isMobile && setImageHover(false)}
            >
              {!imageLoaded && <div className="pd-skeleton" />}
              <img
                src={
                  imageHover && product.hoverImage
                    ? product.hoverImage
                    : (product.image || product.images?.[0] || 'https://via.placeholder.com/500?text=No+Image')
                }
                alt={product.name}
                className="pd-img"
                onLoad={() => setImageLoaded(true)}
                style={{ opacity: imageLoaded ? 1 : 0 }}
              />
              {!isMobile && (
                <div className="pd-zoom-hint">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Hover to zoom
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="pd-info">
            {/* Stock */}
            <span className={`pd-stock ${inStock ? "in" : "out"}`}>
              <span className="pd-stock-dot" />
              {inStock ? "In Stock" : "Out of Stock"}
            </span>

            {/* Title */}
            <h1 className="pd-title">{product.name}</h1>

            {/* Stars */}
            <div className="pd-stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill={s <= Math.floor(product.rating || 4.5) ? "#c49c68" : "#2a2620"}
                  stroke="none"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.07 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className="pd-star-count">
                {product.rating || 4.5} &middot; {product.reviews || 0} reviews
              </span>
            </div>

            <hr className="pd-rule" />

            {/* Price */}
            <div className="pd-price-row">
              <span className="pd-price">
                &#8358;{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="pd-original">&#8358;{typeof originalPrice === 'number' ? originalPrice.toLocaleString() : parseFloat(originalPrice).toLocaleString()}</span>
              )}
              {product.originalPrice && (
                <span className="pd-save">Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
              )}
            </div>

            {/* Description */}
            <p className="pd-desc">{product.description || 'No description available'}</p>

            <hr className="pd-rule" />

            {/* Color - Only show if colors exist */}
            {product.colors && product.colors.length > 0 && (
              <div className="pd-selector">
                <div className="pd-selector-head">
                  <span className="pd-selector-label">Color</span>
                  <span className="pd-selector-val">{selectedColor}</span>
                </div>
                <div className="pd-colors">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      className={`pd-color-btn${selectedColor === c ? " active" : ""}`}
                      style={{ background: c.toLowerCase() }}
                      onClick={() => setSelectedColor(c)}
                      aria-label={`Select ${c}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size - Only show if sizes exist */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="pd-selector">
                <div className="pd-selector-head">
                  <span className="pd-selector-label">Size</span>
                  <span className="pd-selector-val">{selectedSize}</span>
                </div>
                <div className="pd-sizes">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`pd-size-btn${selectedSize === s ? " active" : ""}`}
                      onClick={() => setSelectedSize(s)}
                      disabled={!inStock}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="pd-selector">
              <div className="pd-selector-head">
                <span className="pd-selector-label">Quantity</span>
              </div>
              <div className="pd-qty">
                <button
                  className="pd-qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  &#8722;
                </button>
                <div className="pd-qty-val">{quantity}</div>
                <button
                  className="pd-qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={!inStock}
                >
                  &#43;
                </button>
              </div>
            </div>

            {/* Desktop actions */}
            <div className="pd-actions">
              <button
                className={`pd-cart-btn${showSuccess ? " success" : ""}`}
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                {showSuccess ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Added</span>
                  </span>
                ) : (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
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
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <span>Add to Cart</span>
                  </span>
                )}
              </button>

              {/* WhatsApp Order Button */}
              <button
                className="pd-wa-btn"
                onClick={handleWhatsAppOrder}
                disabled={!inStock}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span>Order via WhatsApp</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile FAB - Two buttons */}
      <div className="pd-fab">
        <button className="pd-fab-btn" onClick={handleAddToCart}>
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
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Cart &middot; ₦{(product.price * quantity).toLocaleString()}
        </button>
        
        <button className="pd-fab-wa" onClick={handleWhatsAppOrder}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          Order via WhatsApp
        </button>
      </div>
    </div>
  );
}