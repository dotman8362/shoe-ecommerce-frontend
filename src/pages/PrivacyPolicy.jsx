import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

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
    --success:    #7aab8a;
    --serif:      'Cormorant Garamond', Georgia, serif;
    --sans:       'Jost', sans-serif;
    --ease:       cubic-bezier(0.4, 0, 0.2, 1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page ── */
  .pp-page {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--sans);
    font-weight: 300;
    color: var(--text);
    position: relative;
  }

  .pp-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* Ambient glow */
  .pp-glow {
    position: fixed;
    top: -80px; right: -80px;
    width: 500px; height: 420px;
    background: radial-gradient(ellipse, rgba(196,156,104,0.04) 0%, transparent 70%);
    pointer-events: none;
    filter: blur(80px);
    z-index: 0;
  }

  /* ── Layout ── */
  .pp-layout {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 80px 48px 120px;
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 60px;
    align-items: start;
  }

  /* ── Sidebar nav (sticky) ── */
  .pp-sidebar {
    position: sticky;
    top: 80px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .pp-sidebar-label {
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-faint);
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }

  .pp-nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    font-size: 0.75rem;
    font-weight: 300;
    color: var(--text-faint);
    text-decoration: none;
    letter-spacing: 0.04em;
    border-bottom: 1px solid var(--border);
    transition: color 0.2s var(--ease);
    position: relative;
    cursor: pointer;
    background: none;
    border-left: none;
    border-right: none;
    border-top: none;
    font-family: var(--sans);
    text-align: left;
    width: 100%;
  }

  .pp-nav-link::before {
    content: '';
    position: absolute;
    left: -16px; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.22s;
    border-radius: 1px;
  }

  .pp-nav-link:hover { color: var(--text-muted); }
  .pp-nav-link.active { color: var(--gold); }
  .pp-nav-link.active::before { opacity: 0.7; }

  .pp-nav-num {
    font-family: var(--serif);
    font-size: 0.75rem;
    font-weight: 300;
    color: var(--text-faint);
    opacity: 0.5;
    transition: color 0.2s, opacity 0.2s;
    flex-shrink: 0;
    min-width: 18px;
  }

  .pp-nav-link.active .pp-nav-num {
    color: var(--gold);
    opacity: 1;
  }

  /* Meta beneath sidebar nav */
  .pp-sidebar-meta {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .pp-meta-row {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .pp-meta-key {
    font-size: 0.55rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  .pp-meta-val {
    font-size: 0.72rem;
    font-weight: 300;
    color: var(--text-muted);
    letter-spacing: 0.03em;
  }

  /* ── Main content ── */
  .pp-content {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* ── Page header ── */
  .pp-header {
    margin-bottom: 52px;
    animation: fadeUp 0.7s 0.1s var(--ease) both;
  }

  .pp-label {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 18px;
  }
  .pp-label::before {
    content: '';
    display: inline-block;
    width: 28px; height: 1px;
    background: var(--gold);
    opacity: 0.45;
  }

  .pp-title {
    font-family: var(--serif);
    font-size: clamp(2.4rem, 4vw, 3.4rem);
    font-weight: 300;
    line-height: 1.1;
    letter-spacing: -0.01em;
    color: var(--text);
    margin-bottom: 18px;
  }
  .pp-title em { font-style: italic; color: var(--gold-light); }

  .pp-rule {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    border: none;
    margin-bottom: 18px;
  }

  .pp-intro {
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.8;
    letter-spacing: 0.02em;
    max-width: 580px;
  }

  /* ── Section ── */
  .pp-section {
    border: 1px solid var(--border);
    background: var(--bg-card);
    margin-bottom: 2px;
    position: relative;
    overflow: hidden;
    transition: background 0.28s var(--ease);
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.55s var(--ease), transform 0.55s var(--ease), background 0.28s var(--ease);
  }

  .pp-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .pp-section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0;
    transition: opacity 0.28s;
  }

  .pp-section:hover { background: #171412; }
  .pp-section:hover::before { opacity: 0.25; }

  /* Section header (clickable accordion trigger) */
  .pp-sec-trigger {
    width: 100%;
    background: none;
    border: none;
    padding: 26px 32px;
    display: grid;
    grid-template-columns: 44px 1fr auto;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    text-align: left;
    font-family: var(--sans);
  }

  .pp-sec-num {
    font-family: var(--serif);
    font-size: 1.6rem;
    font-weight: 200;
    color: transparent;
    -webkit-text-stroke: 1px var(--text-faint);
    opacity: 0.35;
    line-height: 1;
    transition: opacity 0.22s, -webkit-text-stroke-color 0.22s;
    user-select: none;
  }

  .pp-section:hover .pp-sec-num,
  .pp-section.open    .pp-sec-num {
    opacity: 0.75;
    -webkit-text-stroke-color: var(--gold);
  }

  .pp-sec-title {
    font-size: 0.8rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color 0.22s;
  }

  .pp-section.open .pp-sec-title,
  .pp-section:hover .pp-sec-title { color: var(--text); }

  /* Expand icon */
  .pp-expand-icon {
    width: 28px; height: 28px;
    border: 1px solid var(--border);
    border-radius: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.22s, background 0.22s;
  }

  .pp-section.open .pp-expand-icon,
  .pp-section:hover .pp-expand-icon {
    border-color: rgba(196,156,104,0.3);
    background: rgba(196,156,104,0.05);
  }

  .pp-expand-h,
  .pp-expand-v {
    position: absolute;
    background: var(--text-faint);
    border-radius: 1px;
    transition: transform 0.3s var(--ease), opacity 0.3s, background 0.22s;
  }
  .pp-expand-h { width: 10px; height: 1px; }
  .pp-expand-v { width: 1px; height: 10px; }

  .pp-section.open .pp-expand-h,
  .pp-section.open .pp-expand-v { background: var(--gold); }

  .pp-section.open .pp-expand-v {
    transform: scaleY(0);
    opacity: 0;
  }

  /* Section body */
  .pp-sec-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.42s var(--ease);
  }

  .pp-section.open .pp-sec-body {
    max-height: 1200px;
  }

  .pp-sec-inner {
    padding: 0 32px 32px 92px;
  }

  .pp-sec-text {
    font-size: 0.875rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.88;
    letter-spacing: 0.02em;
    margin-bottom: 16px;
  }

  .pp-sec-text:last-child { margin-bottom: 0; }

  /* Highlight box */
  .pp-highlight {
    background: var(--bg-input);
    border: 1px solid var(--border);
    padding: 16px 20px;
    margin: 18px 0;
    position: relative;
  }

  .pp-highlight::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    opacity: 0.5;
    border-radius: 1px;
  }

  .pp-highlight p {
    font-size: 0.82rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.75;
    letter-spacing: 0.02em;
  }

  /* Inline list */
  .pp-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 14px 0;
    padding: 0;
    list-style: none;
  }

  .pp-list li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 0.84rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.7;
    letter-spacing: 0.02em;
  }

  .pp-list-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--gold);
    flex-shrink: 0;
    margin-top: 8px;
    opacity: 0.7;
  }

  /* Contact link in text */
  .pp-link {
    color: var(--gold);
    text-decoration: none;
    border-bottom: 1px solid rgba(196,156,104,0.3);
    padding-bottom: 1px;
    transition: border-color 0.2s, color 0.2s;
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
  }

  .pp-link:hover {
    color: var(--gold-light);
    border-color: var(--gold-light);
  }

  /* ── Contact CTA banner ── */
  .pp-cta {
    border: 1px solid var(--border);
    background: var(--bg-card);
    border-top: none;
    padding: 36px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.6s 0.5s var(--ease) both;
    flex-wrap: wrap;
  }

  .pp-cta::before {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.18;
  }

  .pp-cta-text { flex: 1; min-width: 200px; }

  .pp-cta-title {
    font-family: var(--serif);
    font-size: 1.2rem;
    font-weight: 300;
    color: var(--text);
    margin-bottom: 5px;
    letter-spacing: -0.01em;
  }

  .pp-cta-sub {
    font-size: 0.78rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.65;
    letter-spacing: 0.02em;
  }

  .pp-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 36px;
    background: var(--gold);
    border: none;
    border-radius: 2px;
    font-family: var(--sans);
    font-size: 0.65rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--bg);
    cursor: pointer;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.3s var(--ease);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .pp-cta-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold-light);
    transform: translateX(-101%);
    transition: transform 0.36s var(--ease);
    z-index: 0;
  }

  .pp-cta-btn:hover::before { transform: translateX(0); }
  .pp-cta-btn:hover { box-shadow: 0 8px 28px rgba(196,156,104,0.22); }
  .pp-cta-btn span { position: relative; z-index: 1; }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .pp-layout  { grid-template-columns: 1fr; gap: 40px; padding: 60px 28px 96px; }
    .pp-sidebar { position: static; }
    .pp-sec-inner { padding: 0 24px 28px; }
    .pp-sec-trigger { padding: 22px 24px; }
  }
  @media (max-width: 540px) {
    .pp-layout { padding: 48px 16px 80px; }
    .pp-cta    { flex-direction: column; align-items: flex-start; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-faint); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }
`;

/* ── Policy sections data ── */
const SECTIONS = [
  {
    id: "information",
    title: "Information We Collect",
    content: (
      <>
        <p className="pp-sec-text">
          We collect information you provide directly to us when you place an order,
          create an account, contact our support team, or interact with our services.
          This information helps us deliver and improve your experience with Jofta Solemates.
        </p>
        <ul className="pp-list">
          <li><span className="pp-list-dot" /><span>Personal identification — your full name, email address, phone number, and delivery address.</span></li>
          <li><span className="pp-list-dot" /><span>Order and transaction data — items purchased, sizes, colours, payment reference, and order history.</span></li>
          <li><span className="pp-list-dot" /><span>Communication records — messages sent through our contact form, WhatsApp, or email correspondence.</span></li>
          <li><span className="pp-list-dot" /><span>Sizing and preference data — measurements or preferences shared during bespoke consultations.</span></li>
          <li><span className="pp-list-dot" /><span>Technical data — browser type, device, IP address, and pages visited, collected automatically when you use our website.</span></li>
        </ul>
      </>
    ),
  },
  {
    id: "use",
    title: "How We Use Your Information",
    content: (
      <>
        <p className="pp-sec-text">
          Your information is used solely to operate, maintain, and improve our
          services. We do not sell, rent, or trade your personal data to third parties
          for marketing purposes.
        </p>
        <div className="pp-highlight">
          <p>
            We use your data to process and fulfil orders, communicate about your purchases,
            respond to enquiries, prevent fraud, and — with your consent — send updates
            about new collections or exclusive offers.
          </p>
        </div>
        <ul className="pp-list">
          <li><span className="pp-list-dot" /><span>Processing and delivering your orders and handling returns or exchanges.</span></li>
          <li><span className="pp-list-dot" /><span>Sending order confirmations, shipping updates, and support responses.</span></li>
          <li><span className="pp-list-dot" /><span>Verifying payments through our secure payment processor (Paystack).</span></li>
          <li><span className="pp-list-dot" /><span>Improving our website, product offerings, and customer experience.</span></li>
          <li><span className="pp-list-dot" /><span>Complying with legal obligations and protecting against fraudulent activity.</span></li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Sharing of Information",
    content: (
      <>
        <p className="pp-sec-text">
          We share your personal information only in the limited circumstances
          described below. In every case, we require that third parties maintain
          confidentiality and use your data only as directed.
        </p>
        <ul className="pp-list">
          <li><span className="pp-list-dot" /><span><strong style={{ color: "var(--text-muted)", fontWeight: 400 }}>Payment processors</strong> — Paystack processes payments securely. We do not store your full card details.</span></li>
          <li><span className="pp-list-dot" /><span><strong style={{ color: "var(--text-muted)", fontWeight: 400 }}>Delivery partners</strong> — Courier services receive your name and address to fulfil your order.</span></li>
          <li><span className="pp-list-dot" /><span><strong style={{ color: "var(--text-muted)", fontWeight: 400 }}>Email providers</strong> — We use Resend to send transactional emails on our behalf.</span></li>
          <li><span className="pp-list-dot" /><span><strong style={{ color: "var(--text-muted)", fontWeight: 400 }}>Legal compliance</strong> — We may disclose data when required by law or to protect the rights and safety of our customers.</span></li>
        </ul>
        <p className="pp-sec-text">
          We will never sell your personal data to advertisers or data brokers.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Data Security",
    content: (
      <>
        <p className="pp-sec-text">
          We take the security of your personal information seriously and implement
          appropriate technical and organisational measures to protect it against
          unauthorised access, loss, or misuse.
        </p>
        <div className="pp-highlight">
          <p>
            All payment transactions are encrypted using SSL technology and processed
            by Paystack, a PCI DSS compliant payment processor. We do not store sensitive
            card information on our servers.
          </p>
        </div>
        <p className="pp-sec-text">
          While we take every reasonable precaution, no method of transmission over the
          internet is completely secure. We encourage you to use strong, unique passwords
          and to contact us immediately if you suspect any unauthorised access to your account.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    content: (
      <>
        <p className="pp-sec-text">
          Our website uses cookies and similar technologies to enhance your browsing
          experience, remember your preferences, and understand how visitors interact
          with our site.
        </p>
        <ul className="pp-list">
          <li><span className="pp-list-dot" /><span><strong style={{ color: "var(--text-muted)", fontWeight: 400 }}>Essential cookies</strong> — required for the website to function, including your shopping cart and session data.</span></li>
          <li><span className="pp-list-dot" /><span><strong style={{ color: "var(--text-muted)", fontWeight: 400 }}>Performance cookies</strong> — help us understand page performance and visitor behaviour to improve our site.</span></li>
          <li><span className="pp-list-dot" /><span><strong style={{ color: "var(--text-muted)", fontWeight: 400 }}>Preference cookies</strong> — remember your settings such as currency selection.</span></li>
        </ul>
        <p className="pp-sec-text">
          You can control cookies through your browser settings. Disabling certain
          cookies may affect the functionality of our website.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your Rights",
    content: (
      <>
        <p className="pp-sec-text">
          You have the following rights regarding your personal data. To exercise
          any of these rights, please contact us at the details provided below.
        </p>
        <ul className="pp-list">
          <li><span className="pp-list-dot" /><span><strong style={{ color: "var(--text-muted)", fontWeight: 400 }}>Access</strong> — request a copy of the personal data we hold about you.</span></li>
          <li><span className="pp-list-dot" /><span><strong style={{ color: "var(--text-muted)", fontWeight: 400 }}>Correction</strong> — request that we correct any inaccurate or incomplete data.</span></li>
          <li><span className="pp-list-dot" /><span><strong style={{ color: "var(--text-muted)", fontWeight: 400 }}>Deletion</strong> — request that we delete your personal data, subject to legal obligations.</span></li>
          <li><span className="pp-list-dot" /><span><strong style={{ color: "var(--text-muted)", fontWeight: 400 }}>Portability</strong> — receive your data in a structured, machine-readable format.</span></li>
          <li><span className="pp-list-dot" /><span><strong style={{ color: "var(--text-muted)", fontWeight: 400 }}>Opt-out</strong> — unsubscribe from marketing communications at any time using the link in any email.</span></li>
        </ul>
      </>
    ),
  },
  {
    id: "retention",
    title: "Data Retention",
    content: (
      <>
        <p className="pp-sec-text">
          We retain your personal information for as long as necessary to fulfil
          the purposes for which it was collected, including satisfying legal,
          accounting, or reporting requirements.
        </p>
        <p className="pp-sec-text">
          Order records are typically retained for seven years in compliance with
          Nigerian tax and commercial regulations. Account data is retained for the
          duration of your account and for a reasonable period thereafter. You may
          request deletion at any time, subject to any overriding legal obligations.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: (
      <>
        <p className="pp-sec-text">
          Our services are not directed to individuals under the age of 18. We do
          not knowingly collect personal information from children. If you believe
          a child has provided us with personal data, please contact us and we will
          take immediate steps to delete that information.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: (
      <>
        <p className="pp-sec-text">
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or for legal, regulatory, or operational reasons. When
          we make material changes, we will notify you by updating the effective date
          at the top of this page.
        </p>
        <p className="pp-sec-text">
          We encourage you to review this policy periodically to stay informed about
          how we protect your information. Your continued use of our website after
          any changes constitutes acceptance of the updated policy.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    content: (
      <>
        <p className="pp-sec-text">
          If you have any questions, concerns, or requests regarding this Privacy Policy
          or the handling of your personal data, please reach out to us through any of
          the following channels:
        </p>
        <div className="pp-highlight">
          <p>
            <strong style={{ color: "var(--text)", fontWeight: 400 }}>Jofta Solemates</strong><br />
            Olukotun Compound, Oke Alapata Area, Ogbomosho, Oyo State<br />
            Email: <a href="mailto:ajagbejanet2018@gmail.com" className="pp-link">ajagbejanet2018@gmail.com</a><br />
            Phone: <a href="tel:+2349137496458" className="pp-link">+234 913 749 6458</a>
          </p>
        </div>
        <p className="pp-sec-text">
          We aim to respond to all privacy-related enquiries within 5 business days.
        </p>
      </>
    ),
  },
];

/* ── Policy section component ── */
function PolicySection({ section, index, isOpen, onToggle, activeId }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target); } },
      { threshold: 0.05, rootMargin: "40px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={section.id}
      className={`pp-section${isOpen ? " open" : ""}${visible ? " visible" : ""}`}
      style={{ transitionDelay: `${index * 0.04}s` }}
    >
      <button className="pp-sec-trigger" onClick={() => onToggle(section.id)}>
        <span className="pp-sec-num">0{index + 1}</span>
        <span className="pp-sec-title">{section.title}</span>
        <span className="pp-expand-icon" style={{ position: "relative" }}>
          <span className="pp-expand-h" />
          <span className="pp-expand-v" />
        </span>
      </button>

      <div className="pp-sec-body">
        <div className="pp-sec-inner">
          {section.content}
        </div>
      </div>
    </div>
  );
}

/* ── Main export ── */
export default function PrivacyPolicy() {
  const [openId,   setOpenId]   = useState("information");
  const [activeId, setActiveId] = useState("information");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* Track active section on scroll */
  useEffect(() => {
    const onScroll = () => {
      for (const section of [...SECTIONS].reverse()) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveId(section.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = (id) => setOpenId(prev => prev === id ? null : id);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
      setOpenId(id);
      setActiveId(id);
    }
  };

  return (
    <div className="pp-page">
      <style>{CSS}</style>
      <div className="pp-glow" />

      <div className="pp-layout">

        {/* ── Sidebar nav ── */}
        <aside className="pp-sidebar">
          <p className="pp-sidebar-label">Contents</p>

          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              className={`pp-nav-link${activeId === s.id ? " active" : ""}`}
              onClick={() => scrollTo(s.id)}
            >
              <span className="pp-nav-num">0{i + 1}</span>
              {s.title}
            </button>
          ))}

          <div className="pp-sidebar-meta">
            <div className="pp-meta-row">
              <span className="pp-meta-key">Effective</span>
              <span className="pp-meta-val">1 January 2026</span>
            </div>
            <div className="pp-meta-row">
              <span className="pp-meta-key">Last Updated</span>
              <span className="pp-meta-val">April 2026</span>
            </div>
            <div className="pp-meta-row">
              <span className="pp-meta-key">Jurisdiction</span>
              <span className="pp-meta-val">Federal Republic of Nigeria</span>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="pp-content">

          {/* Header */}
          <div className="pp-header">
            <div className="pp-label">Legal</div>
            <h1 className="pp-title">Privacy <em>Policy</em></h1>
            <hr className="pp-rule" />
            <p className="pp-intro">
              At Jofta Solemates, your privacy is as important to us as the quality
              of every pair we craft. This policy explains what information we collect,
              how we use it, and the choices available to you.
            </p>
          </div>

          {/* Accordion sections */}
          {SECTIONS.map((section, i) => (
            <PolicySection
              key={section.id}
              section={section}
              index={i}
              isOpen={openId === section.id}
              onToggle={toggle}
              activeId={activeId}
            />
          ))}

          {/* Contact CTA */}
          <div className="pp-cta">
            <div className="pp-cta-text">
              <p className="pp-cta-title">Questions about your privacy?</p>
              <p className="pp-cta-sub">
                Our team is happy to clarify anything in this policy or address
                any concerns about your personal data.
              </p>
            </div>
            <Link to="/contact" className="pp-cta-btn">
              <span>Contact Us</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: "relative", zIndex: 1 }}>
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
