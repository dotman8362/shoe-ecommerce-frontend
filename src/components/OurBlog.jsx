import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { subscribeToNewsletter } from "../services/newsletterService";
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

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page ── */
  .bl-page {
    background: var(--bg);
    min-height: 100vh;
    font-family: var(--sans);
    font-weight: 300;
    color: var(--text);
    position: relative;
    overflow: hidden;
  }

  .bl-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  .bl-inner {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 96px 48px 120px;
  }

  /* Ambient glow */
  .bl-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(100px);
  }
  .bl-glow-1 {
    width: 640px; height: 400px;
    top: -60px; right: -100px;
    background: radial-gradient(ellipse, rgba(196,156,104,0.05) 0%, transparent 70%);
  }
  .bl-glow-2 {
    width: 400px; height: 400px;
    bottom: 120px; left: -80px;
    background: radial-gradient(ellipse, rgba(122,171,138,0.035) 0%, transparent 70%);
  }

  /* ── Header ── */
  .bl-header {
    text-align: center;
    max-width: 520px;
    margin: 0 auto 80px;
  }

  .bl-label {
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
  .bl-label::before, .bl-label::after {
    content: '';
    display: inline-block;
    width: 24px; height: 1px;
    background: var(--gold);
    opacity: 0.5;
  }

  .bl-title {
    font-family: var(--serif);
    font-size: clamp(2.6rem, 4.5vw, 3.8rem);
    font-weight: 300;
    line-height: 1.08;
    color: var(--text);
    margin-bottom: 20px;
    opacity: 0;
    animation: fadeUp 0.7s 0.2s var(--ease) forwards;
  }
  .bl-title em { font-style: italic; color: var(--gold-light); }

  .bl-rule {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    border: none;
    margin: 0 auto 20px;
    opacity: 0;
    animation: fadeUp 0.6s 0.28s var(--ease) forwards;
  }

  .bl-subtitle {
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.75;
    letter-spacing: 0.02em;
    opacity: 0;
    animation: fadeUp 0.7s 0.35s var(--ease) forwards;
  }

  /* ── Grid ── */
  .bl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 2px;
    border: 1px solid var(--border);
    margin-bottom: 2px;
  }

  /* ── Card reveal ── */
  .bl-card-reveal {
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 0.55s var(--ease), transform 0.55s var(--ease);
  }
  .bl-card-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Blog card ── */
  .bl-card {
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: background 0.3s var(--ease);
  }
  .bl-card:last-child { border-right: none; }

  .bl-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.35s var(--ease);
    z-index: 2;
  }

  .bl-card:hover { background: #171412; }
  .bl-card:hover::before { opacity: 0.4; }

  /* ── Image area ── */
  .bl-img-wrap {
    position: relative;
    aspect-ratio: 16/10;
    overflow: hidden;
    background: var(--bg-input);
  }

  .bl-skeleton {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--bg-input) 25%, #1f1c18 50%, var(--bg-input) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
  }

  .bl-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.7s var(--ease), opacity 0.3s;
  }
  .bl-card:hover .bl-img { transform: scale(1.05); }

  /* Overlay gradient */
  .bl-img-gradient {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 60%;
    background: linear-gradient(to top, rgba(14,12,10,0.7), transparent);
    opacity: 0;
    transition: opacity 0.35s var(--ease);
    pointer-events: none;
  }
  .bl-card:hover .bl-img-gradient { opacity: 1; }

  /* Category chip */
  .bl-cat {
    position: absolute;
    top: 16px; left: 16px;
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--bg);
    background: var(--gold);
    padding: 5px 10px;
    border-radius: 1px;
    z-index: 3;
  }

  /* Read time */
  .bl-readtime {
    position: absolute;
    bottom: 14px; right: 14px;
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    background: rgba(14,12,10,0.7);
    backdrop-filter: blur(8px);
    border: 1px solid var(--border);
    padding: 5px 10px;
    border-radius: 1px;
    z-index: 3;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
  }
  .bl-card:hover .bl-readtime {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Card body ── */
  .bl-body {
    padding: 28px 26px 26px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .bl-post-title {
    font-family: var(--serif);
    font-size: 1.35rem;
    font-weight: 400;
    line-height: 1.25;
    color: var(--text);
    margin-bottom: 12px;
    transition: color 0.25s;
  }
  .bl-card:hover .bl-post-title { color: var(--gold-light); }

  .bl-excerpt {
    font-size: 0.82rem;
    font-weight: 300;
    line-height: 1.78;
    color: var(--text-muted);
    letter-spacing: 0.02em;
    margin-bottom: 24px;
    flex: 1;
  }

  /* Meta */
  .bl-meta {
    padding-top: 20px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .bl-author {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .bl-avatar {
    width: 30px; height: 30px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid var(--border);
    flex-shrink: 0;
    filter: grayscale(20%);
  }

  .bl-author-name {
    font-size: 0.72rem;
    font-weight: 400;
    color: var(--text-muted);
    letter-spacing: 0.04em;
    display: block;
  }

  .bl-date {
    font-size: 0.65rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.06em;
    display: block;
    margin-top: 2px;
  }

  /* Tags */
  .bl-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .bl-tag {
    font-size: 0.58rem;
    font-weight: 300;
    letter-spacing: 0.1em;
    color: var(--text-faint);
    border: 1px solid var(--border);
    padding: 3px 8px;
    border-radius: 1px;
    transition: border-color 0.2s, color 0.2s;
  }
  .bl-card:hover .bl-tag {
    border-color: rgba(196,156,104,0.2);
    color: var(--text-muted);
  }

  /* Read more row */
  .bl-read-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 18px;
  }

  .bl-read-link {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.65rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--gold);
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity 0.3s var(--ease), transform 0.3s var(--ease), gap 0.2s;
  }
  .bl-card:hover .bl-read-link {
    opacity: 1;
    transform: translateX(0);
  }
  .bl-read-link:hover { gap: 10px; }

  .bl-read-link svg {
    transition: transform 0.25s var(--ease);
    flex-shrink: 0;
  }
  .bl-read-link:hover svg { transform: translateX(3px); }

  /* Share btn */
  .bl-share {
    width: 32px; height: 32px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-faint);
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    opacity: 0;
    transform: translateX(6px);
    transition: opacity 0.3s var(--ease), transform 0.3s var(--ease), border-color 0.2s, color 0.2s;
  }
  .bl-card:hover .bl-share {
    opacity: 1;
    transform: translateX(0);
  }
  .bl-share:hover {
    border-color: rgba(196,156,104,0.35);
    color: var(--gold);
    background: rgba(196,156,104,0.04);
  }

  /* ── Footer row (load more) ── */
  .bl-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 0 0;
  }

  .bl-load-btn {
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
  .bl-load-btn:hover {
    border-color: rgba(196,156,104,0.4);
    color: var(--gold);
    background: rgba(196,156,104,0.04);
  }

  .bl-end-msg {
    font-size: 0.7rem;
    font-weight: 300;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  /* ── Newsletter ── */
  .bl-nl {
    margin-top: 72px;
    border: 1px solid var(--border);
    background: var(--bg-card);
    position: relative;
    overflow: hidden;
    padding: 56px 64px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
  }

  .bl-nl::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.2;
  }

  .bl-nl-label {
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
  }

  .bl-nl-title {
    font-family: var(--serif);
    font-size: 2rem;
    font-weight: 300;
    color: var(--text);
    line-height: 1.2;
    margin-bottom: 12px;
  }
  .bl-nl-title em { font-style: italic; color: var(--gold-light); }

  .bl-nl-sub {
    font-size: 0.82rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.7;
    letter-spacing: 0.02em;
  }

  .bl-nl-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .bl-nl-input-wrap {
    display: flex;
    border: 1px solid var(--border);
    border-radius: 2px;
    overflow: hidden;
    transition: border-color 0.25s var(--ease);
  }
  .bl-nl-input-wrap:focus-within {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px rgba(196,156,104,0.05);
  }

  .bl-nl-input {
    flex: 1;
    padding: 14px 18px;
    background: var(--bg-input);
    border: none;
    outline: none;
    font-family: var(--sans);
    font-size: 0.82rem;
    font-weight: 300;
    color: var(--text);
    letter-spacing: 0.04em;
    min-width: 0;
  }
  .bl-nl-input::placeholder { color: var(--text-faint); }

  .bl-nl-btn {
    padding: 0 28px;
    background: var(--gold);
    border: none;
    font-family: var(--sans);
    font-size: 0.65rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--bg);
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .bl-nl-btn:hover { background: var(--gold-light); }
  .bl-nl-btn.success { background: var(--success); color: var(--bg); }

  .bl-nl-note {
    font-size: 0.65rem;
    font-weight: 300;
    color: var(--text-faint);
    letter-spacing: 0.05em;
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

  /* ── Responsive ── */
  @media (max-width: 960px) {
    .bl-inner { padding: 72px 28px 96px; }
    .bl-nl { grid-template-columns: 1fr; padding: 40px 32px; gap: 32px; }
  }
  @media (max-width: 620px) {
    .bl-inner { padding: 56px 18px 80px; }
    .bl-grid  { grid-template-columns: 1fr; }
    .bl-nl    { padding: 36px 20px; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }
`;


/* ── Blog card ── */
function BlogCard({ post, index }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
      },
      { threshold: 0.12, rootMargin: "40px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Format date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div
      ref={ref}
      className={`bl-card-reveal${isVisible ? " visible" : ""}`}
      style={{ transitionDelay: `${(index % 4) * 0.08}s` }}
    >
      <Link to={`/blog/${post._id}`} className="bl-card">

        {/* Image */}
        <div className="bl-img-wrap">
          {!imageLoaded && <div className="bl-skeleton" />}
          <img
            src={post.image}
            alt={post.title}
            className="bl-img"
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0 }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x500?text=No+Image';
            }}
          />
          <div className="bl-img-gradient" />
          <span className="bl-cat">{post.category}</span>
          <span className="bl-readtime">{post.readTime || "5 min read"}</span>
        </div>

        {/* Body */}
        <div className="bl-body">
          <h3 className="bl-post-title">{post.title}</h3>
          <p className="bl-excerpt">{post.excerpt}</p>

          {/* Meta */}
          <div className="bl-meta">
            <div className="bl-author">
              <img
                src={post.authorAvatar || 'https://via.placeholder.com/30'}
                alt={post.author}
                className="bl-avatar"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/30';
                }}
              />
              <div>
                <span className="bl-author-name">{post.author}</span>
                <span className="bl-date">{formatDate(post.date || post.createdAt)}</span>
              </div>
            </div>
            <div className="bl-tags">
              {(post.tags || []).slice(0, 2).map((tag, i) => (
                <span key={i} className="bl-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Read more row */}
          <div className="bl-read-row">
            <span className="bl-read-link">
              Read Article
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
            <button
              className="bl-share"
              onClick={(e) => {
                e.preventDefault();
                // Share functionality
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.origin + `/blog/${post._id}`
                  });
                } else {
                  navigator.clipboard.writeText(window.location.origin + `/blog/${post._id}`);
                  alert('Link copied to clipboard!');
                }
              }}
              aria-label="Share article"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          </div>
        </div>

      </Link>
    </div>
  );
}

/* ── Newsletter Component ── */

 function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        setSuccessMessage(result.message);
        setSubscribed(true);
        setEmail("");
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setSubscribed(false);
        }, 5000);
      } else {
        setError(result.message);
        
        // Auto-hide error message after 5 seconds
        setTimeout(() => setError(""), 5000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bl-nl">
      <div>
        <div className="bl-nl-label">Newsletter</div>
        <h3 className="bl-nl-title">Join the <em>Journal</em></h3>
        <p className="bl-nl-sub">
          Subscribe to receive curated stories, style guides, and exclusive offers.
          No spam, unsubscribe anytime.
        </p>
      </div>
      
      <form className="bl-nl-form" onSubmit={handleSubscribe}>
        <div className="bl-nl-input-wrap">
          <input
            type="email"
            className="bl-nl-input"
            placeholder="Your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            disabled={loading}
            required
          />
          <button 
            type="submit" 
            className={`bl-nl-btn ${subscribed ? "success" : ""}`} 
            disabled={loading}
          >
            {loading ? "Subscribing..." : subscribed ? "Subscribed!" : "Subscribe"}
          </button>
        </div>
        
        {error && (
          <p style={{ 
            color: "#a87878", 
            fontSize: "0.7rem", 
            marginTop: "8px",
            letterSpacing: "0.05em"
          }}>
            {error}
          </p>
        )}
        
        {successMessage && (
          <p style={{ 
            color: "#7aab8a", 
            fontSize: "0.7rem", 
            marginTop: "8px",
            letterSpacing: "0.05em"
          }}>
            ✓ {successMessage}
          </p>
        )}
        
        <p className="bl-nl-note">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
}




/* ── Main export ── */
export default function OurBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [visiblePosts, setVisiblePosts] = useState(6);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/posts");
        
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        
        const data = await response.json();
        
        // Handle both paginated and non-paginated responses
        const postsData = data.posts || data;
        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  // Get unique categories/tags for filtering
  const allTags = ["all", ...new Set(posts.flatMap(post => post.tags || []))];
  
  // Filter posts based on selected tag
  const filteredPosts = activeFilter === "all"
    ? posts
    : posts.filter(post => (post.tags || []).some(tag => tag.toLowerCase() === activeFilter.toLowerCase()));
  
  const visibleFilteredPosts = filteredPosts.slice(0, visiblePosts);
  const hasMore = visiblePosts < filteredPosts.length;

  if (loading) {
    return (
      <div className="bl-page">
        <style>{CSS}</style>
        <div className="bl-inner" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div className="bl-skeleton" style={{ width: "60px", height: "60px", borderRadius: "50%", margin: "0 auto 20px" }} />
            <p style={{ color: "var(--text-muted)" }}>Loading stories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bl-page">
        <style>{CSS}</style>
        <div className="bl-inner" style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2 style={{ color: "var(--danger)", marginBottom: "16px" }}>Unable to load posts</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: "12px 24px", background: "var(--gold)", border: "none", color: "var(--bg)", cursor: "pointer" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bl-page">
      <style>{CSS}</style>

      <div className="bl-glow bl-glow-1" />
      <div className="bl-glow bl-glow-2" />

      <div className="bl-inner">

        {/* Header */}
        <header className="bl-header">
          <div className="bl-label">Our Journal</div>
          <h2 className="bl-title">Latest <em>Stories</em></h2>
          <hr className="bl-rule" />
          <p className="bl-subtitle">
            Insights, trends, and stories from the world of artisan footwear and craft.
          </p>
        </header>

        {/* Filter Tabs (Optional - uncomment if you want category filters) */}
        <div style={{ 
          display: "flex", 
          gap: "12px", 
          justifyContent: "center", 
          marginBottom: "40px",
          flexWrap: "wrap"
        }}>
          {allTags.slice(0, 6).map(tag => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              style={{
                padding: "8px 20px",
                background: activeFilter === tag ? "var(--gold)" : "transparent",
                border: activeFilter === tag ? "none" : "1px solid var(--border)",
                color: activeFilter === tag ? "var(--bg)" : "var(--text-muted)",
                cursor: "pointer",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                transition: "all 0.2s",
                borderRadius: "2px"
              }}
            >
              {tag === "all" ? "All Posts" : tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredPosts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ color: "var(--text-muted)" }}>No posts found in this category.</p>
          </div>
        ) : (
          <div className="bl-grid">
            {visibleFilteredPosts.map((post, index) => (
              <BlogCard key={post._id} post={post} index={index} />
            ))}
          </div>
        )}

        {/* Load more / end */}
        <div className="bl-footer">
          {hasMore ? (
            <button
              className="bl-load-btn"
              onClick={() => setVisiblePosts(prev => prev + 6)}
            >
              Load More Articles
            </button>
          ) : filteredPosts.length > 0 && (
            <p className="bl-end-msg">All {filteredPosts.length} articles shown</p>
          )}
        </div>

        {/* Newsletter Section */}
        <Newsletter />

      </div>
    </div>
  );
}