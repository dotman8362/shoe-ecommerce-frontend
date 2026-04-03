import logo from "../assets/jofta_solemates_logo.svg";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@200;300;400;500&display=swap');

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

  /* ── Footer shell ── */
  .ft {
    background: var(--bg-card);
    border-top: 1px solid var(--border);
    font-family: var(--sans);
    font-weight: 300;
    color: var(--text-muted);
    position: relative;
    overflow: hidden;
  }

  /* Top-edge gold rule */
  .ft::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--gold) 50%, transparent 100%);
    opacity: 0.2;
  }

  /* Ambient glow */
  .ft::after {
    content: '';
    position: absolute;
    bottom: -80px; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 300px;
    background: radial-gradient(ellipse, rgba(196,156,104,0.04) 0%, transparent 70%);
    pointer-events: none;
    filter: blur(40px);
  }

  /* ── Main grid ── */
  .ft-main {
    position: relative;
    z-index: 1;
    max-width: 1160px;
    margin: 0 auto;
    padding: 72px 48px 64px;
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 80px;
    align-items: start;
  }

  /* ── Brand column ── */
  .ft-brand {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .ft-logo {
    height: 64px;
    width: auto;
    object-fit: contain;
    filter: brightness(0.9);
    display: block;
    margin-bottom: 20px;
  }

  .ft-brand-rule {
    width: 32px; height: 1px;
    background: var(--gold);
    opacity: 0.4;
    border: none;
    margin-bottom: 16px;
  }

  .ft-tagline {
    font-family: var(--serif);
    font-size: 1rem;
    font-weight: 300;
    font-style: italic;
    color: var(--text-muted);
    line-height: 1.5;
    margin-bottom: 32px;
    max-width: 200px;
  }

  .ft-copyright {
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-faint);
    line-height: 1.8;
  }

  /* ── Nav grid ── */
  .ft-nav {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
  }

  /* ── Column titles ── */
  .ft-col-title {
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ft-col-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--gold);
    opacity: 0.15;
  }

  /* ── Link lists ── */
  .ft-links {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ft-links a {
    font-size: 0.82rem;
    font-weight: 300;
    color: var(--text-muted);
    text-decoration: none;
    letter-spacing: 0.04em;
    display: inline-flex;
    align-items: center;
    gap: 0;
    transition: color 0.22s var(--ease), gap 0.22s var(--ease);
    position: relative;
  }

  .ft-links a::before {
    content: '';
    display: inline-block;
    width: 0;
    height: 1px;
    background: var(--gold);
    transition: width 0.22s var(--ease);
    margin-right: 0;
    flex-shrink: 0;
  }

  .ft-links a:hover {
    color: var(--text);
    gap: 8px;
  }

  .ft-links a:hover::before {
    width: 14px;
    margin-right: 0;
  }

  /* ── Social links ── */
  .ft-social a {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ft-social a svg {
    width: 14px; height: 14px;
    stroke: currentColor;
    flex-shrink: 0;
    transition: color 0.2s;
  }

  /* ── Newsletter ── */
  .ft-newsletter-text {
    font-size: 0.8rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.65;
    margin-bottom: 18px;
    letter-spacing: 0.02em;
  }

  .ft-form {
    display: flex;
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 2px;
    overflow: hidden;
    transition: border-color 0.25s var(--ease);
  }

  .ft-form:focus-within {
    border-color: rgba(196,156,104,0.4);
    box-shadow: 0 0 0 3px rgba(196,156,104,0.05);
  }

  .ft-email-input {
    flex: 1;
    padding: 12px 14px;
    background: var(--bg-input);
    border: none;
    outline: none;
    font-family: var(--sans);
    font-size: 0.78rem;
    font-weight: 300;
    color: var(--text);
    letter-spacing: 0.04em;
    min-width: 0;
  }

  .ft-email-input::placeholder {
    color: var(--text-faint);
    font-weight: 300;
    letter-spacing: 0.08em;
  }

  .ft-submit {
    width: 44px;
    background: var(--gold);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--bg);
    flex-shrink: 0;
    transition: background 0.2s var(--ease);
  }

  .ft-submit:hover { background: var(--gold-light); }

  .ft-submit svg {
    width: 14px; height: 14px;
    stroke: currentColor;
    flex-shrink: 0;
  }

  /* ── Bottom bar ── */
  .ft-bottom {
    position: relative;
    z-index: 1;
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 48px 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--border);
    padding-top: 28px;
  }

  .ft-bottom-copy {
    font-size: 0.62rem;
    font-weight: 300;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  .ft-legal {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .ft-legal a {
    font-size: 0.62rem;
    font-weight: 300;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-faint);
    text-decoration: none;
    transition: color 0.2s;
  }

  .ft-legal a:hover { color: var(--gold); }

  .ft-legal-sep {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: var(--text-faint);
    opacity: 0.4;
  }

  /* ── Responsive ── */
  @media (max-width: 1040px) {
    .ft-main { grid-template-columns: 1fr; gap: 52px; padding: 56px 32px 48px; }
    .ft-nav  { grid-template-columns: repeat(2, 1fr); gap: 36px; }
    .ft-bottom { padding: 24px 32px 32px; }
  }

  @media (max-width: 600px) {
    .ft-main { padding: 48px 20px 40px; }
    .ft-nav  { grid-template-columns: 1fr 1fr; gap: 28px; }
    .ft-bottom { flex-direction: column; gap: 14px; text-align: center; padding: 20px 20px 28px; }
    .ft-tagline { max-width: 100%; }
  }

  html { scroll-behavior: smooth; }
  ::selection { background: rgba(196,156,104,0.15); color: var(--gold-light); }
`;

const Footer = () => {
  return (
    <footer className="ft">
      <style>{CSS}</style>

      <div className="ft-main">

        {/* ── Brand ── */}
        <div className="ft-brand">
          <img src={logo} alt="Jofta Solemates" className="ft-logo" />
          <hr className="ft-brand-rule" />
          <p className="ft-tagline">Premium footwear for the discerning sole</p>
          
        </div>

        {/* ── Nav columns ── */}
        <div className="ft-nav">

          {/* About */}
          <div>
            <h3 className="ft-col-title">About</h3>
            <ul className="ft-links">
              <li><a href="/about">Our Story</a></li>
              <li><a href="/contact">Contact</a></li>
             
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="ft-col-title">Support</h3>
            <ul className="ft-links">
              <li><a href="/support-policy">Support Policy</a></li>
              <li><a href="/faqs">FAQs</a></li>
              
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="ft-col-title">Connect</h3>
            <ul className="ft-links ft-social">
              <li>
                <a href="https://www.instagram.com/jofta_solemates?igsh=cGd6M3E5djE3eG1y" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                  </svg>
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@jofta83?_r=1&_t=ZS-957Qgo6TCLA" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M16.6 5.82C15.9 4.92 15.5 3.8 15.5 2.5H12.5V15.5C12.5 16.9 11.4 18 10 18C8.6 18 7.5 16.9 7.5 15.5C7.5 14.1 8.6 13 10 13C10.3 13 10.6 13 10.9 13.1V10C8.5 9.6 6.5 11.5 6.5 13.9C6.5 16.3 8.5 18.3 10.9 17.9C12.1 17.7 13.1 16.8 13.5 15.6C13.5 14.8 13.5 9.8 13.5 9.8C14.9 10.9 16.7 11.5 18.5 11.5V8.5C17.3 8.5 16.1 8.2 15.1 7.6L16.6 5.82Z"/>
                  </svg>
                  TikTok
                </a>
              </li>
              
            </ul>
          </div>

          {/* Newsletter */}
          

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="ft-bottom">
        <p className="ft-bottom-copy">&copy; 2026 Jofta Solemates &mdash; All Rights Reserved</p>
        <div className="ft-legal">
          <a href="/privacy">Privacy Policy</a>
          <span className="ft-legal-sep" />
          <a href="/terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;