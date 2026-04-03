import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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
    --serif:        'Cormorant Garamond', Georgia, serif;
    --sans:         'Jost', sans-serif;
    --ease:         cubic-bezier(0.4, 0, 0.2, 1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .bd-page {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--sans);
    font-weight: 300;
    color: var(--text);
    position: relative;
  }

  /* Grain */
  .bd-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* ── Sticky nav ── */
  .bd-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 52px;
    background: rgba(14,12,10,0.88);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }

  .bd-nav::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.12;
    pointer-events: none;
  }

  .bd-back {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    font-size: 0.65rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color 0.22s var(--ease), gap 0.22s var(--ease);
  }

  .bd-back:hover { color: var(--gold); gap: 14px; }

  .bd-back-arrow {
    font-size: 0.9rem;
    line-height: 1;
    flex-shrink: 0;
    transition: transform 0.22s var(--ease);
  }

  .bd-back:hover .bd-back-arrow { transform: translateX(-3px); }

  .bd-nav-brand {
    font-family: var(--serif);
    font-size: 0.95rem;
    font-weight: 300;
    font-style: italic;
    color: var(--text-faint);
    letter-spacing: 0.04em;
  }

  /* ── Hero ── */
  .bd-hero {
    position: relative;
    width: 100%;
    height: 76vh;
    min-height: 500px;
    overflow: hidden;
  }

  .bd-hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(0.7) saturate(0.75);
    transform: scale(1.06);
    animation: heroReveal 1.2s cubic-bezier(0.16,1,0.3,1) forwards;
    will-change: transform;
  }

  @keyframes heroReveal {
    from { transform: scale(1.1); opacity: 0.4; }
    to   { transform: scale(1);   opacity: 1; }
  }

  .bd-hero-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to bottom, rgba(14,12,10,0.3) 0%, transparent 35%, rgba(14,12,10,0.82) 100%),
      linear-gradient(to right, rgba(14,12,10,0.25) 0%, transparent 60%);
    z-index: 1;
  }

  /* Title overlaid on hero */
  .bd-hero-content {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    z-index: 2;
    max-width: 840px;
    padding: 0 52px 52px;
    animation: fadeUp 0.8s 0.55s var(--ease) both;
  }

  .bd-hero-cat {
    display: inline-block;
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    padding: 5px 12px;
    border: 1px solid rgba(196,156,104,0.4);
    background: rgba(196,156,104,0.08);
    border-radius: 1px;
    margin-bottom: 16px;
  }

  .bd-hero-title {
    font-family: var(--serif);
    font-size: clamp(2.2rem, 4.5vw, 3.8rem);
    font-weight: 300;
    line-height: 1.1;
    letter-spacing: -0.01em;
    color: var(--text);
    margin-bottom: 22px;
  }

  .bd-hero-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0;
  }

  .bd-hero-meta-item {
    font-size: 0.72rem;
    font-weight: 300;
    letter-spacing: 0.05em;
    color: rgba(240,235,227,0.5);
    position: relative;
    padding-right: 18px;
    margin-right: 18px;
  }

  .bd-hero-meta-item:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0; top: 50%;
    transform: translateY(-50%);
    width: 3px; height: 3px;
    border-radius: 50%;
    background: rgba(240,235,227,0.2);
  }

  .bd-hero-meta-author {
    color: rgba(240,235,227,0.82);
    font-weight: 400;
  }

  /* ── Article ── */
  .bd-article {
    position: relative;
    z-index: 1;
    max-width: 760px;
    margin: 0 auto;
    padding: 0 32px 120px;
    animation: fadeUp 0.7s 0.3s var(--ease) both;
  }

  /* Intro block */
  .bd-intro {
    margin-top: 64px;
    padding-top: 52px;
    border-top: 1px solid var(--border);
    position: relative;
  }

  .bd-intro::before {
    content: '';
    position: absolute;
    top: -1px; left: 0;
    width: 56px; height: 1px;
    background: var(--gold);
    opacity: 0.5;
  }

  .bd-body {
    font-size: 1.05rem;
    font-weight: 300;
    line-height: 1.92;
    color: var(--text-muted);
    letter-spacing: 0.015em;
  }

  /* Drop cap */
  .bd-body::first-letter {
    font-family: var(--serif);
    font-size: 4.8rem;
    font-weight: 300;
    font-style: italic;
    float: left;
    line-height: 0.78;
    margin-right: 12px;
    margin-top: 10px;
    color: var(--gold-light);
  }

  .bd-rule {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    border: none;
    margin: 52px 0;
  }

  /* Tags */
  .bd-tags-section {
    padding-top: 32px;
    border-top: 1px solid var(--border);
    position: relative;
  }

  .bd-tags-section::before {
    content: '';
    position: absolute;
    top: -1px; left: 0;
    width: 40px; height: 1px;
    background: var(--gold);
    opacity: 0.4;
  }

  .bd-tags-label {
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-faint);
    margin-bottom: 14px;
  }

  .bd-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .bd-tag {
    font-size: 0.68rem;
    font-weight: 300;
    letter-spacing: 0.08em;
    color: var(--text-faint);
    padding: 6px 14px;
    border: 1px solid var(--border);
    border-radius: 1px;
    background: transparent;
    cursor: default;
    transition: border-color 0.22s var(--ease), color 0.22s, background 0.22s;
  }

  .bd-tag:hover {
    border-color: rgba(196,156,104,0.35);
    color: var(--gold);
    background: rgba(196,156,104,0.05);
  }

  /* Footer row */
  .bd-footer-row {
    margin-top: 56px;
    padding-top: 36px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }

  .bd-back-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    font-size: 0.65rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color 0.22s var(--ease), gap 0.22s;
  }

  .bd-back-cta:hover { color: var(--gold); gap: 14px; }
  .bd-back-cta svg { flex-shrink: 0; transition: transform 0.22s var(--ease); }
  .bd-back-cta:hover svg { transform: translateX(-3px); }

  .bd-share-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .bd-share-label {
    font-size: 0.58rem;
    font-weight: 300;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  .bd-share-btn {
    width: 32px; height: 32px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-faint);
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }

  .bd-share-btn:hover {
    border-color: rgba(196,156,104,0.35);
    color: var(--gold);
    background: rgba(196,156,104,0.04);
  }

  /* ── Not found ── */
  .bd-notfound {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: var(--sans);
    animation: fadeUp 0.6s var(--ease) both;
    padding: 40px;
    text-align: center;
  }

  .bd-notfound-icon {
    width: 48px; height: 48px;
    color: var(--text-faint);
    margin-bottom: 22px;
  }

  .bd-notfound h2 {
    font-family: var(--serif);
    font-size: 2rem;
    font-weight: 300;
    color: var(--text);
    margin-bottom: 10px;
  }

  .bd-notfound p {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 36px;
    line-height: 1.7;
  }

  .bd-notfound-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
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
    text-decoration: none;
    transition: background 0.2s, color 0.2s;
  }

  .bd-notfound-btn:hover { background: var(--gold); color: var(--bg); }

  /* ── Loading state ── */
  .bd-loading {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .bd-spinner {
    width: 40px;
    height: 40px;
    border: 2px solid var(--border);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 720px) {
    .bd-nav       { padding: 16px 24px; }
    .bd-nav-brand { display: none; }
    .bd-hero      { height: 58vh; min-height: 360px; }
    .bd-hero-content { padding: 0 24px 36px; }
    .bd-hero-title   { font-size: clamp(1.9rem, 7vw, 2.6rem); }
    .bd-article   { padding: 0 20px 96px; }
    .bd-body::first-letter { font-size: 3.6rem; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }
`;

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/posts/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Post not found");
          }
          throw new Error("Failed to fetch post");
        }
        
        const data = await response.json();
        setPost(data.post);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPost();
    }
  }, [id]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <div className="bd-loading">
          <div className="bd-spinner" />
          <p style={{ color: "var(--text-muted)" }}>Loading article...</p>
        </div>
      </>
    );
  }

  // Error or not found state
  if (error || !post) {
    return (
      <>
        <style>{CSS}</style>
        <div className="bd-notfound">
          <svg className="bd-notfound-icon" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h2>Post Not Found</h2>
          <p>{error || "This article does not exist or may have been removed."}</p>
          <Link to="/blog" className="bd-notfound-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Blog
          </Link>
        </div>
      </>
    );
  }

  // Handle copy link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
    alert("Link copied to clipboard!");
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="bd-page">

        {/* ── Sticky nav ── */}
        <nav className="bd-nav">
          <Link to="/blog" className="bd-back">
            <span className="bd-back-arrow">&#8592;</span>
            Back to Blog
          </Link>
          <span className="bd-nav-brand">The Journal</span>
        </nav>

        {/* ── Hero ── */}
        <div className="bd-hero">
          <img 
            src={post.image} 
            alt={post.title} 
            className="bd-hero-img"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/1200x800?text=No+Image';
            }}
          />
          <div className="bd-hero-overlay" />

          <div className="bd-hero-content">
            <span className="bd-hero-cat">{post.category}</span>
            <h1 className="bd-hero-title">{post.title}</h1>
            <div className="bd-hero-meta">
              <span className="bd-hero-meta-item bd-hero-meta-author">{post.author}</span>
              <span className="bd-hero-meta-item">{formatDate(post.date || post.createdAt)}</span>
              <span className="bd-hero-meta-item">{post.readTime || "5 min read"}</span>
            </div>
          </div>
        </div>

        {/* ── Article ── */}
        <article className="bd-article">

          <div className="bd-intro">
            <div 
              className="bd-body"
              dangerouslySetInnerHTML={{ 
                __html: post.content || `<p>${post.excerpt}</p><p>Full content coming soon...</p>` 
              }}
            />
          </div>

          <hr className="bd-rule" />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="bd-tags-section">
              <p className="bd-tags-label">Filed under</p>
              <div className="bd-tags">
                {post.tags.map((tag, i) => (
                  <span key={i} className="bd-tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Footer row */}
          <div className="bd-footer-row">
            <Link to="/blog" className="bd-back-cta">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              All Articles
            </Link>

            <div className="bd-share-row">
              <span className="bd-share-label">Share</span>

              {/* Twitter/X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank" rel="noopener noreferrer"
                className="bd-share-btn" aria-label="Share on X"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Copy link */}
              <button
                className="bd-share-btn" aria-label="Copy link"
                onClick={handleCopyLink}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
              </button>
            </div>
          </div>

        </article>
      </div>
    </>
  );
}