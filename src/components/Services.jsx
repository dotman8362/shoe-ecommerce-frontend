import { useState, useEffect, useRef } from "react";

import shippingImg from "../assets/images.jpg";

import paymentImg from "../assets/download (4).jpg";
import premiumImg from "../assets/download (5).jpg";

const services = [
  {
    title: "24/7 Support",
    desc: "Our dedicated support team is available around the clock to assist you with any questions.",
    icon: shippingImg,
    features: ["Live chat support", "Email assistance", "Phone support"],
  },
  {
    title: "Secure Payment",
    desc: "Your transactions are protected with industry-standard encryption and secure payment gateways.",
    icon: paymentImg,
    features: ["SSL encrypted", "Multiple methods", "Fraud protection"],
  },
  {
    title: "Premium Quality",
    desc: "We source only the finest materials to ensure your products meet the highest standards.",
    icon: premiumImg,
    features: ["Quality checked", "Durable materials", "Satisfaction guaranteed"],
  },
];

const stats = [
  {
    number: "100+",
    label: "Happy Customers",
    metric: "Clients",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    number: "100%",
    label: "Satisfaction Rate",
    metric: "Rating",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    number: "24/7",
    label: "Customer Support",
    metric: "Availability",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

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
  .sv-section {
    background: var(--bg);
    padding: 100px 48px 120px;
    position: relative;
    overflow: hidden;
    font-family: var(--sans);
  }

  /* Grain */
  .sv-section::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* Ambient glow */
  .sv-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
  }
  .sv-glow-1 {
    width: 500px; height: 500px;
    top: -100px; left: -80px;
    background: radial-gradient(ellipse, rgba(196,156,104,0.055) 0%, transparent 70%);
  }
  .sv-glow-2 {
    width: 400px; height: 400px;
    bottom: 0; right: -60px;
    background: radial-gradient(ellipse, rgba(122,171,138,0.04) 0%, transparent 70%);
  }

  /* ── Header ── */
  .sv-header {
    position: relative;
    z-index: 2;
    max-width: 560px;
    margin: 0 auto 80px;
    text-align: center;
  }

  .sv-label {
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

  .sv-label::before,
  .sv-label::after {
    content: '';
    display: inline-block;
    width: 24px;
    height: 1px;
    background: var(--gold);
    opacity: 0.5;
  }

  .sv-title {
    font-family: var(--serif);
    font-size: clamp(2.4rem, 4.5vw, 3.6rem);
    font-weight: 300;
    line-height: 1.1;
    color: var(--text);
    margin-bottom: 20px;
    opacity: 0;
    animation: fadeUp 0.7s 0.2s var(--ease) forwards;
  }

  .sv-title em {
    font-style: italic;
    color: var(--gold-light);
  }

  .sv-rule {
    width: 40px;
    height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    border: none;
    margin: 0 auto 20px;
    opacity: 0;
    animation: fadeUp 0.6s 0.3s var(--ease) forwards;
  }

  .sv-subtitle {
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.75;
    letter-spacing: 0.02em;
    opacity: 0;
    animation: fadeUp 0.7s 0.35s var(--ease) forwards;
  }

  /* ── Cards grid ── */
  .sv-grid {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2px;
    max-width: 1100px;
    margin: 0 auto;
    border: 1px solid var(--border);
  }

  /* ── Service card ── */
  .sv-card {
    background: var(--bg-card);
    padding: 48px 36px 44px;
    position: relative;
    overflow: hidden;
    transition: background 0.35s var(--ease);
    cursor: default;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border);
  }

  .sv-card:last-child { border-right: none; }

  .sv-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.35s var(--ease);
  }

  .sv-card:hover { background: #171412; }
  .sv-card:hover::before { opacity: 0.4; }

  /* Card index number */
  .sv-card-num {
    position: absolute;
    top: 28px;
    right: 32px;
    font-family: var(--serif);
    font-size: 3.5rem;
    font-weight: 300;
    color: var(--text-faint);
    line-height: 1;
    opacity: 0.25;
    transition: opacity 0.3s;
    user-select: none;
  }

  .sv-card:hover .sv-card-num { opacity: 0.4; }

  /* Icon */
  .sv-icon-wrap {
    width: 64px;
    height: 64px;
    border: 1px solid var(--border);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 32px;
    position: relative;
    flex-shrink: 0;
    transition: border-color 0.3s var(--ease);
  }

  .sv-card:hover .sv-icon-wrap {
    border-color: rgba(196,156,104,0.25);
  }

  .sv-icon-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(30%) brightness(0.85);
    transition: filter 0.4s var(--ease), transform 0.5s var(--ease);
  }

  .sv-card:hover .sv-icon-wrap img {
    filter: grayscale(0%) brightness(1);
    transform: scale(1.06);
  }

  /* Card title */
  .sv-card-title {
    font-family: var(--serif);
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--text);
    margin-bottom: 12px;
    line-height: 1.2;
    transition: color 0.25s;
  }

  .sv-card:hover .sv-card-title { color: var(--gold-light); }

  /* Card desc */
  .sv-card-desc {
    font-size: 0.83rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.75;
    margin-bottom: 32px;
    letter-spacing: 0.02em;
  }

  /* Features */
  .sv-features {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 28px;
    border-top: 1px solid var(--border);
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s 0.05s var(--ease), transform 0.3s 0.05s var(--ease);
  }

  .sv-card:hover .sv-features {
    opacity: 1;
    transform: translateY(0);
  }

  .sv-feature {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.78rem;
    font-weight: 300;
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }

  .sv-feature-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--gold);
    flex-shrink: 0;
    opacity: 0.7;
  }

  /* Reveal animation */
  .sv-card-reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
  }

  .sv-card-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Stats ── */
  .sv-stats {
    position: relative;
    z-index: 2;
    max-width: 1100px;
    margin: 2px auto 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border: 1px solid var(--border);
    background: var(--bg-card);
  }

  .sv-stats::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.15;
  }

  .sv-stat {
    padding: 44px 40px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    position: relative;
    transition: background 0.3s var(--ease);
    border-right: 1px solid var(--border);
  }

  .sv-stat:last-child { border-right: none; }
  .sv-stat:hover { background: #171412; }

  .sv-stat-icon {
    color: var(--gold);
    opacity: 0.7;
    margin-bottom: 12px;
    transition: opacity 0.2s;
  }

  .sv-stat:hover .sv-stat-icon { opacity: 1; }

  .sv-stat-num {
    font-family: var(--serif);
    font-size: 2.8rem;
    font-weight: 300;
    color: var(--text);
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .sv-stat-label {
    font-size: 0.78rem;
    font-weight: 400;
    color: var(--text-muted);
    letter-spacing: 0.05em;
    margin-top: 4px;
  }

  .sv-stat-metric {
    font-size: 0.62rem;
    font-weight: 300;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-faint);
    margin-top: 2px;
  }

  .sv-stat-line {
    width: 28px;
    height: 1px;
    background: var(--gold);
    opacity: 0.3;
    margin-top: 14px;
    transition: width 0.3s var(--ease), opacity 0.3s;
  }

  .sv-stat:hover .sv-stat-line {
    width: 48px;
    opacity: 0.6;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .sv-section { padding: 72px 28px 96px; }
    .sv-grid { grid-template-columns: 1fr; }
    .sv-card { border-right: none; border-bottom: 1px solid var(--border); }
    .sv-card:last-child { border-bottom: none; }
    .sv-stats { grid-template-columns: 1fr; }
    .sv-stat { border-right: none; border-bottom: 1px solid var(--border); }
    .sv-stat:last-child { border-bottom: none; }
  }

  @media (max-width: 600px) {
    .sv-section { padding: 56px 20px 80px; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
`;

/* ── Service Card ── */
function ServiceCard({ service, index }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "40px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`sv-card-reveal${isVisible ? " visible" : ""}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="sv-card">
        <span className="sv-card-num">0{index + 1}</span>

        <div className="sv-icon-wrap">
          <img src={service.icon} alt={service.title} />
        </div>

        <h3 className="sv-card-title">{service.title}</h3>
        <p className="sv-card-desc">{service.desc}</p>

        <div className="sv-features">
          {service.features.map((f, i) => (
            <div key={i} className="sv-feature">
              <span className="sv-feature-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main export ── */
export default function Services() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredServices = activeFilter === "all"
    ? services
    : services.filter(s =>
        activeFilter === "shipping" ? s.title.includes("Shipping") :
        activeFilter === "support"  ? s.title.includes("Support") :
        activeFilter === "returns"  ? s.title.includes("Return") || s.title.includes("Money") :
        true
      );

  return (
    <section className="sv-section">
      <style>{CSS}</style>

      {/* Ambient glows */}
      <div className="sv-glow sv-glow-1" />
      <div className="sv-glow sv-glow-2" />

      {/* Header */}
      <header className="sv-header">
        <div className="sv-label">Why Choose Us</div>
        <h2 className="sv-title">
          Crafted for <em>Excellence</em>
        </h2>
        <hr className="sv-rule" />
        <p className="sv-subtitle">
          Enjoy a seamless journey to the perfect fit, guided by people who care
          about craftsmanship as much as you do.
        </p>
      </header>

      {/* Cards */}
      <div className="sv-grid">
        {filteredServices.slice(0, visibleCount).map((service, index) => (
          <ServiceCard key={index} service={service} index={index} />
        ))}
      </div>

      {/* Load more */}
      {visibleCount < filteredServices.length && (
        <div style={{ textAlign: "center", marginTop: "40px", position: "relative", zIndex: 2 }}>
          <button
            onClick={() => setVisibleCount(filteredServices.length)}
            style={{
              padding: "13px 40px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "2px",
              fontFamily: "var(--sans)",
              fontSize: "0.7rem",
              fontWeight: "400",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              cursor: "pointer",
              transition: "border-color 0.25s, color 0.25s, background 0.25s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "rgba(196,156,104,0.4)";
              e.currentTarget.style.color = "var(--gold)";
              e.currentTarget.style.background = "rgba(196,156,104,0.04)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            View All Services
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="sv-stats">
        {stats.map((stat, i) => (
          <div key={i} className="sv-stat">
            <div className="sv-stat-icon">{stat.icon}</div>
            <div className="sv-stat-num">{stat.number}</div>
            <div className="sv-stat-label">{stat.label}</div>
            <div className="sv-stat-metric">{stat.metric}</div>
            <div className="sv-stat-line" />
          </div>
        ))}
      </div>
    </section>
  );
}