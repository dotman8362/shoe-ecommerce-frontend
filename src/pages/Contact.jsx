// Contact.jsx

import React, { useState } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --bg:         #0e0c0a;
    --bg-card:    #141210;
    --bg-input:   #1a1714;
    --border:     rgba(255,255,255,0.07);
    --border-focus: rgba(196,156,104,0.5);
    --gold:       #c49c68;
    --gold-light: #dbb98a;
    --text:       #f0ebe3;
    --text-muted: #8a8178;
    --text-faint: #4a4540;
    --success:    #7aab8a;
    --serif:      'Cormorant Garamond', Georgia, serif;
    --sans:       'Jost', sans-serif;
    --radius:     4px;
    --transition: 0.28s cubic-bezier(0.4,0,0.2,1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cp {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    font-weight: 300;
  }

  /* ── Grain overlay ── */
  .cp::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.6;
  }

  /* ── Hero ── */
  .cp-hero {
    position: relative;
    padding: 120px 48px 96px;
    overflow: hidden;
    border-bottom: 1px solid var(--border);
  }

  .cp-hero::after {
    content: '';
    position: absolute;
    top: -40%;
    right: -10%;
    width: 520px;
    height: 520px;
    background: radial-gradient(ellipse at center, rgba(196,156,104,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .cp-hero-label {
    font-family: var(--sans);
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: fadeUp 0.6s 0.1s both;
  }

  .cp-hero-label::before {
    content: '';
    display: inline-block;
    width: 32px;
    height: 1px;
    background: var(--gold);
    opacity: 0.6;
  }

  .cp-hero h1 {
    font-family: var(--serif);
    font-size: clamp(2.8rem, 5vw, 4.5rem);
    font-weight: 300;
    line-height: 1.1;
    letter-spacing: -0.01em;
    color: var(--text);
    max-width: 640px;
    animation: fadeUp 0.7s 0.2s both;
  }

  .cp-hero h1 em {
    font-style: italic;
    color: var(--gold-light);
  }

  .cp-hero-sub {
    margin-top: 20px;
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--text-muted);
    max-width: 480px;
    line-height: 1.7;
    animation: fadeUp 0.7s 0.3s both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Main grid ── */
  .cp-main {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 48px 120px;
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 64px;
    align-items: start;
  }

  /* ── Form side ── */
  .cp-form-head {
    margin-bottom: 40px;
  }

  .cp-form-head h2 {
    font-family: var(--serif);
    font-size: 1.9rem;
    font-weight: 300;
    color: var(--text);
    margin-bottom: 8px;
  }

  .cp-form-head p {
    font-size: 0.82rem;
    color: var(--text-muted);
    letter-spacing: 0.03em;
  }

  /* ── Success alert ── */
  .cp-alert {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 18px 22px;
    border: 1px solid rgba(122,171,138,0.25);
    border-left: 3px solid var(--success);
    background: rgba(122,171,138,0.06);
    border-radius: var(--radius);
    margin-bottom: 32px;
    animation: fadeUp 0.4s both;
  }

  .cp-alert-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--success);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .cp-alert-icon svg {
    width: 11px;
    height: 11px;
    stroke: #0e0c0a;
    stroke-width: 2.5;
    fill: none;
  }

  .cp-alert p {
    font-size: 0.85rem;
    color: var(--success);
    line-height: 1.6;
    font-weight: 300;
  }

  /* ── Form ── */
  .cp-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .cp-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .cp-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
  }

  .cp-field.full { grid-column: 1 / -1; }

  .cp-field label {
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color var(--transition);
  }

  .cp-field:focus-within label {
    color: var(--gold);
  }

  .cp-field input,
  .cp-field textarea {
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 14px 16px;
    font-family: var(--sans);
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--text);
    outline: none;
    transition: border-color var(--transition), background var(--transition), box-shadow var(--transition);
    width: 100%;
    -webkit-appearance: none;
  }

  .cp-field input::placeholder,
  .cp-field textarea::placeholder {
    color: var(--text-faint);
    font-weight: 300;
  }

  .cp-field input:focus,
  .cp-field textarea:focus {
    border-color: var(--border-focus);
    background: rgba(196,156,104,0.03);
    box-shadow: 0 0 0 3px rgba(196,156,104,0.06);
  }

  .cp-field textarea {
    resize: vertical;
    min-height: 140px;
    line-height: 1.7;
  }

  /* ── Submit ── */
  .cp-submit {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 15px 40px;
    background: transparent;
    border: 1px solid var(--gold);
    border-radius: var(--radius);
    font-family: var(--sans);
    font-size: 0.72rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: color var(--transition), background var(--transition), box-shadow var(--transition);
    align-self: flex-start;
    margin-top: 8px;
  }

  .cp-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold);
    transform: translateX(-101%);
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
    z-index: 0;
  }

  .cp-submit:hover::before {
    transform: translateX(0);
  }

  .cp-submit:hover {
    color: var(--bg);
    box-shadow: 0 8px 32px rgba(196,156,104,0.2);
  }

  .cp-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .cp-submit:disabled::before {
    transform: translateX(-101%);
  }

  .cp-submit span {
    position: relative;
    z-index: 1;
  }

  .cp-submit-dot {
    position: relative;
    z-index: 1;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    transition: background var(--transition);
  }

  /* ── Info side ── */
  .cp-info {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .cp-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 32px;
    position: relative;
    overflow: hidden;
  }

  .cp-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.3;
  }

  .cp-card h3 {
    font-family: var(--serif);
    font-size: 1.3rem;
    font-weight: 300;
    color: var(--text);
    margin-bottom: 28px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  /* ── Info items ── */
  .cp-info-list {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .cp-info-item {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .cp-info-icon {
    width: 36px;
    height: 36px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .cp-info-icon svg {
    width: 15px;
    height: 15px;
    stroke: var(--gold);
    stroke-width: 1.5;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .cp-info-body strong {
    display: block;
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 5px;
  }

  .cp-info-body p {
    font-size: 0.83rem;
    color: var(--text-muted);
    line-height: 1.65;
    font-weight: 300;
  }

  .cp-info-note {
    font-size: 0.74rem !important;
    color: var(--text-faint) !important;
    margin-top: 3px;
  }

  /* ── Services ── */
  .cp-services {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .cp-service {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
  }

  .cp-service:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .cp-service:first-child {
    padding-top: 0;
  }

  .cp-service-line {
    width: 2px;
    height: 40px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    flex-shrink: 0;
    margin-top: 2px;
    border-radius: 1px;
  }

  .cp-service-body strong {
    display: block;
    font-size: 0.82rem;
    font-weight: 400;
    color: var(--text);
    margin-bottom: 4px;
    letter-spacing: 0.03em;
  }

  .cp-service-body p {
    font-size: 0.78rem;
    color: var(--text-muted);
    line-height: 1.55;
    font-weight: 300;
  }

  /* ── Responsive ── */
  @media (max-width: 960px) {
    .cp-main {
      grid-template-columns: 1fr;
      padding: 60px 28px 80px;
    }
    .cp-hero { padding: 80px 28px 64px; }
    .cp-info { display: grid; grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 620px) {
    .cp-row { grid-template-columns: 1fr; }
    .cp-info { grid-template-columns: 1fr; }
    .cp-hero { padding: 64px 20px 48px; }
    .cp-main { padding: 48px 20px 72px; }
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    orderNumber: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSubmitting) return; // 🔒 prevent double submit
  setIsSubmitting(true);

  try {
    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // ✅ Handle non-200 responses
    if (!res.ok) {
      throw new Error("Failed to send message");
    }

    const data = await res.json();

    if (data.success) {
      setFormStatus({
        submitted: true,
        success: true,
        message: data.message || "Message sent successfully!",
      });

      // ✅ Clear form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        orderNumber: "",
      });
    } else {
      throw new Error(data.message || "Something went wrong");
    }

  } catch (error) {
    console.error("Submit Error:", error);

    setFormStatus({
      submitted: true,
      success: false,
      message: error.message || "Network error. Try again.",
    });
  } finally {
    setIsSubmitting(false);

    // ✅ Auto-hide alert
    setTimeout(() => {
      setFormStatus({
        submitted: false,
        success: false,
        message: "",
      });
    }, 5000);
  }
};



  return (
    <div className="cp">
      <style>{styles}</style>

      {/* ── Hero ── */}
      <section className="cp-hero">
        <div className="cp-hero-label">Artisan Studio</div>
        <h1>Connect With <em>Our Craft</em></h1>
        <p className="cp-hero-sub">
          Whether you have questions about sizing, need help with a custom order,
          or simply want to learn more about our work — we are here to help.
        </p>
      </section>

      {/* ── Main ── */}
      <section className="cp-main">

        {/* Form */}
        <div>
          <div className="cp-form-head">
            <h2>Send a Message</h2>
            <p>We respond within 24 hours, Monday through Saturday.</p>
          </div>

          {formStatus.submitted && formStatus.success && (
            <div className="cp-alert">
              <div className="cp-alert-icon">
                <svg viewBox="0 0 12 12"><polyline points="1.5,6 4.5,9 10.5,3" /></svg>
              </div>
              <p>{formStatus.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="cp-form">
            <div className="cp-row">
              <div className="cp-field">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text" id="name" name="name"
                  value={formData.name} onChange={handleChange}
                  required placeholder="Your name"
                />
              </div>
              <div className="cp-field">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email" id="email" name="email"
                  value={formData.email} onChange={handleChange}
                  required placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="cp-row">
              <div className="cp-field">
                <label htmlFor="orderNumber">Order Number (Optional)</label>
                <input
                  type="text" id="orderNumber" name="orderNumber"
                  value={formData.orderNumber} onChange={handleChange}
                  placeholder="e.g., #HS-12345"
                />
              </div>
              <div className="cp-field">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text" id="subject" name="subject"
                  value={formData.subject} onChange={handleChange}
                  required placeholder="How can we help?"
                />
              </div>
            </div>

            <div className="cp-field full">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message" name="message"
                value={formData.message} onChange={handleChange}
                required rows="6"
                placeholder="Tell us about your inquiry, sizing questions, or custom order ideas..."
              />
            </div>

            <button type="submit" className="cp-submit" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              {!isSubmitting && <span className="cp-submit-dot" />}
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="cp-info">

          {/* Address / contact card */}
          <div className="cp-card">
            <h3>Visit Our Atelier</h3>
            <div className="cp-info-list">

              <div className="cp-info-item">
                <div className="cp-info-icon">
                  <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                </div>
                <div className="cp-info-body">
                  <strong>Workshop</strong>
                  <p>Olukotun Compound, Oke Alapata Area</p>
                  <p>Ogbomosho, Oyo State</p>
                </div>
              </div>

              <div className="cp-info-item">
                <div className="cp-info-icon">
                  <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                </div>
                <div className="cp-info-body">
                  <strong>Phone</strong>
                  <p>+234 913 749 6458</p>
                  <p className="cp-info-note">Mon – Sat, 9 am – 5 pm</p>
                </div>
              </div>

              <div className="cp-info-item">
                <div className="cp-info-icon">
                  <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div className="cp-info-body">
                  <strong>Email</strong>
                  <p>ajagbejanet2018@gmail.com</p>
                </div>
              </div>

            </div>
          </div>

          {/* Services card */}
          <div className="cp-card">
            <h3>Services</h3>
            <div className="cp-services">

              <div className="cp-service">
                <div className="cp-service-line" />
                <div className="cp-service-body">
                  <strong>Sizing Consultation</strong>
                  <p>Virtual fitting sessions with our experts</p>
                </div>
              </div>

              <div className="cp-service">
                <div className="cp-service-line" />
                <div className="cp-service-body">
                  <strong>Custom Orders</strong>
                  <p>Bespoke designs tailored to your preferences</p>
                </div>
              </div>

              <div className="cp-service">
                <div className="cp-service-line" />
                <div className="cp-service-body">
                  <strong>Repair Services</strong>
                  <p>Lifetime care for your handmade shoes</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;