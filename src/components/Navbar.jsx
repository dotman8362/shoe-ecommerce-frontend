import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import logo from "../assets/jofta_solemates_logo.svg";
import { FaWhatsapp, FaSearch, FaHeart, FaShoppingBag, FaBars, FaTimes } from "react-icons/fa";


const navLinks = [
  { label: "Home", path: "/" },
  { label: "Collection", path: "/collection" },
  { label: "Testimonials", path: "/testimonials" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@200;300;400;500&display=swap');

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
    --nav-h:        72px;
    --top-h:        36px;
    --ease:         cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ── Topbar ── */
  .fn-top {
    height: var(--top-h);
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    font-family: var(--sans);
    position: relative;
    overflow: hidden;
  }

  .fn-top::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.2;
  }

  .fn-top-promo {
    font-size: 0.68rem;
    font-weight: 300;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .fn-top-promo span {
    color: var(--gold);
    font-weight: 400;
  }

  .fn-top-right {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .fn-currency {
    font-family: var(--sans);
    font-size: 0.72rem;
    font-weight: 300;
    letter-spacing: 0.1em;
    color: var(--text-faint);
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    transition: color 0.2s;
  }

  .fn-currency:hover { color: var(--text-muted); }

  .fn-whatsapp {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: var(--sans);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--success);
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.2s var(--ease);
  }

  .fn-whatsapp:hover { opacity: 1; }

  .fn-whatsapp svg { flex-shrink: 0; }

  /* ── Main header ── */
  .fn-header {
    font-family: var(--sans);
    position: sticky;
    top: 0;
    z-index: 1000;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    transition: background 0.4s var(--ease), box-shadow 0.4s var(--ease);
  }

  .fn-header.scrolled {
    background: rgba(14,12,10,0.96);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
  }

  .fn-nav-inner {
    height: var(--nav-h);
    padding: 0 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }

  /* ── Logo ── */
  .fn-logo img {
    height: 56px;
    width: auto;
    object-fit: contain;
    display: block;
    transition: opacity 0.2s;
    filter: brightness(0.95);
  }

  .fn-logo:hover img { opacity: 0.8; }

  /* ── Desktop nav ── */
  .fn-links {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 44px;
    list-style: none;
  }

  .fn-link {
    text-decoration: none;
    font-size: 0.72rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-muted);
    padding: 6px 0;
    position: relative;
    transition: color 0.22s var(--ease);
  }

  .fn-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--gold);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s var(--ease);
  }

  .fn-link:hover {
    color: var(--text);
  }

  .fn-link:hover::after {
    transform: scaleX(1);
  }

  .fn-link.active {
    color: var(--gold-light);
  }

  .fn-link.active::after {
    transform: scaleX(1);
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
  }

  /* ── Icon actions ── */
  .fn-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .fn-icon-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-faint);
    border-radius: 2px;
    position: relative;
    transition: color 0.2s var(--ease), background 0.2s var(--ease);
  }

  .fn-icon-btn:hover {
    color: var(--gold);
    background: rgba(196,156,104,0.06);
  }

  .fn-icon-btn.active {
    color: var(--gold);
    background: rgba(196,156,104,0.08);
  }

  .fn-icon-btn svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  /* Badge */
  .fn-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    min-width: 16px;
    height: 16px;
    background: var(--gold);
    color: var(--bg);
    border-radius: 8px;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    line-height: 1;
    font-family: var(--sans);
  }

  /* Separator */
  .fn-sep {
    width: 1px;
    height: 18px;
    background: var(--border);
    margin: 0 6px;
  }

  /* Mobile toggle */
  .fn-mobile-toggle {
    display: none;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 2px;
    cursor: pointer;
    color: var(--text-muted);
    transition: color 0.2s, border-color 0.2s;
  }

  .fn-mobile-toggle:hover {
    color: var(--gold);
    border-color: rgba(196,156,104,0.3);
  }

  /* ── Search panel ── */
  .fn-search-panel {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    padding: 28px 48px;
    animation: panelDown 0.28s var(--ease);
    z-index: 99;
  }

  .fn-search-wrap {
    max-width: 640px;
    margin: 0 auto;
    position: relative;
    display: flex;
    align-items: center;
  }

  .fn-search-input {
    width: 100%;
    padding: 13px 52px 13px 20px;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.85rem;
    font-weight: 300;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s var(--ease), box-shadow 0.2s var(--ease);
    letter-spacing: 0.04em;
  }

  .fn-search-input::placeholder {
    color: var(--text-faint);
    font-weight: 300;
    letter-spacing: 0.06em;
  }

  .fn-search-input:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px rgba(196,156,104,0.06);
  }

  .fn-search-go {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-faint);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    transition: color 0.2s;
  }

  .fn-search-go:hover { color: var(--gold); }

  /* Search suggestions */
  .fn-search-suggestions {
    max-width: 640px;
    margin: 16px auto 0;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: 2px;
    max-height: 360px;
    overflow-y: auto;
    animation: fadeUp 0.2s var(--ease);
  }

  .fn-suggestion-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s;
    border-bottom: 1px solid var(--border);
    text-decoration: none;
  }

  .fn-suggestion-item:last-child {
    border-bottom: none;
  }

  .fn-suggestion-item:hover {
    background: rgba(196,156,104,0.08);
  }

  .fn-suggestion-img {
    width: 44px;
    height: 44px;
    object-fit: cover;
    border: 1px solid var(--border);
  }

  .fn-suggestion-info {
    flex: 1;
  }

  .fn-suggestion-name {
    font-family: var(--serif);
    font-size: 0.85rem;
    font-weight: 400;
    color: var(--text);
    margin-bottom: 4px;
  }

  .fn-suggestion-category {
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold);
  }

  .fn-suggestion-price {
    font-family: var(--serif);
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .fn-search-no-results {
    padding: 32px;
    text-align: center;
    color: var(--text-faint);
    font-size: 0.78rem;
    letter-spacing: 0.1em;
  }

  /* ── Mobile menu ── */
  .fn-mobile-menu {
    position: fixed;
    inset: 0;
    background: var(--bg);
    z-index: 1100;
    display: flex;
    flex-direction: column;
    animation: menuSlide 0.32s var(--ease);
    overflow-y: auto;
  }

  .fn-mobile-head {
    height: var(--nav-h);
    padding: 0 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .fn-mobile-close {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 2px;
    cursor: pointer;
    color: var(--text-muted);
    transition: color 0.2s, border-color 0.2s;
  }

  .fn-mobile-close:hover {
    color: var(--gold);
    border-color: rgba(196,156,104,0.3);
  }

  .fn-mobile-body {
    flex: 1;
    padding: 40px 28px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .fn-mobile-link {
    text-decoration: none;
    font-family: var(--serif);
    font-size: 2rem;
    font-weight: 300;
    color: var(--text-muted);
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: color 0.2s var(--ease), padding-left 0.2s var(--ease);
    letter-spacing: -0.01em;
  }

  .fn-mobile-link:hover {
    color: var(--text);
    padding-left: 8px;
  }

  .fn-mobile-link.active {
    color: var(--gold-light);
    font-style: italic;
  }

  .fn-mobile-link-arrow {
    font-family: var(--sans);
    font-size: 0.9rem;
    color: var(--text-faint);
    transition: transform 0.2s var(--ease), color 0.2s;
  }

  .fn-mobile-link:hover .fn-mobile-link-arrow {
    transform: translateX(4px);
    color: var(--gold);
  }

  .fn-mobile-footer {
    padding: 32px 28px;
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }

  .fn-mobile-footer-label {
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-faint);
    margin-bottom: 16px;
  }

  .fn-mobile-wa {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: var(--sans);
    font-size: 0.78rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--success);
    text-decoration: none;
    padding: 12px 20px;
    border: 1px solid rgba(122,171,138,0.2);
    border-radius: 2px;
    background: rgba(122,171,138,0.04);
    transition: background 0.2s, border-color 0.2s;
  }

  .fn-mobile-wa:hover {
    background: rgba(122,171,138,0.08);
    border-color: rgba(122,171,138,0.35);
  }

  /* ── Animations ── */
  @keyframes panelDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes menuSlide {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes badgePop {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.3); }
    100% { transform: scale(1); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fn-badge.pop { animation: badgePop 0.3s var(--ease); }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .fn-links       { display: none; }
    .fn-mobile-toggle { display: flex; }
    .fn-top         { padding: 0 20px; }
    .fn-nav-inner   { padding: 0 20px; }
    .fn-top-promo   { font-size: 0.6rem; letter-spacing: 0.1em; }
    .fn-search-panel { padding: 20px; }
  }

  @media (min-width: 769px) {
    .fn-mobile-toggle { display: none; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
`;

export default function FloneNavbar() {
  const [currency] = useState("NGN");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const { cart, wishlist } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // ✅ Fetch search results from backend
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      
      try {
        // Fetch all products and filter on backend? Or use search endpoint
        // Option 1: Use a dedicated search endpoint (recommended)
        const response = await fetch(
          `http://localhost:5000/api/products/search?q=${encodeURIComponent(searchQuery.trim())}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.slice(0, 5)); // Show top 5 results
        } else {
          // Fallback: fetch all and filter client-side
          const allProductsRes = await fetch(`http://localhost:5000/api/products`);
          if (allProductsRes.ok) {
            const allProducts = await allProductsRes.json();
            const query = searchQuery.toLowerCase();
            const filtered = allProducts.filter(product => 
              product.name?.toLowerCase().includes(query) ||
              product.category?.toLowerCase().includes(query) ||
              product.description?.toLowerCase().includes(query)
            );
            setSearchResults(filtered.slice(0, 5));
          }
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search to avoid too many requests
    const debounceTimer = setTimeout(() => {
      searchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      setSearchOpen(false);
      setSearchQuery("");
      navigate(`/collection?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (product) => {
    setSearchOpen(false);
    setSearchQuery("");
    // Use _id from MongoDB
    navigate(`/product/${product._id}`);
  };

  // Handle "View All Results" click
  const handleViewAllResults = () => {
    if (searchQuery.trim().length > 0) {
      setSearchOpen(false);
      setSearchQuery("");
      navigate(`/collection?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <style>{CSS}</style>

      {/* Top bar */}
      <div className="fn-top">
        <p className="fn-top-promo">
          Free shipping on orders over <span>&#8358;50,000</span>
        </p>
        <div className="fn-top-right">
          <select value={currency} onChange={() => {}} className="fn-currency">
            <option value="NGN">NGN (&#8358;)</option>
          </select>
          <a
            href="https://wa.me/2349033080879"
            target="_blank"
            rel="noopener noreferrer"
            className="fn-whatsapp"
          >
            <FaWhatsapp size={11} />
            <span>Chat Support</span>
          </a>
        </div>
      </div>

      {/* Main header */}
      <header className={`fn-header${isScrolled ? " scrolled" : ""}`}>
        <div className="fn-nav-inner">

          {/* Logo */}
          <Link to="/" className="fn-logo">
            <img src={logo} alt="Brand" />
          </Link>

          {/* Desktop nav */}
          <ul className="fn-links">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className={`fn-link${isActive ? " active" : ""}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="fn-actions">
            <IconBtn
              title="Search"
              onClick={() => setSearchOpen(!searchOpen)}
              active={searchOpen}
            >
              <FaSearch />
            </IconBtn>

            <div className="fn-sep" />

            <Link to="/wishlist" style={{ textDecoration: "none" }}>
              <IconBtn title="Wishlist" badge={wishlist.length}>
                <FaHeart />
              </IconBtn>
            </Link>

            <Link to="/cart" style={{ textDecoration: "none" }}>
              <IconBtn title="Cart" badge={cartCount}>
                <FaShoppingBag />
              </IconBtn>
            </Link>

            <div className="fn-sep" />

            <button
              className="fn-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <FaBars size={16} />
            </button>
          </div>
        </div>

        {/* Search panel */}
        {searchOpen && (
          <div className="fn-search-panel">
            <form onSubmit={handleSearchSubmit} className="fn-search-wrap">
              <input
                type="text"
                className="fn-search-input"
                placeholder="Search for styles, materials, or bespoke options..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="fn-search-go" aria-label="Search">
                <FaSearch size={14} />
              </button>
            </form>

            {/* Search suggestions */}
            {searchQuery.trim().length > 0 && (
              <div className="fn-search-suggestions">
                {isSearching ? (
                  <div className="fn-search-no-results">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product) => (
                      <div
                        key={product._id}
                        className="fn-suggestion-item"
                        onClick={() => handleSuggestionClick(product)}
                      >
                        <img
                          src={product.image || product.images?.[0] || 'https://via.placeholder.com/44'}
                          alt={product.name}
                          className="fn-suggestion-img"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/44';
                          }}
                        />
                        <div className="fn-suggestion-info">
                          <div className="fn-suggestion-name">{product.name}</div>
                          <div className="fn-suggestion-category">{product.category}</div>
                        </div>
                        <div className="fn-suggestion-price">
                          ₦{product.price.toLocaleString()}
                        </div>
                      </div>
                    ))}
                    <div
                      className="fn-suggestion-item"
                      onClick={handleViewAllResults}
                      style={{ justifyContent: "center", borderTop: "1px solid var(--border)" }}
                    >
                      <span style={{ color: "var(--gold)", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
                        View all results for "{searchQuery}"
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="fn-search-no-results">
                    No products found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fn-mobile-menu">
          <div className="fn-mobile-head">
            <Link to="/" className="fn-logo" onClick={() => setIsMobileMenuOpen(false)}>
              <img src={logo} alt="Brand" />
            </Link>
            <button
              className="fn-mobile-close"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes size={15} />
            </button>
          </div>

          <div className="fn-mobile-body">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`fn-mobile-link${isActive ? " active" : ""}`}
                >
                  {link.label}
                  <span className="fn-mobile-link-arrow">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
</span>
                </Link>
              );
            })}
          </div>

          <div className="fn-mobile-footer">
            <p className="fn-mobile-footer-label">Customer Support</p>
            <a
              href="https://wa.me/2349033080879"
              target="_blank"
              rel="noopener noreferrer"
              className="fn-mobile-wa"
            >
              <FaWhatsapp size={14} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}

/* Icon button component */
function IconBtn({ children, title, badge, onClick, active }) {
  const prevBadge = useRef(badge);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (badge > 0 && badge !== prevBadge.current) {
      setPop(true);
      const t = setTimeout(() => setPop(false), 300);
      prevBadge.current = badge;
      return () => clearTimeout(t);
    }
    prevBadge.current = badge;
  }, [badge]);

  return (
    <button
      title={title}
      onClick={onClick}
      className={`fn-icon-btn${active ? " active" : ""}`}
    >
      {children}
      {badge > 0 && (
        <span className={`fn-badge${pop ? " pop" : ""}`}>
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}
